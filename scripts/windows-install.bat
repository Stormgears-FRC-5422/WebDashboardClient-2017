"windows-tools\wget.exe" --no-check-certificate https://nodejs.org/dist/v7.5.0/node-v7.5.0-win-x64.zip
"windows-tools\7za.exe" x "node-v7.5.0-win-x64.zip" -r > nul
del node-v7.5.0-win-x64.zip
move node-v7.5.0-win-x64 node

set NODE_ENV=production
node/npm --scripts-prepend-node-path=true install