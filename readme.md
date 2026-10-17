# unixtime.app - Bulk Timestamp Conversion for API Developers

Welcome to `unixtime.app`, a dedicated tool designed to streamline the timestamp conversion process for API developers. This application is an ideal solution for converting and highlighting unix epoch timestamps within full texts, complete API responses, and lists containing timestamps.

## Key Features

- **Bulk Conversion**: Effortlessly convert entire texts, API responses, and lists with timestamps.
- **Automatic Detection**: The app identifies and converts anything that resembles a unix timestamp since a specific year.
- **JSON Highlighting**: Output colors keys, strings, numbers and literals. Converted timestamps stand out in white. Input text and spacing stay unchanged.
- **Simple Replacement**: Timestamps are replaced directly in the text, offering a seamless conversion experience.

## Configuration Options

- **Epoch Format**: Choose between milliseconds and seconds for timestamp representation.
- **Year Threshold**: Specify the starting year for recognizing timestamps.

## Use Cases

- **API Response Handling**: Perfect for developers working with APIs that return timestamps.
- **Timestamp Lists**: Convert lists of timestamps with ease.
- **Text Processing**: Useful for processing any text that includes unix timestamps.

## Getting Started

To contribute to the development of `unixtime.app`, follow these steps:

```bash
npm ci
npm start -- --port 1234
```

Your contributions and feedback are highly appreciated as we continually strive to improve this tool.

Run `npm test` for the conversion, highlighting and analytics tests. Run `npm run build` to build the static site in `dist/`.

## Hosting and deployment

bunny.net hosts the static site in Edge Storage and serves it through Bunny CDN.
The site name is `unixtime-app`. The CDN hostname is `sites-unixtime-app-0gn7zw.b-cdn.net`.

GitHub Actions runs tests and builds pull requests. Pushes to `main` also deploy to bunny.net.
Use the **Build and deploy** workflow on `main` for a manual deployment.
The workflow reads the `BUNNYNET_API_KEY` repository secret. Deployments run one at a time without cancellation.
After each successful production deployment, the workflow keeps the three newest deployments and deletes older ones.
Bunny always protects the current and previous deployments, even if they fall outside the newest three.

For a local production deployment, authenticate the Bunny CLI and run:

```bash
npm ci
npm test
bunny sites deploy --build
```

Every deployment publishes immediately. To restore the previous deployment, run:

```bash
bunny sites deployments publish --previous --force
```

Cloudflare remains the DNS and email-routing provider. Both `@` and `www` point to the Bunny CDN hostname with proxying disabled.
Cloudflare flattens the root CNAME. Bunny manages HTTPS certificates and redirects the root domain to `https://www.unixtime.app`.
The redirect preserves the path and query string. A Bunny edge rule requires browser revalidation of `/pwabuilder-sw.js`.
The existing Cloudflare Pages site remains available for rollback. The workflow no longer deploys to it.

## Analytics

PostHog runs only on `unixtime.app` and `www.unixtime.app`. Local and preview hosts do not send analytics events.
The public project key and EU ingestion host are set in `src/analytics.mjs`.
The key is a public browser project key. The project uses PostHog Cloud EU.

The app records pageviews, page exits, and these usage events:

| Event | Properties | Trigger |
| --- | --- | --- |
| `input_started` | None | First input edit, then first edit after clearing |
| `input_cleared` | None | Input becomes empty |
| `input_pasted` | None | Paste into input |
| `input_copied` | None | Copy from input |
| `output_copied` | None | Copy from output |
| `setting_changed` | `setting`, `value` | Unit or minimum year changes |
| `header_link_clicked` | `link` | Home, about, GitHub, or author link click |
| `app_installed` | None | Browser reports an app installation |

The welcome example does not trigger input events. Input events record usage, not successful conversions or timestamp counts.
PostHog also adds standard page, browser, device, and session properties. It stores its anonymous identifier in local storage.
Input text, output text, clipboard contents, and timestamp values are never event properties.
Autocapture, session replay, error capture, heatmaps, surveys, and remote configuration are disabled.
The build bundles the slim SDK. It does not load extra PostHog scripts.

Conversion remains local and does not wait for analytics requests. The service worker does not cache cross-origin analytics requests.
Browser checks must use an isolated profile. Do not send test events to the production project.

---

We hope `unixtime.app` enhances your development workflow and makes handling unix timestamps a breeze!
