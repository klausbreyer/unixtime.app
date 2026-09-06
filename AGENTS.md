# unixtime.app

unixtime.app converts Unix timestamps inside text, API responses and lists.
It runs in the browser with plain JavaScript, HTML and SCSS. Parcel builds the
static site. A service worker supports offline use and updates installed apps.
There is no application server, database or account system.

## What matters

- Keep conversion local. Do not send pasted text or API responses to a server.
- Keep the app small. Weigh every dependency and every kilobyte you add.
  Do not add a framework or backend without a concrete need.
- Preserve the input text. Conversion and highlighting belong in the output.
- Keep seconds, milliseconds and the minimum year explicit. Date formatting
  currently uses the browser's local timezone and the `en` locale.
  Do not change these semantics as a side effect of another change.
- Keep the browser app and installed app consistent. Check offline behavior
  and updates when a change affects assets or the service worker.
- Support phone and desktop screens. Avoid continuously repainting animations.

## A note from Klaus

I like ambitious ideas, simple systems, and software that feels obvious. Do not
keep complexity because it is already there. Do not add machinery because it
looks architecturally impressive. Understand the real constraint, then fight for
the smallest model that makes the correct behavior unsurprising.

Channel both "measure twice, cut once" and YAGNI. Fight scope creep. Propose a
bold idea when it truly helps, and say so plainly instead of building it behind
my back.

A question is read-only. If I ask how hard something is, why something happens,
or whether something should be done, answer it and offer the change. Do not
start editing.

Match the ceremony to the task. One agent in one pass beats a panel for
ordinary work. Use delegation for breadth or adversarial review. Assign file
ownership before agents work in parallel.

Treat this file as good defaults. My preferences in the moment take precedence.
If a rule conflicts with the task, explain the conflict before you make an exception.

## Protect the working environment

- Never deploy or touch production unless explicitly instructed. A push to
  `main` triggers the Cloudflare Pages deployment for `unixtime-app`.
  State exactly what you will touch before work near production or daily-driver channels.
- Do not take over an existing development server or its port. Start your own
  server on an unused port. Stop only a PID you captured when you started it.
  Never use `pkill -f`, `pgrep | kill`, or a name or worktree match to kill processes.
- Preserve existing changes, local configuration and browser data. Clear only
  the test state your run created. Check cleanup targets before each run.
- Use an installed CLI first. Ask before installing a CLI or using a browser,
  including browser automation. Never use the 1Password CLI unless Klaus asks.
- Do not deploy, publish, commit or push just to verify a local change.

## Hit every surface

Before you call a change done, check the relevant paths and report which applied.

- **Conversion.** Check seconds and milliseconds, the minimum year, repeated
  timestamps, plain text and JSON. Include input without timestamps and values
  outside the supported date range when relevant.
- **Input and output.** Preserve the source text and its formatting. Treat
  pasted content as untrusted text. Do not turn it into executable HTML.
  Check conversion and syntax highlighting together.
- **Settings.** Check fresh storage, saved preferences and changes after typing.
  The welcome example must follow settings without replacing user input.
- **Dates.** Check threshold boundaries and local timezone behavior when date
  logic changes. Make timezone assumptions explicit in tests.
- **Reverse states.** Check switching a setting back, clearing input and returning
  from offline use. A new action needs a way back where applicable.
- **Browser and installed app.** For PWA changes, check first installation,
  existing installations, updates, cached assets and offline navigation.
- **Phone and desktop.** Judge both layouts together, phone first.
- **Docs.** Update `readme.md` in the same pull request when setup, behavior,
  configuration, build commands or deployment changes. This file holds the
  permanent rules and the project map.

## Development

- Use npm. `package-lock.json` is tracked, and CI uses `npm ci`.
  The README still shows Yarn commands. The package scripts and CI define the
  current build workflow.
- `npm ci` installs the locked dependencies.
- `npm start -- --port <unused-port>` starts your own Parcel development server.
- `npm run build` creates `dist/` and copies the images, favicon and service worker.
- CI uses Node.js 20. Check `.github/workflows/pages-deployment.yml` before
  changing runtime or build assumptions.
- There is no database, test account or production snapshot to prepare.
- Stop the server you started, using the PID you tracked.

## Verifying

- Write the failing test first for a bug fix or a change to testable behavior.
- Write focused tests that protect real behavior. Do not add a test framework
  for a documentation change or tests that only repeat the implementation.
- The repository currently has no test script or test suite. Use a small,
  appropriate test setup when behavior needs automated coverage.
