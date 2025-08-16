// Load environment variables
require('dotenv').config();
const axios = require('axios');

// Your GoldAPI key from .env
const API_KEY = process.env.GOLDAPI_KEY;

// GoldAPI endpoint
const API_URL = 'https://www.goldapi.io/api/XAU/USD';

// Function to fetch gold price and display signal
async function fetchGoldPrice() {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'x-access-token': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const price = response.data.price;
        console.log(`Gold Price (XAU/USD): $${price.toFixed(2)}`);

        // Simple trading signal logic
        if (price > 2350) {
            console.log('Signal: STRONG SELL');
        } else if (price < 2300) {
            console.log('Signal: STRONG BUY');
        } else {
            console.log('Signal: WAIT');
        }

    } catch (error) {
        console.error('Error fetching gold price:', error.message);
        console.log("NO DATA - DON'T TRADE");
    }
}

// Run once, then every 30 seconds
fetchGoldPrice();
setInterval(fetchGoldPrice, 30000);
