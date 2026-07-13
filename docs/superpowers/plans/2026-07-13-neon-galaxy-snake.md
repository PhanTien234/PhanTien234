# Neon Galaxy Contribution Snake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decorate both generated contribution-snake SVGs with a seven-color Neon Galaxy treatment, a glowing head, two eyes, and a synchronized smiling mouth.

**Architecture:** Keep `Platane/snk/svg-only@v3` responsible for contribution data and movement. Add a dependency-free Node.js transformer that validates and decorates each generated SVG before the existing publish step; use Node's built-in test runner to protect the SVG contract and workflow ordering.

**Tech Stack:** GitHub Actions YAML, Node.js ES modules, `node:test`, SVG/CSS animation, `Platane/snk/svg-only@v3`, `peaceiris/actions-gh-pages@v4`.

## Global Constraints

- Preserve the existing contribution route, animation duration, six-hour schedule, and light/dark `<picture>` behavior.
- Keep the generator's four native snake segments; distribute red, orange, yellow, green, cyan, blue, and violet across those segments.
- Do not fork or rewrite `Platane/snk`.
- Add no runtime or development dependencies.
- Fail before publishing when the generated SVG no longer contains the expected style block, `s0` through `s3` segments, or `s0` keyframes.
- Touch only the workflow, the snake alt text, the decorator, and its tests.

## File Structure

- Create `scripts/decorate-snake.mjs`: validate and decorate generated SVG strings; provide the workflow CLI.
- Create `scripts/decorate-snake.test.mjs`: test rainbow/face decoration, theme variants, validation, workflow ordering, and README alt text.
- Modify `.github/workflows/main.yml`: check out the repository and run the decorator between generation and publishing.
- Modify `README.md`: update only the snake image's accessible alt text.

---

### Task 1: Build the tested SVG decorator

**Files:**
- Create: `scripts/decorate-snake.test.mjs`
- Create: `scripts/decorate-snake.mjs`

**Interfaces:**
- Consumes: a generated `Platane/snk` SVG string containing `<style>`, `@keyframes s0`, and `class="s s0"` through `class="s s3"`.
- Produces: `decorateSnakeSvg(svg: string, options?: { theme?: "light" | "dark" }): string`.
- CLI: `node scripts/decorate-snake.mjs <svg-path> [<svg-path>...]` decorates each file in place and infers dark mode from `-dark.` in the filename.

- [ ] **Step 1: Write the failing decorator tests**

Create `scripts/decorate-snake.test.mjs`:

