
# Vehicle Ui
## Environment requirements
- install node
- install yarn
- clone project from git
- run `yarn` in root project folder to install all needed dependencies

Builded webpage is in dist folder
## Development mode 
- `yarn build` - make a development build (without uglify, minify, etc.)
- `yarn start` 
  - Browser will be automaticaly run on proper page
  - Run dev web server on port 3000 in hot redeploy mode. 
  - Any changes will be automaticaly rebuiled, result of that will be shown in console where you launch webserver and in console in browser.
  - After changes in css page will be updated without refresh, but changes in javascript will fire auto refresh
## Production build with docker
- `yarn build:prod` - make an optimized production build and build docker image expose as `nexus/vehicle-ui`