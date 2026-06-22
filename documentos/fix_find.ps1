$path = "C:\Users\note\Desktop\defesacivil\g03\documentos\wad.md"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$lines = $content -split "`r`n"

# Find the WebAPI prioridade section - find where to insert (after the fotos table description)
$insertIdx = ($lines | Select-String "Pendencia.*limite de fotos por moradia" | Select-Object -First 1).LineNumber
Write-Output "Insert after line: $insertIdx"
Write-Output "Context: $($lines[$insertIdx-1].Substring(0,[Math]::Min(80,$lines[$insertIdx-1].Length)))"
