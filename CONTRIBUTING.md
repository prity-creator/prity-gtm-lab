# Contributing

Pick one concrete workflow problem. Open an issue with a fictional input, expected result and a proposed small change. Never paste client messages, names, email addresses or credentials into issues.

1. Fork the repository and create a descriptive branch.
2. Change the shared core or UI. Use `textContent` for user-provided text, never raw HTML interpolation.
3. Add a regression test when changing classification or calculations.
4. Run `npm test` and inspect `npm run evaluate`.
5. Rebuild the standalone page with `python3 scripts/build_demo.py` if UI or core code changed.
6. Open a pull request describing the problem, behaviour and verification.

The synthetic diagnostic set is not held out. Add challenging new examples; do not remove a failure to improve reported numbers. If a change introduces an external API, document data flow, configuration, model limitations and cost. Keep the offline demo runnable without a key.

Respectful discussion and beginner contributions are welcome. A small tested improvement is useful. Never backdate commits, invent usage metrics or imply affiliation with the event organisers.
