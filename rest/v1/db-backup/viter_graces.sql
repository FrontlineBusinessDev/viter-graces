-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 05:55 AM
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
-- Database: `viter_graces`
--

-- --------------------------------------------------------

--
-- Table structure for table `graces_roles`
--

CREATE TABLE `graces_roles` (
  `role_aid` int(11) NOT NULL,
  `role_is_active` tinyint(1) NOT NULL,
  `role_code` varchar(50) NOT NULL,
  `role_name` varchar(128) NOT NULL,
  `role_description` text NOT NULL,
  `role_created` datetime NOT NULL,
  `role_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_roles`
--

INSERT INTO `graces_roles` (`role_aid`, `role_is_active`, `role_code`, `role_name`, `role_description`, `role_created`, `role_updated`) VALUES
(2, 1, 'r_is_admin', 'Admin', 'Admin role', '2025-09-11 08:47:24', '2026-04-05 10:32:37'),
(91, 1, 'r_is_developer', 'Developer', 'Developer', '2026-04-05 11:07:25', '2026-04-05 11:07:25');

-- --------------------------------------------------------

--
-- Table structure for table `graces_user_account`
--

CREATE TABLE `graces_user_account` (
  `user_account_aid` int(11) NOT NULL,
  `user_account_is_active` tinyint(1) NOT NULL,
  `user_account_first_name` varchar(125) NOT NULL,
  `user_account_last_name` varchar(125) NOT NULL,
  `user_account_email` varchar(125) NOT NULL,
  `user_account_id` int(11) NOT NULL,
  `user_account_role` varchar(125) NOT NULL,
  `user_account_created` datetime NOT NULL,
  `user_account_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_roles`
--
ALTER TABLE `graces_roles`
  ADD PRIMARY KEY (`role_aid`);

--
-- Indexes for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  ADD PRIMARY KEY (`user_account_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_roles`
--
ALTER TABLE `graces_roles`
  MODIFY `role_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  MODIFY `user_account_aid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
