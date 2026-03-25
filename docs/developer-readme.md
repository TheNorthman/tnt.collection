# TNT Collection Developer Notes

This document contains developer-centric details and version references. For end users, see `readme.md`.

## Project structure
- `dev/tnt.collection.core.user.js` - core runtime module
- `dev/tnt.collection.dev.user.js` - development build + debug features
- `dev/tnt.collection.styles.user.js` - styling / UI CSS

## Versioning
- Production: `tnt.collection.user.js` (what users install) - v1.5.24
- Core: `dev/tnt.collection.core.user.js` - v2.1.4
- Dev: `dev/tnt.collection.dev.user.js` - v1.0.3

## Tips
- Keep major feature logic in `src/` modules and build output in `dev/`.
- After game UI updates, re-test selectors and storage behavior.
- Release pipeline: update `CHANGELOG.md` + bump in `package.json` + tag.
