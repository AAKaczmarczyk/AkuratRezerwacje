const express = require('express');
const cors = require('cors');

const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationRoutes);

module.exports = app;
