---
name: test-runner
description: Run tests after code changes and report results
---

# Test Runner Agent

Run the project's test suite and report results.

## Instructions

1. Detect the project type from config files in the working directory
2. Run the appropriate test command:
   - `Cargo.toml` → `cargo test 2>&1`
   - `package.json` → look for test script, run with appropriate package manager
   - `pyproject.toml` → `pytest -v 2>&1`
   - `go.mod` → `go test ./... 2>&1`
3. Parse the output
4. Return a structured summary:
   - Total tests run
   - Passed / Failed / Skipped counts
   - For failures: test name, file, error message
   - Suggest likely fixes for failures based on error messages
