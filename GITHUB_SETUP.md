# Publish Ticket2FAQ Studio to GitHub

This guide assumes you have never used GitHub before.

## 1. Create your GitHub account

1. Go to `https://github.com/signup`.
2. Create a personal account, or continue with Google/Apple.
3. Choose a professional username. Your public profile URL will be `https://github.com/YOUR-USERNAME`.
4. Verify your email address.
5. Enable two-factor authentication after signup.

Do not share your GitHub password, email verification code, recovery codes, or 2FA codes with anyone.

## 2. Create an empty repository

After signing in:

1. Click the `+` menu in the upper-right corner.
2. Choose **New repository**.
3. Repository name: `ticket2faq-studio`
4. Suggested description: `AI-assisted workflow that turns support tickets into reusable FAQ drafts with deterministic QA and human review.`
5. Choose **Public** if this is a portfolio project.
6. Because this project already contains a README and `.gitignore`, leave the README, `.gitignore`, and license initialization options unselected.
7. Click **Create repository**.

## 3. Put this downloaded project on your computer

Unzip `ticket2faq-studio.zip` somewhere easy to find, such as your Documents folder.

Open a terminal in the unzipped `ticket2faq-studio` folder.

## 4. Check the project locally

Make sure Node.js is installed, then run:

```bash
node --version
npm --version
npm install
npm run dev
```

Open the local URL printed by Vite. Confirm that the sample ticket, generated prompt, draft editor, QA checks, and download button work.

Stop the dev server with `Ctrl+C` when finished.

## 5. Turn the folder into a Git repository

Run these commands inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Ticket2FAQ Studio"
git branch -M main
```

If Git asks you to identify yourself, configure your name and email first:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Then repeat the commit command.

## 6. Connect your computer to the GitHub repository

On your new GitHub repository page, copy the HTTPS repository URL. It will look like:

```text
https://github.com/YOUR-USERNAME/ticket2faq-studio.git
```

Then run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/ticket2faq-studio.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your real GitHub username.

GitHub may open a browser sign-in/authorization flow. Follow that flow. Do not paste your account password into commands or source files.

## 7. Check the result

Refresh your repository page on GitHub. You should see:

- `src/`
- `README.md`
- `AI_WORKFLOW_PROMPT.md`
- `GITHUB_SETUP.md`
- `package.json`
- `vite.config.js`
- `.gitignore`

The README should render underneath the file list.

## 8. Everyday update workflow

Whenever you change the project later:

```bash
git status
git add .
git commit -m "Describe what changed"
git push
```

Useful commit examples:

```text
Improve QA identifier detection
Polish mobile layout
Add GitHub Pages deployment
Clarify privacy warning
```

## 9. Important things never to commit

Do not upload:

- API keys
- passwords
- access tokens
- `.env` files containing secrets
- real customer tickets
- confidential company data
- `node_modules/`

The included `.gitignore` already excludes common local and secret files, but always inspect `git status` before committing.

## 10. Optional next step: live deployment

Once the repository is online, deploy the static Vite app using GitHub Pages, Vercel, or Netlify. A live demo makes the repository much stronger as a portfolio piece.
