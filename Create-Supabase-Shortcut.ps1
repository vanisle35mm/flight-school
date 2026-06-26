$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Desktop = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop 'Flight School Configure Supabase.lnk'
$Target = 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe'
$Script = Join-Path $ProjectDir 'Configure-Supabase.ps1'
$Icon = Join-Path $ProjectDir 'assets\flight-school.ico'

$Shell = New-Object -ComObject WScript.Shell
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $Target
$Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$Script`""
$Shortcut.WorkingDirectory = $ProjectDir
$Shortcut.IconLocation = $Icon
$Shortcut.Description = 'Configure Supabase cloud sync for Flight School'
$Shortcut.Save()

Write-Host $ShortcutPath
