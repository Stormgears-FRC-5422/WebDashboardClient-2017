WebDashboardClient
===

Please see [the wiki](https://github.com/Stormgears-FRC-5422/WebDashboardClient/wiki) for general documentation.

Prerequisites:
* Node.js (tested on version 7)
* npm or yarn (yarn preferred)
* Working C++ compiler toolchain (`build-essential`)
* Sane UNIX environment

## Development
- Start Deepstream server:
```bash
$ [npm|yarn]run deepstream
```
- Start Webpack:
```
$ [npm|yarn] run start
```

Dashboard will be available on port 3000.

## Production (Unix-like system)
If you are using a pre-built package, jump directly to "copy code."

- Build the JS:
```
$ [npm|yarn] run build
```
- Copy code to Raspberry Pi/Jetson/control laptop
- Set `NODE_ENV`:
```bash
$ NODE_ENV=production
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
$ npm run prod
```

Dashboard will be available on port 5803.
