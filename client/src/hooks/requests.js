const baseUrl = 'http://localhost:8000/v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  let planetsRes = await fetch(`${baseUrl}/planets`);
  console.log(planetsRes);
  return await planetsRes.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const launchesRes = await fetch(`${baseUrl}/launches`);
  console.log(launchesRes);
  const launchesResObj = await launchesRes.json();
  return launchesResObj.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  });
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch(`${baseUrl}/launches`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    }
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${baseUrl}/launches/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};