# EPA AVERT Web App

Front end of the AVERT web app built with React and Redux (bootstrapped with [Vite](https://vitejs.dev/)).

## Local Development

Running the **client app** locally depends on a running local instance of the [server app](/web/server). Please view the 'Local Development' section of the [web folder’s README](/web/README.md) to get started.

## Cloud.gov Deployment

**NOTE:** See the _server_ app’s ['Cloud.gov Deployment' section](/web/server/README.md#cloudgov-deployment) after following the client app’s build steps below.

### Development Deployment

- The app is configured to be deployed to Cloud.gov at the following development route: https://avert-dev.app.cloud.gov

  If that route ever changes, update the `VITE_APP_URL` environment variable set in the `.env.development` file to reflect the updated route.

- Ensure you're in this directory ([client](/web/client)) and run:  
  `npm run build:dev`

- Follow the 'Development Deployment' instructions found in the [server app’s README](/web/server/README.md#development-deployment).

### Production Deployment

- The app is configured to be deployed to Cloud.gov at the following production route: https://avert.app.cloud.gov

  If that route ever changes, update the `VITE_APP_URL` environment variable set in the `.env.production` file to reflect the updated route.

- Ensure you're in this directory ([client](/web/client)) and run:  
  `npm run build:prod`

- Follow the 'Production Deployment' instructions found in the [server app’s README](/web/server/README.md#production-deployment).
