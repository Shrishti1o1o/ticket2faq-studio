const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
const LONG_ID_PATTERN = /\b[A-Z]{2,}-\d{4,}\b|\b\d{8,}\b|\b(?=[A-Z0-9]{10,}\b)(?=[A-Z0-9]*\d)[A-Z0-9]+\b/i
const RISKY_ABSOLUTES = /\b(guaranteed|always|never|definitely|certainly|100%|completely fixed|will fix)\b/i
const QUESTION_HEADING = /^##\s+[^\n]+\?\s*$/m
const VERIFICATION_NOTE = /^Verification needed:\s*.+$/im

export function runQa(draft) {
  const text = draft.trim()
  const words = text ? text.split(/\s+/).length : 0

  return [
    {
      id: 'question-heading',
      label: 'Starts with a question-style Markdown heading',
      passed: QUESTION_HEADING.test(text),
      detail: 'Expected a line such as: ## Why can’t I download my invoice?',
    },
    {
      id: 'length',
      label: 'Draft length is reasonable',
      passed: words >= 35 && words <= 350,
      detail: `${words} words. Target range: 35–350 words.`,
    },
    {
      id: 'email',
      label: 'No email address detected',
      passed: !EMAIL_PATTERN.test(text),
      detail: 'Customer email addresses should be removed or generalized.',
    },
    {
      id: 'identifier',
      label: 'No obvious long ID or order reference detected',
      passed: !LONG_ID_PATTERN.test(text),
      detail: 'Long numeric/alphanumeric identifiers may contain customer-specific data.',
    },
    {
      id: 'absolute-language',
      label: 'No risky absolute language detected',
      passed: !RISKY_ABSOLUTES.test(text),
      detail: 'Avoid claims such as “guaranteed”, “always”, “never”, or “definitely”.',
    },
    {
      id: 'verification',
      label: 'Contains a verification note',
      passed: VERIFICATION_NOTE.test(text),
      detail: 'Use “Verification needed:” for product behavior that requires confirmation.',
    },
  ]
}
