const express = require('express');
const axios = require('axios');
const path = require('path');

const router = express.Router();
router.use(express.static(path.resolve()));
let tourHistory = [];

const calculateTourCost = (destination, hotel, adults, children) => {
  const destinationCosts = {
    'Paris': 1000,
    'Rome': 1200,
    'Tokyo': 1500,
    'Bali': 800,
    'Cancun': 1200,
    'Astana': 1000,
  };

  const baseCost = destinationCosts[destination] || 1000;
  const hotelCost = 100 * adults;
  const childrenCost = 50 * children;

  return baseCost + hotelCost + childrenCost;
};

router.route('/')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'travelagency.html'));
  })
  .post(async (req, res) => {
    const { tour, hotel, carRental, arrivalDate, departureDate, adults, children, } = req.body;

    const weatherApiResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=89feff0f3b904daa98b82415241901&q=${tour}`);
    const tourCost = calculateTourCost(tour, hotel, adults, children);
    const weather = weatherApiResponse.data.current.condition.text;
    const timestamp = new Date().toLocaleString();

    tourHistory.push({ tour, hotel, carRental, arrivalDate, departureDate, adults, children,tourCost,weather, timestamp });

    res.redirect('/travelagency.html/history.html'); 
  });

router.get('/history', (req, res) => {
  res.send({ history: tourHistory });
});

module.exports = router;
