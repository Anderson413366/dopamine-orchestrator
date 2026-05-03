import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.env.STATIC_ROOT || process.cwd());
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function resolveRequestPath(url) {
  const requestPath = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const cleanPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const candidate = resolve(join(root, cleanPath));

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    return null;
  }

  return candidate;
}

async function sendFile(res, filePath) {
  const fileStat = await stat(filePath);
  if (fileStat.isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  await access(filePath);
  res.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const candidate = resolveRequestPath(req.url || "/");
    if (!candidate) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    await sendFile(res, req.url === "/" ? join(root, "index.html") : candidate);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Dopamine Orchestrator is running at http://localhost:${port}`);
  console.log(`Serving static root: ${root}`);
});
