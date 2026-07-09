const express = require('express');
const router = require("express").Router();

// Import routes
const bookingRoutes = require('../routes/booking.routes');
const eventRoutes = require('../routes/event.routes');

// Use routes
router.use('/api', bookingRoutes);
router.use('/api', eventRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;