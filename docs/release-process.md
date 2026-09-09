# Release process (Changesets → npm)

> _Set up: Sep 2026_

`@littlebranches/giselle-mui` is versioned and published with [Changesets](https://github.com/changesets/changesets),
using its standard "Version Packages" release-PR flow. Every merged change that should ship in a
release carries its own changeset file describing the bump and the changelog entry.

---

## How the pipeline works

```
Developer opens a PR that changes published behavior
        │
        ▼
`npx changeset add` — writes a markdown file under .changeset/
describing the bump type (patch/minor/major) and changelog text
        │
        ▼
PR is reviewed and merged into main
        │
        ▼
release.yml triggers (push to main)
        │
        ├─ pending changesets exist?
        │     yes → open/update a "Version Packages" PR
        │           (bumps package.json, rolls up changelogs,
        │            deletes the consumed changeset files)
        │
        └─ "Version Packages" PR is reviewed and merged into main
                  │
                  ▼
          release.yml triggers again (push to main)
          no pending changesets remain → runs `npm run release`
          (`changeset publish`) → npm publish + git tag push
                  ✅ New version is live on the public npm registry
```

One GitHub Actions workflow file drives this: `.github/workflows/release.yml`, using
[`changesets/action`](https://github.com/changesets/action). It runs the quality gate first —
a broken build never gets versioned or published.

---

## Adding a changeset

Any PR that changes published behavior should include a changeset:

```bash
npx changeset add
```

Answer the prompts (bump type, changelog summary). This writes a file to `.changeset/`; commit
it alongside the code change.

---

## Required GitHub repository secret

| Secret      | Purpose                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `NPM_TOKEN` | npm automation/publish token with publish rights on the `@littlebranches` org, used by `npm publish` in `release.yml` |

**Gap as of this writing:** `gh secret list` against this repo shows only `VERCEL_TOKEN`,
`VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` — **no `NPM_TOKEN` secret exists yet.** The release
workflow will open "Version Packages" PRs correctly, but the publish step will fail
authentication until a repo (or org) admin creates this token and adds it under
**Settings → Secrets and variables → Actions**.

To create one:

1. Log in to npmjs.com as a maintainer of the `@littlebranches` org.
2. Create a new **Automation** token (Account → Access Tokens → Generate New Token →
   Automation — automation tokens work with 2FA-enabled accounts and bypass the OTP prompt
   `npm publish` would otherwise need in CI).
3. Add it as the `NPM_TOKEN` secret on `LittleBranches/giselle-mui`.

---

## Verifying a release ran

After the "Version Packages" PR is merged:

1. Go to **github.com/LittleBranches/giselle-mui → Actions** and look for the **Release**
   workflow run triggered by that merge.
2. Confirm the publish step succeeded and a new git tag was pushed.
3. Confirm installability from the public registry:
   ```bash
   npm view @littlebranches/giselle-mui versions
   npm install @littlebranches/giselle-mui@latest
   ```

---

## See also

- [`.changeset/config.json`](../.changeset/config.json) — Changesets configuration (public access, GitHub changelog)
- [`.github/workflows/release.yml`](../.github/workflows/release.yml) — the release workflow file
- [`storybook-deploy.md`](./storybook-deploy.md) — the analogous Vercel deploy pipeline, for comparison
