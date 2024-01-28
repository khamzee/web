const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const travelRoutes = require('./travelRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/travelagency', travelRoutes);

app.get('/travelagency/history/total-cost', (req, res) => {
  const totalCost = calculateTotalCost(); 
  res.send({ totalCost });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const calculateTotalCost = () => {
  const tourHistory = require('./travelRoutes').tourHistory;
  let totalCost = 0;

  tourHistory.forEach(tour => {
    totalCost += tour.tourCost || 0;
  });

  return totalCost;
};
