const bookingQueue = require('../config/queue');
const sequelize = require('../database/connection');
const Booking = require('../models/Booking.model');
const Event = require('../models/Event.model');

console.log('Booking worker started...');

bookingQueue.process(async (job) => {
  const { bookingId, requestId, eventId, seats } = job.data;

  console.log(`Processing booking ${bookingId} for event ${eventId}`);

  // Use transaction to ensure data integrity
  const transaction = await sequelize.transaction();

  try {
    // 1. Get booking with lock
    const booking = await Booking.findByPk(bookingId, {
      transaction,
      lock: true
    });

    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    // Check if already processed
    if (booking.status !== 'PENDING') {
      console.log(`Booking ${bookingId} already processed with status: ${booking.status}`);
      await transaction.rollback();
      return;
    }

    // 2. Get event with row lock (FOR UPDATE)
    const event = await Event.findByPk(eventId, {
      transaction,
      lock: true
    });

    if (!event) {
      throw new Error(`Event ${eventId} not found`);
    }

    // 3. Check seat availability
    if (event.seats_remaining >= seats) {
      // 4. Update event - deduct seats
      await Event.update(
        { seats_remaining: event.seats_remaining - seats },
        { 
          where: { id: eventId },
          transaction 
        }
      );

      // 5. Update booking - CONFIRMED
      await Booking.update(
        { status: 'CONFIRMED' },
        { 
          where: { id: bookingId },
          transaction 
        }
      );

      console.log(`Booking ${bookingId} CONFIRMED. Remaining seats: ${event.seats_remaining - seats}`);

    } else {
      // 6. Not enough seats - mark as FAILED
      const failureReason = `Not enough seats available. Requested: ${seats}, Available: ${event.seats_remaining}`;
      
      await Booking.update(
        { 
          status: 'FAILED',
          failure_reason: failureReason
        },
        { 
          where: { id: bookingId },
          transaction 
        }
      );

      console.log(`Booking ${bookingId} FAILED. Reason: ${failureReason}`);
    }

    // Commit transaction
    await transaction.commit();

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error(`Error processing booking ${bookingId}:`, error);
    throw error; // Bull will retry
  }
});

// Handle queue errors
bookingQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

bookingQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

console.log('Worker is running and listening for jobs...');