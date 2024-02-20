document.addEventListener('DOMContentLoaded', function() {
    // Other event listeners...

    const googleLoginButton = document.getElementById('googleLoginButton');
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', function() {
            window.location.href = '/auth/google';
        });
    }

    // Existing code for handling form submissions and other interactions...
});

// Utility functions for validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length > 6;
}

// Placeholder function for login logic
function loginUser(email, password) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Login successful:', data);
        window.location.href = '/reservation-panel'; // Redirect on successful login
        // Now the modal is closed only after successful login
        var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('Failed to login. Please check your credentials.');
    });

    document.getElementById('reservation-section').style.display = 'block';
    // Close modal using Bootstrap's JavaScript
    var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
}

function fetchAvailableTables() {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const time = new Date().toISOString(); // Get current time

    fetch(`/available-tables?date=${date}&time=${time}`)
    .then(response => response.json())
    .then(data => {
        const tablesContainer = document.getElementById('available-tables');
        tablesContainer.innerHTML = ''; // Clear previous results

        if (data.tables && Array.isArray(data.tables)) {
            data.tables.forEach(table => {
                const tableElement = document.createElement('div');
                tableElement.classList.add('alert', 'alert-info');
                tableElement.textContent = `Table for ${table.seats} people`;
                tablesContainer.appendChild(tableElement);
            });
        } else {
            console.error('Expected an array of tables, received:', data);
        }
    })
    .catch(error => console.error('Error fetching available tables:', error));
}

// Adding event listener for the signup form
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    if(signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            if (validateEmail(email) && validatePassword(password)) {
                createUser(email, password);
            } else {
                alert("Please enter a valid email and a password longer than 6 characters.");
            }
        });
    }

    // Signup form logic here (similar structure to login form)
function createUser(email, password) {
    // Additional data might be required for account creation
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Sign up failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Account created successfully:', data);
        // Optionally log the user in directly or redirect to the login page
        window.location.href = '/login'; // Adjust as needed
    })
    .catch(error => {
        console.error('Error during sign up:', error);
        alert('Failed to create an account. Please try again.');
    });
}

    // Reservation form submission
    document.getElementById('reservation-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            customerName: document.getElementById('customerName').value,
            seatsRequired: document.getElementById('seatsRequired').value,
            time: document.getElementById('time').value,
        };

        fetch('/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            alert('Reservation successful!');
            fetchAvailableTables(); // Refresh the list of available tables
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to make reservation.');
        });
    });

    // Fetch available tables on page load
    fetchAvailableTables();
});
