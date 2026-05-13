# PR Review Workflow

> Last updated: 14 May 2026
> Session trigger: `review pr <N>` — type this in any new Copilot chat session to execute the full workflow for PR number `<N>`.

This document defines the end-to-end pull request workflow used across all repos in this
workspace (`giselle-mui`, `alexrebula`, `first-branch`, `giselle-sections-sdk`, `giselle-ui`).
It governs how Copilot prepares PRs, responds to Copilot reviewer threads, fixes valid issues,
and hands control back to the branch owner.

**Branch owner** = the human developer who guides Copilot (Alex). Copilot is never the
branch owner. Copilot does not merge, close, or resolve threads without explicit instruction.

---

## Phase 0 — Branch hygiene (before anything else)

### 0.1 — Every commit must belong to its branch category

Branch naming encodes the type of work:

| Prefix | Category |
| --------- | ------------------------------------------- |
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `chore/` | Tooling, config, dependencies, docs |
| `data/` | Data-only changes (`tasks.json`) |
| `refactor/` | Code restructure with no behaviour change |

**Rule:** every commit on a branch must be related to the branch's stated purpose. Commit
type (the conventional-commits prefix) does not need to match the branch prefix exactly —
a `feature/` branch will often legitimately carry `chore:` commits (barrel export updates,
tsup config changes, dependency additions required by the feature). What matters is whether
the commit is **related to the work the branch describes**.

A commit does not belong on a branch when it is **unrelated** to that branch's purpose:

- A `chore: bump eslint version` on a `feature/add-metric-card` branch — unrelated, move it.
- A `fix: correct aria-label on button` on a `chore/update-deps` branch — unrelated, move it.
- A `chore: add barrel export for MetricCard` on a `feature/add-metric-card` branch — related, keep it.

### 0.2 — Moving unrelated commits

If a commit does not belong on its current branch:

1. Identify the correct branch category for the commit.
2. Check whether a branch for that category already exists. If yes, cherry-pick onto it.
   If no, create a new branch from `main` and cherry-pick.
3. Drop the commit from the original branch via interactive rebase (`git rebase -i`).
4. Force-push the original branch (`git push --force-with-lease origin <branch>`) after rebase.
5. Push the new branch (`git push origin <new-branch>`).
6. **Never force-push a branch that already has an open PR** without first confirming with the
   branch owner — force-push rewrites history and invalidates outstanding review threads.

### 0.3 — Quality gate before PR

Run the full quality gate on the branch before asking for the green light:

```sh
npm run check:verify
```

All checks must be green: Prettier → ESLint → `tsc --noEmit` → Vitest → tsup build →
Storybook build (where applicable). A red quality gate is a blocker — do not request PR
creation and do not request a Copilot review.

---

## Phase 1 — PR creation

### 1.1 — Wait for the green light

**Do not create a PR until the branch owner explicitly approves it in the current session.**
"Green light" means a clear instruction such as: "create the PR", "open it", "go ahead".
A general instruction to finish a task does not constitute a green light for PR creation.

### 1.2 — PR description conventions

Follow the template in `.github/pull_request_template.md` (present in all repos). Every PR must include:

- **What does this PR do?** — one paragraph, concrete deliverable
- **Why** — the reason the change is needed (links to roadmap entry, issue, or conversation context)
- **Type of change** — the matching checkbox from the template
- **Checklist** — all items ticked or explicitly marked N/A with a reason
- **Notes for reviewer** — anything non-obvious the reviewer should look at first

PR title format: `<type>(<scope>): <short description>` — mirrors the commit convention.

### 1.3 — Trigger a Copilot review

After the PR is created, trigger a Copilot code review immediately. If the repository is
configured to do this automatically, verify that it fired. If it did not, trigger it manually:

```sh
gh pr review <PR-number> --repo <owner>/<repo>  # only works for human accounts
# For Copilot review, use the GitHub UI: PR → "Request review" → Copilot
```

Or via the API:

```sh
gh api --method POST /repos/<owner>/<repo>/pulls/<PR-number>/requested_reviewers \
  -f "reviewers[]=github-copilot[bot]"
```

Do not proceed to Phase 2 until the Copilot review has been submitted and threads are visible.

---

## Phase 2 — Copilot review response (one thread at a time)

### 2.1 — Gather all threads before responding

Before writing any response, collect the full list of open review threads:

