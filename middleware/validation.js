const Joi = require('joi');

// Validate create booking request
const validateBooking = (req, res, next) => {
  const schema = Joi.object({
    // ✅ Change from .uuid() to just string
    requestId: Joi.string().min(5).max(100).required(),
    eventId: Joi.number().integer().min(1).required(),
    customerName: Joi.string().min(2).max(255).required(),
    customerEmail: Joi.string().email().required(),
    seats: Joi.number().integer().min(1).max(10).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message)
    });
  }
  next();
};

// Validate query params for bookings
const validateBookingQuery = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    eventId: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid('PENDING', 'CONFIRMED', 'FAILED').optional()
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message)
    });
  }
  req.query = value;
  next();
};

module.exports = {
  validateBooking,
  validateBookingQuery
};