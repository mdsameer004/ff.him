# Read the corrupted style.css
$stylePath = "css\style.css"
$content = Get-Content $stylePath -Raw

# The body block ends at the first closing brace after "body {"
# Find the correct body block (lines 31-40 which look correct) and strip junk after it
# Strategy: find the first clean body { ... } and remove everything between } and next selector

# Use a pattern: after the first `}` closing the body block, remove any junk up to the next blank line + selector
$pattern = '(?s)(body \{[^}]+\})[^\r\n{]*("data:image[^"]*");?\r?\n(\s*background-repeat:[^\r\n]+\r?\n\s*background-size:[^\r\n]+\r?\n)?'
$replacement = '$1'

$fixed = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)

# Also fix hero-section similarly
$heroPattern = '(?s)(\.hero-section \{[^}]+\})[^\r\n{]*("data:image[^"]*");?\r?\n(\s*background-repeat:[^\r\n]+\r?\n\s*background-size:[^\r\n]+\r?\n)?'
$fixed2 = [System.Text.RegularExpressions.Regex]::Replace($fixed, $heroPattern, '$1')

Set-Content $stylePath $fixed2 -Encoding UTF8
Write-Host "style.css cleaned."

# Read the corrupted floral-theme.css
$floralPath = "css\floral-theme.css"
$content2 = Get-Content $floralPath -Raw

$fixed3 = [System.Text.RegularExpressions.Regex]::Replace($content2, $pattern, '$1')
$fixed4 = [System.Text.RegularExpressions.Regex]::Replace($fixed3, $heroPattern, '$1')

Set-Content $floralPath $fixed4 -Encoding UTF8
Write-Host "floral-theme.css cleaned."
