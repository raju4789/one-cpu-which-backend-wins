// Smoke test for the harness: 10 VUs for 30 seconds, every endpoint once per loop.
// Run with bin/smoke. Not the benchmark script.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const userId = String(1 + Math.floor(Math.random() * 50000));
  const json = { "Content-Type": "application/json", "X-User-Id": userId };

  const feed = http.get(`${BASE}/feed`, { tags: { name: "GET /feed" } });
  check(feed, {
    "feed 200": (r) => r.status === 200,
    "feed has 20 posts": (r) => r.status === 200 && r.json("posts").length === 20,
  });

  const posts = feed.status === 200 ? feed.json("posts") : [];
  if (posts.length > 0) {
    const id = posts[Math.floor(Math.random() * posts.length)].id;
    const like = http.post(`${BASE}/posts/${id}/like`, null, {
      headers: { "X-User-Id": userId },
      tags: { name: "POST /posts/:id/like" },
    });
    check(like, { "like 204": (r) => r.status === 204 });
  }

  const created = http.post(`${BASE}/posts`, JSON.stringify({ body: "smoke test post" }), {
    headers: json,
    tags: { name: "POST /posts" },
  });
  check(created, { "post 201": (r) => r.status === 201 });

  sleep(1);
}
