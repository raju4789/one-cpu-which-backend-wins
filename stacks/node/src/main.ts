// Entry point. Tracing is opt-in: with OTEL_ENABLED=true, OpenTelemetry is
// set up before the app loads, so it can instrument http, pg and Prisma.
// It stays off in benchmark runs: tracing every request costs CPU, and on
// one core that would change the result.
if (process.env.OTEL_ENABLED === "true") {
  await import("./tracing.js");
}
await import("./server.js");
