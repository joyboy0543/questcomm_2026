
# QuestComm UI Upgrade Pack

This bundle adds: dramatic SFX, police radio toasts, puzzle randomizer, optional CCTV puzzle, animated case-file transitions, police-tape loading bar, crime scene mini-map, interrogation mini-game, and a fingerprint scan mini-game.

## How to install (new branch)

1. Clone your repo:
   ```bash
   git clone https://github.com/joyboy0543/questcomm_2026.git
   cd questcomm_2026
   ```
2. Create a feature branch:
   ```bash
   git checkout -b feature/ui-bonus-minigames
   ```
3. Copy the contents of this zip **into the repo root** (it contains the `assets/` and `index.html`). If you already have HTML/CSS/JS, merge manually.
4. Commit & push:
   ```bash
   git add -A
   git commit -m "feat(ui): bonus + cosmetics + minigames"
   git push -u origin feature/ui-bonus-minigames
   ```
5. Open a Pull Request on GitHub (Compare: `feature/ui-bonus-minigames` → `main`).

## Enable reviews before merging

In GitHub: **Settings → Branches → Add rule** for `main`:
- Enable **Require a pull request before merging**
- Enable **Require approvals** (choose 1+) and **Require review from Code Owners** (optional)
- Optionally enable **Require status checks** (e.g., CI) and **Require conversation resolution**

Add a `CODEOWNERS` file (one is included at `.github/CODEOWNERS`) and replace `@your-handle` with your GitHub username or team. GitHub will auto-request reviews from owners when PRs touch owned paths.

## Free, reusable custom subdomains (no purchase)

If you want a cleaner URL than `joyboy0543.github.io/questcomm_2026/` without buying a domain, you have two solid, free options:

- **JS.ORG** — Get `questcomm.js.org` or `investigation.js.org`. Steps:
  1) Add a `CNAME` file with the chosen `*.js.org` subdomain to your Pages branch
  2) Submit a PR to the `js-org/js.org` repo to add your subdomain
  3) Wait ~24h for activation

- **is-a.dev** — Get `investigation.is-a.dev` (or similar). Steps:
  1) Fork `is-a-dev/register`, add `domains/<subdomain>.json` with `{"records":{"CNAME":"joyboy0543.github.io"}}`
  2) Open a PR and, after merge, set `Custom domain` in your repo Pages to `<subdomain>.is-a.dev`, then enforce HTTPS

After activation, regenerate your QR code to point at the new subdomain.

## Optional: QR Code

Once the domain (or subdomain) resolves, generate a QR that points to it. We can provide one from the assistant if needed.

## Notes

- Audio files referenced (`/assets/sounds/*.ogg`) are placeholders. Add tiny OGGs to avoid heavy payload.
- The CCTV GIF (`/assets/img/cctv_loop.gif`) should be added by you (optimize for <1MB).
- All features are vanilla JS; toggle modules by commenting imports in `index.html`.