```sh
gh api /repos/<owner>/<repo>/pulls/<PR-number>/comments --jq \
  '[.[] | {id, path, line, body: .body[0:120]}]'
```

Read every thread body in full. Do not respond to any thread before reading all of them —
context from a later thread can change whether an earlier comment is valid.

### 2.2 — Respond to every thread — no exceptions

Go through every thread in document order (file path → line number). For each one, post a
reply in the **same thread** (never a top-level PR comment) using the GitHub reply API:

```sh
gh api --method POST \
  /repos/<owner>/<repo>/pulls/comments/<comment-id>/replies \
  -f body="<response>"
```

Every response must:

1. State clearly whether the comment is **valid** or **not valid**.
2. Explain **why** in one to three sentences. Reference the relevant rule, invariant, or
   design decision. Do not just say "agree" or "disagree".
3. If the fix will be made: describe **what** will change and **where**.

**Valid comment response format:**
```
✅ Valid. [One sentence confirming the issue and why it matters.] Will fix in the batch
commit — [brief description of the fix].
```

**Not valid comment response format:**
```
❌ Not valid. [One sentence explaining why the concern does not apply here.] [Optional:
what the code is actually doing and why it is correct.]
```

**Partially valid comment format:**
```
⚠️ Partially valid. [The issue is real / the concern is right] but [the suggested fix
is wrong / the scope is narrower than described because ...]. Will fix [what is actually wrong].
```

### 2.3 — Security and WCAG comments are always treated as valid

Any comment from the Copilot reviewer that flags a potential security vulnerability
(OWASP Top 10, injection, auth bypass, exposed secrets) or a WCAG accessibility gap is
**always treated as valid** — do not push back on these unless you have a specific
technical reason the finding is a false positive, and even then, explain the reason
explicitly in the thread response.

### 2.4 — When Copilot cannot assess validity

If a thread's validity cannot be determined without business context (e.g. a comment about
whether a particular value is intentional or a mistake), do **not** make a judgment call.
Flag it explicitly:

```
⏸️ Needs branch owner input. [Describe exactly what context is missing and what the two
possible outcomes are.] Holding this fix until clarified.
```

Do not fix anything flagged with ⏸️ until the branch owner responds.

---

## Phase 3 — Fixing valid comments (one batch)

### 3.1 — Fix all valid issues in a single commit

Once all threads have been responded to:

1. Collect every comment marked ✅ or ⚠️ (partially valid — fix the valid part).
2. Fix them all in a single working session.
3. Run the quality gate after all fixes are made — do not push before it is green.
4. Commit all fixes together in **one single commit**:

```sh
git add -A
git commit -m "fix: address PR #<N> Copilot review comments

- <file>: <what was fixed>
- <file>: <what was fixed>
..."
```

The commit message must list every fix. Reviewers should be able to verify each fix
from the commit message alone without reading a thread.

5. Push once:

```sh
git push origin <branch>
```

**Why one batch?** A single fix commit keeps the git history readable — one review, one
fix commit, clear before/after. Multiple small fix commits create noise and make it harder
to identify which commit introduced a regression.

### 3.2 — Follow-up reply on each fixed thread

After the push, reply to every thread that was fixed with a follow-up response:

```sh
gh api --method POST \
  /repos/<owner>/<repo>/pulls/comments/<comment-id>/replies \
  -f body="<follow-up>"
```

Follow-up format:
```
Fixed in <commit-SHA> — <one sentence describing exactly what changed and in which file/line>.
```

Include the short commit SHA (7 characters). The branch owner can click it to verify the diff.

---

## Phase 4 — Post-fix state

### 4.1 — Leave threads UNRESOLVED

**Never resolve a review thread.** Copilot posted the follow-up; the branch owner reads it,
verifies the fix, and resolves the thread manually. This is non-negotiable:

- Resolving a thread marks it as "done" in GitHub's UI and collapses it from the default view.
- If Copilot resolves its own threads, the branch owner cannot quickly see what was fixed.
- Only the branch owner resolves threads — this is the final sign-off step.

### 4.2 — Re-requesting a Copilot review (optional)

After the fix batch is pushed, the branch owner may choose to re-request the Copilot review
to confirm the fixes are clean. Copilot does not re-request a review automatically.

### 4.3 — Updating the PR description (when needed)

