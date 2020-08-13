# EPA's Avoided Emissions and Generation Tool (AVERT)

The AVERT app is composed of two apps working together:    
The [client side app](/epa-avert-webapp), and [web server app](/epa-avert-webservice).

The client side app is a single page app ultimately built to static files, which are served by the web server app on [Cloud.gov](https://cloud.gov/). In addition to serving the client side app, the web server app is responsible for performing displacement calculations, and returning that data to the client side app for use in its displayed outputs.

View each app's README for more info on the local development and deployment processes of each app.
