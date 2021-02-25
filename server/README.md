# EPA AVERT Web Service

Node.js web service (built with Koa) for performing displacement calculations and serving the built static content of the avert web app.

## Local Development

Though you can run the **server app** indepdently of the **client app**, you’ll usually be working on them both together. Please view the 'Local Development' section of the [repository’s README](../README.md) to get started.

## Cloud.gov Deployment

Four environment variables are set in Cloud.gov (three specific to the AVERT app):
- `OPTIMIZE_MEMORY`: `true` (not AVERT specific, but [recommended for node apps](https://docs.cloudfoundry.org/buildpacks/node/node-tips.html#-low-memory-environments))
- `AVERT_AUTH`: `true` or `false`
- `AVERT_USER`: (any string)
- `AVERT_PASS`: (any string)

The app is currently deployed to the `epa-avert` org on [Cloud.gov](https://cloud.gov/). The development app is in the `avert-dev` space, and the production app in in the `avert-prod` space. The deployed development app is password protected with basic authentication to view the page. The deployed production app requires no authentication to view the page.

**IMPORTANT:** Before deploying code to Cloud.gov, ensure the app has the most recent version of the client app’s build files. See: [client app’s Cloud.gov Deployment](/client#cloudgov-deployment).

### Development Deployment

First, see **IMPORTANT** note above.

The development version is exactly the same as the production version, but is password protected with basic authentication. Ensure you’re in this directory ([server](/server)) and run:    
`cf set-env avert-dev AVERT_AUTH true` and then: `cf push -f manifest.dev.yml`

To view the previously-set username and password required for viewing the development version of the app, run: `cf env avert` and look for the 'User-Provided' `AVERT_USER` and `AVERT_PASS` variables. These can be changed the same way you set the `AVERT_AUTH` environment variable above.

### Production Deployment

First, see **IMPORTANT** note above.

No authentication is needed to view the deployed production page. As with the development instructions above, ensure you’re in this directory ([server](/server)) and run:    
`cf set-env avert AVERT_AUTH false` and then: `cf push`
