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
