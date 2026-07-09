const Event = require('../models/Event.model');
const { formatEventResponse } = require('../utils/helper/helpers');

// GET /events - Get all events
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

// GET /events/:id - Get single event by ID
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      attributes: ['id', 'name', 'date', 'total_seats', 'seats_remaining', 'price']
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const formattedEvent = formatEventResponse(event);

    return res.status(200).json({
      success: true,
      data: formattedEvent
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    next(error);
  }
};

// POST /events - Create a new event
const createEvent = async (req, res, next) => {
  try {
    const { name, date, total_seats, price } = req.body;

    // Validate required fields
    if (!name || !date || !total_seats || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, date, total_seats, price are required'
      });
    }

    // Validate price is not negative
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    // Validate total_seats is at least 1
    if (total_seats < 1) {
      return res.status(400).json({
        success: false,
        message: 'Total seats must be at least 1'
      });
    }

    // Create the event
    const event = await Event.create({
      name,
      date,
      total_seats,
      price,
      seats_remaining: total_seats // Initially, all seats are available
    });

    const formattedEvent = formatEventResponse(event);

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: formattedEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);
    next(error);
  }
};

// PUT /events/:id - Update an event
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, date, total_seats, price } = req.body;

    // Find the event
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Prepare update data
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (date !== undefined) updateData.date = date;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price cannot be negative'
        });
      }
      updateData.price = price;
    }

    // Handle total_seats update with validation
    if (total_seats !== undefined) {
      if (total_seats < 1) {
        return res.status(400).json({
          success: false,
          message: 'Total seats must be at least 1'
        });
      }

      // If total_seats is being reduced, ensure we don't go below booked seats
      if (total_seats < event.total_seats) {
        const bookedSeats = event.total_seats - event.seats_remaining;
        if (total_seats < bookedSeats) {
          return res.status(400).json({
            success: false,
            message: `Cannot reduce total seats below ${bookedSeats} as ${bookedSeats} seats are already booked`
          });
        }
        // Adjust seats_remaining based on the new total
        updateData.seats_remaining = total_seats - bookedSeats;
      } else {
        // If increasing total seats, add to seats_remaining
        const additionalSeats = total_seats - event.total_seats;
        updateData.seats_remaining = event.seats_remaining + additionalSeats;
      }

      updateData.total_seats = total_seats;
    }

    // Update the event
    await event.update(updateData);

    // Fetch the updated event
    const updatedEvent = await Event.findByPk(id, {
      attributes: ['id', 'name', 'date', 'total_seats', 'seats_remaining', 'price']
    });

    const formattedEvent = formatEventResponse(updatedEvent);

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: formattedEvent
    });

  } catch (error) {
    console.error('Error updating event:', error);
    next(error);
  }
};

// DELETE /events/:id - Delete an event
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the event with its bookings
    const event = await Event.findByPk(id, {
      include: [{
        model: Booking,
        as: 'bookings'
      }]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if there are any bookings for this event
    const bookingCount = event.bookings ? event.bookings.length : 0;
    
    if (bookingCount > 0) {
      // Optional: Check if there are any CONFIRMED bookings
      const confirmedBookings = event.bookings.filter(
        booking => booking.status === 'CONFIRMED'
      );
      
      if (confirmedBookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete event with ${confirmedBookings.length} confirmed booking(s). Please cancel all bookings first.`,
          data: {
            total_bookings: bookingCount,
            confirmed_bookings: confirmedBookings.length,
            pending_bookings: bookingCount - confirmedBookings.length
          }
        });
      }

      
      // If there are only PENDING bookings, you might want to allow deletion
      // with automatic cancellation, or you can block deletion entirely
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${bookingCount} existing booking(s). Please cancel all bookings first.`,
        data: {
          total_bookings: bookingCount
        }
      });
    }

    // Delete the event (cascade will handle related bookings if you have cascade delete set up)
    await event.destroy();

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {
        event_id: parseInt(id),
        event_name: event.name
      }
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    next(error);
  }
};
module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};