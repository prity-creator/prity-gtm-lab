# Verification record — 15 October 2026 IST

## Executed successfully
- 20 Node.js regression tests (`npm test`).
- 28 synthetic development examples (`npm run evaluate`); these are not held-out data.
- Python-to-Node bridge with an opt-out that also contains positive language.
- JavaScript syntax checks and Python AST parsing.
- Static checks of HTML IDs, label targets, UI element references, standalone script embedding and local Markdown links.

## Publication and browser checks — 15 October 2026 IST

- Public repository, profile README and pinned portfolio verified on GitHub.
- GitHub Actions regression and synthetic-evaluation workflow passed, including [run 3](https://github.com/prity-creator/prity-gtm-lab/actions/runs/38623646012).
- [Live GitHub Pages demo](https://prity-creator.github.io/prity-gtm-lab/) loaded successfully.
- Desktop screenshot inspected; all five project panels opened.
- Confirmed opt-out disables sales drafting, campaign sample deltas are correct, follow-up generation works, outreach warnings appear, and UTM link generation works.
- This was a focused browser smoke check, not exhaustive accessibility, mobile or cross-browser testing.

## Initial build limitations
- A visual browser review or interactive click-through. The environment denied a local listening socket, and its browser policy blocked file URLs. No bypass was attempted.
- Google ADK package import and live model inference. Supported Python and a user-supplied key are still needed.
- GitHub Actions, publication, profile update and Pages were unavailable during the initial build; these were subsequently verified as recorded above.

Run the standalone demo locally before recording or submitting the application. Working core tests do not establish production readiness or real-world classification accuracy.
