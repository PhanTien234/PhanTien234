# Neon Galaxy Contribution Snake Design

## Context

The current GitHub profile uses `Platane/snk/svg-only@v3` to generate light and dark animated contribution snakes. The generated snake is a four-segment, single-color SVG. The requested enhancement is a rainbow neon snake with a visible head, glowing eyes, and a smiling mouth while preserving the contribution-eating animation and the six-hour update schedule.

## Goals

- Preserve the existing `Platane/snk` route and contribution-eating behavior.
- Display a seven-color rainbow across the four generated snake segments.
- Give the leading segment a Neon Galaxy head with two eyes and a smiling mouth.
- Keep the face synchronized with the generated `s0` head animation.
- Render correctly in GitHub light and dark themes.
- Fail the workflow clearly if a future generator release changes the SVG structure that the decorator relies on.

## Non-goals

- Forking or rewriting `Platane/snk`.
- Changing contribution data, route generation, animation duration, or schedule.
- Expanding the snake beyond the generator's four native segments.
- Redesigning any other profile section.

## Selected Approach

Add a small dependency-free Node.js post-processor after the existing SVG generation step. It will decorate both generated SVG files before `peaceiris/actions-gh-pages` publishes them.

This approach keeps the upstream generator responsible for contribution data and movement. The local script is responsible only for presentation, which is smaller and easier to verify than maintaining a fork.

## Visual Design

The seven-color spectrum is red, orange, yellow, green, cyan, blue, and violet:

- `s0` head: cyan-to-violet galaxy gradient with a neon glow.
- `s1`: red-to-orange gradient.
- `s2`: yellow-to-green gradient.
- `s3`: cyan-to-blue-to-violet gradient.

The head remains aligned to the 16-pixel contribution grid but is made slightly rounder and visually dominant. A face group is drawn above the head with:

- two white glowing eyes;
- dark pupils for contrast;
- a small white curved smile;
- a restrained cyan/violet glow suitable for the profile's galaxy theme.

The light SVG uses a darker facial outline and reduced glow spread. The dark SVG uses a brighter glow. The geometry and animation stay identical in both variants.

## Components and Data Flow

1. `Platane/snk/svg-only@v3` generates the existing light and dark SVG files.
2. `scripts/decorate-snake.mjs` reads both files and validates the expected `<style>`, `s0` through `s3` segment classes, and closing `</svg>` marker.
3. The decorator injects:
   - SVG gradient and glow definitions;
   - class-specific rainbow fills;
   - a face group that reuses the generated `s0` keyframe animation;
   - a marker used to prevent duplicate decoration.
4. The script writes the decorated SVGs back to `dist/`.
5. The existing publish action sends the files to the orphan `output` branch.
6. The README continues to select the correct asset with its existing `<picture>` element.

## Failure Handling

- Missing input files cause a non-zero exit.
- Missing `s0` through `s3`, `<style>`, or `</svg>` markers cause a non-zero exit with the affected filename.
- Already-decorated input is rejected to avoid duplicated definitions or faces.
- Publishing does not run if decoration fails.

This intentionally fails loudly instead of silently publishing an undecorated or malformed snake after an upstream format change.

## Testing

Use Node's built-in test runner with no package installation:

- Start with a failing test that describes the required decoration.
- Verify all seven colors, glow definition, eyes, pupils, smile, and synchronized `s0` animation are present.
- Verify the original contribution keyframes and all four snake segments remain present.
- Verify malformed and already-decorated SVGs are rejected.
- Lint the workflow YAML and assert that decoration runs between generation and publishing.
- Generate local light and dark fixtures and render them in a browser for visual inspection.
- After push, dispatch `Generate Snake`, verify the run succeeds, confirm both output URLs return HTTP 200, and inspect the live GitHub profile.

## Files in Scope

- `.github/workflows/main.yml`
- `README.md` for the snake's accessible alt text only
- `scripts/decorate-snake.mjs`
- `scripts/decorate-snake.test.mjs`

No unrelated files or profile sections will be changed.

## Success Criteria

- The live snake retains the existing contribution-eating motion.
- The body visibly spans all seven rainbow colors.
- The head has two eyes and a recognizable smile at GitHub profile scale.
- The Neon Galaxy glow is visible without obscuring contribution cells.
- Both light and dark assets load without broken images or horizontal overflow.
- The scheduled and manual workflows remain operational.
