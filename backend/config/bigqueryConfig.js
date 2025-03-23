const { BigQuery } = require('@google-cloud/bigquery');
require('dotenv').config();

//initialize BigQuery client
const bigquery = new BigQuery({
    keyFilename: process.env.KEY_FILE
});

// const test = async() => {
//     try {
//         const datasets = await bigquery.getDatasets();
//         console.log(datasets);
//     } catch (error) {
//         console.log(error);
//     }
// }

// test();

module.exports = { bigquery };