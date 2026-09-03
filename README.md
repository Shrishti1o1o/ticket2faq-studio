# Ticket2FAQ Studio

A small React proof-of-work project that turns a messy customer support ticket into a **repeatable AI-assisted FAQ workflow**.

Instead of sending a one-off prompt and accepting the answer as-is, the project separates the process into four inspectable steps:

1. Capture the raw support ticket.
2. Wrap it in a persistent, reusable AI instruction template.
3. Generate a first-pass FAQ with the AI model of your choice.
4. Run deterministic QA checks before a human decides whether the draft is safe and useful.

The workflow is intentionally provider-agnostic, so it can be demonstrated with ChatGPT, Claude, Gemini, or another model without storing an API key in the browser.

## Why I built it

Support tickets contain useful documentation signals, but they are usually noisy: customer-specific details, urgency, partial troubleshooting, and sometimes assumptions about the root cause. Turning those tickets into reusable help content manually is repetitive.

This project treats AI as one stage in a small system rather than as the final authority. The saved prompt gives the model consistent instructions, while the QA layer catches a few obvious failure modes such as leaked email addresses, long IDs, overconfident language, missing verification notes, or an overly long draft.

## What makes this more than a one-off prompt

- **Persistent prompt template:** the instruction layer is saved in `localStorage` and can be edited or restored.
- **Reusable workflow:** any support ticket can pass through the same sequence.
- **Human-in-the-loop review:** AI output is pasted back into the app and checked instead of being accepted automatically.
- **Deterministic guardrails:** simple JavaScript rules provide a second layer that does not depend on the model.
- **Inspectable record:** the input, generated prompt, draft, and QA results can be exported as a text file.

## Demo flow

1. Click **Load sample** under “Raw support ticket.”
2. Review the generated prompt.
3. Click **Copy prompt for AI** and paste it into your preferred AI model.
4. Paste the model response into “First-pass FAQ draft.”
5. Review the QA checklist.
6. Edit the draft if needed and watch the checks update.
7. Click **Download workflow record** to export an auditable snapshot.

For a fast demo without leaving the app, use **Load example draft**.

## Example input

> “I upgraded my plan yesterday and now the invoice download opens a blank tab. I tried two browsers and signing out. I need the invoice today. Account: Northstar Labs, user: maya@..., order ref: RF-88314.”

## Example output

```md
## Why can’t I download an invoice after changing my plan?

After a plan change, billing information may need to refresh before an invoice is available normally. If the invoice download opens a blank tab, try the following steps:

1. Open **Billing** and refresh the page.
2. Sign out, then sign back in.
3. Try the invoice download in another browser or a private/incognito window.
4. If the issue continues, contact support and include the approximate time of the plan change.

Verification needed: Confirm whether billing changes can take time to refresh and whether any additional invoice-generation delay is expected.
```

The example is a **first pass**, not publishing-ready documentation. A human should still verify product behavior and edit the answer.

## How it works

### 1. Prompt construction

`src/lib/prompt.js` stores the default instruction template. The app combines that template with the raw ticket inside clear delimiters. Delimiting the ticket makes the boundary between instructions and source material easier to inspect.

### 2. Persistence

The current ticket, prompt template, and FAQ draft are stored in browser `localStorage`. Refreshing the page does not destroy the working session.

### 3. QA checks

`src/lib/qa.js` runs lightweight checks for:

- a question-style Markdown heading;
- reasonable draft length;
- email addresses;
- obvious long IDs/order references;
- risky absolute claims such as “guaranteed”;
- a `Verification needed:` note.

These checks are deliberately simple. They are a safety net, not a truth detector.

## Current limitations

This version does **not** automatically call an AI API. That is intentional for the first version: it avoids exposing API keys in a front-end demo and keeps the workflow model-agnostic. The tradeoff is one manual copy/paste step.

The QA rules are also heuristic. A draft can pass every check and still be factually wrong, vague, or off-brand. The system cannot verify product behavior because it has no approved knowledge base connected to it.

## What I would improve next

If I continued the project, I would add a small server-side API layer and connect the workflow to an approved documentation source. The system could then:

1. retrieve relevant help-center passages;
2. ask the model to draft only from those sources;
3. require citations for factual claims;
4. run the existing deterministic checks;
5. route low-confidence drafts to a human reviewer.

That would reduce the manual step while keeping the AI output grounded and reviewable.

## Tech stack

- React
- Vite
- Plain JavaScript
- CSS
- Browser `localStorage`

No UI framework or database is required.

## Run locally

### Prerequisites

Install Node.js `20.19+` or `22.12+`, matching the current Vite requirement.

### Commands

```bash
npm install
npm run dev
```

Open the local address printed by Vite in your terminal, usually `http://localhost:5173`.

To test a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
ticket2faq-studio/
├── src/
│   ├── data/
│   │   └── sample.js        # Safe example ticket and FAQ
│   ├── lib/
│   │   ├── prompt.js        # Persistent AI instructions + prompt builder
│   │   └── qa.js            # Deterministic QA rules
│   ├── App.jsx              # Main workflow UI and localStorage logic
│   ├── main.jsx
│   └── styles.css
├── AI_WORKFLOW_PROMPT.md     # Prompt shown separately for inspection
├── GITHUB_SETUP.md           # Beginner GitHub publishing guide
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Privacy note

Do not paste real confidential customer data into a public demo. The sample ticket uses fictional information. For a production version, add a server-side redaction step and define a formal data-retention policy before any model call.

## Design principle

The goal is not “make AI write an FAQ.” The goal is to make the transformation **repeatable, inspectable, and reviewable**.
