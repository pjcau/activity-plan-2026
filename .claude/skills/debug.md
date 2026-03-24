---
name: debug
description: Systematically debug an error or unexpected behavior
user_invocable: true
args: Error message or description of the problem
---

# Debug Skill

Systematically diagnose and fix bugs.

## Steps

1. **Reproduce**: understand the error message or behavior described
2. **Locate**: find the relevant code
   - Search for error messages in the codebase
   - Trace the call stack if available
   - Check recent changes: `git log --oneline -10` and `git diff`
3. **Understand**: read the surrounding code to understand intent
4. **Hypothesize**: form 2-3 possible causes ranked by likelihood
5. **Verify**: test hypotheses starting from most likely
   - Add targeted logging or read state
   - Check edge cases and inputs
6. **Fix**: apply the minimal fix
7. **Verify fix**: run tests or reproduce to confirm

## Rules

- Don't guess — trace the actual code path
- Fix the root cause, not the symptom
- If stuck after 3 attempts, explain findings and ask for more context
- Don't change unrelated code
