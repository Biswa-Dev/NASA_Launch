const axios = require('axios');
const launchesDatabase = require('./launches.mongo');
const planetDatabase = require('./planets.mongo');

// const launches = new Map();

// let latestFilghNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100, // flightNumber
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 203'), // date_locale
    target: 'Kepler-442 b', // not applicable
    customers: ['ZTM', 'NASA'], // payload.customers for each payload
    upcoming: true, // upcoming
    success: true, // success
}

// saveLaunchToDB(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLauchesData() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });
    if (response.status !== 200) {
        console.log('Failed to download spaceX launch data!');
        throw new Error('Failed to download spaceX launch data!')
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        // console.log('launchDoc:', launchDoc);
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap(payload => {
            return payload.customers;
        });
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }
        console.log(`${launch.flightNumber}:`, launch);

        await saveLaunchToDB(launch)
    }
}

async function loadLaunchesData() {
    console.log("Downloading launch data...");

    let firstLaunchData = await findOneLaunch({
        flightNumber: 1,
        mission: "FalconSat",
        rocket: "Falcon 1",
    });

    if (firstLaunchData) {
        console.log("Launch data already populated.");
    } else {
        await populateLauchesData();
    }
}

async function findOneLaunch(filter) {
    const launchData = await launchesDatabase.findOne(filter);
    return launchData;
}

// launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId) {
    return await findOneLaunch({ flightNumber: launchId });
}

async function getAllLaunches(limit, skip) {
    // return Array.from(launches.values());
    return await launchesDatabase
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function saveLaunchToDB(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlighNumber() + 1;
    const newLaunchData = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['SpaceX', 'NASA'],
        upcoming: true,
        success: true,
    });
    const isPlanetExist = await planetDatabase.findOne({
        keplerName: newLaunchData.target,
    });
    if (!isPlanetExist) throw new Error('No matching planet found in db!');
    await saveLaunchToDB(newLaunchData);
}

// function addNewLaunch(launch) {
//     latestFilghNumber++;
//     launches.set(
//         latestFilghNumber, 
//         Object.assign(launch, {
//             flightNumber: latestFilghNumber,
//             customer: ['SpaceX', 'NASA'],
//             upcoming: true,
//             success: true,
//         }
//     ));
// }

// function existLaunchWithId(launchId) {
//     return launches.has(launchId);
// }

async function getLatestFlighNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
    return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
    // const abortedMisson = launches.get(launchId);
    // abortedMisson.upcoming = false;
    // abortedMisson.success = false;
    // return abortedMisson;
    const abortedDbRes = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false,
    });

    return abortedDbRes.acknowledged === true && abortedDbRes.modifiedCount === 1;
}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    // existLaunchWithId,
    existsLaunchWithId,
    abortLaunchById,
}