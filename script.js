const axios = require('axios');
const fs = require('fs');
const { parse } = require('json2csv');

// SpaceX REST API endpoint
const SPACEX_REST_API = 'https://api.spacexdata.com/v5/launches/latest';
// REST API endpoint
const REST_API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';

// Fetching data from SpaceX REST API
async function fetchLaunches() {
    try {
        const response = await axios.get(SPACEX_REST_API);
        const launch = response.data;
        return [{
            mission_name: launch.name,
            launch_date_local: launch.date_local,
            rocket: { rocket_name: launch.rocket },
        }];
    } catch (error) {
        console.error('Error fetching data from REST API:', error.message);
        throw error;
    }
}

// Post launch details to REST API
async function postLaunchDetails(launch) {
    const payload = {
        title: `${launch.mission_name} Launch`,
        body: `Rocket: ${launch.rocket.rocket_name}, Launch Date: ${launch.launch_date_local}`,
        userId: 1,
    };

    try {
        const response = await axios.post(REST_API_ENDPOINT, payload);
        console.log('POST Response:', response.data);
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            console.error(`Error ${status}: ${error.message}`);
            if (status === 403) {
                console.error('Forbidden: Skipping the request.');
            } else if (status === 500) {
                console.error('Internal Server Error: Retrying with exponential backoff...');
                await retryRequest(() => axios.post(REST_API_ENDPOINT, payload));
            }
        } else {
            console.error('Unexpected error:', error.message);
        }
    }
}

// Retry logic with exponential backoff
async function retryRequest(requestFn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            await requestFn();
            return;
        } catch (error) {
            console.error(`Retry ${i + 1} failed.`);
            await new Promise(resolve => setTimeout(resolve, delay * 2 ** i));
        }
    }
    console.error('All retries failed.');
}

//  Save launches to a CSV file
function saveLaunchesToCSV(launches) {
    const fields = ['mission_name', 'rocket.rocket_name', 'launch_date_local'];
    const opts = { fields };

    try {
        const csv = parse(launches, opts);
        fs.writeFileSync('launches.csv', csv);
        console.log('Launch data saved to launches.csv');
    } catch (error) {
        console.error('Error saving data to CSV:', error.message);
    }
}

//  Automate the workflow
async function main() {
    try {
        // Fetch data from REST API
        const launches = await fetchLaunches();

        // Log fetched data
        console.log('Fetched Launches:', launches);

        // Post details of one launch
        if (launches.length > 0) {
            await postLaunchDetails(launches[0]);
        }

        // Save all launches to CSV
        saveLaunchesToCSV(launches);
    } catch (error) {
        console.error('Workflow failed:', error.message);
    }
}

// Execute the workflow
main();