If the fix batch changed the scope of the PR (added or removed functionality, changed what
a file does), update the "What does this PR do?" section of the PR description to reflect
the final state. Use:

```sh
gh pr edit <PR-number> --body "<updated body>"
```

---

## Phase 5 — Branch owner sign-off

The branch owner:

1. Reads all thread follow-ups.
2. Clicks through commit SHAs to verify each fix.
3. Resolves threads they are satisfied with.
4. Flags any thread where the fix is incorrect or incomplete — Copilot will respond and fix.
5. Approves and merges the PR (or instructs Copilot to merge — Copilot never merges unilaterally).

---

## Quick reference

```
Phase 0  → branch hygiene + quality gate (before green light)
Phase 1  → green light → create PR → trigger Copilot review
Phase 2  → read ALL threads → respond one-by-one (✅ / ❌ / ⚠️ / ⏸️)
Phase 3  → fix all valid issues → one batch commit → one push → follow-up replies (SHA)
Phase 4  → threads stay UNRESOLVED → branch owner resolves
Phase 5  → branch owner verifies → merges
```

---

## Improvements and gaps not listed in the original brief

These were identified during the writing of this document. They are included here so they
are not silently dropped.

### G1 — The "partially valid" case

The original brief only covered valid / not valid. Many Copilot comments are partially
right — the identified location is wrong but the underlying concern is real, or the fix
suggested is incorrect while the bug is genuine. The ⚠️ format handles this.

### G2 — Security and WCAG comments are non-negotiable valid

The brief did not distinguish comment types. Security findings and accessibility gaps
should be treated as always-valid unless there is a specific technical reason to push back.
Treating them like any other "is this valid?" judgment call introduces risk.

### G3 — Read all threads before responding to any

If you respond to thread 1 without reading thread 5, and thread 5 provides context that
changes whether thread 1 is valid, you have posted a wrong response that cannot be deleted.
Gather first, respond second.

### G4 — "Needs branch owner input" flag

The brief assumed Copilot can always assess validity. For comments about intentional design
decisions or business rules that only the branch owner knows, Copilot should flag and hold —
not guess.

### G5 — Force-push safety after branch hygiene

Moving commits off a branch (Phase 0.2) requires a force-push. If the branch already has
an open PR at that point, a force-push rewrites history and orphans existing review threads.
This must be confirmed with the branch owner before doing it.

### G6 — One batch push discipline (and why)

The brief mentioned "one push in one batch" but did not explain the reason. The reason is
important: reviewers and CI both react to every push. A push-per-fix creates noise, wastes
CI minutes, and makes it harder to bisect a regression to a specific fix. One commit, one push
is the correct discipline.

### G7 — Commit message must list every fix

Without an explicit per-fix list in the commit message, the branch owner cannot verify fixes
from the commit alone — they must cross-reference every thread. A structured commit message
(one bullet per fix, file + what changed) is the minimum required.

### G8 — PR description update after fix batch

If the fix batch added meaningful changes to the PR, the description should reflect them.
The original brief did not mention this. Stale PR descriptions mislead reviewers and future
readers of the git log.

### G9 — Re-requesting review is the branch owner's choice

The brief said "once this post-review-and-fix is done" without specifying whether a new
Copilot review cycle is triggered. This is left to the branch owner — Copilot does not
decide. Some small fix batches do not warrant a second review; larger ones do.

### G10 — Thread resolution is a sign-off signal, not a cleanup step

The original brief said threads must stay unresolved "so the branch owner can review them".
The stronger framing: resolving a thread is the branch owner's sign-off that a fix is
accepted. It is not a housekeeping step. Copilot resolving its own threads removes the
branch owner's ability to signal acceptance without merging.

### G11 — Quality gate before the fix batch push

The brief described the fix → push flow but did not mention running the quality gate between
fixing and pushing. A fix that breaks a type check or a test is worse than the original issue.
Quality gate is mandatory before the single batch push.

### G12 — Inline suggestions (GitHub code suggestion blocks)

Copilot reviewers sometimes post GitHub "Suggested change" blocks (fenced diff suggestions
in the review UI). These can be accepted directly via the GitHub UI (one click) or rejected
with a comment. The brief did not cover this. Rule: accept or reject in the thread (with
explanation); do not silently ignore them. Accepted suggestions are cherry-picked into the
fix batch commit, not applied separately.
