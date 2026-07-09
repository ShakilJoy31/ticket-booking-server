const Booking = require('../models/Booking.model');
const Event = require('../models/Event.model');
const { Op } = require('sequelize');
const { generateBookingReference, formatBookingResponse } = require('../utils/helper/helpers');
const bookingQueue = require('../config/queue');

// POST /bookings
const createBooking = async (req, res, next) => {
  try {
    const { requestId, eventId, customerName, customerEmail, seats } = req.body;

    // Check if requestId already exists (duplicate check)
    const existingBooking = await Booking.findOne({
      where: { request_id: requestId }
    });

    if (existingBooking) {
      // Return existing booking if found
      const bookingData = await Booking.findOne({
        where: { request_id: requestId },
        include: [{
          model: Event,
          as: 'event',
          attributes: ['name']
        }]
      });

      return res.status(202).json({
        success: true,
        message: 'Duplicate request - returning existing booking',
        data: {
          bookingReference: bookingData.booking_reference,
          status: bookingData.status,
          requestId: bookingData.request_id
        }
      });
    }

    // Check if event exists and has seats
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Validate seat availability (quick check)
    if (event.seats_remaining < seats) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Generate booking reference
    const bookingReference = generateBookingReference();

    // Create booking with PENDING status
    const booking = await Booking.create({
      request_id: requestId,
      booking_reference: bookingReference,
      event_id: eventId,
      customer_name: customerName,
      customer_email: customerEmail,
      seats: seats,
      status: 'PENDING'
    });

    // Add job to queue for processing
    await bookingQueue.add({
      bookingId: booking.id,
      requestId: requestId,
      eventId: eventId,
      seats: seats
    });

    // Return 202 Accepted with booking reference
    return res.status(202).json({
      success: true,
      message: 'Booking request accepted and is being processed',
      data: {
        bookingReference: bookingReference,
        status: 'PENDING',
        requestId: requestId
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    next(error);
  }
};

// GET /bookings
const getBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, eventId, status, search } = req.query;

    const whereClause = {};
    
    if (eventId) {
      whereClause.event_id = eventId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    // ✅ Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_email: { [Op.like]: `%${search}%` } },
        { booking_reference: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [{
        model: Event,
        as: 'event',
        attributes: ['name', 'date']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    const formattedBookings = bookings.map(booking => formatBookingResponse(booking));

    return res.status(200).json({
      success: true,
      data: formattedBookings,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings
};

