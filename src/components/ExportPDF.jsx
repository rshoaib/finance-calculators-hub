export default function ExportPDF() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button className="btn-share" onClick={handlePrint} title="Download as PDF">
      📄 Download PDF
    </button>
  )
}
