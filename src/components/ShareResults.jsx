import { useState } from 'react'

export default function ShareResults({ title, resultsSummary }) {
  const [copied, setCopied] = useState(false)

  const handleCopyResults = async () => {
    const text = `${title}\n${'—'.repeat(30)}\n${resultsSummary}\n\nCalculated at ${window.location.href}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: resultsSummary, url: window.location.href })
      } catch { /* user cancelled */ }
    } else {
      handleCopyResults()
    }
  }

  return (
    <div className="share-results">
      <button className="btn-share" onClick={handleCopyResults} title="Copy results to clipboard">
        {copied ? '✅ Copied!' : '📋 Copy Results'}
      </button>
      <button className="btn-share" onClick={handleShare} title="Share results">
        🔗 Share
      </button>
    </div>
  )
}
