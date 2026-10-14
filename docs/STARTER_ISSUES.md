# Suggested issues to create on GitHub

These are proposals, not claims that issues already exist online.

## 1. Improve indirect opt-out recognition
**Scope:** add a small fictional set including “take me off this list” and “please leave me alone”; preserve opt-out precedence. **Done when:** core tests and evaluation record the behaviour. **Beginner-friendly:** yes.

## 2. Verify the optional Google ADK agent
**Scope:** run setup on supported Python, capture tool traces, test conflicting instructions, record package and model versions. **Done when:** docs clearly distinguish what passed from what still fails. **Beginner-friendly:** with a mentor.

## 3. Add a separate unseen evaluation set
**Scope:** ask a contributor to write fictional cases without viewing the classifier patterns. **Done when:** report per-intent outcomes and abstentions; do not tune on the same set and call it held out.

## 4. Add explicit speaker separation
**Scope:** make the input format distinguish the last prospect message from quoted history. **Done when:** text in a seller's earlier message cannot silently drive intent classification.

## 5. Add campaign cohort-age guidance
**Scope:** capture observation length and warn about mismatched windows. **Done when:** a recent send cohort is not compared as if it had equal time to accumulate bookings.
