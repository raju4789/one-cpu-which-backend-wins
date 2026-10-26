// OpenTelemetry, loaded only when OTEL_ENABLED=true (see main.ts).
// Configuration follows the standard OTEL_* environment variables, for example:
//   OTEL_SERVICE_NAME=one-cpu-node
//   OTEL_EXPORTER_OTLP_ENDPOINT=http://host.lima.internal:4318
//   OTEL_TRACES_EXPORTER=console      (print spans instead of sending them)
import { register } from "node:module";

// ESM modules can only be instrumented through a loader hook registered
// before they are imported. main.ts imports the app after this file runs.
register("@opentelemetry/instrumentation/hook.mjs", import.meta.url);

const { NodeSDK } = await import("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = await import("@opentelemetry/auto-instrumentations-node");
const { PrismaInstrumentation } = await import("@prisma/instrumentation");

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME ?? "one-cpu-node",
  instrumentations: [
    getNodeAutoInstrumentations({
      // Noise for this API: file system, DNS and raw TCP spans.
      "@opentelemetry/instrumentation-fs": { enabled: false },
      "@opentelemetry/instrumentation-dns": { enabled: false },
      "@opentelemetry/instrumentation-net": { enabled: false },
    }),
    new PrismaInstrumentation(),
  ],
});
sdk.start();

process.on("SIGTERM", () => void sdk.shutdown());
