import { createFileRoute } from "@tanstack/react-router";

const UPSTREAM =
  import.meta.env.VITE_API_UPSTREAM ?? "https://nupun-health-backend.onrender.com/api/v1";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  "Access-Control-Max-Age": "86400",
};

async function proxy(request: Request, splat: string) {
  const inUrl = new URL(request.url);
  const upstream = new URL(`${UPSTREAM}/${splat}`);
  inUrl.searchParams.forEach((v, k) => upstream.searchParams.set(k, v));

  const headers = new Headers();
  const ct = request.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const auth = request.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  headers.set("accept", "application/json");

  const init: RequestInit = { method: request.method, headers };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  const res = await fetch(upstream.toString(), init);
  const outHeaders = new Headers();
  const outCt = res.headers.get("content-type");
  if (outCt) outHeaders.set("content-type", outCt);
  for (const [k, v] of Object.entries(CORS)) outHeaders.set(k, v);

  return new Response(res.body, { status: res.status, headers: outHeaders });
}

export const Route = createFileRoute("/api/public/proxy/$")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),
      GET: ({ request, params }) => proxy(request, params._splat ?? ""),
      POST: ({ request, params }) => proxy(request, params._splat ?? ""),
      PUT: ({ request, params }) => proxy(request, params._splat ?? ""),
      PATCH: ({ request, params }) => proxy(request, params._splat ?? ""),
      DELETE: ({ request, params }) => proxy(request, params._splat ?? ""),
    },
  },
});
