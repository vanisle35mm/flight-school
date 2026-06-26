function Convert-SecureStringToPlainText {
  param([Security.SecureString]$SecureString)

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

$securePassword = Read-Host "Enter the admin password you want to use" -AsSecureString
$confirmPassword = Read-Host "Type the same admin password again" -AsSecureString
$plainPassword = Convert-SecureStringToPlainText $securePassword
$plainConfirm = Convert-SecureStringToPlainText $confirmPassword

if ($plainPassword -ne $plainConfirm) {
  Write-Host ""
  Write-Host "Passwords did not match. Run this script again." -ForegroundColor Yellow
  exit 1
}

if ([string]::IsNullOrWhiteSpace($plainPassword)) {
  Write-Host ""
  Write-Host "Password cannot be blank. Run this script again." -ForegroundColor Yellow
  exit 1
}

$bytes = [Text.Encoding]::UTF8.GetBytes($plainPassword)
$hashBytes = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
$hash = ($hashBytes | ForEach-Object { $_.ToString("x2") }) -join ""

Write-Host ""
Write-Host "Copy this value into Vercel as VITE_ADMIN_PASSWORD_HASH:"
Write-Host $hash
Write-Host ""
Write-Host "For local testing, add this line to .env.local:"
Write-Host "VITE_ADMIN_PASSWORD_HASH=$hash"
