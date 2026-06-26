$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvPath = Join-Path $ProjectDir '.env.local'
$SetupDoc = Join-Path $ProjectDir 'SUPABASE_SETUP.md'
$SchemaPath = Join-Path $ProjectDir 'supabase\schema.sql'

Write-Host ''
Write-Host 'Flight School Supabase Setup'
Write-Host '----------------------------'
Write-Host ''
Write-Host 'Before continuing: create a Supabase project and run this SQL file in Supabase SQL Editor:'
Write-Host $SchemaPath
Write-Host ''

$supabaseUrl = Read-Host 'Paste VITE_SUPABASE_URL'
$supabaseAnonKey = Read-Host 'Paste VITE_SUPABASE_ANON_KEY'

if (-not $supabaseUrl.Trim().StartsWith('https://')) {
  throw 'VITE_SUPABASE_URL should start with https://'
}

if ($supabaseAnonKey.Trim().Length -lt 20) {
  throw 'VITE_SUPABASE_ANON_KEY looks too short.'
}

$envContent = @"
VITE_SUPABASE_URL=$($supabaseUrl.Trim())
VITE_SUPABASE_ANON_KEY=$($supabaseAnonKey.Trim())
"@

Set-Content -Path $EnvPath -Value $envContent

Write-Host ''
Write-Host 'Saved Supabase settings to:'
Write-Host $EnvPath
Write-Host ''
Write-Host 'Next: restart Flight School. The cockpit topbar should change from Local to Cloud online after it connects.'
Write-Host ''
Write-Host 'Setup notes:'
Write-Host $SetupDoc
