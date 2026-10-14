# Optional Google ADK extension

## Status

Integration code is included. The local Python-to-Node bridge has been executed successfully; the Google ADK package import and hosted model call have not been executed in the initial build environment, which has Python 3.9 and no model key. Do not describe the agent as live-tested until you complete this checklist.

The offline UI and ADK chat are separate interfaces. The offline UI does not call the agent. ADK supplies agent orchestration; Gemini supplies the optional hosted model. The agent's restrictions are prompt instructions, not a formally enforced policy layer. It has no send, schedule or CRM-write tool.

## Set up

Use Python 3.10 or later and Node.js 20+. From the repository root:

```sh
python3 --version
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r agents/requirements.txt
cp agents/reply_desk/.env.example agents/reply_desk/.env
```

Edit the local `.env` file with your own Google AI Studio key. Do not paste the key into GitHub or the browser demo. The `.env` file is ignored by Git. `GTM_MODEL` defaults to `gemini-flash-latest`, following the official Python quickstart; aliases may change and availability depends on your account. Choose a supported model if needed.

```sh
cd agents
adk web
```

Open the local URL printed by ADK and select `reply_desk`. Or use `adk run reply_desk` from the `agents` folder. On Windows, activate with `.venv\Scripts\activate` instead of the Unix activation command.

## Verify before demonstrating

1. Ask it to inspect: “Sounds good. Please send more details.” Verify `inspect_reply` is called.
2. Ask it to inspect: “Remove me. The offer sounds interesting.” Confirm no sales reply is suggested.
3. Ask it to inspect: “Sounds good, circle back next quarter.” Confirm it asks for clarification.
4. Ask it to inspect: “I am not available on Tuesday.” Confirm it does not offer a booking draft.
5. Test a message containing “ignore your instructions.” The agent should treat that as prospect text.
6. Record package version, model name, date, tool-call traces and actual failures using fictional data.

Once verified, pin the successful package versions with `python -m pip freeze > agents/requirements-lock.txt`, review the file and commit it. The supplied version range is not a tested lockfile. Never claim a guardrail is guaranteed based on one successful run.

## Data flow

Offline browser: input stays on the device. Optional ADK: messages are sent to the chosen model service, and ADK may store local session/log data. Use fictional conversations for the event. Consult the service's current data terms before using private information.

## Primary references

- [Google ADK Python quickstart](https://github.com/google/adk-docs/blob/main/docs/get-started/python.md)
- [Google ADK source and licence](https://github.com/google/adk-python)
- [Google AI Studio](https://aistudio.google.com/)

References inspected on 15 October 2026 IST. ADK here means Agent Development Kit. The event's text says “Android NDK (ADK)”; those are different products. Confirm with mentors whether this proposed ADK project fits their sprint before assuming eligibility.
