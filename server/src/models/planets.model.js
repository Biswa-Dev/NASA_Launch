const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../../data/kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    // insert + update = upsert
                    await savePlanets(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const planetsCount = (await getAllPlanets()).length;
                console.log(
                    `${planetsCount} habitable planets found!`
                );
                resolve();
            });
    })
}

async function getAllPlanets() {
    // return habitablePlanets;
    return await planets.find({}, {'_id': 0, '__v': 0});
}

async function savePlanets(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name, // filter
        }, {
            keplerName: planet.kepler_name, // update with if any
        }, {
            upsert: true, // upsert if doesnt match any
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getAllPlanets,
    loadPlanetsData,
}
