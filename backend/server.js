const express = require('express');
const cron = require('node-cron'); // Install using: npm install node-cron

const app = express();
const PORT = 3000;

// Example task to be executed by the cron job
const executeCronJob = () => {
    console.log(`Cron job executed at ${new Date().toISOString()}`);
    // Add your logic here (e.g., calling a function, processing data, etc.)
};

// Schedule a cron job to run every 2 minutes
cron.schedule('*/2 * * * *', () => {
    console.log('Running cron job...');
    const { main } = require('./services/agents/geminiAgents');
    executeCronJob();
    main();
});

// Basic route for testing the server
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});