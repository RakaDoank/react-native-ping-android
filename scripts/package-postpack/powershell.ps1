$root = ".." # relative from package/package.json
$readmeFile = "README.md"

Remove-Item "$root\package\$readmeFile"
Rename-Item -Path "$root\package\README-original.md" -NewName "README.md"