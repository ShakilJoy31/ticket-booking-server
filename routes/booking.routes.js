const express = require('express');
const router = express.Router();

const { 
  validateBooking, 
  validateBookingQuery 
} = require('../middleware/validation');
const { createBooking, getBookings } = require('../controller/booking.controller');

// POST /bookings
router.post('/bookings', validateBooking, createBooking);

// GET /bookings
router.get('/bookings', validateBookingQuery, getBookings);

module.exports = router;