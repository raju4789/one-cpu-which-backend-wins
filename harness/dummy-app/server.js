// Dummy app for validating the harness only. Not a stack, never benchmarked.
// Speaks the contract's endpoints from memory (no database), so Nginx,
// caching, monitoring and k6 can be proven end to end before any real stack exists.
const http = require("node:http");

const port = Number(process.env.PORT || 8080);
const posts = [];
let nextId = 1;

function addPost(userId, body) {
  const post = {
    id: nextId++,
    body,
    like_count: 0,
    created_at: new Date().toISOString(),
    author: { id: userId, username: `user_${userId}`, display_name: `User ${userId}` },
  };
  posts.unshift(post);
  if (posts.length > 1000) posts.pop();
  return post;
}

for (let i = 1; i <= 20; i++) addPost(i, `Seed post ${i}`);

function send(res, status, payload) {
  const body = payload === undefined ? "" : JSON.stringify(payload);
  res.writeHead(status, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); } catch { resolve(null); }
    });
  });
}

http
  .createServer(async (req, res) => {
    const userId = Number(req.headers["x-user-id"]);
    const like = req.url.match(/^\/posts\/(\d+)\/like$/);

    if (req.method === "GET" && req.url === "/health") return send(res, 200, { status: "ok" });
    if (req.method === "GET" && req.url === "/feed") return send(res, 200, { posts: posts.slice(0, 20) });

    if (req.method === "POST" && req.url === "/posts") {
      const input = await readJson(req);
      if (!userId || !input || typeof input.body !== "string" || input.body.length < 1 || input.body.length > 280) {
        return send(res, 400, { error: "invalid input" });
      }
      return send(res, 201, addPost(userId, input.body));
    }

    if (req.method === "POST" && like) {
      if (!userId) return send(res, 400, { error: "missing X-User-Id" });
      const post = posts.find((p) => p.id === Number(like[1]));
      if (!post) return send(res, 404, { error: "post not found" });
      post.like_count++;
      return send(res, 204);
    }

    send(res, 404, { error: "not found" });
  })
  .listen(port, () => console.log(`dummy app on ${port}`));
