const app = require('./app');
const connectDB = require('./db');
const http = require('http');
const app = require('./app');  // Importing the Express app
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// You might also handle process-wide events, like uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err);
});

process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection', err);
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
