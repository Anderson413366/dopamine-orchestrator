import { access, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "assets/styles.css",
  "assets/app.js",
  ".env.example",
  "README.md",
  "vercel.json",
  "docs/deployment.md",
  "docs/backend-readiness.md",
  "docs/environment-variables.md",
  "docs/production-checklist.md",
  "docs/production-readiness-report.md",
  "SECURITY.md",
  "package-lock.json",
  "scripts/build-static.mjs",
];

const forbiddenPatterns = [
  {
    label: "Tailwind CDN script",
    pattern: /cdn\.tailwindcss\.com/i,
  },
  {
    label: "inline script block",
    pattern: /<script(?![^>]+src=)[^>]*>/i,
  },
  {
    label: "inline style block",
    pattern: /<style[\s>]/i,
  },
  {
    label: "document.write",
    pattern: /document\.write/i,
  },
  {
    label: "eval",
    pattern: /\beval\s*\(/i,
  },
  {
    label: "Function constructor",
    pattern: /new\s+Function\s*\(/i,
  },
  {
    label: "private key placeholder in public source",
    pattern: /(SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|STRIPE_SECRET_KEY|OPENAI_API_KEY)\s*=/i,
    exclude: [".env.example", "docs/environment-variables.md", "docs/backend-readiness.md"],
  },
];

function fail(message) {
  console.error(`Validation failed: ${message}`);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  try {
    await access(join(root, file));
  } catch {
    fail(`missing required file: ${file}`);
  }
}

const html = await readFile(join(root, "index.html"), "utf8");
const css = await readFile(join(root, "assets/styles.css"), "utf8");
const js = await readFile(join(root, "assets/app.js"), "utf8");
const filesToScan = {
  "index.html": html,
  "assets/styles.css": css,
  "assets/app.js": js,
  ".env.example": await readFile(join(root, ".env.example"), "utf8"),
  "docs/environment-variables.md": await readFile(
    join(root, "docs/environment-variables.md"),
    "utf8",
  ),
  "docs/backend-readiness.md": await readFile(join(root, "docs/backend-readiness.md"), "utf8"),
};
const vercelConfig = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));

if (!html.includes('href="/assets/styles.css"')) {
  fail("index.html does not reference /assets/styles.css");
}

if (!html.includes('src="/assets/app.js" defer')) {
  fail("index.html does not reference deferred /assets/app.js");
}

if (!html.includes('aria-live="polite"')) {
  fail("status log must keep an aria-live region");
}

if (!css.includes("@media (prefers-reduced-motion: reduce)")) {
  fail("reduced motion media query is missing");
}

if (!js.includes("textContent")) {
  fail("app.js should use textContent for text updates");
}

const configuredHeaders = vercelConfig.headers?.flatMap((entry) => entry.headers || []) || [];
const configuredHeaderNames = new Set(configuredHeaders.map((header) => header.key));
for (const header of [
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
]) {
  if (!configuredHeaderNames.has(header)) {
    fail(`vercel.json is missing ${header}`);
  }
}

const csp = configuredHeaders.find((header) => header.key === "Content-Security-Policy")?.value || "";
if (csp.includes("'unsafe-inline'") || csp.includes("'unsafe-eval'")) {
  fail("CSP must not include unsafe-inline or unsafe-eval");
}

if (vercelConfig.framework !== null) {
  fail("vercel.json should set framework to null for this static app");
}

if (vercelConfig.buildCommand !== "npm run build") {
  fail("vercel.json should use npm run build");
}

if (vercelConfig.outputDirectory !== "dist") {
  fail("vercel.json should deploy only the dist output directory");
}

for (const [file, contents] of Object.entries(filesToScan)) {
  for (const rule of forbiddenPatterns) {
    if (rule.exclude?.includes(file)) {
      continue;
    }

    if (rule.pattern.test(contents)) {
      fail(`${rule.label} found in ${file}`);
    }
  }
}

const oldFile = join(root, "The Dopamine Orchestrator.html");
try {
  await stat(oldFile);
  fail("legacy HTML filename still exists");
} catch {
  // Expected.
}

if (process.exitCode) {
  process.exit();
}

console.log("Static validation passed.");
