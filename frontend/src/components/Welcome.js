import React from 'react';
import '/frontend/src/styles/WelcomeStyles.css';

const Welcome = () => {
    const handleLogin = () => {
        // Redirect user to the backend Google Auth route
        window.location.href = '/auth/google';
    };

    return (
        <div className="welcome">
            <h1>Witamy w Akurat Rezerwacje!</h1>
            <button onClick={handleLogin} className="loginButton">
                Login with Google
            </button>
        </div>
    );
};

export default Welcome;
