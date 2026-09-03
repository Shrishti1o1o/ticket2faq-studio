import { useEffect, useMemo, useState } from 'react'
import { SAMPLE_FAQ, SAMPLE_TICKET } from './data/sample.js'
import { DEFAULT_PROMPT_TEMPLATE, buildPrompt } from './lib/prompt.js'
import { runQa } from './lib/qa.js'

const STORAGE_KEYS = {
  ticket: 'ticket2faq.ticket',
  template: 'ticket2faq.template',
  draft: 'ticket2faq.draft',
}

function readStoredValue(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ?? fallback
  } catch {
    return fallback
  }
}

function Panel({ eyebrow, title, children, actions }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

function Button({ children, variant = 'secondary', ...props }) {
  return (
    <button className={`button button-${variant}`} type="button" {...props}>
      {children}
    </button>
  )
}

function App() {
  const [ticket, setTicket] = useState(() => readStoredValue(STORAGE_KEYS.ticket, ''))
  const [template, setTemplate] = useState(() =>
    readStoredValue(STORAGE_KEYS.template, DEFAULT_PROMPT_TEMPLATE),
  )
  const [draft, setDraft] = useState(() => readStoredValue(STORAGE_KEYS.draft, ''))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.ticket, ticket)
  }, [ticket])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.template, template)
  }, [template])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.draft, draft)
  }, [draft])

  const generatedPrompt = useMemo(() => buildPrompt(template, ticket), [template, ticket])
  const qaResults = useMemo(() => runQa(draft), [draft])
  const passedChecks = qaResults.filter((check) => check.passed).length
  const draftWords = draft.trim() ? draft.trim().split(/\s+/).length : 0

  async function copyPrompt() {
    if (!ticket.trim()) return

    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = generatedPrompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }

  function downloadRecord() {
    const timestamp = new Date().toISOString()
    const qaLines = qaResults
      .map((check) => `${check.passed ? 'PASS' : 'REVIEW'} — ${check.label}`)
      .join('\n')

    const record = `Ticket2FAQ Studio — Workflow Record\nGenerated: ${timestamp}\n\n=== RAW SUPPORT TICKET ===\n${ticket || '(empty)'}\n\n=== PROMPT TEMPLATE ===\n${template}\n\n=== GENERATED AI PROMPT ===\n${generatedPrompt}\n\n=== FIRST-PASS FAQ DRAFT ===\n${draft || '(empty)'}\n\n=== QA RESULTS ===\n${qaLines}\n`

    const blob = new Blob([record], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `ticket2faq-workflow-${Date.now()}.txt`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  function clearSession() {
    setTicket('')
    setDraft('')
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <span className="badge">AI workflow proof-of-work</span>
          <h1>Ticket2FAQ Studio</h1>
          <p>
            Turn a messy customer support ticket into a repeatable FAQ workflow with a saved
            prompt, model-agnostic drafting, deterministic QA checks, and human review.
          </p>
        </div>
        <div className="hero-card" aria-label="Workflow summary">
          <span>1. Capture</span>
          <span>2. Prompt</span>
          <span>3. Draft</span>
          <span>4. QA + review</span>
        </div>
      </header>

      <div className="privacy-note">
        <strong>Privacy note:</strong> Use fictional or redacted tickets in this front-end demo.
        The browser stores the current session in localStorage.
      </div>

      <main className="workflow-grid">
        <div className="workflow-column">
          <Panel
            eyebrow="Step 1"
            title="Raw support ticket"
            actions={
              <>
                <Button onClick={() => setTicket(SAMPLE_TICKET)}>Load sample</Button>
                <Button onClick={clearSession}>Clear</Button>
              </>
            }
          >
            <p className="helper-text">
              Paste a support ticket here. Customer-specific details should not survive into the
              reusable FAQ.
            </p>
            <textarea
              className="editor editor-ticket"
              value={ticket}
              onChange={(event) => setTicket(event.target.value)}
              placeholder="Paste a fictional or redacted support ticket..."
              aria-label="Raw support ticket"
            />
            <div className="editor-meta">{ticket.length} characters</div>
          </Panel>

          <Panel
            eyebrow="Step 2"
            title="Persistent AI instruction template"
            actions={
              <Button onClick={() => setTemplate(DEFAULT_PROMPT_TEMPLATE)}>Restore default</Button>
            }
          >
            <p className="helper-text">
              These instructions persist in localStorage and are reused for every ticket.
            </p>
            <textarea
              className="editor editor-template"
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              aria-label="AI instruction template"
            />
          </Panel>
        </div>

        <div className="workflow-column">
          <Panel
            eyebrow="Step 3"
            title="Generated prompt"
            actions={
              <Button variant="primary" onClick={copyPrompt} disabled={!ticket.trim()}>
                {copied ? 'Copied' : 'Copy prompt for AI'}
              </Button>
            }
          >
            <p className="helper-text">
              Send this prompt to the AI model of your choice. No API key is stored in this app.
            </p>
            <pre className="prompt-preview">{generatedPrompt}</pre>
          </Panel>

          <Panel
            eyebrow="Step 4"
            title="First-pass FAQ draft"
            actions={<Button onClick={() => setDraft(SAMPLE_FAQ)}>Load example draft</Button>}
          >
            <p className="helper-text">
              Paste the model response here, then edit it while the deterministic checks update.
            </p>
            <textarea
              className="editor editor-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Paste the AI-generated FAQ draft..."
              aria-label="First-pass FAQ draft"
            />
            <div className="editor-meta">{draftWords} words</div>
          </Panel>
        </div>
      </main>

      <section className="qa-section">
        <div className="qa-heading">
          <div>
            <p className="eyebrow">Deterministic guardrails</p>
            <h2>QA checklist</h2>
            <p className="helper-text">
              These rules catch obvious failure modes. Passing them does not prove factual
              correctness.
            </p>
          </div>
          <div className="score-card">
            <strong>{passedChecks}/{qaResults.length}</strong>
            <span>checks passed</span>
          </div>
        </div>

        <div className="qa-list">
          {qaResults.map((check) => (
            <article className={`qa-item ${check.passed ? 'qa-pass' : 'qa-review'}`} key={check.id}>
              <div className="qa-status" aria-hidden="true">
                {check.passed ? '✓' : '!'}
              </div>
              <div>
                <h3>{check.label}</h3>
                <p>{check.detail}</p>
              </div>
              <span className="qa-label">{check.passed ? 'Pass' : 'Review'}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="export-section">
        <div>
          <p className="eyebrow">Inspectable record</p>
          <h2>Export the workflow snapshot</h2>
          <p>
            Download the ticket, current template, generated prompt, draft, and QA results as a
            plain-text audit record.
          </p>
        </div>
        <Button variant="primary" onClick={downloadRecord}>
          Download workflow record
        </Button>
      </section>

      <footer>
        <p>
          AI output is a first pass. Product behavior and publishing decisions still require human
          verification.
        </p>
      </footer>
    </div>
  )
}

export default App
