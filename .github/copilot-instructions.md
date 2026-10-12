# GitHub Actions verification

After every push to GitHub, do not consider the task complete until Actions has
been checked for the exact pushed commit.

1. Record the pushed branch and full commit SHA with Git.
2. Read `.github/workflows/` to confirm workflow filenames, event triggers,
   branch filters, dependencies, and permissions. Do not assume a scheduled
   workflow runs for a push.
3. Find Actions runs matching the exact SHA, branch, and event. Prefer the
   GitHub Actions connector; otherwise use authenticated `gh`.
4. Wait for every workflow triggered by that push to complete. Require
   `conclusion == success`. For failures, inspect the failed job, step, and logs;
   fix in-scope causes, push a new commit, and verify again against its new SHA.
5. If a workflow was not triggered by the push, report `NOT TRIGGERED`. If runs
   are missing, inaccessible, or still pending at the bounded wait limit,
   report `BLOCKED` or `PENDING`; never infer success from a successful push.
6. Report the branch, full SHA, push status, each required workflow status,
   links to its exact-SHA run, any failure and root cause, and a final verdict:
   `VERIFIED`, `FAILED`, `PENDING`, or `BLOCKED`.

Workflow expectations (confirm against the checked-in workflow files each
time; these can change):

- `CI` (`.github/workflows/ci.yml`): runs on pull requests and pushes to
  `main`, `develop`, `feature/**`, `fix/**`, and `chore/**`.
- `Build & Publish Docker Image`
  (`.github/workflows/docker-publish.yml`): runs on pushes to `main`, version
  tags matching `v*.*.*`, or manual dispatch.
- `Auto Update F1 2026 Data`
  (`.github/workflows/auto-update-f1.yml`): runs on its configured schedule or
  manual dispatch; it is not push-triggered. Do not manually trigger it without
  explicit user authorization.

Do not merge, force-push, manually publish images, manually synchronize
production data, or modify production secrets without explicit authorization.
A successful Docker image publication is not proof of a production deployment.