```javascript
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

const decoratorUrl = new URL("./decorate-snake.mjs", import.meta.url);

const fixture = `<svg viewBox="-16 -32 880 192" xmlns="http://www.w3.org/2000/svg">
<style>
:root{--cs:#a78bfa}.s{fill:var(--cs);animation:none linear 22500ms infinite}
@keyframes s0{0%{transform:translate(0px,-16px)}100%{transform:translate(64px,0px)}}.s.s0{transform:translate(0px,-16px);animation-name:s0}
@keyframes s1{0%{transform:translate(16px,-16px)}100%{transform:translate(48px,0px)}}.s.s1{transform:translate(16px,-16px);animation-name:s1}
@keyframes s2{0%{transform:translate(32px,-16px)}100%{transform:translate(32px,0px)}}.s.s2{transform:translate(32px,-16px);animation-name:s2}
@keyframes s3{0%{transform:translate(48px,-16px)}100%{transform:translate(16px,0px)}}.s.s3{transform:translate(48px,-16px);animation-name:s3}
</style>
<rect class="s s0" x="0.8" y="0.8" width="14.4" height="14.4" rx="4.5" ry="4.5"/>
<rect class="s s1" x="1.8" y="1.8" width="12.3" height="12.3" rx="4.1" ry="4.1"/>
<rect class="s s2" x="2.6" y="2.6" width="10.8" height="10.8" rx="3.6" ry="3.6"/>
<rect class="s s3" x="3.0" y="3.0" width="9.9" height="9.9" rx="3.3" ry="3.3"/>
</svg>`;

test("adds the seven-color Neon Galaxy face without replacing generated motion", async () => {
  assert.ok(existsSync(decoratorUrl), "decorator module must exist");
  const { decorateSnakeSvg } = await import(decoratorUrl.href);

  const result = decorateSnakeSvg(fixture, { theme: "dark" });

  for (const color of [
    "#ff3b7a",
    "#ff8a00",
    "#ffd60a",
    "#39ff88",
    "#00e5ff",
    "#3b82f6",
    "#8b5cf6",
  ]) {
    assert.ok(result.includes(color), `missing rainbow color ${color}`);
  }

  assert.equal((result.match(/neon-galaxy-snake/g) ?? []).length, 1);
  assert.match(result, /class="s s0 snake-head"/);
  assert.match(result, /<g class="snake-face s s0"/);
  assert.match(result, /<circle class="snake-eye"/);
  assert.match(result, /<circle class="snake-pupil"/);
  assert.match(result, /<path class="snake-smile"/);
  assert.match(result, /@keyframes s0/);
  assert.match(result, /animation-name:s0/);

  for (const segment of ["s0", "s1", "s2", "s3"]) {
    assert.match(result, new RegExp(`class="s ${segment}(?: |")`));
  }
});

test("uses brighter glow and facial contrast in dark mode", async () => {
  assert.ok(existsSync(decoratorUrl), "decorator module must exist");
  const { decorateSnakeSvg } = await import(decoratorUrl.href);

  const light = decorateSnakeSvg(fixture, { theme: "light" });
  const dark = decorateSnakeSvg(fixture, { theme: "dark" });

  assert.match(light, /stdDeviation="1.2"/);
  assert.match(light, /stroke:#312e81/);
  assert.match(dark, /stdDeviation="1.8"/);
  assert.match(dark, /stroke:#67e8f9/);
});

test("rejects unsupported or already-decorated SVG input", async () => {
  assert.ok(existsSync(decoratorUrl), "decorator module must exist");
  const { decorateSnakeSvg } = await import(decoratorUrl.href);

  assert.throws(
    () => decorateSnakeSvg("<svg></svg>"),
    /Missing style block/,
  );

  const decorated = decorateSnakeSvg(fixture);
  assert.throws(
    () => decorateSnakeSvg(decorated),
    /already decorated/,
  );
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```powershell
node --test scripts/decorate-snake.test.mjs
```

Expected: FAIL with `decorator module must exist` because `scripts/decorate-snake.mjs` does not exist.

- [ ] **Step 3: Implement the minimal decorator**

Create `scripts/decorate-snake.mjs`:

```javascript
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const MARKER = "<!-- neon-galaxy-snake -->";

const REQUIRED_TOKENS = [
  ["<svg", "opening SVG element"],
  ["<style>", "style block"],
  ["</style>", "closing style block"],
  ["@keyframes s0", "s0 head keyframes"],
  ['class="s s0"', "snake segment s0"],
  ['class="s s1"', "snake segment s1"],
  ['class="s s2"', "snake segment s2"],
  ['class="s s3"', "snake segment s3"],
  ["</svg>", "closing SVG element"],
];

const assertSupportedSvg = (svg) => {
  if (svg.includes(MARKER)) {
    throw new Error("SVG is already decorated");
  }

  for (const [token, label] of REQUIRED_TOKENS) {
    if (!svg.includes(token)) {
      throw new Error(`Missing ${label}`);
    }
  }
};

const definitionsFor = (theme) => {
  const glowDeviation = theme === "dark" ? "1.8" : "1.2";

  return `<defs>
  <linearGradient id="snake-head-galaxy" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8b5cf6"/>
    <stop offset="0.5" stop-color="#3b82f6"/>
    <stop offset="1" stop-color="#00e5ff"/>
  </linearGradient>
  <linearGradient id="snake-rainbow-warm" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ff3b7a"/>
    <stop offset="0.5" stop-color="#ff8a00"/>
    <stop offset="1" stop-color="#ffd60a"/>
  </linearGradient>
  <linearGradient id="snake-rainbow-green" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffd60a"/>
    <stop offset="0.55" stop-color="#39ff88"/>
    <stop offset="1" stop-color="#00e5ff"/>
  </linearGradient>
  <linearGradient id="snake-rainbow-cool" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#00e5ff"/>
    <stop offset="0.5" stop-color="#3b82f6"/>
    <stop offset="1" stop-color="#8b5cf6"/>
  </linearGradient>
  <filter id="snake-neon-glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="${glowDeviation}" result="glow"/>
    <feMerge>
      <feMergeNode in="glow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>`;
};

