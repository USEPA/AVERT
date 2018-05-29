# EPA AVERT Web Service

Node.js web service (built with Koa) for performing displacement calculations and serving the built static content of the avert web app.

## Local Development
Local development depends on `node` (version 8 or higher).

Open two separate terminal sessions and run the following in each subsequent session:
1. From the [epa-avert-webservice directory](/epa-avert-webservice) (this one), start the npm dev script: `npm run dev`.
2. From the [epa-avert-webapp directory](/epa-avert-webapp) (up a level), start the npm start script: `npm start`. App will be served from `localhost:3000`.

## Cloud.gov Deployment
Four environment variables are set in Cloud.gov (three specific to the AVERT app):
- `OPTIMIZE_MEMORY`: `true` (not AVERT specific, but [recommended for node apps](https://docs.cloudfoundry.org/buildpacks/node/node-tips.html#-low-memory-environments))
- `AVERT_AUTH`: `true` or `false`
- `AVERT_USER`: (any string)
- `AVERT_PASS`: (any string)

The app is currently deployed to the `epa-prototyping` org on [Cloud.gov](https://cloud.gov/). In production, the app will be deployed to a non-sandbox org. The development app is password protected with basic authentication.

**IMPORTANT:** Before deploying code to Cloud.gov, ensure the app has the most recent version of the webapp's build files. See: [epa-avert-webapp's Cloud.gov Deployment](/epa-avert-webapp#cloudgov-deployment).

### Development Deployment
The development version is exactly the same as the production version, but is password protected with basic authentication. Ensure you're in this directory ([epa-avert-webservice](/epa-avert-webservice)) in a terminal session and enter:    
`cf set-env avert AVERT_AUTH true` and then: `cf push`

To view the previously-set username and password required for viewing the development site, in a terminal session run:    
`cf env avert` and look for the 'User-Provided' `AVERT_USER` and `AVERT_PASS` variables. These can be changed the same way you set the `AVERT_AUTH` environment variable above.

### Production Deployment
No authentication is needed to access the production app. As with the development instructions above, ensure you're in this directory ([epa-avert-webservice](/epa-avert-webservice)) in a terminal session and enter:    
`cf set-env avert AVERT_AUTH false` and then: `cf push`
