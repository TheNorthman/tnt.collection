## Plan: Migrate Repository to src/dist/docs Build Structure

TL;DR - Convert existing monolithic userscript repo into structure described in TNT - Refactor plan.md, using a simple Node build script and gradual migration. Keep current script working during transition.

Steps
1. Audit and define source boundaries (existing files, metadata, style). *Done* by exploration.
2. Create directory structure in root:
   - src/
    - 'core.js' (main logic)
    - 'styles.js' (CSS or style-related code)
    - optionally other modules as needed (e.g. utils, ui), as long as it don't interfere with the development flow. Confusing Copilit/AI tools with too many files is a concern.
   - dist/ (Main output target for userscript)
   - docs/ (GitHub Pages target)
   - optionally .github/workflows/ (Still considering if this is necessary or adds too much complexity at this stage)
3. Add metadata template file `src/metadata.template.js` (mirrors current // ==UserScript== header from `tnt.collection.user.js`).
4. Add a minimal `package.json` with scripts: build, clean, test (manual), etc.
5. Implement `build.js`:
   - read `src/metadata.template.js`, optionally update version from package.json/arg
   - concatenate code from `src/` into final output string
   - write artifact into dist/tnt-collection.user.js
   - copy to docs/tnt-collection.user.js for GitHub Pages host path
   - optional: generate a source map or simple version stamping log
6. Migrate existing userscript code in a gradual stepwise fashion:
   - Start with existing `tnt.collection.user.js` as canonical source
   - create `src/core.js` (entry point) and move functional blocks one by one from old file, if obeying the principle of point 2.
   - create `src/styles.js` for CSS or style-related code
   - keep `tnt.collection.user.js` unchanged initially, to maintain existing functionality. Add build instructions which generate dist; run tests manually.
7. Create a tiny `README` update or dev-guide with commands: `npm install`, `npm run build`, `npm run dev` etc.
8. Add a lightweight checklist if desired.
9. Ronny: We will wait with this until we are done with getting the structure in order and working!
   Add optional GitHub Actions workflow `.github/workflows/release.yml` near final stage to automate:
   - on push/main
   - run `npm ci` / `npm run build`
   - commit dist/docs artifact if changed
   - tag release (optional)
10. Verification and rollback plan:
   - test script in userscript manager using `dist/tnt-collection.user.js` served locally or via file:// with proxy if necessary
   - verify metadata block remains, updateURL still functional
   - check `npm run build` from clean repository reproduces dist file and compare with baseline

Relevant files
- `tnt.collection.user.js` - source of current script logic and metadata.
- `dev/tnt.collection.core.user.js` / `dev/tnt.collection.styles.user.js` - reference code to integrate or preserve.
- `dist/tnt.collection.user.js` - generated target; keep in git and sync.
- `TNT - Refactor plan.md` - requirements doc to align with.
- new `src/metadata.template.js` - build input.
- new `build.js` - core generation script.
- new `package.json` - scripts and dependency points.
- new `docs/tnt.collection.user.js` - GitHub Pages target.

Verification
1. Clone repo clean, run `npm install` and `npm run build`.
2. Inspect `dist/tnt.collection.user.js` and `docs/tnt.collection.user.js` for correct metadata and script logic.
3. Run `npm run build` again and ensure output is deterministic (or at least contains same functional code).
4. Install generated script in a userscript manager and confirm behavior matches existing script.
5. (Optional) add a small automated test in `dev/examples` (HTML page that loads dist script and asserts expected global names/values) to detect regressions.

Decisions
- build tool: simple Node custom script (selected by user).
- migration path: gradual, existing script remains operational while moving code.

Further Considerations
1. Clarify whether `dist/tnt-collection.user.js` should be committed immediately or only from release pipeline.
2. Decide where to store versions (metadata template + package.json) and how to keep in sync; likely single source in package.json and numbered by script.
3. Determine if `src/` will export modules and use ES modules (optionally build with bundler later) or use IIFE for compatibility.
