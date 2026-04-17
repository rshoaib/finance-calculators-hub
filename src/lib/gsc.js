// Google Search Console helper.
//
// Used by the `mycalcfinance-gsc-audit-fixes` scheduled task to pull Coverage,
// Performance, and URL-inspection data that can't be derived from the DB alone.
//
// Auth: service account JSON key. Path resolution order:
//   1. process.env.GSC_SERVICE_ACCOUNT_JSON     (raw JSON blob)
//   2. process.env.GOOGLE_APPLICATION_CREDENTIALS (path to JSON file)
//   3. <repoRoot>/.gsc-service-account.json      (default)
//
// The service account must be added to the GSC property as a "Full" user.
// As of 2026-04-17, `gsc-audit-bot@my-project-15076orderviachat.iam.gserviceaccount.com`
// has Full access on https://mycalcfinance.com/ (URL-prefix property).
//
// The property value passed to every method is the GSC resource id, which for
// mycalcfinance.com is the URL-prefix form: `https://mycalcfinance.com/`.
// (There is no sc-domain: property for this site.)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

// Default key path: repo root. __dirname-equivalent for ESM.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_KEY_PATH = path.resolve(__dirname, '../../.gsc-service-account.json');

export const DEFAULT_PROPERTY = 'https://mycalcfinance.com/';

function loadCredentials() {
  if (process.env.GSC_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      throw new Error(`GSC_SERVICE_ACCOUNT_JSON is not valid JSON: ${e.message}`);
    }
  }
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_KEY_PATH;
  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `GSC service-account key not found at ${keyPath}. ` +
      `Set GSC_SERVICE_ACCOUNT_JSON, or drop the key JSON at that path.`
    );
  }
  return JSON.parse(fs.readFileSync(keyPath, 'utf8'));
}

/**
 * Returns true if a service-account credential is reachable. The scheduled
 * audit uses this to decide whether to pull live GSC data or skip those
 * sections and emit a "data gap" note.
 */
export function isAvailable() {
  try {
    loadCredentials();
    return true;
  } catch {
    return false;
  }
}

let _webmastersClient = null;
let _searchConsoleClient = null;

async function getClients() {
  if (_webmastersClient && _searchConsoleClient) {
    return { webmasters: _webmastersClient, searchconsole: _searchConsoleClient };
  }
  const creds = loadCredentials();
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
  await auth.authorize();
  _webmastersClient = google.webmasters({ version: 'v3', auth });
  _searchConsoleClient = google.searchconsole({ version: 'v1', auth });
  return { webmasters: _webmastersClient, searchconsole: _searchConsoleClient };
}

// --- Performance report (queries, pages, clicks, impressions, CTR, position) ---

/**
 * Query Search Analytics for the given date range.
 *
 * @param {object} opts
 * @param {string} [opts.property]   GSC resource id. Defaults to DEFAULT_PROPERTY.
 * @param {string} opts.startDate    YYYY-MM-DD
 * @param {string} opts.endDate      YYYY-MM-DD
 * @param {string[]} [opts.dimensions] e.g. ['query'], ['page'], ['query','page']
 * @param {number} [opts.rowLimit]   default 1000, max 25000
 * @returns {Promise<Array<{keys: string[], clicks, impressions, ctr, position}>>}
 */
export async function querySearchAnalytics({
  property = DEFAULT_PROPERTY,
  startDate,
  endDate,
  dimensions = ['query'],
  rowLimit = 1000,
} = {}) {
  if (!startDate || !endDate) throw new Error('startDate and endDate are required');
  const { webmasters } = await getClients();
  const res = await webmasters.searchanalytics.query({
    siteUrl: property,
    requestBody: { startDate, endDate, dimensions, rowLimit },
  });
  return res.data.rows || [];
}

/**
 * Pull the last `days` of performance data grouped by page, useful for
 * spotting low-CTR URLs to target with title/meta rewrites.
 */
export async function getLowCtrPages({
  property = DEFAULT_PROPERTY,
  days = 28,
  minImpressions = 100,
} = {}) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 86400 * 1000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const rows = await querySearchAnalytics({
    property,
    startDate: fmt(startDate),
    endDate: fmt(endDate),
    dimensions: ['page'],
    rowLimit: 25000,
  });
  return rows
    .filter((r) => r.impressions >= minImpressions)
    .sort((a, b) => a.ctr - b.ctr);
}

// --- URL inspection (coverage / indexing state for a single URL) ---

/**
 * Inspect a single URL. Returns the full inspectionResult, which includes
 * indexStatusResult (coverageState, robotsTxtState, indexingState, verdict),
 * mobileUsabilityResult, richResultsResult, and the Google-cached version.
 */
export async function inspectUrl({
  property = DEFAULT_PROPERTY,
  url,
  languageCode = 'en-US',
} = {}) {
  if (!url) throw new Error('url is required');
  const { searchconsole } = await getClients();
  const res = await searchconsole.urlInspection.index.inspect({
    requestBody: { inspectionUrl: url, siteUrl: property, languageCode },
  });
  return res.data.inspectionResult || null;
}

// --- Sitemaps ---

export async function listSitemaps({ property = DEFAULT_PROPERTY } = {}) {
  const { webmasters } = await getClients();
  const res = await webmasters.sitemaps.list({ siteUrl: property });
  return res.data.sitemap || [];
}

export async function listSites() {
  const { webmasters } = await getClients();
  const res = await webmasters.sites.list();
  return res.data.siteEntry || [];
}

export default {
  DEFAULT_PROPERTY,
  isAvailable,
  querySearchAnalytics,
  getLowCtrPages,
  inspectUrl,
  listSitemaps,
  listSites,
};
