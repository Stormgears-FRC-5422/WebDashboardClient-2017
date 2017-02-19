WebDashboardClient
===

Prerequisites:
* Node.js (tested on version 7)
* npm or yarn (yarn preferred)
* Working C++ compiler toolchain (`build-essential`)
* Python (2.7?)

##Development
- Start Deepstream server:
```bash
$ node server.js
```
- Start Webpack:
```
$ [npm|yarn] run start
```

Dashboard will be available on port 3000.

##Production (not quite working yet)
- Build the JS:
```
$ [npm|yarn] run build
```
- Copy code to Raspberry Pi/Jetson/control laptop
- Set `NODE_ENV`:
```bash
$ export NODE_ENV=production
```
- Install dependencies:
```bash
$ npm install
```
OR
```bash
$ yarn
```
- Run:
```bash
$ node server.js
```

Dashboard will be available on port 5802.

##Tips
- Use the WebDashboardBridge - download the "fat" jar, add to classpath/dependencies