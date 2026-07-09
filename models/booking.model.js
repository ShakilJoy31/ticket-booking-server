const { DataTypes: dt } = require('sequelize');
const Event = require('./Event.model');
const sequelize = require('../database/connection');

const Booking = sequelize.define('Booking', {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  request_id: {
    type: dt.STRING(100),
    allowNull: false,
    unique: true
  },
  booking_reference: {
    type: dt.STRING(50),
    allowNull: false,
    unique: true
  },
  event_id: {
    type: dt.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  customer_name: {
    type: dt.STRING(255),
    allowNull: false
  },
  customer_email: {
    type: dt.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  seats: {
    type: dt.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  status: {
    type: dt.ENUM('PENDING', 'CONFIRMED', 'FAILED'),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  failure_reason: {
    type: dt.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
Booking.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event'
});

Event.hasMany(Booking, {
  foreignKey: 'event_id',
  as: 'bookings'
});

module.exports = Booking;