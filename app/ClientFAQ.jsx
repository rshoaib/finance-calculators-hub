"use client"
import { useState } from 'react'

export default function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {question}
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
      </button>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  )
}
