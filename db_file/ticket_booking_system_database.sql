-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 12:02 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ticket_booking_system_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `request_id` varchar(100) NOT NULL,
  `booking_reference` varchar(50) NOT NULL,
  `event_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `seats` int(11) NOT NULL,
  `status` enum('PENDING','CONFIRMED','FAILED') NOT NULL DEFAULT 'PENDING',
  `failure_reason` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `request_id`, `booking_reference`, `event_id`, `customer_name`, `customer_email`, `seats`, `status`, `failure_reason`, `created_at`, `updated_at`) VALUES
(1, '7f3c2a10-9b1e-4d5a-8c6f-booking-001', 'BK-MRC852PS-JOK9', 1, 'Rahim Uddin', 'rahim@example.com', 2, 'PENDING', NULL, '2026-07-08 15:20:01', '2026-07-08 15:20:01'),
(2, '7f3c2a10-9b1e-4d5a-8c6f-booking-002', 'BK-MRCBZVES-FR1X', 1, 'Rahim Vai', 'rahimvai@example.com', 2, 'CONFIRMED', NULL, '2026-07-08 17:07:56', '2026-07-08 17:07:56'),
(3, '7f3c2a10-9b1e-4d5a-8c6f-booking-003', 'BK-MRCC49GP-DO41', 1, 'Rahim Miya', 'rahimmiya@example.com', 2, 'CONFIRMED', NULL, '2026-07-08 17:11:21', '2026-07-08 17:11:21'),
(4, '7f3c2a10-9b1e-4d5a-8c6f-booking-004', 'BK-MRD1TJHZ-FXND', 2, 'Rahim Molla', 'rahimmiya12@example.com', 3, 'CONFIRMED', NULL, '2026-07-09 05:10:51', '2026-07-09 05:10:51'),
(5, 'booking-mrd2sqib-rvs0vh', 'BK-MRD2TTQY-T8OV', 1, 'Hashmot', 'hashmot@gmail.com', 3, 'CONFIRMED', NULL, '2026-07-09 05:39:04', '2026-07-09 05:39:04'),
(6, 'booking-mrd2w0sj-ax7nd7', 'BK-MRD2WMRI-WXDO', 1, 'asdf', 'asdf@gmail.com', 1, 'CONFIRMED', NULL, '2026-07-09 05:41:15', '2026-07-09 05:41:15'),
(7, 'booking-mrd79r8m-38cwlw', 'BK-MRD7AR0J-7FD9', 1, 'dgfhfdg', 'sdgh@gmail.com', 1, 'CONFIRMED', NULL, '2026-07-09 07:44:12', '2026-07-09 07:44:12'),
(8, 'booking-mrd7fhgu-354w42', 'BK-MRD7G4F5-OQQH', 1, 'dsa', 'asdf@gmail.com', 1, 'CONFIRMED', NULL, '2026-07-09 07:48:23', '2026-07-09 07:48:23'),
(9, 'booking-mrd7kezp-dv7jxd', 'BK-MRD7KTIW-HZXX', 4, 'fdsg', 'sdfg@gmail.com', 10, 'CONFIRMED', NULL, '2026-07-09 07:52:02', '2026-07-09 07:52:02'),
(10, 'booking-mrd88c72-ajz2vv', 'BK-MRD89BGW-41OR', 2, 'Shakil', 'shakil@gmail.com', 4, 'CONFIRMED', NULL, '2026-07-09 08:11:05', '2026-07-09 08:11:05'),
(11, 'booking-mrd8mdie-s8g9p3', 'BK-MRD8MSMQ-X0JC', 2, 'asfg', 'dsfg@gmail.com', 3, 'CONFIRMED', NULL, '2026-07-09 08:21:33', '2026-07-09 08:21:33');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `total_seats` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `seats_remaining` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `date`, `total_seats`, `price`, `seats_remaining`, `created_at`, `updated_at`) VALUES
(1, 'Summer Music Festival 2026', '2026-07-15 18:00:00', 100, 49.99, 90, '0000-00-00 00:00:00', '2026-07-09 07:48:23'),
(2, 'Tech Conference 2026', '2026-08-20 09:00:00', 50, 199.00, 40, '0000-00-00 00:00:00', '2026-07-09 08:21:33'),
(3, 'Comedy Night Special', '2026-09-05 20:00:00', 30, 25.50, 30, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 'Movie', '2026-07-08 19:38:00', 100, 120.00, 90, '2026-07-09 07:38:47', '2026-07-09 07:52:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `request_id` (`request_id`),
  ADD UNIQUE KEY `booking_reference` (`booking_reference`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
