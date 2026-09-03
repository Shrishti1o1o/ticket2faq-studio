export const DEFAULT_PROMPT_TEMPLATE = `You are turning a customer support ticket into a reusable help-center FAQ draft.

Follow these rules:
- Write for a general customer, not the individual ticket author.
- Remove or generalize names, email addresses, account names, order references, IDs, and other customer-specific details.
- Do not invent product behavior, causes, timelines, policies, or troubleshooting steps that are not supported by the ticket.
- If a factual product claim needs confirmation, add a final line beginning exactly with "Verification needed:".
- Avoid absolute or overconfident language such as "guaranteed", "always", "never", or "definitely".
- Start with a Markdown level-2 question heading (## ...?).
- Keep the answer concise and practical.
- Prefer numbered troubleshooting steps when the ticket contains actions a user can try.
- Do not mention that the content came from a support ticket.
- Output only the FAQ draft.`

export function buildPrompt(template, ticket) {
  const safeTemplate = template.trim()
  const safeTicket = ticket.trim()

  return `${safeTemplate}\n\n--- BEGIN SOURCE TICKET ---\n${safeTicket}\n--- END SOURCE TICKET ---`
}
