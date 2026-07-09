const Event = require('../models/Event.model');
const { formatEventResponse } = require('../utils/helper/helpers');


// GET /events
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      attributes: ['id', 'name', 'date', 'total_seats', 'seats_remaining', 'price'],
      order: [['date', 'ASC']]
    });

    const formattedEvents = events.map(event => formatEventResponse(event));

    return res.status(200).json({
      success: true,
      data: formattedEvents
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    next(error);
  }
};

module.exports = {
  getEvents
};

