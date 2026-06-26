$securePassword = Read-Host "Enter the admin password you want to use" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
$bytes = [Text.Encoding]::UTF8.GetBytes($plainPassword)
$hashBytes = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
$hash = ($hashBytes | ForEach-Object { $_.ToString("x2") }) -join ""

Write-Host ""
Write-Host "Copy this value into Vercel as VITE_ADMIN_PASSWORD_HASH:"
Write-Host $hash
Write-Host ""
Write-Host "For local testing, add this line to .env.local:"
Write-Host "VITE_ADMIN_PASSWORD_HASH=$hash"
