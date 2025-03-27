const { db } = require('../../config/firebaseConfig');

const createAgentPortfolio = async(agentID) => {
    try {
        db.collection('portfolio-agents').doc(`${agentID}`).set({
            balance: 1000000,
            stocks: {
                "CYBR" : {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                },
                "EDCI" : {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                }, 
                "EDLK": {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                }, 
                "GTI": {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                },
                "MCRP": {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                },
                "NOVA": {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                }, 
                "STBC": {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
                },
                "VPHM": {
                    quantity: Math.floor(Math.random() * 1000),
                    price: Math.random() * (5000 - 1000) + 1000
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
        const agentIDs = ['mean-reversion-trader', 'breakout-trader', 'contrarian-trader', 'trend-follower-trader'];
        for (const agentID of agentIDs) {
            await createAgentPortfolio(agentID);
        }
        console.log('Agent portfolios created successfully.');
    } catch (err) {
        console.error('Error creating agent portfolio:', err);
    }
};

main();

module.exports = {
    createAgentPortfolio,
    fetchAgentPortfolio
}