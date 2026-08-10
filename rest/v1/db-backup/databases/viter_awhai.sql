-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2026 at 01:12 AM
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
-- Database: `viter_awhai`
--

-- --------------------------------------------------------

--
-- Table structure for table `awhai_booking`
--

CREATE TABLE `awhai_booking` (
  `booking_aid` int(11) NOT NULL,
  `booking_is_active` tinyint(1) NOT NULL,
  `booking_id` varchar(20) NOT NULL,
  `booking_status` varchar(20) NOT NULL,
  `booking_client_first_name` varchar(255) NOT NULL,
  `booking_client_last_name` varchar(255) NOT NULL,
  `booking_client_email` varchar(255) NOT NULL,
  `booking_client_phone` varchar(255) NOT NULL,
  `booking_schedule_id` int(11) NOT NULL,
  `booking_schedule_start_date` varchar(20) NOT NULL,
  `booking_schedule_end_date` varchar(20) NOT NULL,
  `booking_practitioner_id` int(11) NOT NULL,
  `booking_practitioner_first_name` varchar(255) NOT NULL,
  `booking_practitioner_last_name` varchar(255) NOT NULL,
  `booking_practitioner_email` varchar(255) NOT NULL,
  `booking_services_id` int(11) NOT NULL,
  `booking_services_name` varchar(128) NOT NULL,
  `booking_remarks` text NOT NULL,
  `booking_created` datetime NOT NULL,
  `booking_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_booking`
--

INSERT INTO `awhai_booking` (`booking_aid`, `booking_is_active`, `booking_id`, `booking_status`, `booking_client_first_name`, `booking_client_last_name`, `booking_client_email`, `booking_client_phone`, `booking_schedule_id`, `booking_schedule_start_date`, `booking_schedule_end_date`, `booking_practitioner_id`, `booking_practitioner_first_name`, `booking_practitioner_last_name`, `booking_practitioner_email`, `booking_services_id`, `booking_services_name`, `booking_remarks`, `booking_created`, `booking_datetime`) VALUES
(1, 1, '176630768725', '5', 'cyrene', 'lumabas', 'cyrenemlumabas@gmail.com', '09865321475', 4, '2025-12-24 13:00:00', '2025-12-24 15:30:00', 2, 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 5, 'Life Coaching', '', '2025-12-21 17:01:27', '2025-12-21 19:18:16'),
(2, 1, '176630959825', '4', 'cyrene', 'lumabas', 'cyrenemlumabas@gmail.com', '098745632145', 3, '2025-12-24 11:00:00', '2025-12-24 13:00:00', 2, 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 5, 'Life Coaching', 'asas', '2025-12-21 17:33:18', '2025-12-29 08:47:45'),
(3, 1, '176631094025', '5', 'Jane', 'doe', 'cyrenemlumabas@gmail.com', '09687456321', 4, '2025-12-24 13:00:00', '2025-12-24 15:30:00', 2, 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 5, 'Life Coaching', '', '2025-12-21 17:55:40', '2025-12-21 19:18:16'),
(4, 1, '176632159925', '1', 'ronaldo', 'lumabas', 'cyrenemlumabas@gmail.com', '09874563214', 5, '2025-12-21 15:00:00', '2025-12-21 16:00:00', 2, 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 5, 'Life Coaching', 'test', '2025-12-21 20:53:19', '2025-12-21 20:53:19'),
(6, 1, '176638441725', '5', 'cyrene', 'lumabas', 'cyrenemlumabas@gmail.com', '098746311', 4, '2025-12-24 13:00:00', '2025-12-24 15:00:00', 2, 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 5, 'Life Coaching', '', '2025-12-22 14:20:17', '2025-12-22 14:21:58'),
(7, 1, '176645074025', '1', 'cyrene', 'lumabas', 'cyrenemlumabas@gmail.com', '098745632123', 2, '2025-12-24 09:00:00', '2025-12-24 11:00:00', 2, 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 5, 'Life Coaching', '', '2025-12-23 08:45:40', '2025-12-23 08:45:40');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_category`
--

CREATE TABLE `awhai_category` (
  `category_aid` int(11) NOT NULL,
  `category_is_active` tinyint(1) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_description` varchar(200) NOT NULL,
  `category_created` datetime NOT NULL,
  `category_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_category`
--

INSERT INTO `awhai_category` (`category_aid`, `category_is_active`, `category_name`, `category_description`, `category_created`, `category_updated`) VALUES
(6, 1, 'Courses', 'Courses', '2025-11-13 08:20:33', '2025-11-13 12:31:01'),
(9, 1, 'Healing', 'Healing', '2025-11-13 12:31:19', '2025-11-24 10:24:20'),
(10, 1, 'Coaching', 'Coaching', '2025-11-13 12:31:34', '2025-11-13 12:31:34');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_practitioner`
--

CREATE TABLE `awhai_practitioner` (
  `practitioner_aid` int(11) NOT NULL,
  `practitioner_is_active` tinyint(1) NOT NULL,
  `practitioner_first_name` varchar(128) NOT NULL,
  `practitioner_last_name` varchar(128) NOT NULL,
  `practitioner_middle_name` varchar(128) NOT NULL,
  `practitioner_email` varchar(200) NOT NULL,
  `practitioner_phone` varchar(200) NOT NULL,
  `practitioner_services_id` varchar(20) NOT NULL,
  `practitioner_services_name` varchar(100) NOT NULL,
  `practitioner_rate` varchar(50) NOT NULL,
  `practitioner_photo` text NOT NULL,
  `practitioner_remarks` text NOT NULL,
  `practitioner_country_id` varchar(20) NOT NULL,
  `practitioner_country` varchar(128) NOT NULL,
  `practitioner_created` datetime NOT NULL,
  `practitioner_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_practitioner`
--

INSERT INTO `awhai_practitioner` (`practitioner_aid`, `practitioner_is_active`, `practitioner_first_name`, `practitioner_last_name`, `practitioner_middle_name`, `practitioner_email`, `practitioner_phone`, `practitioner_services_id`, `practitioner_services_name`, `practitioner_rate`, `practitioner_photo`, `practitioner_remarks`, `practitioner_country_id`, `practitioner_country`, `practitioner_created`, `practitioner_updated`) VALUES
(2, 1, 'Luke', 'Rubico', 'Macandili', 'cyrene.lumabas@frontlinebusiness.com.ph', '90909909666', '3', 'Exercises', '0.00', '', 'ccccccc', '2', 'russiasss', '2025-11-12 09:15:29', '2025-12-21 17:35:59'),
(15, 1, 'aaa', 'aaa', '', 'wewe@gmail.com', '9865325412', '', '', '100.00', '', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos non id dolorem nesciunt nemo similique fugiat et, voluptatum reprehenderit harum est veniam sit recusandae asperiores eaque veritatis quiaLorem ipsum dolor sit amet consectetur adipisicing elit. Quos non id dolorem nesciunt nemo similique fugiat et, voluptatum reprehenderit harum est veniam sit recusandae asperiores eaque veritatis quia quod illo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos non id dolorem nesciunt nemo similique fugiat et, voluptatum reprehenderit harum est veniam sit recusandae asperiores eaque veritatis quia quod illo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos non id dolorem nesciunt nemo similique fugiat et, voluptatum reprehenderit harum est veniam sit recusandae asperiores eaque veritatis quia quod illo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos non id dolorem nesciunt nemo similique fugiat et, voluptatum reprehenderit harum est veniam sit recusandae asperiores eaque veritatis quia quod illo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos non id dolorem nesciunt nemo similique fugiat et, voluptatum reprehenderit harum est veniam sit recusandae asperiores eaque veritatis quia quod illo?', '2', 'russiasss', '2025-12-18 09:08:32', '2025-12-22 07:47:49'),
(16, 1, 'ad', 'asd', 'ad', 'cyrenemlumabas@gmail.com', '32323232', '', '', '1.00', '', 'asdasd', '2', 'russiasss', '2025-12-22 07:48:20', '2026-02-13 14:50:07');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_practitioner_services`
--

CREATE TABLE `awhai_practitioner_services` (
  `practitioner_services_aid` int(11) NOT NULL,
  `practitioner_services_is_active` tinyint(1) NOT NULL,
  `practitioner_services_practitioner_id` int(11) NOT NULL,
  `practitioner_services_practitioner_first_name` varchar(255) NOT NULL,
  `practitioner_services_practitioner_last_name` varchar(255) NOT NULL,
  `practitioner_services_service_id` int(11) NOT NULL,
  `practitioner_services_service_name` varchar(255) NOT NULL,
  `practitioner_services_service_amount` varchar(20) NOT NULL,
  `practitioner_services_created` datetime NOT NULL,
  `practitioner_services_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_practitioner_services`
--

INSERT INTO `awhai_practitioner_services` (`practitioner_services_aid`, `practitioner_services_is_active`, `practitioner_services_practitioner_id`, `practitioner_services_practitioner_first_name`, `practitioner_services_practitioner_last_name`, `practitioner_services_service_id`, `practitioner_services_service_name`, `practitioner_services_service_amount`, `practitioner_services_created`, `practitioner_services_datetime`) VALUES
(11, 1, 7, 'James', 'Reid', 3, 'Exercises', '', '2025-11-24 12:17:45', '2025-11-24 12:17:45'),
(12, 1, 7, 'James', 'Reid', 5, 'Life Coaching', '', '2025-11-24 12:17:45', '2025-11-24 12:17:45'),
(13, 1, 7, 'James', 'Reid', 9, 'Teaching', '', '2025-11-24 12:17:45', '2025-11-24 12:17:45'),
(14, 1, 7, 'James', 'Reid', 8, 'Mentoring', '', '2025-11-24 12:17:45', '2025-11-24 12:17:45'),
(26, 1, 2, 'Luke', 'Rubico', 3, 'Exercises', '200', '2025-12-21 17:35:59', '2025-12-21 17:35:59'),
(27, 1, 2, 'Luke', 'Rubico', 5, 'Life Coaching', '100', '2025-12-21 17:35:59', '2025-12-21 17:35:59'),
(28, 1, 2, 'Luke', 'Rubico', 8, 'Mentoring', '300', '2025-12-21 17:35:59', '2025-12-21 17:35:59'),
(29, 1, 2, 'Luke', 'Rubico', 9, 'Teaching', '100', '2025-12-21 17:35:59', '2025-12-21 17:35:59'),
(32, 1, 15, 'aaa', 'aaa', 5, 'Life Coaching', '100', '2025-12-22 07:47:49', '2025-12-22 07:47:49'),
(34, 1, 16, 'ad', 'asd', 5, 'Life Coaching', '1', '2026-02-13 13:29:30', '2026-02-13 13:29:30');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_role`
--

CREATE TABLE `awhai_role` (
  `role_aid` int(11) NOT NULL,
  `role_is_active` tinyint(1) NOT NULL,
  `role_code` varchar(20) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_description` varchar(100) NOT NULL,
  `role_created` datetime NOT NULL,
  `role_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_role`
--

INSERT INTO `awhai_role` (`role_aid`, `role_is_active`, `role_code`, `role_name`, `role_description`, `role_created`, `role_updated`) VALUES
(2, 1, 'r_is_developer', 'Developer', 'developer', '2025-11-11 15:21:59', '2025-11-11 15:21:59'),
(3, 1, 'r_is_admin', 'Admin', 'admin', '2025-11-11 15:22:08', '2025-11-11 15:22:08'),
(4, 1, 'r_is_practitioner', 'Practitioner', 'practitioner', '2025-11-11 15:22:24', '2025-11-11 15:22:24');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_schedule`
--

CREATE TABLE `awhai_schedule` (
  `schedule_aid` int(11) NOT NULL,
  `schedule_is_active` tinyint(1) NOT NULL,
  `schedule_start_date` varchar(20) NOT NULL,
  `schedule_end_date` varchar(20) NOT NULL,
  `schedule_practitioner_id` int(11) NOT NULL,
  `schedule_services_id` int(11) NOT NULL,
  `schedule_services_name` varchar(20) NOT NULL,
  `schedule_practitioner_first_name` varchar(255) NOT NULL,
  `schedule_practitioner_last_name` varchar(255) NOT NULL,
  `schedule_practitioner_email` varchar(255) NOT NULL,
  `schedule_remarks` text NOT NULL,
  `schedule_created` datetime NOT NULL,
  `schedule_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_schedule`
--

INSERT INTO `awhai_schedule` (`schedule_aid`, `schedule_is_active`, `schedule_start_date`, `schedule_end_date`, `schedule_practitioner_id`, `schedule_services_id`, `schedule_services_name`, `schedule_practitioner_first_name`, `schedule_practitioner_last_name`, `schedule_practitioner_email`, `schedule_remarks`, `schedule_created`, `schedule_datetime`) VALUES
(1, 1, '2025-12-20 07:00:00', '2025-12-20 09:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sasas', '2025-12-20 22:22:36', '2025-12-20 22:22:36'),
(2, 1, '2025-12-24 09:00:00', '2025-12-24 11:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sasas', '2025-12-20 22:22:36', '2025-12-20 22:22:36'),
(3, 1, '2025-12-24 11:00:00', '2025-12-24 13:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sasas', '2025-12-20 22:22:36', '2025-12-20 22:22:36'),
(4, 1, '2025-12-24 13:00:00', '2025-12-24 15:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'aaa', '2025-12-20 22:22:36', '2025-12-21 19:18:16'),
(5, 1, '2025-12-24 15:00:00', '2025-12-24 16:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sasas', '2025-12-20 22:22:36', '2025-12-20 22:22:36'),
(7, 0, '2025-12-25 09:01:00', '2025-12-25 10:30:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:35:24', '2025-12-22 13:07:34'),
(8, 1, '2025-12-25 11:00:00', '2025-12-25 13:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:35:24', '2025-12-21 17:35:24'),
(9, 1, '2025-12-25 13:00:00', '2025-12-25 15:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:35:24', '2025-12-21 17:35:24'),
(10, 1, '2025-12-25 15:00:00', '2025-12-25 16:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:35:24', '2025-12-21 17:35:24'),
(14, 1, '2025-12-25 16:30:00', '2025-12-25 18:30:00', 2, 9, 'Teaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:39:32', '2025-12-21 17:39:32'),
(15, 1, '2025-12-25 18:30:00', '2025-12-25 20:30:00', 2, 9, 'Teaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:39:32', '2025-12-21 17:39:32'),
(16, 1, '2025-12-25 20:30:00', '2025-12-25 22:00:00', 2, 9, 'Teaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-21 17:39:32', '2025-12-21 17:39:32'),
(17, 1, '2025-12-25 23:00:00', '2025-12-25 23:04:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(18, 1, '2025-12-25 23:04:00', '2025-12-25 23:09:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(19, 1, '2025-12-25 23:09:00', '2025-12-25 23:14:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(20, 1, '2025-12-25 23:14:00', '2025-12-25 23:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(21, 1, '2025-12-25 23:19:00', '2025-12-25 23:24:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(22, 1, '2025-12-25 23:24:00', '2025-12-25 23:29:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(23, 1, '2025-12-25 23:29:00', '2025-12-25 23:30:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-21 19:26:44', '2025-12-21 19:26:44'),
(24, 1, '2025-12-24 17:00:00', '2025-12-24 17:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(25, 1, '2025-12-24 17:19:00', '2025-12-24 17:39:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(26, 1, '2025-12-24 17:39:00', '2025-12-24 17:59:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(27, 1, '2025-12-24 17:59:00', '2025-12-24 18:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(28, 1, '2025-12-24 18:19:00', '2025-12-24 18:39:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(29, 1, '2025-12-24 18:39:00', '2025-12-24 18:59:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(30, 1, '2025-12-24 18:59:00', '2025-12-24 19:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(31, 1, '2025-12-24 19:19:00', '2025-12-24 19:39:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(32, 1, '2025-12-24 19:39:00', '2025-12-24 19:59:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(33, 1, '2025-12-24 19:59:00', '2025-12-24 20:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(34, 1, '2025-12-24 20:19:00', '2025-12-24 20:39:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(35, 1, '2025-12-24 20:39:00', '2025-12-24 20:59:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(36, 1, '2025-12-24 20:59:00', '2025-12-24 21:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(37, 1, '2025-12-24 21:19:00', '2025-12-24 21:39:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(38, 1, '2025-12-24 21:39:00', '2025-12-24 21:59:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(39, 1, '2025-12-24 21:59:00', '2025-12-24 22:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(40, 1, '2025-12-24 22:19:00', '2025-12-24 22:39:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(41, 1, '2025-12-24 22:39:00', '2025-12-24 22:59:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(42, 1, '2025-12-24 22:59:00', '2025-12-24 23:19:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(43, 1, '2025-12-24 23:19:00', '2025-12-24 23:30:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'asdada', '2025-12-21 19:56:33', '2025-12-21 19:56:33'),
(44, 1, '2025-12-23 07:00:00', '2025-12-23 08:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(45, 1, '2025-12-23 08:00:00', '2025-12-23 09:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(46, 1, '2025-12-23 09:00:00', '2025-12-23 10:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(47, 1, '2025-12-23 10:00:00', '2025-12-23 11:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(48, 1, '2025-12-23 11:00:00', '2025-12-23 12:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(49, 1, '2025-12-23 12:00:00', '2025-12-23 13:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(50, 1, '2025-12-23 13:00:00', '2025-12-23 14:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(51, 1, '2025-12-23 14:00:00', '2025-12-23 15:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(52, 1, '2025-12-23 15:00:00', '2025-12-23 16:00:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(53, 1, '2025-12-23 16:00:00', '2025-12-23 16:15:00', 2, 5, 'Life Coaching', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'sdsd', '2025-12-22 07:51:37', '2025-12-22 07:51:37'),
(54, 1, '2025-12-26 07:00:00', '2025-12-26 08:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(55, 1, '2025-12-26 08:00:00', '2025-12-26 09:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(56, 1, '2025-12-26 09:00:00', '2025-12-26 10:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(57, 1, '2025-12-26 10:00:00', '2025-12-26 11:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(58, 1, '2025-12-26 11:00:00', '2025-12-26 12:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'as', '2025-12-22 08:48:53', '2025-12-22 15:53:43'),
(59, 1, '2025-12-26 12:00:00', '2025-12-26 13:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(60, 1, '2025-12-26 13:00:00', '2025-12-26 14:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(61, 1, '2025-12-26 14:00:00', '2025-12-26 15:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(62, 1, '2025-12-26 15:00:00', '2025-12-26 16:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(63, 1, '2025-12-26 16:00:00', '2025-12-26 17:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(64, 1, '2025-12-26 17:00:00', '2025-12-26 18:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(65, 1, '2025-12-26 18:00:00', '2025-12-26 19:00:00', 2, 8, 'Mentoring', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'a', '2025-12-22 08:48:53', '2025-12-22 08:48:53'),
(66, 1, '2025-12-22 00:00:00', '2025-12-22 00:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'te', '2025-12-22 15:40:41', '2025-12-22 15:40:41'),
(67, 1, '2025-12-22 00:00:00', '2025-12-22 00:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'te', '2025-12-22 15:40:41', '2025-12-22 15:40:41'),
(68, 1, '2025-12-22 00:00:00', '2025-12-22 00:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'te', '2025-12-22 15:40:41', '2025-12-22 15:40:41'),
(69, 1, '2025-12-22 00:00:00', '2025-12-22 00:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'te', '2025-12-22 15:40:41', '2025-12-22 15:40:41'),
(70, 1, '2025-12-22 00:00:00', '2025-12-22 00:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'te', '2025-12-22 15:40:41', '2025-12-22 15:40:41'),
(71, 1, '2025-12-27 07:30:00', '2025-12-27 08:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-23 07:25:52', '2025-12-23 07:25:52'),
(72, 1, '2025-12-27 08:00:00', '2025-12-27 08:30:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-23 07:25:52', '2025-12-23 07:25:52'),
(73, 1, '2025-12-27 08:30:00', '2025-12-27 09:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-23 07:25:52', '2025-12-23 07:25:52'),
(74, 1, '2025-12-27 09:01:00', '2025-12-27 09:30:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 's', '2025-12-23 07:25:52', '2025-12-23 08:11:10'),
(75, 1, '2025-12-29 07:00:00', '2025-12-29 07:45:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(76, 1, '2025-12-29 07:45:00', '2025-12-29 08:30:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(77, 1, '2025-12-29 08:30:00', '2025-12-29 09:15:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(78, 1, '2025-12-29 09:15:00', '2025-12-29 10:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(79, 1, '2025-12-29 10:00:00', '2025-12-29 10:45:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(80, 1, '2025-12-29 10:45:00', '2025-12-29 11:30:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(81, 1, '2025-12-29 11:30:00', '2025-12-29 12:15:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(82, 1, '2025-12-29 12:15:00', '2025-12-29 13:00:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(83, 1, '2025-12-29 13:00:00', '2025-12-29 13:45:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(84, 1, '2025-12-29 13:45:00', '2025-12-29 14:30:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(85, 1, '2025-12-29 14:30:00', '2025-12-29 15:15:00', 2, 3, 'Exercises', 'Luke', 'Rubico', 'lourenisobel18@gmail.com', 'TEST DATA', '2025-12-29 09:03:27', '2025-12-29 09:03:27'),
(87, 1, '2025-12-29 07:30:00', '2025-12-29 09:00:00', 15, 5, 'Life Coaching', 'aaa', 'aaa', 'wewe@gmail.com', 'test data', '2025-12-29 09:24:18', '2025-12-29 09:24:18'),
(88, 1, '2025-12-29 09:00:00', '2025-12-29 10:30:00', 15, 5, 'Life Coaching', 'aaa', 'aaa', 'wewe@gmail.com', 'test data', '2025-12-29 09:24:18', '2025-12-29 09:24:18'),
(89, 1, '2025-12-29 10:30:00', '2025-12-29 12:00:00', 15, 5, 'Life Coaching', 'aaa', 'aaa', 'wewe@gmail.com', 'test data', '2025-12-29 09:24:18', '2025-12-29 09:24:18'),
(90, 1, '2025-12-29 12:00:00', '2025-12-29 13:30:00', 15, 5, 'Life Coaching', 'aaa', 'aaa', 'wewe@gmail.com', 'test data', '2025-12-29 09:24:18', '2025-12-29 09:24:18'),
(91, 1, '2025-12-29 13:30:00', '2025-12-29 15:00:00', 15, 5, 'Life Coaching', 'aaa', 'aaa', 'wewe@gmail.com', 'test data', '2025-12-29 09:24:18', '2025-12-29 09:24:18');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_services`
--

CREATE TABLE `awhai_services` (
  `services_aid` int(11) NOT NULL,
  `services_is_active` tinyint(1) NOT NULL,
  `services_name` varchar(200) NOT NULL,
  `services_description` varchar(500) NOT NULL,
  `services_category_id` varchar(20) NOT NULL,
  `services_category_name` varchar(100) NOT NULL,
  `services_created` datetime NOT NULL,
  `services_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_services`
--

INSERT INTO `awhai_services` (`services_aid`, `services_is_active`, `services_name`, `services_description`, `services_category_id`, `services_category_name`, `services_created`, `services_updated`) VALUES
(3, 1, 'Exercises', 'Content is still under development', '9', 'Healing', '2025-11-13 11:10:33', '2025-11-17 12:37:44'),
(4, 0, 'Reiki', 'Reiki Non Physical Healing Techniques like Reiki are a great complement for any Manual Therapy including the Dorn Method.', '9', 'Healing', '2025-11-13 12:32:33', '2025-11-17 13:23:38'),
(5, 1, 'Life Coaching', 'Content is still under development', '10', 'Coaching', '2025-11-13 12:33:00', '2025-11-13 12:33:00'),
(8, 1, 'Mentoring', 'Mentoring', '6', 'Courses', '2025-11-24 10:24:36', '2025-11-24 10:24:36'),
(9, 1, 'Teaching', 'Teaching', '6', 'Courses', '2025-11-24 10:24:57', '2025-11-24 10:24:57');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_settings_country`
--

CREATE TABLE `awhai_settings_country` (
  `settings_country_aid` int(11) NOT NULL,
  `settings_country_name` varchar(200) NOT NULL,
  `settings_country_is_active` tinyint(1) NOT NULL,
  `settings_country_created` datetime NOT NULL,
  `settings_country_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_settings_country`
--

INSERT INTO `awhai_settings_country` (`settings_country_aid`, `settings_country_name`, `settings_country_is_active`, `settings_country_created`, `settings_country_updated`) VALUES
(2, 'russiasss', 1, '2025-12-18 08:10:04', '2025-12-18 08:13:31'),
(3, 'Philipines', 1, '2025-12-22 14:18:16', '2025-12-22 14:18:16');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_settings_notification`
--

CREATE TABLE `awhai_settings_notification` (
  `notification_aid` int(11) NOT NULL,
  `notification_is_active` tinyint(1) NOT NULL,
  `notification_first_name` varchar(20) NOT NULL,
  `notification_last_name` varchar(20) NOT NULL,
  `notification_email` varchar(255) NOT NULL,
  `notification_created` datetime NOT NULL,
  `notification_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_settings_notification`
--

INSERT INTO `awhai_settings_notification` (`notification_aid`, `notification_is_active`, `notification_first_name`, `notification_last_name`, `notification_email`, `notification_created`, `notification_updated`) VALUES
(1, 1, 'zaicy', 'lumabas', 'cyrene.lumabas@frontlinebusiness.com.ph', '2025-12-21 17:01:22', '2025-12-21 17:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_user_other`
--

CREATE TABLE `awhai_user_other` (
  `user_other_aid` int(11) NOT NULL,
  `user_other_is_active` tinyint(1) NOT NULL,
  `user_other_fname` varchar(100) NOT NULL,
  `user_other_lname` varchar(100) NOT NULL,
  `user_other_email` varchar(100) NOT NULL,
  `user_other_new_email` varchar(100) NOT NULL,
  `user_other_role_id` varchar(20) NOT NULL,
  `user_other_practitioner_id` varchar(20) NOT NULL,
  `user_other_key` varchar(255) NOT NULL,
  `user_other_password` varchar(255) NOT NULL,
  `user_other_created` datetime NOT NULL,
  `user_other_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_user_other`
--

INSERT INTO `awhai_user_other` (`user_other_aid`, `user_other_is_active`, `user_other_fname`, `user_other_lname`, `user_other_email`, `user_other_new_email`, `user_other_role_id`, `user_other_practitioner_id`, `user_other_key`, `user_other_password`, `user_other_created`, `user_other_updated`) VALUES
(1, 1, 'Luke', 'Rubico', 'cyrene.lumabas@frontlinebusiness.com.ph', '', '3', '2', '', '$2y$10$JMOAyDfBxlgix2oe1QGQ7e3e6.rtuMbFoOz4YsNFKCHncxTjNlBO2', '2025-11-12 10:28:52', '2026-01-06 09:48:58'),
(4, 1, 'ad', 'a', 'cyrenemlumabas@gmail.com', 'april9rhina@gmail.com', '4', '16', 'b0008e3ac681eea4b5e834ca19b8f23c83579d21d2a5f9015cfcda1fa13fcba6', '$2y$10$avF8hgK4/ijtydvlTCKyL.lBxpIybRkh7.FCzgZNOBECmNhFT0uCi', '2026-02-13 13:29:39', '2026-02-20 12:03:41');

-- --------------------------------------------------------

--
-- Table structure for table `awhai_user_system`
--

CREATE TABLE `awhai_user_system` (
  `user_system_aid` int(11) NOT NULL,
  `user_system_is_active` tinyint(1) NOT NULL,
  `user_system_fname` varchar(100) NOT NULL,
  `user_system_lname` varchar(100) NOT NULL,
  `user_system_email` varchar(100) NOT NULL,
  `user_system_new_email` varchar(100) NOT NULL,
  `user_system_role_id` varchar(20) NOT NULL,
  `user_system_key` varchar(255) NOT NULL,
  `user_system_password` varchar(255) NOT NULL,
  `user_system_created` datetime NOT NULL,
  `user_system_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `awhai_user_system`
--

INSERT INTO `awhai_user_system` (`user_system_aid`, `user_system_is_active`, `user_system_fname`, `user_system_lname`, `user_system_email`, `user_system_new_email`, `user_system_role_id`, `user_system_key`, `user_system_password`, `user_system_created`, `user_system_updated`) VALUES
(1, 1, 'Louren', 'Rubico', 'louren.rubico@frontlinebusiness.com.ph', '', '2', '', '$2y$10$4hvNW3uu8p99ojIDlTsGsePc1VuFbzgaDOa09YuDgXRBcEYSUrbym', '2025-11-12 09:24:58', '2025-11-17 09:50:14'),
(2, 1, 'Emmanuel', 'Manalo', 'emmanuel.manalo@frontlinebusiness.com.ph', '', '2', '', '$2y$10$JMOAyDfBxlgix2oe1QGQ7e3e6.rtuMbFoOz4YsNFKCHncxTjNlBO2', '2025-11-12 09:24:58', '2025-11-17 09:50:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `awhai_booking`
--
ALTER TABLE `awhai_booking`
  ADD PRIMARY KEY (`booking_aid`);

--
-- Indexes for table `awhai_category`
--
ALTER TABLE `awhai_category`
  ADD PRIMARY KEY (`category_aid`);

--
-- Indexes for table `awhai_practitioner`
--
ALTER TABLE `awhai_practitioner`
  ADD PRIMARY KEY (`practitioner_aid`);

--
-- Indexes for table `awhai_practitioner_services`
--
ALTER TABLE `awhai_practitioner_services`
  ADD PRIMARY KEY (`practitioner_services_aid`);

--
-- Indexes for table `awhai_role`
--
ALTER TABLE `awhai_role`
  ADD PRIMARY KEY (`role_aid`);

--
-- Indexes for table `awhai_schedule`
--
ALTER TABLE `awhai_schedule`
  ADD PRIMARY KEY (`schedule_aid`);

--
-- Indexes for table `awhai_services`
--
ALTER TABLE `awhai_services`
  ADD PRIMARY KEY (`services_aid`);

--
-- Indexes for table `awhai_settings_country`
--
ALTER TABLE `awhai_settings_country`
  ADD PRIMARY KEY (`settings_country_aid`);

--
-- Indexes for table `awhai_settings_notification`
--
ALTER TABLE `awhai_settings_notification`
  ADD PRIMARY KEY (`notification_aid`);

--
-- Indexes for table `awhai_user_other`
--
ALTER TABLE `awhai_user_other`
  ADD PRIMARY KEY (`user_other_aid`);

--
-- Indexes for table `awhai_user_system`
--
ALTER TABLE `awhai_user_system`
  ADD PRIMARY KEY (`user_system_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `awhai_booking`
--
ALTER TABLE `awhai_booking`
  MODIFY `booking_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `awhai_category`
--
ALTER TABLE `awhai_category`
  MODIFY `category_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `awhai_practitioner`
--
ALTER TABLE `awhai_practitioner`
  MODIFY `practitioner_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `awhai_practitioner_services`
--
ALTER TABLE `awhai_practitioner_services`
  MODIFY `practitioner_services_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `awhai_role`
--
ALTER TABLE `awhai_role`
  MODIFY `role_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `awhai_schedule`
--
ALTER TABLE `awhai_schedule`
  MODIFY `schedule_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `awhai_services`
--
ALTER TABLE `awhai_services`
  MODIFY `services_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `awhai_settings_country`
--
ALTER TABLE `awhai_settings_country`
  MODIFY `settings_country_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `awhai_settings_notification`
--
ALTER TABLE `awhai_settings_notification`
  MODIFY `notification_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `awhai_user_other`
--
ALTER TABLE `awhai_user_other`
  MODIFY `user_other_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `awhai_user_system`
--
ALTER TABLE `awhai_user_system`
  MODIFY `user_system_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
