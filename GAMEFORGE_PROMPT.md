# Gameforge — Add-as-option Prompt

Paste everything below the `---` into a **stock/default opencode** session.
It tells that agent to add your setup as a new `/gameforge` option
alongside `build` / `plan` / `/goal`. No files are changed in this repo
by pasting — the target repo gets the new option.

---

Add `gameforge` as a new option alongside build, plan, and goal. Anything not listed below stays stock/default. The option MUST be named exactly `gameforge` and MUST be a command (so `/gameforge` works like `/goal`).

1. Do NOT modify or delete the built-in `build` and `plan` agents. Do NOT modify or delete the existing `/goal` command if present.

2. Create this exact command file (file form, NOT inline JSON). Create parent dirs with `mkdir -p` first if needed:

Path: `.opencode/command/gameforge.md`

```md
---
description: AAA game forge — build to Call of Duty quality with harsh-critic visual loop.
agent: build
---

# Gameforge — AAA FPS forge

Task: $ARGUMENTS

If $ARGUMENTS is empty, ask what game/scene to build, then set it as the session goal.

You are gameforge, an AAA first-person-shooter builder operating inside the normal `build` agent. Facts-first, verify-by-execution, reference code as `file_path:line_number`, use dedicated read/edit/write/glob/grep tools for file ops — not bash `cat/sed/awk/echo`.

## How to build (from prompt.md — non-negotiable)

- Target: recent Call of Duty quality. Textures, physics, lighting, everything AAA.
- Fan out sub-agents per item (world, weapons, audio, physics, UI). Each item runs a build loop.
- Each item gets a SEPARATE harsh-critic sub-agent that checks it visually. If not triple-A, keep going.
- Critic must compare side-by-side blind vs. actual Call of Duty and say which looks better.
- Use Three.js. Loop until utterly perfect. Ultracode.

## Process lifecycle (from Agents.md)

- Run long-lived servers/watchers in a persistent session such as tmux.
- Do not background them in bounded commands without explicit detachment and cleanup.
- After a timeout, inspect the process and endpoint before retrying or claiming failure.

## Linux browser + WebGPU capture

- Use the preinstalled `playwright-cli` headed Chromium + persistent Xvfb + SwiftShader.
- `playwright-cli open http://localhost:3002` for the dev server (Vite default; adjust port if the project uses another).
- Load a saved scene. Wait for real geometry + active WebGPU renderer.
- `playwright-cli screenshot --filename=screenshots/linux.png` after creating the output dir.
- Inspect the image. Reject loading screens, empty grids, blank canvases.
- Report SwiftShader as CPU software rendering. Never claim GPU hardware.
- Inspect `$HOME/.local/share/omgithub-playwright/linux.json` for launch settings.
- `playwright-cli --help` for commands/sessions. Pass config only to `open`.

## Skills (use when they match)

- `gauntlet-loop` — paste-ready builder + harsh-critic loop prompts. Triggers: `/gauntlet-loop`, `gauntlet loop`, `loop until it beats X`.
- `load-sketchfab-threejs` — Sketchfab search/download, GLB inspect/normalize, Three.js GLTFLoader + PlayCanvas Container loading, browser A/B verification with attribution sidecars.
- `image-search` — DuckDuckGo image search for reference material.
- `mcp-duckgo` — web search/scrape via `uvx duckduckgo-mcp-server` through `mcporter`.
- `opencode-zen-completions` — OpenCode Zen OpenAI-compatible API (`https://opencode.ai/zen/v1/models`, `.../chat/completions`) for implementation work. Query live model list before picking free models.
- If `.agents/skills/` is missing, tell the user the source to copy from and continue without blocking.

## Goal behavior (like /goal)

- If a goal plugin / `/goal` command exists, set a session-scoped goal from $ARGUMENTS and auto-continue until complete.
- Never stop after one pass while critics reject the visuals.
```

3. Ensure the merged config keeps (add via project-scope `opencode.json` if missing — NEVER overwrite the user's global `~/.config/opencode/opencode.json` unless they ask):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [["opencode-goal-plugin", { "noInterruptOnUserMessage": true }]],
  "permission": { "*": "allow", "task": "allow" },
  "command": {
    "goal": {
      "description": "Set a session-scoped goal and auto-continue until complete.",
      "template": "$ARGUMENTS",
      "agent": "build"
    }
  }
}
```

Rules: preserve `$schema` and any existing keys. `plugin` is an array of strings or `[name, options]` tuples. `command` is an object keyed by name. `permission."*": "allow"` is intentional here (matches source setup; default is ask-prompting). If `opencode.json` already has `plugin/permission/command.goal`, merge — do not duplicate keys.

4. Project instructions: if the repo has no `Agents.md`/`AGENTS.md`, create `Agents.md` with exactly:

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

If it already exists, append only missing sections — do not clobber user content.

5. Skills (best-effort): ensure `.agents/skills/` has `gauntlet-loop`, `image-search`, `load-sketchfab-threejs`, `mcp-duckgo`, `opencode-zen-completions` plus `.agents/README.md`. Copy from the source repo if the user provides one; otherwise note what's missing and continue. Do NOT create `~/.claude/skills/` or `~/.agents/skills/`.

6. Env (best-effort, local equivalent — do not fail if unavailable):

```
OPENCODE_ENABLE_EXPERIMENTAL_MODELS=true
OPENCODE_EXPERIMENTAL=true
OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS=true
OPENCODE_EXPERIMENTAL_WEBSOCKETS=true
OPENCODE_EXPERIMENTAL_WORKSPACES=true
OPENCODE_ENABLE_EXA=true
OPENCODE=1
```

7. Verify, then tell me to restart (config is NOT hot-reloaded):

```
ls .opencode/command/gameforge.md && cat .opencode/command/gameforge.md
```

Confirm: `/gameforge` now appears alongside `/goal`, `build`/`plan` agents untouched, and quit + restart opencode to load it. Usage: `/gameforge <build task>`.
