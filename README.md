# EPA's Avoided Emissions and Generation Tool (AVERT)

The AVERT app is composed of two apps working together: a [client app](/client), and [server app](/server).

The client app is a single page JavaScript app, which is ultimately built to static files that are served by the server app on [Cloud.gov](https://cloud.gov/). In addition to serving the client app's static files, the server app is responsible for performing calculations and returning the results of those calculations to the client app. This offloading of the calculations keeps the client app fast and always responsive to user input.

View each app's README files for more info on the individual apps.

## Local Development

Local development uses [Node.js](https://nodejs.org/en/) (v10 or higher is required, but using the latest LTS release is suggested – currently v14).

If this is your first time running AVERT locally, download all dependencies by running:    
`npm run setup`

Running the [client app](/client) locally depends on a running local instance of the [server app](/server). Instead of starting both apps individually, running the following command will start both concurrently:    
`npm start`

The _server app_ will run on port `3001` and the _client app_ will run on port `3000`. Your browser will open the app at http://localhost:3000.

