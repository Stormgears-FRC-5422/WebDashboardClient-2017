#!/bin/sh

rm -r webdashboard-client

mkdir webdashboard-client
yarn run build
cp package.json webdashboard-client
cp server.js webdashboard-client
cp default-data.json webdashboard-client
cp -r build webdashboard-client


cd webdashboard-client
mkdir windows-tools
cd windows-tools

wget https://eternallybored.org/misc/wget/current/wget.exe
wget http://7-zip.org/a/7za920.zip
unzip 7za920.zip
rm 7-zip.chm license.txt readme.txt 7za920.zip

cp ../../scripts/windows-zipjs.bat .
cp ../../scripts/windows-install.bat ..
cp ../../scripts/windows-run.bat ..
unix2dos *.bat
cd ..
unix2dos *.bat
cd ..

rm webdashboard-client.zip
zip -9 -r webdashboard-client webdashboard-client
rm -r webdashboard-client