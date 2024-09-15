$root = ".." # relative from package/package.json
$readmeFile = "README.md"

Copy-Item -Path "$root\$readmeFile" -Destination "$root\package\$readmeFile"