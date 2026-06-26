$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeBin = 'C:\Users\blanc\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$Pnpm = 'C:\Users\blanc\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
$LocalUrl = 'http://127.0.0.1:5173'
$ToolsDir = Join-Path $ProjectDir 'tools'
$Cloudflared = Join-Path $ToolsDir 'cloudflared.exe'
$TunnelLog = Join-Path $ProjectDir 'cloudflared-tunnel.log'
$PublicUrlFile = Join-Path $ProjectDir 'PUBLIC-TEST-URL.txt'

$env:Path = "$NodeBin;$env:Path"

function Test-FlightSchoolServer {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $LocalUrl -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Stop-FlightSchoolServer {
  Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq 'node.exe' -and
    $_.CommandLine -like "*$ProjectDir*" -and
    $_.CommandLine -like '*node_modules*vite*'
  } | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force
  }

  Start-Sleep -Milliseconds 500
}

function Start-FlightSchoolServer {
  if (Test-FlightSchoolServer) { return }

  Start-Process -FilePath $Pnpm `
    -ArgumentList @('dev', '--host', '127.0.0.1') `
    -WorkingDirectory $ProjectDir `
    -RedirectStandardOutput (Join-Path $ProjectDir 'vite-dev.log') `
    -RedirectStandardError (Join-Path $ProjectDir 'vite-dev.err.log') `
    -WindowStyle Hidden

  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-FlightSchoolServer) { return }
  }

  throw "Flight School did not start at $LocalUrl."
}

function Install-Cloudflared {
  if (Test-Path $Cloudflared) { return }

  New-Item -ItemType Directory -Force -Path $ToolsDir | Out-Null
  $downloadUrl = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
  Write-Host "Downloading Cloudflare Tunnel helper..."
  Invoke-WebRequest -UseBasicParsing -Uri $downloadUrl -OutFile $Cloudflared
}

function Stop-ExistingPublicTunnel {
  Get-Process -Name 'cloudflared' -ErrorAction SilentlyContinue | ForEach-Object {
    try {
      if ($_.Path -eq $Cloudflared) {
        Stop-Process -Id $_.Id -Force
      }
    } catch {
      # Ignore processes whose path cannot be inspected.
    }
  }

  Start-Sleep -Milliseconds 500
}

function Test-PublicUrl {
  param([string]$Url)

  try {
    $hostName = ([uri]$Url).Host
    $dns = Resolve-DnsName $hostName -Server 1.1.1.1 -Type A -ErrorAction Stop | Select-Object -First 1
    if (-not $dns.IPAddress) { return $false }

    $headers = & curl.exe -sS -I --resolve "$hostName`:443`:$($dns.IPAddress)" $Url --max-time 20
    return $LASTEXITCODE -eq 0 -and ($headers -match 'HTTP/.* 200')
  } catch {
    return $false
  }
}

function Start-PublicTunnelOnce {
  Stop-ExistingPublicTunnel

  if (Test-Path $TunnelLog) { Remove-Item $TunnelLog -Force }
  if (Test-Path $PublicUrlFile) { Remove-Item $PublicUrlFile -Force }

  Start-Process -FilePath $Cloudflared `
    -ArgumentList @('tunnel', '--url', $LocalUrl, '--logfile', $TunnelLog) `
    -WorkingDirectory $ProjectDir `
    -WindowStyle Hidden

  for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Milliseconds 750
    if (-not (Test-Path $TunnelLog)) { continue }

    $log = Get-Content -Path $TunnelLog -Raw -ErrorAction SilentlyContinue
    $matches = [regex]::Matches($log, 'https://[a-zA-Z0-9-]+\.trycloudflare\.com')
    if ($matches.Count -gt 0) {
      return $matches[$matches.Count - 1].Value
    }
  }

  throw "Cloudflare tunnel started, but no public URL was found yet. Check $TunnelLog."
}

function Start-PublicTunnel {
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    $publicUrl = Start-PublicTunnelOnce
    Write-Host "Cloudflare created: $publicUrl"
    Write-Host "Checking public URL..."

    for ($i = 0; $i -lt 12; $i++) {
      if (Test-PublicUrl $publicUrl) {
        Set-Content -Path $PublicUrlFile -Value $publicUrl
        Start-Process $publicUrl
        Write-Host "Public Flight School URL: $publicUrl"
        Write-Host "Saved to: $PublicUrlFile"
        return
      }
      Start-Sleep -Seconds 5
    }

    Write-Host "That URL did not resolve/respond. Trying a fresh Cloudflare URL..."
  }

  throw "Cloudflare created tunnel URLs, but none became reachable. Check $TunnelLog."
}

Stop-FlightSchoolServer
Start-FlightSchoolServer
Install-Cloudflared
Start-PublicTunnel
