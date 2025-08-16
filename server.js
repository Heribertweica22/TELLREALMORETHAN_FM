require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public')); // Serve the public folder

const API_KEY = process.env.GOLDAPI_KEY;
const API_URL = 'https://www.goldapi.io/api/XAU/USD';

// Function to fetch gold price with detailed error logging
async function fetchGoldPrice() {
    try {
        const response = await axios.get(`https://metals-api.com/api/latest`, {
            params: {
                access_key: process.env.METALS_API_KEY,
                base: 'USD',
                symbols: 'XAU' // Gold
            }
        });

        // Convert to price per ounce
        const pricePerOunce = 1 / response.data.rates.XAU;

        let signal;
        if (pricePerOunce > 2350) {
            signal = 'STRONG SELL';
        } else if (pricePerOunce < 2300) {
            signal = 'STRONG BUY';
        } else {
            signal = 'WAIT';
        }

        return { price: pricePerOunce.toFixed(2), signal };

    } catch (error) {
        console.error('Error fetching gold price:', error.response?.data || error.message);
        return { price: 'No Data', signal: "DON'T TRADE" };
    }
}


app.get('/price', async (req, res) => {
    const data = await fetchGoldPrice();
    res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
