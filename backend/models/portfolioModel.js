const { db } = require('../config/firesbaseConfig');    


//real and virtual stocks would be an object with keys as stock symbols and values as objects containing stock details
//stock details would be an object containing stock symbol, quantity, and price
const createDefaultPortfolio = async(uid) => {
    try {
        await db.collection('portfolios').doc(uid).set({
            stocks: {
                "real" : {
                    
                },
                "virtual" : {

                }
            },
            lastModified: new Date().toISOString()
        });
    } catch (error) {
        throw error;
    }
};