const { DataTypes: dt } = require('sequelize');
const sequelize = require('../database/connection');


const Event = sequelize.define('Event', {
  id: {
    type: dt.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: dt.STRING(255),
    allowNull: false
  },
  date: {
    type: dt.DATE,
    allowNull: false
  },
  total_seats: {
    type: dt.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: dt.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  seats_remaining: {
    type: dt.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Event;