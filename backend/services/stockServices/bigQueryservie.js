const { bigquery } = require('../../config/bigqueryConfig');

//create a dataset
const createDataset = async (datasetId) => {
    try {
        const [dataset] = await bigquery.createDataset(datasetId, {
            location: 'asia-south2', //for delhi
        });
        console.log(`Dataset ${dataset.id} created.`);
    } catch (error) {
        console.log(error);
    }
};

//delete a dataset
const deleteDataset = async(datasetID) => {
    try {
        await bigquery.dataset(datasetID).delete({
            force: true
        });
    } catch (error) {
        console.log(error);
    }
};


// const test = async() => {
//     try {
//         const datasets = await bigquery.getDatasets();
//         console.log(datasets);
//     } catch (error) {
//         console.log(error);
//     }
// }

//function to create a table called stockPrices in virtual_Stock_dataset
const createTable = async(datasetID, tableID) => {
    try {
        const schema = [
            {
                name: 'symbol',
                type: 'STRING',
                mode: 'REQUIRED'
            }, {
                name: 'old_price',
                type: 'FLOAT',
                mode: 'REQUIRED'
            }, {
                name: 'new_price',
                type: 'FLOAT',
                mode: 'REQUIRED'
            }, {
                name: 'percentage_change',
                type: 'FLOAT',
                mode: 'REQUIRED'
            }, {
                name: 'timestamp',
                type: 'TIMESTAMP',
                mode: 'REQUIRED'
            }
        ];
        await bigquery.dataset(datasetID).table(tableID).create({
            schema: schema
        });
        console.log(`Table ${tableID} created in dataset ${datasetID}`);
    } catch (err) {
        console.error(`Error creating table : ${err}`);
    }
};


//datasetID for virtual stock market = virtual_stock_data
//tableID for stock prices = stock_prices
//data = [{symbol: 'AAPL', old_price: 150.00, new_price: 155.00, percentage_change: 3.33, timestamp: new Date()}]
//data has to be in the form array of objects
const insertIntoBigQuery = async(datasetID, tableID, data) => {
    try {
        await bigquery.dataset(datasetID).table(tableID).insert(data);
        console.log(`Data inserted in big query at timestamp ${new Date().toISOString() }`);
    } catch (err) {
        console.error(`Error inserting data in big query at timestamp ${new Date().toISOString()}`);
    }
};

module.exports = {
    insertIntoBigQuery,
}




// const data = [
//     { symbol: 'AAPL', old_price: 150.00, new_price: 155.00, percentage_change: 3.33, timestamp: new Date() },
//     { symbol: 'GOOGL', old_price: 2800.00, new_price: 2850.00, percentage_change: 1.79, timestamp: new Date() }
// ];

// insertIntoBigQuery('virtual_stock_data', 'stock_prices', data);

// createTable('virtual_stock_data', 'stock_prices');
// deleteDataset('virtual_stock_data');
// createDataset('virtual_stock_data');
// test();