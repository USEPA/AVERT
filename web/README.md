# EPA’s Avoided Emissions and Generation Tool (AVERT)

The AVERT app is composed of two apps working together: a [client app](/web/client), and [server app](/web/server).

The client app is a single page JavaScript app, which is ultimately built to static files that are served by the server app on [Cloud.gov](https://cloud.gov/). In addition to serving the client app’s static files, the server app is responsible for performing calculations and returning the results of those calculations to the client app. This offloading of the calculations keeps the client app fast and always responsive to user input.

View each app’s README files for more info on the individual apps.

## Update Process

Documentation on the process for applying annual updates exist for both the [code changes](/web/docs/avert_annual_updates.md) and also as a [high level checklist (PDF)](/web/docs/Checklist_for_AVERT_Web_Edition_updates_08-27-2025.pdf).

## Local Development

Local development uses [Node.js](https://nodejs.org/en/) (v18 or higher).

If this is your first time running AVERT locally, download all dependencies by running:  
`npm run setup`

Running the [client app](/web/client) locally depends on a running local instance of the [server app](/web/server). Instead of starting both apps individually, running the following command will start both concurrently:  
`npm start`

The _server app_ will run on port `3001` and the _client app_ will run on port `3000`. Your browser will open the app at http://localhost:3000.

### Embedded iframe Testing

The deployed Cloud.gov app is displayed in an iframe [on a page in EPA’s AVERT web area](https://www.epa.gov/avert/avert-web-edition). To test and replicate this locally, first run the app as described above, then navigate into the [docs](/web/docs) directory, and start a simple web server from that directory with following command:  
`npx serve --listen 8000`

_(NOTE: port 8000 used because the client app is running on port 3000)._

Then open a web browser to: http://localhost:8000/epa-drupal-iframe-testing to view the AVERT web application, rendered in an iframe on an page that uses [EPA’s Standard Template](https://www.epa.gov/themes/epa_theme/pattern-lab/?p=pages-standalone-template), which resembles EPA’s Drupal template.
