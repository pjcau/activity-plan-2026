---
name: refactor
description: Refactor code safely with tests as safety net
user_invocable: true
args: What to refactor and why
---

# Refactor Skill

Safely refactor code while preserving behavior.

## Steps

1. Read and understand the code to refactor
2. Run existing tests to establish baseline: all must pass
3. Plan the refactoring — common patterns:
   - **Extract**: pull code into a function/module
   - **Inline**: remove unnecessary abstraction
   - **Rename**: improve clarity
   - **Move**: better file/module organization
   - **Simplify**: reduce complexity
4. Apply changes incrementally
5. Run tests after each step
6. If tests fail, revert the last step and try differently

## Rules

- Tests must pass before AND after
- Don't change behavior — only structure
- Don't mix refactoring with feature changes
- If no tests exist, write them first or confirm with user that it's ok to proceed
- Keep commits atomic: one refactoring per commit
