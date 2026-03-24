---
name: review-pr
description: Review a pull request for code quality, bugs, and best practices
user_invocable: true
args: PR number or URL
---

# Review PR Skill

Review a pull request thoroughly.

## Steps

1. Fetch PR details: `gh pr view $PR --json title,body,files,commits`
2. Get the diff: `gh pr diff $PR`
3. Read changed files for full context (not just the diff)
4. Review for:
   - **Correctness**: logic errors, edge cases, off-by-one
   - **Security**: injection, auth bypass, secrets exposure
   - **Performance**: N+1 queries, unnecessary allocations, missing indexes
   - **Maintainability**: naming, complexity, dead code
   - **Tests**: adequate coverage, meaningful assertions
5. Provide feedback organized by severity:
   - **Blocking**: must fix before merge
   - **Suggestion**: would improve but not blocking
   - **Nit**: style/preference

## Output Format

```
## PR Review: [title]

### Summary
[1-2 sentences on what this PR does]

### Blocking
- [ ] file:line - description

### Suggestions
- file:line - description

### Nits
- file:line - description

### Verdict
[APPROVE / REQUEST_CHANGES / COMMENT]
```
