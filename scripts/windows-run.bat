set NODE_ENV=production
START CMD /C CALL "node/npm" --scripts-prepend-node-path=true run prod
timeout /t 4
start http://127.0.0.1:5803/