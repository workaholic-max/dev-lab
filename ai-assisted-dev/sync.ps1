# Mirrors this folder's skills/agents/rules into ~/.claude/, and wires up the CLAUDE.md import.
# Run from inside dev-lab\ai-assisted-dev: .\sync.ps1

$here = $PSScriptRoot
$claudeHome = Join-Path $HOME ".claude"

New-Item -ItemType Directory -Force -Path $claudeHome | Out-Null

function Mirror-Folder($name) {
    $source = Join-Path $here $name
    $dest = Join-Path $claudeHome $name
    if (Test-Path $source) {
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        robocopy $source $dest /MIR /NFL /NDL /NJH /NJS | Out-Null
        Write-Host "Synced $name -> $dest"
    }
}

Mirror-Folder "skills"
Mirror-Folder "agents"
Mirror-Folder "rules"

# Wire up the personal CLAUDE.md import (idempotent — only adds the line once).
$userClaudeMd = Join-Path $claudeHome "CLAUDE.md"
$importLine = "@$here\CLAUDE.md"

if (-not (Test-Path $userClaudeMd)) {
    Set-Content -Path $userClaudeMd -Value $importLine
    Write-Host "Created $userClaudeMd with import."
}
elseif (-not (Select-String -Path $userClaudeMd -Pattern ([regex]::Escape($importLine)) -Quiet)) {
    Add-Content -Path $userClaudeMd -Value "`n$importLine"
    Write-Host "Added import to existing $userClaudeMd."
}
else {
    Write-Host "Import already present in $userClaudeMd."
}

Write-Host "`nDone. Open Claude Code in any project and run /context to verify."
