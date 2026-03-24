---
name: test
description: Run tests intelligently based on what changed
user_invocable: true
---

# Test Skill

Run the right tests based on context.

## Steps

1. Detect the project type by looking for config files:
   - `Cargo.toml` → Rust (`cargo test`)
   - `package.json` → Node (`npm test` or `pnpm test` or `yarn test`)
   - `pyproject.toml` / `setup.py` → Python (`pytest`)
   - `go.mod` → Go (`go test ./...`)
2. Check `git diff --name-only` to see what files changed
3. Run targeted tests if possible:
   - Rust: `cargo test module_name`
   - Node: test runner with `--filter` or path
   - Python: `pytest path/to/test_file.py`
   - Go: `go test ./pkg/...`
4. If targeted tests fail, run full suite for context
5. Report results clearly: passed, failed, skipped

## Rules

- Always run tests before suggesting "it works"
- If no test framework is configured, say so
- Don't modify tests unless asked
