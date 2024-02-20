const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Ensure you have uuid installed: npm install uuid
const router = express.Router();
const cors = require('cors');
app.use(cors());

// Path to the data file
const DATA_PATH = path.join(__dirname, '..', 'data', 'reservations.json');

// Helper function to read data from the JSON file
function readData() {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
}

// Helper function to write data to the JSON file
function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// This function checks for table availability based on requested seats and time
function checkTableAvailability(requestedSeats, requestedTime) {
    const data = readData();
    let availableTables = data.tables.filter(table => table.seats >= requestedSeats && table.available);

    // Filter out tables already reserved at the requested time
    const reservedTables = data.reservations.filter(reservation =>
        new Date(reservation.time).getTime() === new Date(requestedTime).getTime()
    ).map(reservation => reservation.tableId);

    availableTables = availableTables.filter(table => !reservedTables.includes(table.id));

    return availableTables.length > 0 ? availableTables[0] : null; // Return the first available table or null
}

// Endpoint to list available tables for a given time
router.get('/available-tables', (req, res) => {
    const { date, time } = req.query;
    const availableTables = checkTableAvailability(Number.MAX_SAFE_INTEGER, time); // Check for any seat count
    res.json(availableTables);
});

// Endpoint to create a new reservation
router.post('/', (req, res) => {
    const { customerName, seatsRequired, time } = req.body;
    const table = checkTableAvailability(seatsRequired, time);

    if (!table) {
        return res.status(404).send('No available table for the requested time and seat requirement.');
    }

    const reservationId = uuidv4();
    const data = readData();

    // Update the table's availability
    const tableIndex = data.tables.findIndex(t => t.id === table.id);
    data.tables[tableIndex].available = false;
    data.tables[tableIndex].reservationId = reservationId;

    // Create and add the new reservation
    const newReservation = {
        id: reservationId,
        tableId: table.id,
        customerName,
        time,
        status: 'pending'
    };
    data.reservations.push(newReservation);

    writeData(data);
    res.status(201).json({ message: 'Reservation created', reservationId, tableId: table.id });
});

// Endpoint to update an existing reservation
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { time, seatsRequired } = req.body; // Assuming these might be updated
    const data = readData();

    const reservationIndex = data.reservations.findIndex(reservation => reservation.id === id);
    if (reservationIndex === -1) {
        return res.status(404).send('Reservation not found.');
    }

    // Check if a different table is needed based on the new requirements
    const currentTableId = data.reservations[reservationIndex].tableId;
    const newTable = checkTableAvailability(seatsRequired, time);

    if (!newTable || newTable.id !== currentTableId) {
        return res.status(400).send('No available table for the updated requirements.');
    }

    // Update reservation details
    data.reservations[reservationIndex].time = time;
    // No need to change the tableId or reservationId if the same table is still suitable

    writeData(data);
    res.json({ message: 'Reservation updated', reservationId: id });
});


// Endpoint to cancel a reservation
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    const reservationIndex = data.reservations.findIndex(reservation => reservation.id === id);
    if (reservationIndex === -1) {
        return res.status(404).send('Reservation not found.');
    }

    // Find and update the table associated with the reservation
    const tableIndex = data.tables.findIndex(table => table.reservationId === id);
    if (tableIndex !== -1) {
        data.tables[tableIndex].available = true;
        data.tables[tableIndex].reservationId = null;
    }

    // Remove the reservation
    data.reservations.splice(reservationIndex, 1);
    writeData(data);
    res.status(204).send(); // Successfully deleted
});


module.exports = router;

