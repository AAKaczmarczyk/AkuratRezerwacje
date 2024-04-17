import axios from 'axios';

const API_URL = '/api/reservations';

export const fetchReservations = async () => {
    return axios.get(API_URL);
};

export const createReservation = async (reservationData) => {
    return axios.post(API_URL, reservationData);
};