const stylesFor = (theme) => {
  const eyeStroke = theme === "dark" ? "#67e8f9" : "#312e81";
  const pupil = theme === "dark" ? "#020617" : "#111827";

  return `
.snake-head{fill:url(#snake-head-galaxy);filter:url(#snake-neon-glow)}
.s.s1{fill:url(#snake-rainbow-warm);filter:url(#snake-neon-glow)}
.s.s2{fill:url(#snake-rainbow-green);filter:url(#snake-neon-glow)}
.s.s3{fill:url(#snake-rainbow-cool);filter:url(#snake-neon-glow)}
.snake-face{filter:url(#snake-neon-glow);pointer-events:none}
.snake-eye{fill:#f8fafc;stroke:${eyeStroke};stroke-width:.55}
.snake-pupil{fill:${pupil}}
.snake-smile{fill:none;stroke:#f8fafc;stroke-width:1.25;stroke-linecap:round}
`;
};

const FACE = `
<g class="snake-face s s0" aria-hidden="true">
  <circle class="snake-eye" cx="5.1" cy="5.6" r="1.75"/>
  <circle class="snake-eye" cx="10.9" cy="5.6" r="1.75"/>
  <circle class="snake-pupil" cx="5.4" cy="5.9" r=".7"/>
  <circle class="snake-pupil" cx="11.2" cy="5.9" r=".7"/>
  <path class="snake-smile" d="M4.6 10 Q8 12.8 11.4 10"/>
</g>
`;

export function decorateSnakeSvg(svg, { theme = "light" } = {}) {
  assertSupportedSvg(svg);
  const normalizedTheme = theme === "dark" ? "dark" : "light";

  let decorated = svg.replace(
    /<rect class="s s0"[^>]*\/>/,
    (head) => head
      .replace('class="s s0"', 'class="s s0 snake-head"')
      .replace(/rx="[^"]+"/, 'rx="7.2"')
      .replace(/ry="[^"]+"/, 'ry="7.2"'),
  );

  if (decorated === svg) {
    throw new Error("Unable to decorate snake head");
  }

  decorated = decorated.replace(
    /<svg\b[^>]*>/,
    (opening) => `${opening}
${MARKER}
${definitionsFor(normalizedTheme)}`,
  );
  decorated = decorated.replace(
    "</style>",
    `${stylesFor(normalizedTheme)}</style>`,
  );
  decorated = decorated.replace("</svg>", `${FACE}</svg>`);

  return decorated;
}

if (
  process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const paths = process.argv.slice(2);
    if (paths.length === 0) {
      throw new Error("Provide at least one SVG path");
    }

    for (const filePath of paths) {
      const theme = filePath.toLowerCase().includes("-dark.")
        ? "dark"
        : "light";
      const source = await readFile(filePath, "utf8");
      const decorated = decorateSnakeSvg(source, { theme });
      await writeFile(filePath, decorated, "utf8");
      console.log(`Decorated ${filePath} (${theme})`);
    }
  } catch (error) {
    console.error(`Neon snake decoration failed: ${error.message}`);
    process.exitCode = 1;
  }
}
```

- [ ] **Step 4: Run the tests and verify GREEN**

Run:

```powershell
node --test scripts/decorate-snake.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 5: Commit the tested decorator**

```powershell
git add scripts/decorate-snake.mjs scripts/decorate-snake.test.mjs
git commit -m "feat: add neon galaxy snake decorator"
```

---

### Task 2: Integrate decoration into Actions and accessible profile copy

**Files:**
- Modify: `scripts/decorate-snake.test.mjs`
- Modify: `.github/workflows/main.yml:16-31`
- Modify: `README.md:95`

**Interfaces:**
- Consumes: `node scripts/decorate-snake.mjs <paths...>` from Task 1.
- Produces: a workflow order of checkout → generation → decoration → publish, plus an accurate snake alt description.

- [ ] **Step 1: Add failing workflow and README tests**

Add this import to `scripts/decorate-snake.test.mjs`:

```javascript
import { readFile } from "node:fs/promises";
```

Append:

