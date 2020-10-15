# Portal

Nexus Portal is a new project that will be build inside Amdocs and will replace the systems that already being used in Vubiquity.

## Environment requirements

-   install node
-   install yarn
-   clone project from git
-   run `yarn` in root project folder to install all needed dependencies

## Starting application

Inside project root create `.env.development` file (see `.env.example` for reference). Then run:
yarn start # to start the app
yarn test # to run Jest test suite (in separate terminal)

-   Currently, .env files have variables accessible inside project. If it is possible all configuration data
    (set inside config.js and config.json or configQA.json) should be set inside .env files. Those files are git ignored.

## Development mode

-   `yarn build` - make a development build (without uglify, minify, etc.) into dist folder
-   `yarn build:analyze-dev` - make a development build with two 2 additional html documents (visualizer and analyze)
-   `yarn start`
    -   Browser will be automatically run on proper page
    -   Run dev web server on port 3000 in hot redeploy mode.
    -   Any changes will be automatically rebuilded, result of that will be shown in console where you launch webserver and in console in browser.
    -   After changes in css and JS files page will be updated without refresh
-   `yarn test` - run unit and integration tests written in Jest and Enzyme
-   `yarn lint` - quick overview of failing eslint rules, show the detailed error reports for one rule at a time.

## Production build with docker

-   `yarn build:prod` - make an optimized production build and build docker image expose as `nexus/vehicle-ui`
-   `yarn build:analyze-prod` - make an optimized production with 2 additional html documents (analyze and visualizer)

## Configuration of portal

-   basically application is initiated by default configuration from config.js file which is included into bundle application
-   before react application is loaded into DOM it make a call for `/config.json` resource on root path to load external configuration
-   application will be loaded only when config.json file will be received
-   if there will be any problem with that user will see error msg instead of application and in web console will be printed details what was happen

### config.json

-   need to be a valid JSON file
-   should have similar structure to default config.js file, but you can specify only value which need to be changed in environment, all other will be a default one
-   in case of any problem with Parsing json you will se problematic position in web console log

## Link to shared components:

-   http://confluence.vubiquity.com/display/CS/Portal+Components
