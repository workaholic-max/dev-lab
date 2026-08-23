#!/usr/bin/env bash
# Mirrors this folder's skills/agents/rules into ~/.claude/, and wires up the CLAUDE.md import.
# Run from inside dev-lab/ai-assisted-dev: ./sync.sh
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
claude_home="$HOME/.claude"

mkdir -p "$claude_home"

mirror_folder() {
    local name="$1"
    local source="$here/$name"
    local dest="$claude_home/$name"
    if [ -d "$source" ]; then
        mkdir -p "$dest"
        rsync -a --delete "$source"/ "$dest"/
        echo "Synced $name -> $dest"
    fi
}

mirror_folder "skills"
mirror_folder "agents"
mirror_folder "rules"

# Wire up the personal CLAUDE.md import (idempotent — only adds the line once).
user_claude_md="$claude_home/CLAUDE.md"
import_line="@$here/CLAUDE.md"

if [ ! -f "$user_claude_md" ]; then
    echo "$import_line" > "$user_claude_md"
    echo "Created $user_claude_md with import."
elif ! grep -qF "$import_line" "$user_claude_md"; then
    printf '\n%s\n' "$import_line" >> "$user_claude_md"
    echo "Added import to existing $user_claude_md."
else
    echo "Import already present in $user_claude_md."
fi

echo
echo "Done. Open Claude Code in any project and run /context to verify."
