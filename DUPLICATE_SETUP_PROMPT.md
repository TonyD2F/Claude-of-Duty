# Duplicate My Setup — Prompt for your OpenCode agent

Copy-paste everything below the line to your opencode agent:

---

Duplicate my custom OpenCode setup exactly. Anything not listed below stays stock/default.

1. Runtime / model:
- Install/use OpenCode 1.18.32 at `~/.opencode/bin/opencode` (`opencode --version` must show 1.18.32).
- Set model to `opencode/muse-spark-1.3-contributor-free` (Muse Spark). Do not set `small_model` or `default_agent`.
- Behavior framing: facts-first, verify-by-execution, reference code as `file_path:line_number`, use dedicated read/edit/write/glob/grep tools over bash for file ops.

2. Global config `~/.config/opencode/opencode.json` — create with exactly this content:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [["opencode-goal-plugin", {"noInterruptOnUserMessage": true}]],
  "permission": {"*": "allow", "task": "allow"},
  "command": {"goal": {"description": "Set a session-scoped goal and auto-continue until complete.", "template": "$ARGUMENTS", "agent": "build"}}
}
```
- Ensure `~/.config/opencode/package.json` has `"@opencode-ai/plugin": "1.18.32"`.
- Do NOT add `provider`, `mcp`, `lsp`, `formatter`, `skills.paths/urls`, `references`, `instructions`, `compaction`, `tool_output`.

3. Project config:
- Delete if present: `./opencode.json`, `./opencode.jsonc`, `.opencode/opencode.json`.
- Ensure `.opencode/` contains only `goals/` — no `agent/`, `command/`, `skill/`, `plugin/` overrides.
- Do NOT create global `~/.claude/skills/` or `~/.agents/skills/`.

4. Project instructions `Agents.md` in repo root — create with exactly this:
```md
## Process lifecycle

- Run long-lived servers and watchers in a persistent session such as tmux.
- Do not background them in bounded commands without explicit detachment and cleanup.
- After a timeout, inspect the process and endpoint before retrying or claiming failure.

## Linux browser and WebGPU capture

- Use the preinstalled `playwright-cli` executable from Actions or SSH.
- Use its headed Chromium, persistent Xvfb display, and SwiftShader configuration.
- Run `playwright-cli open http://localhost:3002` for the Pascal development server.
- Load a saved scene. Wait for actual geometry and the active WebGPU renderer.
- Run `playwright-cli screenshot --filename=screenshots/linux.png` after creating the output directory.
- Inspect the image. Reject loading screens, empty grids, and blank canvases.
- Report SwiftShader as CPU software rendering. Do not claim GPU hardware acceleration.
- Inspect `$HOME/.local/share/omgithub-playwright/linux.json` for launch settings.
- Use `playwright-cli --help` for commands and named sessions. Pass configuration only to `open`.
```

5. Skills `.agents/skills/` — recreate verbatim from source `mshumer/Claude-of-Duty@d9b237b`:
- `.agents/skills/gauntlet-loop/SKILL.md`
- `.agents/skills/image-search/SKILL.md + scripts/image_search.py`
- `.agents/skills/load-sketchfab-threejs/` (full dir: SKILL.md, AGENTS.md, agents/, assets/viewer/, scripts/, vendor/sketchfab_downloader_extension/, wiki/)
- `.agents/skills/mcp-duckgo/SKILL.md`
- `.agents/skills/opencode-zen-completions/SKILL.md`
- Plus `.agents/README.md` and `.agents/third-party-licenses/`. If you cannot fetch, ask me for the source path and copy with `cp -r`.

6. Env (best-effort, local equivalent):
```
OPENCODE_ENABLE_EXPERIMENTAL_MODELS=true
OPENCODE_EXPERIMENTAL=true
OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
OPENCODE_EXPERIMENTAL_WEBSOCKETS=true
OPENCODE_EXPERIMENTAL_WORKSPACES=true
OPENCODE_ENABLE_EXA=true
OPENCODE=1
```

7. Verify then restart:
- `cat ~/.config/opencode/opencode.json && opencode --version && ls -R .agents/skills && ls opencode.json opencode.jsonc .opencode/opencode.json || true`
- Tell me to quit and restart opencode (config is not hot-reloaded).
