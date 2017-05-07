set NODE_ENV=production
START CMD /C CALL "node/node.exe" build-server/server.js
timeout /t 4
start http://127.0.0.1:5803/