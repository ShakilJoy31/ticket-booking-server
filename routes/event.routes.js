const express = require('express');
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controller/event.controller');
const router = express.Router();

// GET /events - Get all events
router.get('/events', getEvents);

// GET /events/:id - Get single event by ID
router.get('/events/:id', getEventById);

// POST /events - Create a new event
router.post('/events', createEvent);

// PUT /events/:id - Update an event
router.put('/events/:id', updateEvent);

// PATCH /events/:id - Partially update an event
router.patch('/events/:id', updateEvent);

// DELETE /events/:id - Delete an event
router.delete('/events/:id', deleteEvent);

module.exports = router;