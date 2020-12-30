import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"

Sentry.init({
  dsn: "https://6c18334f69674200af1fb47936b2a906@o491172.ingest.sentry.io/5556275",
  project: "PoLZy",
  release: "0.1",
  environment: "development",
  /*
  autoSessionTracking: true,
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  */
})