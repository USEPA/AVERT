# EPA AVERT Web Service

Node.js web service (built with Koa and Redis/Kue) for performing displacement calculations for AVERT web app.

## Local Development
Local development depends on `redis-server` and `node` (version 8 or higher).

Open three separate terminal sessions and run the following in each subsequent session:
1. Start a local redis server: `redis-server`.
2. From the [epa-avert-webservice directory](/epa-avert-webservice) (this one), start the npm dev script: `npm run dev`.
2. From the [epa-avert-webapp directory](/epa-avert-webapp) (up a level), start the npm dev script: `npm run dev`. App will be served from `localhost:3000`.

## Cloud.gov Deployment
The app is currently deployed to the `epa-prototyping` org on [Cloud.gov](https://cloud.gov/). The app will eventually be moved to a non-sandbox org w/ three spaces for Development, Staging, and Production. The Development and Staging spaces will be password protected with basic authentication.

**IMPORTANT:** Before deploying code to Cloud.gov, ensure this app has the most recent version of the [epa-avert-webapp's build files](/epa-avert-webapp/build) in this app's [public](/epa-avert-webservice/public) directory.

### Development/Staging Spaces
The development/staging version is exactly the same as the production version, but it requires basic authentication to access the site. From the [epa-avert-webservice directory](/epa-avert-webservice) (this one), in a terminal session enter:    
`cf set-env avert AVERT_AUTH true` and then enter: `cf push`

To view the username and password you’ll need to authenticate with the site, in a terminal session run:    
`cf env avert` and look for the 'User-Provided' `AVERT_USER` and `AVERT_PASS` variables. These can be changed the same way you set the `AVERT_AUTH` environment variable above.

### Production Space
No authentication is needed to access the production app. As with Development/Staging, from the [epa-avert-webservice directory](/epa-avert-webservice) (this one), in a terminal session, enter:    
`cf set-env avert AVERT_AUTH false` and then enter: `cf push`
