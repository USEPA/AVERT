# EPA AVERT Web App

Front-end of the AVERT web app built with React and Redux (bootstrapped with [create-react-app](https://github.com/facebook/create-react-app)).

## Local Development

Front-end app depends on a local instance of the [epa-avert-webservice app](/epa-avert-webservice) running, so view the ['Local Development' section](/epa-avert-webservice#local-development) of the _epa-avert-webservice_ app.

## Cloud.gov Deployment

**NOTE:** See _epa-avert-webservice_ app's ['Cloud.gov Deployment' section](/epa-avert-webservice#cloudgov-deployment) for more info on deploying for Development and Production.

### Development Deployment

- The app is configured to be deployed to Cloud.gov at the following route: https://avert-dev.app.cloud.gov

  If that route ever needs to change, make sure you update the `REACT_APP_URL` environment variable set in the `.env.development` file to reflect the updated route.

- Ensure you're in this directory ([epa-avert-webapp](/epa-avert-webapp)) in a terminal session and enter:  
  `npm run build:dev`

- Follow the deployment instructions found in the [epa-avert-webservice app’s README](/epa-avert-webservice#development-deployment).

### Production Deployment

- The app is configured to be deployed to Cloud.gov at the following route: https://avert.app.cloud.gov

  If that route ever needs to change, make sure you update the `REACT_APP_URL` environment variable set in the `.env.production` file to reflect the updated route.

- Ensure you're in this directory ([epa-avert-webapp](/epa-avert-webapp)) in a terminal session and enter:  
  `npm run build`

- Follow the deployment instructions found in the [epa-avert-webservice app’s README](/epa-avert-webservice#production-deployment).
