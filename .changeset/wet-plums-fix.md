---
"@littlebranches/giselle-mui": patch
---

Add Changesets-based release automation: `.changeset/config.json`, a `changeset`/`release` npm script pair, and a `.github/workflows/release.yml` that opens/maintains a "Version Packages" pull request per Changesets' standard flow and publishes to the public npm registry once that PR merges.
