const { db } = require('../../config/firebaseConfig');

const createAgentPortfolio = async(agentID) => {
    try {
        db.collection('portfolio-agents').doc(`${agentID}`).set({
            balance: 1000000,
            stocks: {
                "CYBR" : {
                    quantity: 0,
                    price: 0
                },
                "EDCI" : {
                    quantity: 0,
                    price: 0
                }, 
                "EDLK": {
                    quantity: 0,
                    price: 0
                }, 
                "GTI": {
                    quantity: 0,
                    price: 0
                },
                "MCRP": {
                    quantity: 0,
                    price: 0
                },
                "NOVA": {
                    quantity: 0,
                    price: 0
                }, 
                "STBC": {
                    quantity: 0,
                    price: 0
                },
                "VPHM": {
                    quantity: 0,
                    price: 0
                }
            },
            lastModified: new Date().toISOString()
        });
    } catch (err) {
        console.log(`Error creating portfolio for agent ${agentID}:`, err);
        throw err;
    }
};

const fetchAgentPortfolio = async(agentID) => {
    try {
        const portfolioDoc = await db.collection('portfolio-agents').doc(agentID).get();
        if (!portfolioDoc.exists) {
            throw new Error(`Portfolio for agent ${agentID} not found`);
        }
        return portfolioDoc.data();
    } catch (err) {
        throw err;
    }
}

const main = async() => {
    try {
        const agentID = 'momentum-trader';
        await createAgentPortfolio(agentID);
    } catch (err) {
        console.error('Error creating agent portfolio:', err);
    }
};

main();

module.exports = {
    createAgentPortfolio,
    fetchAgentPortfolio
}