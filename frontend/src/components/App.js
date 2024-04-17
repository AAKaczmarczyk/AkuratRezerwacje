import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import ReservationForm from './Reservations/ReservationForm';
import ReservationList from './Reservations/ReservationList';

const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/reservations/new" component={ReservationForm} />
                <Route path="/reservations" component={ReservationList} />
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
