---
name: test-analyze
description: Analyze the codebase to find untested code, generate unit and integration tests, then run them. Use this to improve test coverage or bootstrap tests for new/changed code.
user_invocable: true
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, Agent
---

# Test Analyze — Discover & Generate Tests

Analyze the codebase, identify untested code, generate unit and integration tests, then run them.

## Steps

1. **Discover project test setup**
   - Read `package.json` for test command and framework
   - Read vitest/jest config for patterns and setup
   - Find existing test files: `**/*.test.ts`, `**/*.test.tsx`

2. **Map test coverage**
   - List all source files in `src/`
   - Compare against existing test files (co-located: `foo.test.ts` next to `foo.ts`)
   - Identify files with NO test coverage
   - Identify files with PARTIAL coverage (existing tests but missing scenarios)

3. **Prioritize what to test**
   - Pure functions and utilities (easiest, highest value)
   - Data transformations (parsers, mappers, builders)
   - API route handlers (integration tests with Hono test client)
   - React hooks (with renderHook from @testing-library/react)
   - React components (with render from @testing-library/react — only if library is available)

4. **Generate unit tests** for each untested file:
   - Import the module under test
   - Test happy path with realistic data
   - Test edge cases: empty input, invalid input, boundary values
   - Test error handling paths
   - Use factory helpers (`makeListing()` etc.) for test data consistency
   - Co-locate tests: create `foo.test.ts` next to `foo.ts`

5. **Generate integration tests** where applicable:
   - Route tests: use Hono `app.request()` pattern
   - Test request validation, response shape, status codes
   - Test filter/sort/pagination behavior end-to-end

6. **Run the tests**
   - Run via Docker if docker-compose.yml exists: `docker compose run --rm backend npm test`
   - Otherwise run locally: `npm test`
   - If tests fail, read the error, fix the test (not the source), re-run
   - Report: total passed, failed, skipped

## Rules

- Co-locate tests next to source files (`foo.test.ts` beside `foo.ts`)
- Use `describe` / `it` blocks with clear, behavior-driven names
- Do NOT modify source code — only create/edit test files
- Do NOT add test dependencies without asking the user first
- Use existing test patterns found in the project (helpers, fixtures, etc.)
- Prefer testing public API over internal implementation details
- Skip files that are pure type definitions or re-exports
- For scraper tests, use HTML fixtures (not live HTTP calls)

## Output

After running, report:
- Files analyzed
- Tests created (new files)
- Tests added (to existing files)
- Pass/fail summary
