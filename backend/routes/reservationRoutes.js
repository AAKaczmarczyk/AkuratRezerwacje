const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Reservation routes are working');
});

module.exports = router;
