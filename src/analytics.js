import posthog from "posthog-js/dist/module.slim.no-external.js";
import { initAnalytics } from "./analytics.mjs";

initAnalytics({ client: posthog });
