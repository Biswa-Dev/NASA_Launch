const express = require('express');
const versionPaths = require('./vPaths');
const planetsRouter = require('../routes/planets/planets.router');
const launchesRouter = require('../routes/launches/launches.router');

const apiV1 = express.Router();

apiV1.use(`${versionPaths.v1}/planets`, planetsRouter);
apiV1.use(`${versionPaths.v1}/launches`, launchesRouter);

module.exports = apiV1;
