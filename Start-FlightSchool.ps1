$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeBin = 'C:\Users\blanc\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$Pnpm = 'C:\Users\blanc\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
$Url = 'http://127.0.0.1:5173'

$env:Path = "$NodeBin;$env:Path"

function Test-FlightSchoolServer {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (-not (Test-FlightSchoolServer)) {
  Start-Process -FilePath $Pnpm `
    -ArgumentList @('dev', '--host', '127.0.0.1') `
    -WorkingDirectory $ProjectDir `
    -RedirectStandardOutput (Join-Path $ProjectDir 'vite-dev.log') `
    -RedirectStandardError (Join-Path $ProjectDir 'vite-dev.err.log') `
    -WindowStyle Hidden

  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-FlightSchoolServer) { break }
  }
}

Start-Process $Url