```javascript
test("workflow decorates both generated SVGs before publishing", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/main.yml", import.meta.url),
    "utf8",
  );

  const checkoutIndex = workflow.indexOf("uses: actions/checkout@v4");
  const generateIndex = workflow.indexOf("uses: Platane/snk/svg-only@v3");
  const decorateIndex = workflow.indexOf("node scripts/decorate-snake.mjs");
  const publishIndex = workflow.indexOf("uses: peaceiris/actions-gh-pages@v4");

  for (const [name, index] of [
    ["checkout", checkoutIndex],
    ["generate", generateIndex],
    ["decorate", decorateIndex],
    ["publish", publishIndex],
  ]) {
    assert.ok(index >= 0, `missing ${name} workflow step`);
  }

  assert.ok(checkoutIndex < generateIndex);
  assert.ok(generateIndex < decorateIndex);
  assert.ok(decorateIndex < publishIndex);

  const decorationBlock = workflow.slice(decorateIndex, publishIndex);
  assert.ok(decorationBlock.includes("dist/github-contribution-grid-snake.svg"));
  assert.ok(
    decorationBlock.includes(
      "dist/github-contribution-grid-snake-dark.svg",
    ),
  );
});

test("README describes the Neon Galaxy rainbow snake", async () => {
  const readme = await readFile(
    new URL("../README.md", import.meta.url),
    "utf8",
  );

  assert.match(
    readme,
    /alt="Animated Neon Galaxy rainbow snake eating PhanTien234's GitHub contributions"/,
  );
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```powershell
node --test scripts/decorate-snake.test.mjs
```

Expected: the three decorator tests pass; the workflow test fails with `missing checkout workflow step` and the README test fails because the old alt text is still present.

- [ ] **Step 3: Update the workflow**

Replace `.github/workflows/main.yml` with:

```yaml
name: Generate Snake

on:
  schedule:
    - cron: "0 */6 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Generate light and dark contribution snakes
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg?color_snake=#58a6ff&color_dots=#161b22,#0e4429,#006d32,#26a641,#39d353
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark&color_snake=#a78bfa

      - name: Add Neon Galaxy rainbow styling
        run: |
          node scripts/decorate-snake.mjs `\
            dist/github-contribution-grid-snake.svg `\
            dist/github-contribution-grid-snake-dark.svg

      - name: Publish snake assets to output branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: output
          publish_dir: ./dist
          force_orphan: true
```

- [ ] **Step 4: Update only the snake alt text**

In `README.md:95`, replace the `<img>` line with:

```html
    <img alt="Animated Neon Galaxy rainbow snake eating PhanTien234's GitHub contributions" src="https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake.svg" />
```

- [ ] **Step 5: Verify workflow and README GREEN**

Run:

```powershell
node --test scripts/decorate-snake.test.mjs
npx --yes yaml-lint@1.7.0 .github/workflows/main.yml
git diff --check
```

Expected: 5 tests pass, YAML lint reports success, and `git diff --check` emits no errors.

- [ ] **Step 6: Commit workflow integration**

```powershell
git add .github/workflows/main.yml README.md scripts/decorate-snake.test.mjs
git commit -m "ci: publish neon galaxy contribution snake"
```

---

### Task 3: Verify against real generated SVGs and inspect the visuals

**Files:**
- No repository files should change.

**Interfaces:**
- Consumes: the decorator and workflow from Tasks 1-2 plus the current production `Platane/snk` output.
- Produces: fresh automated, structural, and visual evidence that the feature is safe to release.

- [ ] **Step 1: Run the complete local test suite**

```powershell
node --test scripts/decorate-snake.test.mjs
npx --yes yaml-lint@1.7.0 .github/workflows/main.yml
git diff --check
git status --short --branch
```

Expected: 5 tests pass, YAML lint succeeds, no whitespace errors, and the feature branch is clean.

- [ ] **Step 2: Exercise the decorator against current real output**

```powershell
$ErrorActionPreference = "Stop"
$tempRoot = Join-Path $env:TEMP "phan-tien-neon-snake-preview"
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
$light = Join-Path $tempRoot "github-contribution-grid-snake.svg"
$dark = Join-Path $tempRoot "github-contribution-grid-snake-dark.svg"
Invoke-WebRequest "https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake.svg" -OutFile $light
Invoke-WebRequest "https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake-dark.svg" -OutFile $dark
node scripts/decorate-snake.mjs $light $dark
foreach ($path in @($light, $dark)) {
  $svg = Get-Content $path -Raw
  foreach ($token in @(
    "neon-galaxy-snake",
    "snake-head-galaxy",
    "snake-face",
    "snake-eye",
    "snake-pupil",
    "snake-smile",
    "@keyframes s0"
  )) {
    if (-not $svg.Contains($token)) {
      throw "Missing $token in $path"
    }
  }
}
Write-Output $tempRoot
```

Expected: both files report `Decorated ...` and the structural checks complete without an exception.

- [ ] **Step 3: Render both temporary SVGs**

Start a temporary local server for the preview directory:

```powershell
npx --yes http-server "$env:TEMP\phan-tien-neon-snake-preview" -p 4173 -c-1
```

Use the in-app browser to inspect:

- `http://127.0.0.1:4173/github-contribution-grid-snake.svg`
- `http://127.0.0.1:4173/github-contribution-grid-snake-dark.svg`

