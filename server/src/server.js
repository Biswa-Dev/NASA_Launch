require('dotenv').config();
const http = require('http');
const app = require('./app');
const { mongoConnect } = require('./services/mongoConnection.service');
const { loadLaunchesData } = require('./models/launches.model');
const { loadPlanetsData } = require('./models/planets.model');


const PORT = process.env.PORT;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadLaunchesData();
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Server listening to port ${PORT}`);
    });
}

startServer();