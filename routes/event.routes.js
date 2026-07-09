const express = require('express');
const { getEvents } = require('../controller/event.controller');
const router = express.Router();


// GET /events
router.get('/events', getEvents);

module.exports = router;