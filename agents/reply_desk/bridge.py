"""Bridge to the exact deterministic core used by the browser demo."""
import json
from pathlib import Path
import subprocess

CORE = Path(__file__).resolve().parents[2] / "src" / "cli.cjs"

def inspect_reply(reply_text: str) -> dict:
    """Inspect one latest prospect reply; return matched evidence and draft restrictions.

    Args:
        reply_text: The latest prospect message only, without a quoted thread.
    """
    if not isinstance(reply_text, str) or not reply_text.strip() or len(reply_text) > 12000:
        return {"error": "Provide 1 to 12000 characters.", "review_required": True}
    try:
        result = subprocess.run(
            ["node", str(CORE)],
            input=json.dumps({"tool": "analyzeReply", "text": reply_text}),
            capture_output=True, text=True, timeout=5, check=True,
        )
        return json.loads(result.stdout)
    except (OSError, subprocess.SubprocessError, json.JSONDecodeError):
        return {"error": "Local rules could not run. Check Node.js installation.", "review_required": True}
