#!/usr/bin/env bash
# PostToolUse hook: auto-commit changes to .claude-kit submodule
# Triggers after Edit/Write on skills, agents, or hooks files
# that live inside the .claude-kit submodule.

set -euo pipefail

# Only process Edit and Write tool results
TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
[[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]] || exit 0

# Read the tool input to get the file path
INPUT="$(cat)"
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | head -1 | cut -d'"' -f4 2>/dev/null || true)
[[ -n "$FILE_PATH" ]] || exit 0

# Resolve symlinks to find the real path
REAL_PATH="$(readlink "$FILE_PATH" 2>/dev/null || echo "$FILE_PATH")"

# Find repo root
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[[ -n "$REPO_ROOT" ]] || exit 0

SUBMODULE_DIR="$REPO_ROOT/.claude-kit"
[[ -d "$SUBMODULE_DIR/.git" || -f "$SUBMODULE_DIR/.git" ]] || exit 0

# Check if the file is inside .claude-kit (directly or via symlink)
IS_SUBMODULE_FILE=false

# Direct path inside .claude-kit/
if [[ "$FILE_PATH" == */.claude-kit/* ]]; then
    IS_SUBMODULE_FILE=true
fi

# Symlink resolving into .claude-kit/
if [[ "$REAL_PATH" == */.claude-kit/* || "$REAL_PATH" == ../../.claude-kit/* ]]; then
    IS_SUBMODULE_FILE=true
fi

# Also check: .claude/skills|agents|hooks that are symlinks into .claude-kit
if [[ "$FILE_PATH" == */.claude/skills/* || "$FILE_PATH" == */.claude/agents/* || "$FILE_PATH" == */.claude/hooks/* ]]; then
    if [[ -L "$FILE_PATH" ]]; then
        LINK_TARGET="$(readlink "$FILE_PATH")"
        if [[ "$LINK_TARGET" == *".claude-kit"* ]]; then
            IS_SUBMODULE_FILE=true
        fi
    fi
fi

$IS_SUBMODULE_FILE || exit 0

# Check if the submodule has changes
cd "$SUBMODULE_DIR"
if git diff --quiet && git diff --cached --quiet; then
    exit 0
fi

# Get the relative path of the changed file within the submodule
REL_FILE="${FILE_PATH#*/.claude-kit/}"
if [[ "$REL_FILE" == "$FILE_PATH" ]]; then
    # Try from real path
    REL_FILE="${REAL_PATH#*/.claude-kit/}"
fi

# Determine change type for commit message
CHANGE_TYPE="file"
if [[ "$REL_FILE" == skills/* ]]; then
    CHANGE_TYPE="skill"
elif [[ "$REL_FILE" == agents/* ]]; then
    CHANGE_TYPE="agent"
elif [[ "$REL_FILE" == hooks/* ]]; then
    CHANGE_TYPE="hook"
fi

BASENAME="$(basename "$REL_FILE" .md)"
BASENAME="$(basename "$BASENAME" .sh)"

# Stage and commit in the submodule
git add -A
git commit -q -m "Update $CHANGE_TYPE: $BASENAME"

# Update submodule reference in parent repo
cd "$REPO_ROOT"
git add .claude-kit
git commit -q -m "Update .claude-kit submodule ($CHANGE_TYPE: $BASENAME)"

# Notify the user
cat << RESULT
{"description": "Auto-committed $CHANGE_TYPE change ($BASENAME) to .claude-kit submodule"}
RESULT
