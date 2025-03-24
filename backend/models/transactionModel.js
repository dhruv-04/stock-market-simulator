const { bigquery } = require('../config/bigqueryConfig');

//create a dataset for transaction history
const createTableTransaction = async(datasetID, tableID) => {
    try {
        const schema = [
            {
                transactionID: {
                    name: 'transactionID',
                    type: 'STRING',
                    mode: 'REQUIRED'
                }
            }, {
                userID: {
                    name: 'userID',
                    type: 'STRING',
                    mode: 'REQUIRED'
                }
            }, {
                transactionType: {
                    name: 'transactionType',
                    type: 'STRING',
                    mode: 'REQUIRED'
                }
            }, {
                stockID: {
                    name: 'stockID',
                    type: 'STRING',
                    mode: 'REQUIRED'
                }
            }, {
                totalAmount: {
                    name: 'totalAmount',
                    type: 'FLOAT',
                    mode: 'REQUIRED'
                }
            }, {
                quantity: {
                    name: 'quantity',
                    type: 'INTEGER',
                    mode: 'REQUIRED'
                }
            }, {
                pricePerStock: {
                    name: 'pricePerStock',
                    type: 'FLOAT',
                    mode: 'REQUIRED'
                }
            }, {
                marketType: {
                    name: 'marketType',
                    type: 'STRING',
                    mode: 'REQUIRED'
                }
            }, {
                timestamp: {
                    name: 'timestamp',
                    type: 'TIMESTAMP',
                    mode: 'REQUIRED'
                }
            }
        ];

        await bigquery.dataset(datasetID).createTable(tableID, { schema });
        console.log(`Table ${tableID} created in dataset ${datasetID}`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = { createTableTransaction };