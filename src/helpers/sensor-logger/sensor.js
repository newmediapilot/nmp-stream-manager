require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const { fetchSensorData } = require('./helpers/sensor-logger/sensor'); // Import the fetchSensorData method

const app = express();
const PORT = 80; // Local port for your server

// API endpoint to fetch and return the sensor data
app.get('/sensor', async (req, res) => {
    try {
        // Call the fetchSensorData method to get the sensor data
        const sensorData = await fetchSensorData();

        // Send the sensor data as a JSON string response
        res.json(sensorData);
    } catch (error) {
        // Handle errors in fetching sensor data
        console.error('Error in /sensor endpoint:', error.message);
        res.status(500).send('Error fetching sensor data');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
