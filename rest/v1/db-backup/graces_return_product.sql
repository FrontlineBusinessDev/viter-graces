-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2026 at 02:46 AM
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
-- Table structure for table `graces_return_product`
--

CREATE TABLE `graces_return_product` (
  `return_product_aid` int(11) NOT NULL,
  `return_product_status` varchar(20) NOT NULL,
  `return_product_number` varchar(20) NOT NULL,
  `return_product_order_id` int(11) NOT NULL,
  `return_product_order_number` varchar(20) NOT NULL,
  `return_product_customer_id` int(11) NOT NULL,
  `return_product_customer_name` varchar(200) NOT NULL,
  `return_product_date` varchar(20) NOT NULL,
  `return_product_amount` varchar(20) NOT NULL,
  `return_product_product_id` int(11) NOT NULL,
  `return_product_product_name` varchar(200) NOT NULL,
  `return_product_qty` varchar(20) NOT NULL,
  `return_product_price` varchar(20) NOT NULL,
  `return_product_reason` varchar(200) NOT NULL,
  `return_product_notes` text NOT NULL,
  `return_product_is_restocked` tinyint(1) NOT NULL,
  `return_product_owner_id` int(11) NOT NULL,
  `return_product_owner_name` varchar(200) NOT NULL,
  `return_product_created` datetime NOT NULL,
  `return_product_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_return_product`
--
ALTER TABLE `graces_return_product`
  ADD PRIMARY KEY (`return_product_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_return_product`
--
ALTER TABLE `graces_return_product`
  MODIFY `return_product_aid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
