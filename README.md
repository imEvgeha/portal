
# Vehicle Ui
## Environment requirements
- install node
- install yarn
- clone project from git
- run `yarn` in root project folder to install all needed dependencies

## Development mode 
- `yarn build` - make a development build (without uglify, minify, etc.) into dist folder
- `yarn start` 
  - Browser will be automatically run on proper page
  - Run dev web server on port 3000 in hot redeploy mode. 
  - Any changes will be automatically rebuilded, result of that will be shown in console where you launch webserver and in console in browser.
  - After changes in css page will be updated without refresh, but changes in javascript will fire auto refresh
- `yarn test` - perform basic build into dist folder and ESLint validation of javascript code and list all of that problem, in production build this problem will be thrown as an error
## Production build with docker
- `yarn build:prod` - make an optimized production build and build docker image expose as `nexus/vehicle-ui`

## Configuration of portal
- basically application is initiated by default configuration from config.js file which is included into bundle application 
- before react application is loaded into DOM it make a call for `/config.json` resource on root path to load external configuration
- application will be loaded only when config.json file will be received
- if there will be any problem with that user will see error msg instead of application and in web console will be printed details what was happen

### config.json
- need to be a valid JSON file
- should have similar structure to default config.js file, but you can specify only value which need to be changed in environment, all other will be a default one
- in case of any problem with Parsing json you will se problematic position in web console log
