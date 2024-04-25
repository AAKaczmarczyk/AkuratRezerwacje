const express = require('express');
const db = require('../db'); // Adjust the path as necessary

const router = express.Router();

router.get('/data', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM your_table');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
