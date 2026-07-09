# Event Booking System - Server

A robust, production-ready event booking system built with **Node.js (Express.js)**, **MySQL**, and **Redis**. This system handles asynchronous booking processing with Bull queue, prevents overbooking, and ensures data integrity through database transactions and row-level locking.

---

## 🚀 Features

- ✅ **Async Booking Processing** - Fast 202 Accepted response with background queue processing
- ✅ **Overbooking Prevention** - Database row-level locking ensures seat count integrity
- ✅ **Duplicate Request Handling** - Unique requestId constraints prevent duplicate bookings
- ✅ **Real-time Status Updates** - Bookings transition from PENDING → CONFIRMED/FAILED
- ✅ **Event Management** - CRUD operations for events with seat tracking
- ✅ **Comprehensive Filtering** - Paginated bookings with event and status filters
- ✅ **Data Integrity** - ACID transactions with Sequelize and MySQL


---

## 🛠️ Tech Stack

| Technology | Purpose |

| **Node.js + Express.js** | Backend API framework |
| **MySQL** | Primary database |
| **Sequelize** | ORM for database operations |
| **Redis** | Queue backend |
| **Bull** | Queue processing library |
| **Joi** | Request validation |
| **Nodemon** | Development hot-reloading |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://www.mysql.com/downloads/)
- **Redis** (v6 or higher) - [Download for Windows](https://github.com/tporadowski/redis/releases) | [Mac/Linux](https://redis.io/download)
- **npm** or **yarn** (comes with Node.js)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ShakilJoy31/ticket-booking-server.git
cd ticket-booking-system-server (Nevigate to your server project folder)
```

### 2. Install Dependencies

```bash
npm install or npm i
```

### 3. Install Required Packages (if not already installed)

```bash
npm install express cors dotenv mysql2 sequelize bull ioredis joi
npm install -D nodemon
```

---

## 🔧 Environment Setup

### 1. Create `.env` File

Create a `.env` file in the root directory:

```env
DB_DIALECT=mysql
DB_HOST=localhost

# For development
DB_NAME=ticket_booking_system_database 
DB_USER=root
DB_PASSWORD=


```

### 2. Update Database Credentials

Replace `yourpassword` with your actual MySQL root password and update the database name as needed. (You need to do this at the production for production you will ignore this part)

---

## 🗄️ Database Setup

### 1. Create Database

Connect to MySQL and create the database named "ticket_booking_system_database". Please take exactly as it is. 

Then go to "http://localhost/phpmyadmin/index.php?route=/database/structure&db=ticket_booking_system_database" and replace the database. You can find the database (.sql) file at here: 

## 🏃 Running the Application

### 1. Start Redis Server

**On Windows:**
```bash
# Navigate to Redis folder
cd C:\Redis
redis-server.exe
```

**On Mac/Linux:**
```bash
redis-server
```

### 2. Start the Queue Worker (Terminal 1)

```bash
npm run worker
```

You should see:
```
Booking worker started...
Worker is running and listening for jobs...
```

### 3. Start the API Server (Terminal 2)

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ Server running on http://localhost:2000
📋 API endpoints:
   POST /api/bookings - Create booking
   GET  /api/bookings - Get bookings
   GET  /api/events   - Get events
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:2000/api
```

### 1. Create Booking

**Endpoint:** `POST /api/bookings`

**Request Body:**
```json
{
  "requestId": "7f3c2a10-9b1e-4d5a-8c6f-booking-001",
  "eventId": 1,
  "customerName": "Rahim Uddin",
  "customerEmail": "rahim@example.com",
  "seats": 2
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Booking request accepted and is being processed",
  "data": {
    "bookingReference": "BK-MK8X-9A2F",
    "status": "PENDING",
    "requestId": "7f3c2a10-9b1e-4d5a-8c6f-booking-001"
  }
}
```

**Duplicate Request Response:**
```json
{
  "success": true,
  "message": "Duplicate request - returning existing booking",
  "data": {
    "bookingReference": "BK-MK8X-9A2F",
    "status": "CONFIRMED",
    "requestId": "7f3c2a10-9b1e-4d5a-8c6f-booking-001"
  }
}
```

---

### 2. Get All Bookings

**Endpoint:** `GET /api/bookings`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `eventId` | number | Filter by event ID |
| `status` | string | Filter by status (PENDING/CONFIRMED/FAILED) |
| `search` | string | Search by customer name/email |

**Examples:**
```bash
# Get all bookings
GET /api/bookings

# Get confirmed bookings for event 1
GET /api/bookings?eventId=1&status=CONFIRMED

# Paginated results
GET /api/bookings?page=1&limit=5

# Search by customer name
GET /api/bookings?search=Rahim
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookingReference": "BK-MK8X-9A2F",
      "eventId": 1,
      "eventName": "Summer Music Festival 2026",
      "customerName": "Rahim Uddin",
      "customerEmail": "rahim@example.com",
      "seats": 2,
      "status": "CONFIRMED",
      "createdAt": "2026-07-08T15:20:01.000Z",
      "updatedAt": "2026-07-08T15:20:01.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get All Events

**Endpoint:** `GET /api/events`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Summer Music Festival 2026",
      "date": "2026-07-15T18:00:00.000Z",
      "totalSeats": 100,
      "seatsRemaining": 96,
      "price": 49.99
    }
  ]
}
```

---

### 4. Event Management (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

---

## 🔒 How Overbooking is Prevented

### 1. Database Row-Level Locking

When the worker processes a booking, it uses `SELECT ... FOR UPDATE` to lock the event row:

```javascript
const event = await Event.findByPk(eventId, {
  transaction,
  lock: true  // ✅ FOR UPDATE lock
});
```

### 2. ACID Transactions

All seat deductions are wrapped in database transactions:

```javascript
const transaction = await sequelize.transaction();
try {
  // Check availability
  if (event.seats_remaining >= seats) {
    // Deduct seats
    await Event.update(
      { seats_remaining: event.seats_remaining - seats },
      { where: { id: eventId }, transaction }
    );
    // Confirm booking
    await Booking.update(
      { status: 'CONFIRMED' },
      { where: { id: bookingId }, transaction }
    );
  }
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
}
```

### 3. Single Worker Processing

The queue ensures one booking is processed at a time per event, eliminating race conditions:

```
Booking 1 → Check → Deduct → Confirm
Booking 2 → Wait → Check → Deduct → Confirm
Booking 3 → Wait → Check → Fail (sold out)
```

### 4. Unique Constraint on `seats_remaining`

The database ensures `seats_remaining` never goes below 0:

```sql
seats_remaining INT NOT NULL CHECK (seats_remaining >= 0)
```

---

## 🔄 How Duplicate Requests are Handled

### 1. Database Unique Constraint

The `request_id` column has a `UNIQUE` constraint:

```sql
request_id VARCHAR(100) NOT NULL UNIQUE
```

### 2. Pre-Creation Check

Before creating a booking, the system checks if the `requestId` already exists:

```javascript
const existingBooking = await Booking.findOne({
  where: { request_id: requestId }
});

if (existingBooking) {
  return res.status(202).json({
    message: 'Duplicate request - returning existing booking',
    data: {
      bookingReference: existingBooking.booking_reference,
      status: existingBooking.status
    }
  });
}
```

### 3. Flow Diagram

```
User submits booking with requestId
         ↓
Check if requestId exists in database
         ↓
    ┌────┴────┐
    ↓         ↓
  YES        NO
    ↓         ↓
Return      Create new
existing    booking with
booking     PENDING status
            ↓
          Add to queue
            ↓
          Return 202
```

---

## 📁 Project Structure

```
ticket-booking-system-server/
├── app/
│   ├── api.routes.js          # Main route aggregator
│   └── app.js                 # Express app configuration
├── config/
│   ├── queue.js               # Bull queue configuration
│   └── redis.js               # Redis connection
├── controller/
│   ├── booking.controller.js  # Booking CRUD operations
│   └── event.controller.js    # Event CRUD operations
├── database/
│   └── connection.js          # Sequelize database connection
├── middleware/
│   └── validation.js          # Joi request validation
├── models/
│   ├── Booking.model.js       # Booking schema
│   └── Event.model.js         # Event schema
├── routes/
│   ├── booking.routes.js      # Booking endpoints
│   └── event.routes.js        # Event endpoints
├── utils/helper/
│   └── helpers.js             # Utility functions
├── workers/
│   └── booking.worker.js      # Queue worker
├── .env                       # Environment variables
├── server.js                  # Entry point
└── package.json               # Dependencies and scripts
```

---

## 🚀 What Could Be Improved

### 1. Production Enhancements
- **Logging**: Implement structured logging with Winston or Pino
- **Monitoring**: Add health checks and metrics (e.g., Prometheus)
- **Rate Limiting**: Implement API rate limiting to prevent abuse
- **Authentication**: Add JWT-based authentication and authorization

### 2. Code Quality
- **TypeScript**: Migrate to TypeScript for better type safety
- **Testing**: Add unit and integration tests (Jest/Mocha)
- **Error Handling**: More granular error handling and retry strategies

### 3. Architecture
- **Event Sourcing**: Implement event-driven architecture for audit trails
- **Caching**: Add Redis caching for frequently accessed data
- **WebSockets**: Real-time booking status updates via WebSockets

### 4. DevOps
- **Docker**: Add docker-compose.yml for easy setup
- **CI/CD**: Implement CI/CD pipeline for automated deployments
- **Kubernetes**: Container orchestration for scalability

### 5. Features
- **Email Notifications**: Send booking confirmations via email
- **Payment Integration**: Integrate payment gateway (Stripe, PayPal)
- **QR Codes**: Generate QR codes for ticket validation
- **Booking Cancellation**: Allow users to cancel bookings

---

## 🧪 Testing

### Test Overbooking Prevention
```bash
# Try to book all seats
curl -X POST http://localhost:2000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"requestId":"test-1","eventId":1,"customerName":"User1","customerEmail":"user1@example.com","seats":95}'

# Immediately try to book remaining seats
curl -X POST http://localhost:2000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"requestId":"test-2","eventId":1,"customerName":"User2","customerEmail":"user2@example.com","seats":10}'
```

### Test Duplicate Prevention
```bash
# First request
curl -X POST http://localhost:2000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"requestId":"duplicate-test","eventId":1,"customerName":"Test","customerEmail":"test@example.com","seats":2}'

# Duplicate request (same requestId)
curl -X POST http://localhost:2000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"requestId":"duplicate-test","eventId":1,"customerName":"Test2","customerEmail":"test2@example.com","seats":5}'
```

---

## 📝 Postman Collection

### Import Collection

1. Download the Postman collection: [Download Link](#)
2. Import into Postman
3. Set environment variable `BASE_URL` to `http://localhost:2000`

### Sample Requests

| Request | Method | URL | Body |
|---------|--------|-----|------|
| Get Events | GET | `{{BASE_URL}}/api/events` | - |
| Create Booking | POST | `{{BASE_URL}}/api/bookings` | Booking JSON |
| Get Bookings | GET | `{{BASE_URL}}/api/bookings?status=CONFIRMED` | - |
| Search Bookings | GET | `{{BASE_URL}}/api/bookings?search=Rahim` | - |

---

## 🐛 Troubleshooting

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:** Start Redis server:
```bash
redis-server
```

### MySQL Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** Check your `.env` file credentials.

### Worker Not Processing
```
Booking status stays PENDING
```
**Solution:** Start the worker:
```bash
npm run worker
```

---

## 👥 Authors

- **Your Name** - [GitHub Profile](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Bull](https://optimalbits.github.io/bull/)
- [Redis](https://redis.io/)