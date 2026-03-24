---
name: doc
description: Generate or update documentation for code
user_invocable: true
args: Optional - specific file or module to document
---

# Documentation Skill

Generate clear, useful documentation.

## Steps

1. If a specific target is given, read that code. Otherwise, identify undocumented public APIs
2. Understand what the code does by reading it (not guessing)
3. Generate documentation appropriate to the language:
   - Rust: `///` doc comments with examples
   - TypeScript/JavaScript: JSDoc
   - Python: docstrings (Google or NumPy style)
   - Go: godoc-style comments
4. Include:
   - What the function/module does (one line)
   - Parameters and return values
   - Example usage (if non-obvious)
   - Edge cases or important notes
5. For README: describe purpose, installation, usage, configuration

## Rules

- Don't document obvious things (`/// Returns the name` on `fn name()`)
- Don't document internal/private code unless complex
- Match existing documentation style in the project
- Examples should compile/run
