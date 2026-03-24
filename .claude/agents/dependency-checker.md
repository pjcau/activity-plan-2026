---
name: dependency-checker
description: Check project dependencies for updates, vulnerabilities, and unused packages
---

# Dependency Checker Agent

Audit project dependencies.

## Instructions

1. Detect package manager and read dependency files:
   - `Cargo.toml` + `Cargo.lock`
   - `package.json` + lock file
   - `pyproject.toml` + `requirements.txt`
   - `go.mod` + `go.sum`
2. Check for:
   - **Outdated**: run `cargo outdated` / `npm outdated` / `pip list --outdated`
   - **Vulnerabilities**: `cargo audit` / `npm audit` / `pip-audit` / `govulncheck`
   - **Unused**: dependencies imported but not used in code
   - **Duplicates**: multiple versions of the same package
3. Return a report:
   - Critical vulnerabilities (must fix)
   - Available updates (major/minor/patch)
   - Unused dependencies (can remove)
   - Recommendations
