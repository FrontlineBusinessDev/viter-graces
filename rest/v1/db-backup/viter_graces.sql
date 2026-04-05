-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 04:30 PM
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
(1, 1, 'r_is_admin', 'Admin', 'Admin role', '2025-09-11 08:47:24', '2026-04-05 10:32:37'),
(2, 1, 'r_is_developer', 'Developer', 'Developer', '2026-04-05 11:07:25', '2026-04-05 11:07:25');

-- --------------------------------------------------------

--
-- Table structure for table `graces_user_account`
--

CREATE TABLE `graces_user_account` (
  `user_account_aid` int(11) NOT NULL,
  `user_account_is_active` tinyint(1) NOT NULL,
  `user_account_first_name` varchar(128) NOT NULL,
  `user_account_last_name` varchar(128) NOT NULL,
  `user_account_email` varchar(128) NOT NULL,
  `user_account_new_email` varchar(125) NOT NULL,
  `user_account_role_id` int(11) NOT NULL,
  `user_account_role` varchar(128) NOT NULL,
  `user_account_key` varchar(255) NOT NULL,
  `user_account_password` varchar(255) NOT NULL,
  `user_account_created` datetime NOT NULL,
  `user_account_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_user_account`
--

INSERT INTO `graces_user_account` (`user_account_aid`, `user_account_is_active`, `user_account_first_name`, `user_account_last_name`, `user_account_email`, `user_account_new_email`, `user_account_role_id`, `user_account_role`, `user_account_key`, `user_account_password`, `user_account_created`, `user_account_updated`) VALUES
(3, 1, 'Cyrene', 'Lumabas', 'cyrenemlumabas@gmail.com', '', 2, 'Developer', '', '$2y$10$PFQ6D.kk/etJhbe1fnMxDe3UcheUsiKTyWKJOVMg6o550oaojhXbC', '2026-04-05 21:21:37', '2026-04-05 21:46:14');

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
  MODIFY `role_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  MODIFY `user_account_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
