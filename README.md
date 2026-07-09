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

If you visit this drive link you will be able to see a video where I have shown how to run the backend from starting to end. Please follow the link below: 

https://drive.google.com/drive/folders/1CLmq3E1QIrFq60HV5QoKPjJyvGzukx_v?usp=sharing

Or let me guide you how to start the server. Please follow the steps below: 

### 1. Clone the Repository first. 

Open cmd and run 

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
Paste the above database credentials. 

### 2. Update Database Credentials

Replace `yourpassword` with your actual MySQL root password and update the database name as needed. (You need to do this at the production for development you will ignore this part)

---

## 🗄️ Database Setup

### 1. Create Database

Connect to MySQL and create the database named "ticket_booking_system_database". Please take database name exactly as it is. 

Then go to "http://localhost/phpmyadmin/index.php?route=/database/structure&db=ticket_booking_system_database" and replace with my database. You can find the database (.sql) file at here: https://github.com/ShakilJoy31/ticket-booking-server/tree/main/db_file then please take the sql file from there. Since you already have my project so go to db_file folder and take ticket_booking_system_database.sql file and import at your newly created database. 

## 🏃 Running the Application

### 1. Start Redis Server first. 

**On Windows:** 
1. First you need to download radis from: https://github.com/tporadowski/redis/releases/tag/v5.0.14.1 you need to download: 
Feb 17, 2022 Source code (zip) [Ok, let me share the zip too at db_file folder for you. Check db_file folder you will find the zip along with ticket_booking_system_database.sql file]
2. Extract the filed to your drive (Where ever you want)
3. Nevigate to that extracted folder and open cmd to that particular folder. 
4. Run redis-server.exe on the cmd interface. 
5. you will be able to see this: 

[3252] 09 Jul 16:16:47.697 # Server initialized
[3252] 09 Jul 16:16:47.697 * DB loaded from disk: 0.001 seconds
[3252] 09 Jul 16:16:47.697 * Ready to accept connections

Thus Redis is succfully running. 



### 2. Start the Queue Worker (Terminal 1)

```bash 
1. Open terminal for the project. 
npm run worker
```

You should see:
```
Booking worker started...
Worker is running and listening for jobs...
```

### 3. Start the API Server (Terminal 2)

```bash
1. Run another terminal for the project. 
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

## 👥 Authors

- **Shakidul Islam Shakil** - [GitHub Profile](https://github.com/ShakilJoy31)

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Bull](https://optimalbits.github.io/bull/)
- [Redis](https://redis.io/)


