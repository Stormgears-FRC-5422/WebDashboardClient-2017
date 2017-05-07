#!/bin/sh

rm -r webdashboard-client

yarn run build
yarn run build:server

mkdir webdashboard-client
cp -r build webdashboard-client
cp -r build-server webdashboard-client
cd webdashboard-client

cp ../scripts/webdashboard.bat .
cp ../scripts/webdashboard.sh .
unix2dos *.bat
cd ..

NODE_VERSION=7.10.0

# Windows
rm webdashboard-client-windows-x64.zip
wget https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip
unzip node-v${NODE_VERSION}-win-x64.zip node-v${NODE_VERSION}-win-x64/node.exe
mkdir webdashboard-client/node
mv node-v${NODE_VERSION}-win-x64/node.exe webdashboard-client/node/node.exe
rm -r node-v${NODE_VERSION}-win-x64 node-v${NODE_VERSION}-win-x64.zip
zip -9 -r webdashboard-client-windows-x64 webdashboard-client

# macOS
rm webdashboard-client-macos.tar.gz
rm webdashboard-client/node/node.exe
wget https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-x64.tar.gz
tar -xzvf node-v${NODE_VERSION}-darwin-x64.tar.gz
mv node-v${NODE_VERSION}-darwin-x64/bin/node webdashboard-client/node/node
rm -r node-v${NODE_VERSION}-darwin-x64 node-v${NODE_VERSION}-darwin-x64.tar.gz
tar -czvf webdashboard-client-macos.tar.gz webdashboard-client

# Linux
rm webdashboard-client-linux-x64.tar.xz
rm webdashboard-client/node/node
wget https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz
tar -xzvf node-v${NODE_VERSION}-linux-x64.tar.gz
mv node-v${NODE_VERSION}-linux-x64/bin/node webdashboard-client/node/node
rm -r node-v${NODE_VERSION}-linux-x64 node-v${NODE_VERSION}-linux-x64.tar.gz
tar -cJvf webdashboard-client-linux-x64.tar.xz webdashboard-client


rm -r webdashboard-client