# My Setup — Non-Default Configuration

This file documents everything in this session that differs from a stock OpenCode + default model setup.

Generated: 2026-09-26
Workspace: `/home/runner/work/Claude-of-Duty/Claude-of-Duty`
Host: `linux` (GitHub Action runner)

## 1. Identity / Model

- Default would be e.g. `anthropic/claude-sonnet-4-6` with no extra system framing.
- Here:
  - Agent runtime: **OpenCode 1.18.32** (`/home/runner/.opencode/bin/opencode`)
  - Powering model: **Muse Spark `muse-spark-1.3-contributor-free`**
    - OpenCode model ID: `opencode/muse-spark-1.3-contributor-free`
  - System framing: OpenCode coding agent + Muse Spark friendly-assistant instructions (facts-first, verify-by-execution, `file_path:line_number` references, specialized tools over bash for file ops).

## 2. Global OpenCode config — `~/.config/opencode/opencode.json`

Stock OpenCode has **no** `~/.config/opencode/opencode.json` (no plugins, no custom permissions, no custom commands). Here:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    [
      "opencode-goal-plugin",
      {
        "noInterruptOnUserMessage": true
      }
    ]
  ],
  "permission": {
    "*": "allow",
    "task": "allow"
  },
  "command": {
    "goal": {
      "description": "Set a session-scoped goal and auto-continue until complete.",
      "template": "$ARGUMENTS",
      "agent": "build"
    }
  }
}
```

Deltas:
- `plugin`: `opencode-goal-plugin@1.18.32` (`@opencode-ai/plugin: 1.18.32` in `~/.config/opencode/package.json`) with `noInterruptOnUserMessage: true`.
- `permission`: wildcard `allow` + `task: allow` (default is `ask` / per-tool prompting).
- `command.goal`: custom `/goal` command, `agent: build`, `template: $ARGUMENTS`.

No other global scopes set: no `model`, `small_model`, `default_agent`, `provider`, `mcp`, `lsp`, `formatter`, `skills.paths/urls`, `references`, `instructions`.

## 3. Project config — none (uses globals)

- Default: optional `./opencode.json` / `./opencode.jsonc` / `.opencode/opencode.json`.
- Here: **none of those exist**. Verified `opencode.json`, `opencode.jsonc`, `.opencode/opencode.json` all missing.
- `.opencode/` contains only `goals/` session state (`state.json.sessions/...`), no `agent/`, `command/`, `skill/`, `plugin/` overrides.
- Provenance: `.omgithub-remix.json` → source `mshumer/Claude-of-Duty@d9b237b`.

## 4. Project instructions — `Agents.md`

Stock repo has no custom instructions. Here `Agents.md` (17 lines) is loaded as session context:

- Process lifecycle: run long-lived servers/watchers in persistent `tmux`, no detached bounded-command backgrounds, inspect process+endpoint after timeout.
- Linux browser/WebGPU capture: use preinstalled `playwright-cli` headed Chromium + persistent Xvfb + SwiftShader, `playwright-cli open http://localhost:3002`, load saved scene, wait for real geometry + active WebGPU renderer, `playwright-cli screenshot --filename=screenshots/linux.png`, reject loading screens/empty grids/blank canvases, report SwiftShader as CPU software rendering (not GPU), inspect `$HOME/.local/share/omgithub-playwright/linux.json`, `playwright-cli --help` for sessions.

## 5. Skills — `.agents/skills/` (project-bundled)

Default: no project skills; external scan only `~/.claude/skills/`, `~/.agents/skills/` (both absent here). This workspace bundles 5 skills in `.agents/skills/` per `.agents/README.md`:

1. `gauntlet-loop` — build paste-ready builder+harsh-critic loop prompts; triggers: `/gauntlet-loop`, `gauntlet loop`, `loop until it beats X`.
2. `image-search` — DuckDuckGo image search for配图 (`scripts/image_search.py`, size/color/type/license filters). `user-invocable: false`.
3. `load-sketchfab-threejs` — Sketchfab search/download, GLB inspect/normalize (`scripts/*.mjs|*.py`), Three.js `GLTFLoader` + PlayCanvas Container loading, browser A/B verification with attribution sidecars. Includes `agents/openai.yaml`, `assets/viewer/`, `vendor/sketchfab_downloader_extension/`, `wiki/`.
4. `mcp-duckgo` — web search/scrape via `uvx duckduckgo-mcp-server` through `mcporter` (`search`, `fetch_content`).
5. `opencode-zen-completions` — call OpenCode Zen OpenAI-compatible API (`https://opencode.ai/zen/v1/models`, `.../chat/completions`, `Authorization: Bearer public`), query live model list before picking free models.

Upstream licenses preserved in `.agents/third-party-licenses/`.

## 6. Runtime env / experimental flags

Stock: plain local TUI, no experimental env. Here (GitHub workflow `TonyD2F/Claude-of-Duty/.github/workflows/opencode.yml`, job `opencode`, `OPENCODE=1`):

```
OPENCODE_ENABLE_EXPERIMENTAL_MODELS=true
OPENCODE_EXPERIMENTAL=true
OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
OPENCODE_EXPERIMENTAL_WEBSOCKETS=true
OPENCODE_EXPERIMENTAL_WORKSPACES=true
OPENCODE_ENABLE_EXA=true
OPENCODE_WEB_PORT=33667
OPENCODE_WEB_DIR=/home/runner/work/_temp/omgithub-web
GITHUB_ACTION=opencode_web
TARGET_REF=opencode-remix/72a2b421-7852-4f3d-9868-b73e8d2216cf
BRANCH_NAME=opencode/36211841607
```

Plus goal-plugin state in `.opencode/goals/state.json.sessions/` (2 sessions active at time of writing).

## 7. What was *not* customized (still default)

- No project `opencode.json`, no `agent`, `mcp`, `provider`, `disabled_providers`, `formatter`, `lsp`, `compaction`, `tool_output` overrides.
- No `.opencode/agent/*.md`, `.opencode/command/*.md` (other than global `/goal`), `.opencode/skill/*/SKILL.md`, `.opencode/plugin/*`.
- No global agents/commands/skills under `~/.config/opencode/`, no `~/.claude/skills/`, no `~/.agents/skills/`.
- Built-in agents unchanged: `build`, `plan`, `general`, `explore` (+ hidden `compaction`, `title`, `summary`).
