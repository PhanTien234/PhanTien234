import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
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

test("README versions every snake asset to invalidate stale caches", async () => {
  const readme = await readFile(
    new URL("../README.md", import.meta.url),
    "utf8",
  );

  assert.equal(
    (readme.match(/\?v=neon-galaxy-1/g) ?? []).length,
    3,
  );
});
