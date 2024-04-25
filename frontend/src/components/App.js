import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import ReservationForm from './Reservations/ReservationForm';
import ReservationList from './Reservations/ReservationList';

const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route path="/reservations/new" component={ReservationForm} />
                <Route path="/reservations" component={ReservationList} />
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
