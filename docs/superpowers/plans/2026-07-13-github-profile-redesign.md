# GitHub Profile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, galaxy-themed GitHub profile for a backend-leaning Full-Stack .NET Developer and a reliable light/dark contribution-snake workflow.

**Architecture:** The profile is a single GitHub-rendered `README.md` backed by one repository-owned hero image, a small number of external badge/stat services, and static project summaries. A scheduled GitHub Actions workflow independently generates two theme-aware SVG snake animations and publishes only those artifacts to the orphan `output` branch.

**Tech Stack:** GitHub Flavored Markdown, supported inline HTML, PNG, Shields.io, Skill Icons, GitHub Readme Stats, GitHub Actions, Platane/snk v3, peaceiris/actions-gh-pages v4.

## Global Constraints

- Position the owner consistently as a backend-leaning **Full-Stack .NET Developer** with 3.5+ years of verified experience.
- Name React, TypeScript, Tailwind CSS, and ASP.NET Core in the first screen and the primary stack.
- Use concise, professional English for international recruiters and engineering teams.
- Do not include “Top 15%,” coding hours, fixed activity totals, or any other unsupported ranking or metric.
- Do not add unconfirmed core frameworks such as Next.js, Redux, or Node.js.
- Use only the verified contact URLs and `minhtienp328@gmail.com`.
- Keep the README useful if a third-party stats endpoint or the snake image is temporarily unavailable.
- Generate only SVG snake assets; do not add a GIF.
- Publish generated snake files only to the orphan `output` branch; never force-push `main` or `master`.
- Use the `imagegen` skill for the bitmap hero asset and inspect the result before committing it.

## File Structure

- Create `assets/github-profile-banner.png`: text-free, wide galaxy hero artwork owned by the repository.
- Modify `README.md`: complete public profile content and all external/local asset references.
- Modify `.github/workflows/main.yml`: scheduled and manual light/dark snake generation.
- Preserve `docs/superpowers/specs/2026-07-13-github-profile-redesign-design.md` as the approved design record.

---

### Task 1: Create the Galaxy Hero Asset

**Files:**
- Create: `assets/github-profile-banner.png`

**Interfaces:**
- Consumes: the approved dark navy, electric-blue, cyan, violet, and restrained green visual direction.
- Produces: a text-free PNG at `assets/github-profile-banner.png` that `README.md` embeds at full width.

- [ ] **Step 1: Generate the banner with the imagegen skill**

Use the image generation tool with this exact direction:

```text
Create one ultra-wide 3.33:1 cinematic banner for a professional full-stack software developer's GitHub profile. Deep navy-black outer-space environment, luminous blue spiral galaxy on the right, subtle cyan nebula and tiny stars across the background, a distant developer silhouette standing on a minimal geometric platform near the lower-right, elegant electric-blue and restrained violet highlights, tiny emerald accents, premium high-end technology aesthetic, strong depth, crisp detail, calm and professional, ample dark negative space through the left and center so GitHub headings remain visually readable below the image. No words, no letters, no numbers, no logos, no badges, no UI cards, no watermark, no border. Output at least 1600 x 480 pixels as a PNG.
```

Save the returned image as `assets/github-profile-banner.png` without recompressing it into JPEG.

- [ ] **Step 2: Inspect the full-resolution image**

Open `assets/github-profile-banner.png` with the image viewer at original detail.

Expected:

- No visible text, pseudo-text, watermark, logo, badge, or UI.
- Dark negative space remains on the left and center.
- The galaxy is concentrated on the right and does not look like a stock wallpaper.
- The image is sharp, professional, and readable when scaled to a GitHub README width.

- [ ] **Step 3: Verify the file properties**

Run:

```powershell
$python = 'C:/Users/minht/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$code = 'from PIL import Image; import sys; im=Image.open(sys.argv[1]); assert im.format==chr(80)+chr(78)+chr(71); assert im.width>=1600 and im.height>=480; assert 3.0 <= im.width/im.height <= 3.6; print(im.format, im.size)'
& $python -c $code 'assets/github-profile-banner.png'
```

