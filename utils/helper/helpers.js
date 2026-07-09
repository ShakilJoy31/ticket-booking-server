
// Generate unique booking reference
const generateBookingReference = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${timestamp}-${random}`;
};

// Format event response
const formatEventResponse = (event) => {
  return {
    id: event.id,
    name: event.name,
    date: event.date,
    totalSeats: event.total_seats,
    seatsRemaining: event.seats_remaining,
    price: parseFloat(event.price)
  };
};

// Format booking response
const formatBookingResponse = (booking) => {
  const response = {
    id: booking.id,
    bookingReference: booking.booking_reference,
    eventId: booking.event_id,
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    seats: booking.seats,
    status: booking.status,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at
  };

  if (booking.failure_reason) {
    response.failureReason = booking.failure_reason;
  }

  if (booking.event) {
    response.eventName = booking.event.name;
  }

  return response;
};

module.exports = {
  generateBookingReference,
  formatEventResponse,
  formatBookingResponse
};