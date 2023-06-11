const {
    getAllLaunches,
    addNewLaunch,
    scheduleNewLaunch,
    // existLaunchWithId,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');
const getPaginationSkipAndLimit = require('../../services/queryPagination.servic');

async function httpGetAllLaunches(req, res) {
    const { count, page } = req.query;
    const {skip, limit} = getPaginationSkipAndLimit(count, page);
    return res.status(200).json(await getAllLaunches(limit, skip));
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({
            error: 'Missing required property for launch',
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }
    // addNewLaunch(launch);
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    // if(!existLaunchWithId(launchId)) {
    const isLaunchExist = await existsLaunchWithId(launchId);
    if (!isLaunchExist) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    }
    const abortedMisson = await abortLaunchById(launchId);
    if (!abortedMisson) {
        return res.status(400).json({
            errorCode: 0,
            errorMsg: "Launch abortion failed!",
        });
    }
    return res.status(200).json({
        errorCode: 1,
        errorMsg: "Launch aborted successfully.",
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}