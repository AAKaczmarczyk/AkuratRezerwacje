require('dotenv').config(); // If using dotenv to load environment variables
const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:"http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Here, you would find or create a user in your database
    // For demonstration, we'll just return the profile
    return done(null, profile);
  }
));

// Serialize user into the sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Simulated "database" for demonstration purposes
let users = [
    { email: 'aleksandraweglersk@wp.pl', password: '123456', userId: 'user-0' }
];
let reservations = [];

app.use(express.json());
app.use(express.static('public'));

// Route to start authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home or to another page
    res.redirect('/');
  });

// Login endpoint
//app.post('/api/login', (req, res) => {
    //const { email, password } = req.body;
    //const user = users.find(user => user.email === email && user.password === password);
    //if (user) {
      //  res.json({ message: "Login successful", user: email });
    //} else {
      //  res.status(401).json({ message: "Invalid credentials" });
    //}
//});

// Signup endpoint
//app.post('/api/signup', (req, res) => {
    //const { email, password } = req.body;
    //if (users.some(user => user.email === email)) {
    //    return res.status(400).json({ message: "User already exists" });
    //}
    //const newUser = { email, password, userId: `user-${users.length}` };
    //users.push(newUser);
    //res.status(201).json({ message: "User created successfully", user: email });
//});

 //Reservations endpoint
app.post('/reservations', (req, res) => {
    const reservationData = req.body;
    const newReservation = { ...reservationData, reservationId: `res-${reservations.length}` };
    reservations.push(newReservation);
    console.log('Creating reservation:', newReservation);
    res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
});

// Available tables endpoint
app.get('/available-tables', (req, res) => {
    // This could be dynamic based on current reservations vs. table capacity
    const response = {
        "tables": [
            { "id": 1, "seats": 10, "available": true, "reservationId": null },
            { "id": 2, "seats": 10, "available": true, "reservationId": null },
            { "id": 3, "seats": 10, "available": true, "reservationId": null },
            { "id": 4, "seats": 4, "available": true, "reservationId": null },
            { "id": 5, "seats": 4, "available": true, "reservationId": null },
            { "id": 6, "seats": 4, "available": true, "reservationId": null },
            { "id": 7, "seats": 4, "available": true, "reservationId": null },
            { "id": 8, "seats": 4, "available": true, "reservationId": null },
            { "id": 9, "seats": 4, "available": true, "reservationId": null },
            { "id": 10, "seats": 2, "available": true, "reservationId": null },
            { "id": 11, "seats": 2, "available": true, "reservationId": null },
            { "id": 12, "seats": 2, "available": true, "reservationId": null },
            { "id": 13, "seats": 2, "available": true, "reservationId": null },
            { "id": 14, "seats": 2, "available": true, "reservationId": null },
            { "id": 15, "seats": 2, "available": true, "reservationId": null },
            { "id": 16, "seats": 1, "available": true, "reservationId": null },
            { "id": 17, "seats": 1, "available": true, "reservationId": null },
            { "id": 18, "seats": 1, "available": true, "reservationId": null },
            { "id": 19, "seats": 1, "available": true, "reservationId": null }
            
        ],
        "reservations": reservations
    };
    res.json(response);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
