# Architecture

![Architecture Diagram](https://github.com/Eastern-Research-Group/EPA-AVERT/blob/master/docs/AVERT%20Architecture.gif)

## Components

- **avert-etl.** Laravel application. This is used to convert the RDF Excel files into JSON files, which can be read by the AVERT Online application. This is used exclusively for local development, and it should be deprecated when Synapse provides the new RDFs in JSON format.
- **avert-ui.** The front-end component, built with React/Redux. This is deployed to the EPA State and Local Energy Resources Microsite, under the AVERT area. It should be provided to EPA as a widget, which they will upload directly to the Drupal server. Once uploaded, the developer should create an iframe within the AVERT microsite that exposes the widget URL. The UI is responsible for accepting user input, calculating EERE values, and then communicating with the microservice to calculate the pollutant avoided emissions.
- **avert-microservice.** The exposed microservice for the calculations backend. This is deployed to a cloud platform, and links to any service workers and the redis backend. Its responsibility is to receive requests from the UI, provide RDF data to the UI, save data to redis, initiate workers, and retrieve jobs from redis.
- **avert-workers.** Scaled workers. These are not exposed to the public, and communicate exclusively with avert-microservice and redis. Avoided emission calculations are performed here. The microservice distributes jobs to workers, providing a job number. The workers pull the data from redis, perform the calculation, then save the transformed data back in redis.
- **redis.** Saves transient data to communicate and queue work for the workers from the microservice, and to save transformed data for the microservice to return to the UI.

## Process

**A.** After the User generates EERE values on Screen 2, they navigate to Screen 3, which initiates the "fetch" functions to the microservice. All 4 pollutants are initiated simultaneously, then the frontend immediately begins polling for finished data.

Relevant function chain:
_(From epa-avert-ui)_

- PanelFooterContainer@onCalculateDisplacement() > actions/index.js@calculateDisplacement > [redux/modules/generation, redux/modules/so2, redux/modules/nox, redux/modules/co2]@fetch{Pollutant}IfNeeded()
- actions/index.js@receiveDisplacement

_(From epa-avert-microservice)_

- app/http/routes.js > app/modules/displacements/index.js@[calculateGeneration, calculateSo2, calculateNox, calculateCo2]

**B.** The microservice parses the JSON body from the UI, which contains information regarding the region and the calculated EERE values from Screen 2. The microservice deposits the EERE values into redis. The job ID generated from saving it into redis is sent back to the client, allowing epa-avert-ui to poll the microservice for finished data.

Relevant function chain:

_(From epa-avert-microservice)_

- app/modules/displacements/index.js@[calculateGeneration, calculateSo2, calculateNox, calculateCo2] > yield redis.set('...')

**C.** The microservice communicates with the workers, hitting the specific calculation endpoint. The worker then finds the job, calculates it using the AVERT engine.

Relevant function chain:

_(From epa-avert-microservice)_

- app/modules/displacements/index.js@[calculateGeneration, calculateSo2, calculateNox, calculateCo2] > const response = yield request(options)

_(From epa-avert-workers)_

- app/modules/jobs/index.js@process > app/modules/jobs/addDisplacementJob@displacementJobs.[calculate_so2,...]

**D.** The worker saves the transformed data back into Redis.

Relevant function chain:

_(From epa-avert-workers)_

- app/modules/jobs/index.js@process > app/modules/jobs/addDisplacementJob@displacementJobs.[calculate_so2,...] > yield redis.set('job:' + id, JSON.stringify(data)); / return done && done()

**E.** avert-ui polls the microservice every 30 seconds. THe microservice checks the status of the requested job, then returns 'in progress' if it's still working, or 'ok' if it's done. If the process is complete, avert-ui stops polling the service, prepares the data for visualization, and increments the progress bar.

Relevant function chain:

_(From epa-avert-microservice)_

- app/modules/jobs/index.js@get
