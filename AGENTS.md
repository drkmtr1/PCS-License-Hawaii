# Agent instructions

Read `docs/PROJECT_STATE.md`, then the relevant files in `docs/` before changing the project.

- Do not invent or interpret licensing rules. Use approved source records and abstain on ambiguity.
- Do not claim a user is authorized to practice.
- Keep applicant answers ephemeral; do not add accounts, uploads, or persistence without an approved requirement.
- Map work to backlog, requirements, acceptance criteria, tests, and exact review evidence.
- Treat routing/source changes as at least R2; unresolved source-authority interpretation is R3. Require independent correctness and user-risk reviews.
- Do not begin feature implementation until the Stage 1 foundation is pushed to the verified GitHub repository.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