Verify at profile scale:

- the contribution grid and eating animation remain present;
- the head moves with the original `s0` path;
- two eyes, pupils, and the curved smile stay aligned with the head;
- all seven colors and the glow are visible;
- neither SVG overflows its `880×192` viewport.

Stop the temporary server after inspection.

- [ ] **Step 4: Record final branch evidence**

```powershell
git log --oneline main..HEAD
git diff --stat main...HEAD
git status --short --branch
```

Expected: exactly the decorator and workflow-integration commits are ahead of `main`, the diff is limited to the four in-scope files, and the working tree is clean.

---

### Task 4: Merge, push, generate, and verify production

**Files:**
- No new repository files.

**Interfaces:**
- Consumes: the clean verified feature branch.
- Produces: updated `origin/main`, successful `Generate Snake` output, and a verified live GitHub profile.

- [ ] **Step 1: Finish the implementation branch**

Use `superpowers:finishing-a-development-branch`. The user has already authorized merging locally into `main` and pushing to `origin/main`. Synchronize `main` with `git pull --ff-only origin main`, fast-forward merge the feature branch, and rerun:

```powershell
node --test scripts/decorate-snake.test.mjs
npx --yes yaml-lint@1.7.0 .github/workflows/main.yml
git diff --check
```

Expected: 5 tests pass, YAML lint succeeds, and there are no whitespace errors.

- [ ] **Step 2: Push main and dispatch the workflow**

```powershell
git push origin main
gh workflow run main.yml --repo PhanTien234/PhanTien234 --ref main
```

Expected: `main` pushes successfully and GitHub returns a new workflow run URL.

- [ ] **Step 3: Watch the new run to completion**

```powershell
$runs = gh run list --repo PhanTien234/PhanTien234 --workflow main.yml --limit 1 --json databaseId,status,conclusion,url | ConvertFrom-Json
$run = $runs[0]
gh run watch $run.databaseId --repo PhanTien234/PhanTien234 --exit-status
```

Expected: the `Generate Snake` run completes with `success` and the decoration step appears before publishing.

- [ ] **Step 4: Verify both published assets**

```powershell
$urls = @(
  "https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake.svg",
  "https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake-dark.svg"
)
foreach ($url in $urls) {
  $response = Invoke-WebRequest $url -UseBasicParsing
  if ($response.StatusCode -ne 200) {
    throw "HTTP $($response.StatusCode): $url"
  }
  foreach ($token in @("neon-galaxy-snake", "snake-face", "snake-smile")) {
    if (-not $response.Content.Contains($token)) {
      throw "Published SVG missing $token: $url"
    }
  }
}
```

Expected: both URLs return HTTP 200 and contain the decoration marker, face, and smile.

- [ ] **Step 5: Inspect the live profile and clean up**

Use the in-app browser to open `https://github.com/PhanTien234#contribution-snake`. Confirm the rainbow, Neon Galaxy glow, eyes, pupils, smile, movement, and absence of broken images at the actual GitHub rendering width.

After successful verification, remove the clean merged worktree and delete the merged local feature branch. Confirm:

```powershell
git status --short --branch
git worktree list
```

Expected: `main` matches `origin/main` and only the primary worktree remains.