Expected: output starts with `PNG`, reports at least `(1600, 480)`, and exits 0.

- [ ] **Step 4: Commit the hero asset**

```powershell
git add -- assets/github-profile-banner.png
git commit -m "feat: add galaxy profile banner"
```

Expected: one commit containing only the new banner.

---

### Task 2: Replace the Profile README

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: `assets/github-profile-banner.png` from Task 1 and the verified profile/CV facts in the approved spec.
- Produces: the complete GitHub profile page and raw URLs for the snake files produced by Task 3.

- [ ] **Step 1: Run content assertions against the old README**

Run:

```powershell
$content = Get-Content -Raw README.md
$required = @('Full-Stack .NET Developer', 'TypeScript', 'Tailwind CSS', 'AI-Assisted Development', 'github-contribution-grid-snake-dark.svg')
$missing = $required | Where-Object { -not $content.Contains($_) }
if (-not $missing) { throw 'Expected the old README to miss the redesigned content.' }
$missing
```

Expected: the command prints the missing redesigned content, proving the old README does not satisfy the spec.

- [ ] **Step 2: Replace README.md with the approved content**

Replace the entire file with:

```markdown
<div align="center">
  <img src="./assets/github-profile-banner.png" alt="Blue galaxy above a futuristic developer landscape" width="100%" />
</div>

<h1 align="center">Hi 👋, I'm Phan Minh Tien (Hubert)</h1>
<h3 align="center">Full-Stack .NET Developer</h3>

<p align="center">
  Building scalable applications with <strong>ASP.NET Core</strong>, <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Da%20Nang-Vietnam-0A66C2?style=flat-square&logo=googlemaps&logoColor=white" alt="Da Nang, Vietnam" />
  <img src="https://img.shields.io/badge/Experience-3.5%2B%20years-238636?style=flat-square" alt="3.5+ years of experience" />
  <a href="https://phan-tien234.vercel.app"><img src="https://img.shields.io/badge/Portfolio-Visit-7C3AED?style=flat-square&logo=vercel&logoColor=white" alt="Portfolio" /></a>
  <img src="https://komarev.com/ghpvc/?username=PhanTien234&label=Profile%20views&color=0e75b6&style=flat-square" alt="PhanTien234 profile views" />
</p>

## About Me

- I build scalable full-stack and enterprise applications with a strong .NET backend foundation.
- I focus on Clean Architecture, SOLID, secure API design, performance, and maintainable code.
- I work comfortably with reporting, batch processing, database-heavy workflows, and third-party integrations.
- I use AI-assisted engineering for analysis, implementation, debugging, review, refactoring, test scenarios, and documentation - with every output manually validated.

## Tech Stack

### Frontend

<p>
  <img src="https://skillicons.dev/icons?i=react,ts,js,tailwind,html,css,bootstrap" alt="React, TypeScript, JavaScript, Tailwind CSS, HTML, CSS, and Bootstrap" />
</p>

### Backend

<p>
  <img src="https://skillicons.dev/icons?i=cs,dotnet" alt="C sharp and dotnet" />
  <img src="https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="ASP.NET Core" />
  <img src="https://img.shields.io/badge/REST%20APIs-0D1117?style=for-the-badge&logo=swagger&logoColor=85EA2D" alt="REST APIs" />
</p>

### Data, Delivery & Tools

<p>
  <img src="https://skillicons.dev/icons?i=mongodb,mysql,docker,git,githubactions,postman" alt="MongoDB, MySQL, Docker, Git, GitHub Actions, and Postman" />
  <img src="https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server" />
  <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white" alt="Oracle" />
</p>

### Engineering Practices

`Clean Architecture` · `SOLID` · `Unit of Work` · `Clean Code` · `Structured Exception Handling` · `xUnit` · `NUnit`

<details>
  <summary><strong>Additional professional experience</strong></summary>
  <br />

  - **Frontend:** AngularJS, jQuery, AJAX, Kendo UI
  - **Reporting:** ActiveReports, Excel Creator, Spread for ASP.NET
  - **Platforms & integrations:** SharePoint, OneDrive, Salesforce Pub/Sub API, Web Services
  - **Team workflow:** Jira, Backlog, SSMS, Agile delivery, mentoring, and code review
</details>

## AI-Assisted Development

<p>
  <img src="https://img.shields.io/badge/Claude%20Code-D97757?style=flat-square&logo=anthropic&logoColor=white" alt="Claude Code" />
  <img src="https://img.shields.io/badge/Codex-412991?style=flat-square&logo=openai&logoColor=white" alt="Codex" />
  <img src="https://img.shields.io/badge/Cursor-111827?style=flat-square&logo=cursor&logoColor=white" alt="Cursor" />
  <img src="https://img.shields.io/badge/GitHub%20Copilot-000000?style=flat-square&logo=githubcopilot&logoColor=white" alt="GitHub Copilot" />
  <img src="https://img.shields.io/badge/Antigravity-4285F4?style=flat-square&logo=google&logoColor=white" alt="Antigravity" />
</p>

I integrate AI assistants into real engineering workflows: legacy-code analysis, dependency tracing, requirement summarization, implementation, refactoring, review checklists, test-scenario design, and technical documentation.

## Featured Projects

| Project | Project |
| --- | --- |
| [**FinalProjectShopFruit**](https://github.com/PhanTien234/FinalProjectShopFruit)<br />Full-stack fruit shop built with .NET 5 and ReactJS.<br />`.NET` `ReactJS` | [**BookStore.WebAPI_with_MongoDB**](https://github.com/PhanTien234/BookStore.WebAPI_with_MongoDB)<br />Bookstore Web API backed by MongoDB.<br />`C#` `Web API` `MongoDB` |
| [**FPTLearningSystem**](https://github.com/PhanTien234/FPTLearningSystem)<br />C# application exploring learning-system workflows.<br />`C#` `ASP.NET` | [**FPT_BOOKSTORE-ASP.NET-CORE_MVC**](https://github.com/PhanTien234/FPT_BOOKSTORE-ASP.NET-CORE_MVC)<br />Team-built bookstore application using ASP.NET Core MVC.<br />`C#` `ASP.NET Core MVC` |

## GitHub Activity

<p align="center">
  <img width="49%" src="https://github-readme-stats.vercel.app/api?username=PhanTien234&show_icons=true&include_all_commits=true&hide_border=true&bg_color=0D1117&title_color=58A6FF&icon_color=39D353&text_color=C9D1D9" alt="PhanTien234 GitHub statistics" />
  <img width="49%" src="https://github-readme-stats.vercel.app/api/top-langs?username=PhanTien234&layout=compact&langs_count=8&hide_border=true&bg_color=0D1117&title_color=58A6FF&text_color=C9D1D9" alt="PhanTien234 most used languages" />
</p>

## Contribution Snake

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake.svg" />
    <img alt="Animated snake moving through PhanTien234's GitHub contribution graph" src="https://raw.githubusercontent.com/PhanTien234/PhanTien234/output/github-contribution-grid-snake.svg" />
  </picture>
</div>

## Connect with Me

<p align="center">
  <a href="https://github.com/PhanTien234"><img src="https://img.shields.io/badge/GitHub-PhanTien234-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
  <a href="https://www.linkedin.com/in/minhti%E1%BA%BFn-phan-8ab992272/"><img src="https://img.shields.io/badge/LinkedIn-Phan%20Minh%20Tien-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:minhtienp328@gmail.com"><img src="https://img.shields.io/badge/Email-minhtienp328%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  <a href="https://www.facebook.com/profile.php?id=100033065775051"><img src="https://img.shields.io/badge/Facebook-Connect-0866FF?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" /></a>
</p>

<p align="center">
  <em>Code is not just written - it is engineered with purpose.</em>
</p>
```

- [ ] **Step 3: Run README content assertions**

Run:

```powershell
$content = Get-Content -Raw README.md
$required = @(
  './assets/github-profile-banner.png',
  'Full-Stack .NET Developer',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'ASP.NET Core',
  'AI-Assisted Development',
  'Claude Code',
  'Codex',
  'Cursor',
  'Antigravity',
  'github-contribution-grid-snake-dark.svg'
)
$forbidden = @('Top 15%', '2+ years', 'gmail.comr', 'linkedin.com/in/https://', 'TODO', 'TBD')
$missing = $required | Where-Object { -not $content.Contains($_) }
$present = $forbidden | Where-Object { $content.Contains($_) }
if ($missing) { throw "Missing required content: $($missing -join ', ')" }
if ($present) { throw "Found forbidden content: $($present -join ', ')" }
'README content assertions passed.'
```

Expected: `README content assertions passed.`

- [ ] **Step 4: Commit the README redesign**

```powershell
git add -- README.md
git commit -m "feat: redesign GitHub profile README"
```

Expected: one commit containing only `README.md`.

---

### Task 3: Modernize the Contribution Snake Workflow

**Files:**
- Modify: `.github/workflows/main.yml`

**Interfaces:**
- Consumes: the GitHub repository owner and the automatically provided `GITHUB_TOKEN`.
- Produces: `github-contribution-grid-snake.svg` and `github-contribution-grid-snake-dark.svg` on the orphan `output` branch for the README `<picture>` element.

- [ ] **Step 1: Run workflow assertions against the legacy workflow**

Run:

```powershell
$workflow = Get-Content -Raw '.github/workflows/main.yml'
$required = @('Platane/snk/svg-only@v3', 'peaceiris/actions-gh-pages@v4', 'contents: write', 'force_orphan: true')
$missing = $required | Where-Object { -not $workflow.Contains($_) }
if (-not $missing) { throw 'Expected the legacy workflow to fail modern workflow assertions.' }
$missing
```

Expected: the command lists all or part of the required modern workflow tokens.

- [ ] **Step 2: Replace the workflow with the minimal v3 implementation**

Replace the entire file with:

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
      - name: Generate light and dark contribution snakes
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg?color_snake=#58a6ff&color_dots=#161b22,#0e4429,#006d32,#26a641,#39d353
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark&color_snake=#a78bfa

      - name: Publish snake assets to output branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: output
          publish_dir: ./dist
          force_orphan: true
```

- [ ] **Step 3: Run semantic and YAML checks**

Run:

```powershell
$workflow = Get-Content -Raw '.github/workflows/main.yml'
$required = @(
  'Platane/snk/svg-only@v3',
  'peaceiris/actions-gh-pages@v4',
  'github_user_name: ${{ github.repository_owner }}',
  'contents: write',
  'publish_branch: output',
  'publish_dir: ./dist',
  'force_orphan: true'
)
$forbidden = @('actions/checkout@v2', 'Platane/snk@master', 'ad-m/github-push-action', 'branch: master', 'gif_out_path')
$missing = $required | Where-Object { -not $workflow.Contains($_) }
$present = $forbidden | Where-Object { $workflow.Contains($_) }
if ($missing) { throw "Missing workflow content: $($missing -join ', ')" }
if ($present) { throw "Found legacy workflow content: $($present -join ', ')" }
npx --yes yaml-lint@1.7.0 '.github/workflows/main.yml'
```

Expected: semantic assertions do not throw, YAML lint exits 0, and no legacy action is reported.

- [ ] **Step 4: Commit the workflow**

```powershell
git add -- .github/workflows/main.yml
git commit -m "ci: modernize contribution snake workflow"
```

Expected: one commit containing only the workflow.

---

### Task 4: Verify the Complete Profile

**Files:**
- Verify: `README.md`
- Verify: `assets/github-profile-banner.png`
- Verify: `.github/workflows/main.yml`
- Temporary, do not commit: `readme-preview.html`

**Interfaces:**
- Consumes: all deliverables from Tasks 1-3.
- Produces: a clean, validated working tree ready for user review and eventual push.

- [ ] **Step 1: Run repository-level checks**

Run:

```powershell
git diff --check HEAD~3..HEAD
git status --short
$tracked = git diff-tree --no-commit-id --name-only -r HEAD~3..HEAD
$expected = @('.github/workflows/main.yml', 'README.md', 'assets/github-profile-banner.png')
$unexpected = $tracked | Where-Object { $_ -notin $expected }
if ($unexpected) { throw "Unexpected implementation files: $($unexpected -join ', ')" }
```

Expected: `git diff --check` prints nothing, `git status --short` prints nothing, and the scope assertion does not throw.

- [ ] **Step 2: Verify the local asset and required links**

Run:

```powershell
$python = 'C:/Users/minht/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
$code = 'from PIL import Image; import sys; im=Image.open(sys.argv[1]); assert im.format==chr(80)+chr(78)+chr(71); assert im.width>=1600 and im.height>=480; print(im.format, im.size)'
& $python -c $code 'assets/github-profile-banner.png'

$urls = @(
  'https://github.com/PhanTien234',
  'https://github.com/PhanTien234/FinalProjectShopFruit',
  'https://github.com/PhanTien234/BookStore.WebAPI_with_MongoDB',
  'https://github.com/PhanTien234/FPTLearningSystem',
  'https://github.com/PhanTien234/FPT_BOOKSTORE-ASP.NET-CORE_MVC',
  'https://skillicons.dev',
  'https://img.shields.io',
  'https://github-readme-stats.vercel.app'
)
foreach ($url in $urls) {
  $status = curl.exe -L -s -o NUL -w '%{http_code}' $url
  if ([int]$status -ge 400 -or [int]$status -eq 0) { throw "$url returned HTTP $status" }
  "$status $url"
}
```

Expected: PNG verification exits 0 and each checked host/repository returns an HTTP status below 400. LinkedIn and Facebook are intentionally excluded from automated HTTP checks because they commonly block scripted requests; their exact validated URLs remain covered by README content assertions.

- [ ] **Step 3: Render and inspect a local Markdown preview**

Run:

```powershell
npx --yes marked@15.0.12 -i README.md -o readme-preview.html
$python = 'C:/Users/minht/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
& $python -m http.server 4173
```

Open `http://127.0.0.1:4173/readme-preview.html` with the in-app browser and inspect at a desktop width and a narrow mobile width.

Expected:

- Banner spans the content width without cropping important artwork.
- Headline and supporting copy are clear before the first scroll.
- Badge/icon rows wrap without horizontal overflow.
- Project table remains readable.
- Stats cards align on desktop and degrade without hiding surrounding content.
- The snake area has useful alt text before the first workflow deployment.
- No malformed HTML or visibly duplicated URL appears.

Stop the local server, then run:

```powershell
Remove-Item -LiteralPath '.\readme-preview.html'
git status --short
```

Expected: the temporary preview is removed and the working tree is clean.

- [ ] **Step 4: Record the remote-only verification step**

After the commits are pushed by an explicitly authorized action:

1. Open the repository's **Actions** tab.
2. Select **Generate Snake**.
3. Run `workflow_dispatch` once.
4. Confirm the run succeeds in under five minutes.
5. Confirm the `output` branch contains both SVG files.
6. Confirm the public profile selects light/dark snake assets with the viewer's theme.

Do not claim the snake is live before these remote checks pass.
