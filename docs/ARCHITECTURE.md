# Architecture and trade-offs

The browser and Node CLI use the same pure functions in `src/engine.js`. The optional Python agent calls the CLI through `subprocess.run` with an argument list and JSON on stdin; it does not use a shell or construct commands from message content. A timeout bounds the subprocess. The browser interface renders user text with `textContent` and textarea values.

The demo has no backend data store. The development server binds to loopback and serves a fixed allowlist of static files, excluding `.env`, documentation and filesystem traversal paths. It is a local development server, not production hosting.

## Decision rules

Opt-out outranks a decline, which outranks referral, timing, objection and interest. Multiple non-decline intents and selected conditional phrases suppress drafting. Explicit negated availability triggers review. Every result still requires a person to check it.

These are incomplete English phrase rules. They cannot reliably resolve sarcasm, semantic negation, quoted content, mixed speakers or indirect opt-outs. A single intent may miss context. That is a deliberate scope boundary, not evidence of production safety. Do-not-contact is a recommendation only; users must update the source system themselves.

## Next engineering step

Compare a verified ADK/model path with this baseline on a separately authored, unseen synthetic evaluation set. Keep evidence quotes, report errors by category and distinguish classification performance from draft quality. Do not replace measurable behaviour with a confident-looking score.

## Other tools

- Campaign Pulse assumes one nested funnel cohort, with equal observation windows. It cannot infer why a campaign changed.
- Follow-up uses explicit structured fields; it does not extract facts from transcripts or confirm that a promise was agreed.
- Outreach Check uses simple patterns; passing it does not prove a message is accurate or appropriate.
- Campaign Link Kit builds URLs; it does not measure attribution or visits.
