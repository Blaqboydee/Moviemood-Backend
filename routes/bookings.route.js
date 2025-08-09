// routes/booking.routes.js
const express = require('express');
const Bookingrouter = express.Router();
const { 
  Bookseats, 
  getUserBookings, 
  getBookingById, 
  cancelBooking, 
  getAvailableSeats 
} = require('../controllers/Booking.controller');

Bookingrouter.post('/book', Bookseats);
Bookingrouter.get('/user/:userEmail', getUserBookings);
Bookingrouter.get('/:bookingId', getBookingById);
Bookingrouter.put('/cancel/:bookingId', cancelBooking);
Bookingrouter.get('/available-seats/:showtimeId', getAvailableSeats);

module.exports = Bookingrouter;