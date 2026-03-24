---
name: simplify
description: Review changed code for reuse, quality, and efficiency, then fix issues
user_invocable: true
---

# Simplify Skill

Review recently changed code and simplify it.

## Steps

1. Run `git diff HEAD` to see current changes (or `git diff HEAD~1` if already committed)
2. For each changed file, read the full file for context
3. Look for:
   - **Duplication**: code repeated that could be extracted
   - **Over-engineering**: abstractions that aren't needed yet
   - **Dead code**: unused imports, variables, functions
   - **Complexity**: nested conditionals that could be flattened
   - **Naming**: unclear or misleading names
   - **Performance**: obvious inefficiencies
4. Apply fixes directly — don't just report them
5. Show a brief summary of what changed and why

## Rules

- Don't add features or change behavior
- Don't add comments unless logic is truly non-obvious
- Don't refactor code that wasn't touched in the diff
- Keep changes minimal and focused
