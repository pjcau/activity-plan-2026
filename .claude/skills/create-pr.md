---
name: create-pr
description: Create a pull request with proper title, description, and test plan
user_invocable: true
---

# Create PR Skill

Create a well-structured pull request.

## Steps

1. Run `git status` and `git log --oneline main..HEAD` to understand all changes
2. Run `git diff main...HEAD` for full diff
3. Check if branch is pushed: `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`
4. Analyze ALL commits (not just the latest) to understand the full scope
5. Draft PR:
   - **Title**: under 70 chars, describes the change
   - **Summary**: 1-3 bullet points of what and why
   - **Test plan**: how to verify this works
6. Push if needed: `git push -u origin HEAD`
7. Create PR:

```bash
gh pr create --title "title" --body "$(cat <<'EOF'
## Summary
- bullet points

## Test plan
- [ ] steps to verify

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

8. Return the PR URL
