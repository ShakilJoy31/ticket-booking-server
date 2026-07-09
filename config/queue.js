const Bull = require('bull');
const redis = require('./redis');

const bookingQueue = new Bull('booking-queue', {
  createClient: (type) => {
    switch (type) {
      case 'client':
        return redis;
      case 'subscriber':
        return redis.duplicate();
      case 'bclient':
        return redis.duplicate();
      default:
        return redis;
    }
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

module.exports = bookingQueue;