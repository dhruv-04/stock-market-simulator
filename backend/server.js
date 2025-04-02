const express = require('express');
const cron = require('node-cron'); 
const cors = requier('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
const PORT = 3000;

//api to call user order function
app.use('/api/users/orders', require('./routes/userOrderRoutes'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});