# TNT Collection Userscript

## Distribution & Update Strategy

GreasyFork (Stable) + GitHub (Source/Dev) + GitHub Pages (Hosted Script)

🎯 **Overview**

This document defines the complete workflow for developing, publishing, and updating the TNT Collection Ikariam userscript using a hybrid distribution model:

- GitHub → Source code, development, version control
- GitHub Pages → Hosting the actual `.user.js` file
- GreasyFork → Stable public distribution with auto-updates

The goal is to make updates mechanical, low friction, and audit-friendly, while giving users the easiest possible installation and update experience.

---

## 1. Repository structure

```text
tnt-collection/
│
├── src/───────────
│  ├── core/────────
│  ├── ui/───────
│  ├── utils/──────
│  ├── metadata.template.js # Metadata block template
│
├── dist/
│  └── tnt.user.js          # Built production userscript (auto-generated)
│
├── docs/                    # GitHub Pages site
│  └── index.html           # Landing page with install button
│
├── .github/
│  └── workflows/
│      └── release.yml      # Automated build + deploy pipeline
│
├── CHANGELOG.md
│└── README.md
│└── package.json             # Optional (for build tooling)
```

## 2. GitHub Pages hosting

GitHub Pages will host the final built script at:

`https://<username>.github.io/tnt-collection/tnt.user.js`

### Why GitHub Pages?

- Stable URL: Clean, predictable, and under your control
- Auto-update friendly: Works with `@updateURL` and `@downloadURL`
- No extra infra: No separate hosting needed
- Good caching behavior: Reliable for userscript managers

## 3. Userscript metadata block

The metadata block in `dist/tnt.user.js` should include:

```js
// ==UserScript==
// @name         TNT Collection
// @namespace    https://github.com/<username>/tnt-collection
// @version      1.0.0
// @description  Ikariam TNT Collection Tools
// @author       Ronny
// @match        *://*.ikariam.gameforge.com/*
// @updateURL    https://<username>.github.io/tnt-collection/tnt.user.js
// @downloadURL  https://<username>.github.io/tnt-collection/tnt.user.js
// @homepageURL  https://github.com/<username>/tnt-collection
// @supportURL   https://github.com/<username>/tnt-collection/issues
// @grant        none
// ==/UserScript==
```

Key points:

- GreasyFork will host the project page, not the script file.
- Userscript managers (Tampermonkey, Violentmonkey, etc.) will auto-update from GitHub Pages.
- You maintain full control over the hosted file and release timing.

## 4. Development workflow

### Step 1 — Develop in `src/`

All development happens in `src/`:

- Core logic in `src/core/`
- UI components in `src/ui/`
- Shared helpers in `src/utils/`
- Metadata template in `src/metadata.template.js`

This keeps production output (`dist/`) clean and generated.

### Step 2 — Build the production script

A build step (can be a simple Node script or minimal bundler) generates:

- `dist/tnt.user.js`

The build should:

- Inject the metadata block (from `metadata.template.js`)
- Bundle/minify if desired (optional)
- Ensure deterministic output for easy diffing and auditing

Example build command (conceptual):

```bash
node build.js
# or
npm run build
```

### Step 3 — Commit and push

You commit:

- Changes in `src/`
- The generated `dist/tnt.user.js`
- Any updated docs or changelog entries

Then push to GitHub:

```bash
git commit -am "Describe change here"
git push
```

### Step 4 — GitHub Actions publishes the update

A GitHub Actions workflow (`.github/workflows/release.yml`) will:

- Run the build step
- Copy `dist/tnt.user.js` into `docs/tnt.user.js` (for GitHub Pages)
- Optionally bump the version (if not already done)
- Commit the updated `docs/tnt.user.js` to the `gh-pages` or `main` branch (depending on Pages setup)
- Optionally create a Git tag and GitHub Release

This makes the update process mechanical and repeatable.

## 5. GreasyFork integration

GreasyFork is used as the stable distribution hub and discovery platform.

### Initial setup on GreasyFork

- Create a new script on GreasyFork.
- Use a minimal script that matches your metadata but points to your hosted file, or directly paste the full script initially.

Ensure the metadata block includes:

- `@updateURL` → GitHub Pages URL
- `@downloadURL` → GitHub Pages URL
- `@homepageURL` → GitHub repo
- `@supportURL` → GitHub issues

Once set, GreasyFork will:

- Provide an Install button
- Handle auto-updates via your `@updateURL`
- Serve as a trusted entry point for users

## 6. Release workflow (automated)

### Trigger on:

- Push to `main`
- Or creation of a Git tag

### Steps:

- Checkout repository
- Install dependencies (if any)
- Run build → generate `dist/tnt.user.js`
- Copy `dist/tnt.user.js` → `docs/tnt.user.js`
- Commit updated `docs/tnt.user.js` (if changed)
- Tag version (optional if not already tagged)
- Create GitHub Release (optional)

This turns your release flow into:

- Edit code → Commit → Push → (CI runs) → Users get update

## 7. Versioning strategy

Use semantic versioning:

- MAJOR → Breaking changes
- MINOR → New features, backward compatible
- PATCH → Bug fixes, small tweaks

Examples:

- `1.0.0` → initial stable
- `1.1.0` → new feature added
- `1.1.1` → bug fix
- `2.0.0` → breaking change

Version should be kept in sync in:

- `src/metadata.template.js`
- `dist/tnt.user.js` (generated)
- Git tags (e.g., `v1.1.0`)
- Optionally `package.json` if using Node tooling

## 8. User experience

From the user’s perspective:

1. They go to GreasyFork and search for “TNT Collection” or follow your link.
2. They click Install.
3. Their userscript manager installs the script from your GitHub Pages URL.
4. Whenever you push a new version and CI updates `tnt.user.js` on GitHub Pages, their manager auto-updates it.

They get:

- One-click install
- Automatic updates
- Trusted platform (GreasyFork)
- No need to understand GitHub or your internal workflow

## 9. Developer experience

For you, the workflow is:

- Work in `src/` with clean, modular code.
- Run a build step to generate `dist/tnt.user.js`.
- Commit and push.
- Let GitHub Actions handle:
  - Copying to `docs/`
  - Keeping GitHub Pages in sync
  - Tagging and releases (if configured)

You get:

- Audit-friendly diffs (dist is deterministic)
- Single source of truth (GitHub)
- Mechanical, repeatable process
- No manual upload to GreasyFork after initial setup (updates flow via `@updateURL`)

## 10. Future enhancements

Potential future improvements:

- Beta channel: use a separate branch or separate script on GreasyFork for beta users.
- Host `tnt-beta.user.js` alongside stable.
- OpenUserJS mirror.
