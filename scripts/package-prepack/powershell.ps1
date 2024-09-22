$root = ".." # relative from package/package.json
$readmeFile = "README.md"

Rename-Item -Path "$root\package\README.md" -NewName "README-original.md" # It will be renamed again in postpack cycle
Copy-Item -Path "$root\$readmeFile" -Destination "$root\package\$readmeFile"