- Test conversion logic independently where practical. Use UI checks for
  behavior that depends on DOM events, highlighting, storage or service workers.
  Ask before using a browser, as required above.
- Wait for the page and the relevant state before browser interactions.
- A test that changes storage, caches, service workers or other shared state
  must clean up its own state. Use an isolated browser profile for PWA tests.
- Run `npm run build` before a pull request that changes code, assets or build
  configuration. Run the focused tests relevant to the change.
- Investigate CI-only failures for timing, ordering and environment differences.
  A successful rerun does not explain the failure.
- For UI changes, inspect phone and desktop screenshots after browser approval.
  Report any checks you could not complete.

## Visual changes

- Before a non-trivial UI, layout or copy change, create several distinct static
  mocks. Save them as local HTML files in a temporary folder.
- Report their paths and wait for a selection before editing production components.
  Do not publish mocks or documents as hosted artifacts.
- Default to a true black (`#000`) background, white primary text, dense layouts
  and minimal copy. Avoid decorative cards, pills and subtitle lines above sections.
- Avoid pulse, shimmer, blur and spinner animations that continuously repaint.

## Pull requests

- Never work on `main`. Create branches from `main` in sibling worktrees named
  `../worktrees/<repo-folder-name>-<slug>`.
- Use EnterWorktree or an equivalent session mechanism when available. Otherwise,
  set the worktree as the working directory for every command. Verify new pane directories.
- Keep at most ten registered worktrees. Never force removal or remove a dirty
  or unintegrated worktree. Ask what to remove if cleanup is not safe.
- Use `feature/<slug>` for a user-facing capability, changes across several
  modules, or work that needs more than two commits. Use a short name for smaller changes.
- Write branch names, commits and pull request text in English. Add no agent
  co-author or generation trailer to commits.
- Follow the repository's title conventions. Current commit subjects use plain language.
- For a release, update the version in `package.json` and its lockfile entry
  together. Base it on the latest `main`. Use patch for repairs, minor for new
  capabilities and major for breaking changes. Never lower or skip a version.
- Before opening a pull request, pull the latest `main` and rebase the branch onto it.
- Open a normal pull request, never a draft. Start with the problem, then explain
  the solution and relevant verification. End with the model and harness used.
- Keep the conversation's requirements in one pull request. Avoid unrelated changes.
- Include before and after images for UI changes when browser use is approved.
- Review the diff before opening the pull request. Verify findings against the
  source. Turn real findings into fixes and focused tests. Do not commit temporary probes.
- When monitoring a pull request, poll checks and comments newer than the last
  push. Fix valid findings and dismiss false positives with a written reason.
  Distinguish code failures from infrastructure failures. Stay quiet when nothing changes.
- Stop when the review bots are green on the latest commit. Merge only with
  explicit authorization. If no disposition was given, report and ask.

## Where code lives

- `src/app.js` handles input, timestamp detection, formatting, settings and the welcome example.
- `src/index.html` holds the main layout and settings controls.
- `src/index.scss` holds the styles.
- `src/head.html` and `src/header.html` are shared HTML includes.
  `.posthtmlrc` configures their build processing.
- `src/pwa.js` registers the service worker and reloads existing clients after updates.
- `src/pwabuilder-sw.js` handles installation, cache cleanup and network-first requests
  with a cache fallback. The build copies it to the site root.
- `src/manifest.json` defines installed-app metadata.
- `src/lib/highlight.js-11.5.1/` holds the bundled highlighter and its theme.
  Do not hand-edit minified vendor code.
- `src/images/` and the favicon files hold static assets. `src/docs/` holds example input.
- `package.json` defines dependencies, the version and build commands.
- `.github/workflows/pages-deployment.yml` builds and deploys the static site to Cloudflare Pages.

## Taste

- Keep it simple. Channel YAGNI unless told otherwise.
- Type safety where it earns its place, not everywhere.
- Comments explain how a thing is used and what is not obvious, not every line.
  A comment moves when its code moves.
- Keep parsing and formatting plain. Keep DOM, storage and service-worker concerns
  at the edges when separating them helps. Do not add layers without a need.
- Write focused tests that protect real behavior. No endless smoke tests, and no
  regression test for a feature that is gone.
- Be careful with anything destructive that Klaus did not ask for.

## Prose

- Apply `ste-writing` to English pull request text, documentation, error messages
  and UI copy when available. Use strict mode for procedures and errors, flavored mode elsewhere.
- Never use an em dash. Use a comma, a colon, parentheses or two sentences.
- Use consistent names: input, output, timestamp, seconds, milliseconds and minimum year.
- Keep it short. Rewrite any sentence a reader has to read twice.
