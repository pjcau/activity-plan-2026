---
name: commit
description: Create a well-structured git commit with conventional commit format
user_invocable: true
---

# Commit Skill

Create a commit following conventional commits format.

## Steps

1. Run `git status` to see all changes
2. Run `git diff --staged` to see staged changes. If nothing is staged, run `git diff` to see unstaged changes
3. Run `git log --oneline -5` to see recent commit style
4. Analyze the changes and determine the commit type:
   - `feat`: new feature
   - `fix`: bug fix
   - `refactor`: code restructuring
   - `docs`: documentation only
   - `test`: adding/updating tests
   - `chore`: maintenance, deps, config
   - `style`: formatting, no logic change
   - `perf`: performance improvement
5. Stage relevant files (prefer specific files over `git add .`)
6. Write a concise commit message: `type(scope): description`
7. Create the commit

## Rules

- Never use `--no-verify`
- Never amend unless explicitly asked
- Don't commit `.env`, credentials, or secrets
- Keep the first line under 72 characters
- Add body only if the "why" isn't obvious from the title
