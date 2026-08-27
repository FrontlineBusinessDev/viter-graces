-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 27, 2026 at 02:59 AM
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
  `return_product_status` varchar(20) DEFAULT NULL,
  `return_product_number` varchar(20) DEFAULT NULL,
  `return_product_order_id` int(11) DEFAULT NULL,
  `return_product_order_number` varchar(20) DEFAULT NULL,
  `return_product_customer_id` int(11) DEFAULT NULL,
  `return_product_customer_name` varchar(200) DEFAULT NULL,
  `return_product_date` varchar(20) DEFAULT NULL,
  `return_product_amount` varchar(20) DEFAULT NULL,
  `return_product_product_id` int(11) DEFAULT NULL,
  `return_product_product_name` varchar(200) DEFAULT NULL,
  `return_product_qty` varchar(20) DEFAULT NULL,
  `return_product_price` varchar(20) DEFAULT NULL,
  `return_product_reason` varchar(200) DEFAULT NULL,
  `return_product_notes` text DEFAULT NULL,
  `return_product_is_restocked` tinyint(1) DEFAULT NULL,
  `return_product_owner_id` int(11) DEFAULT NULL,
  `return_product_owner_name` varchar(200) DEFAULT NULL,
  `return_product_resolution_type` varchar(100) NOT NULL,
  `return_product_created` datetime NOT NULL,
  `return_product_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_return_product`
--

INSERT INTO `graces_return_product` (`return_product_aid`, `return_product_status`, `return_product_number`, `return_product_order_id`, `return_product_order_number`, `return_product_customer_id`, `return_product_customer_name`, `return_product_date`, `return_product_amount`, `return_product_product_id`, `return_product_product_name`, `return_product_qty`, `return_product_price`, `return_product_reason`, `return_product_notes`, `return_product_is_restocked`, `return_product_owner_id`, `return_product_owner_name`, `return_product_resolution_type`, `return_product_created`, `return_product_updated`) VALUES
(1, 'processed', 'RET001', 11, 'ORD007', 1, 'Walk in customer', '2026-08-14', '100', 2, 'Cassava chips', '10', '10', 'damage', 'sdsd', 1, 7, 'zaicy lumabas', '', '2026-08-14 10:51:09', '2026-08-25 15:35:38'),
(2, 'processed', 'RET002', 1, 'ORD001', 1, 'Walk in customer', '2026-08-25', '150', 1, 'Banana chips', '30', '5', 'damage', 'sdsd', 0, 6, 'Herlyn Torres', '', '2026-08-25 15:35:54', '2026-08-27 08:13:33'),
(3, 'pending', 'RET003', 23, 'ORD013', 2, 'cy lumabas', '2026-08-27', '200', 2, 'Cassava chips', '20', '10', 'damage', 's', 0, 7, 'zaicy lumabas', '', '2026-08-27 08:13:47', '2026-08-27 08:13:47'),
(4, 'pending', 'RET004', 15, 'ORD011', 1, 'Walk in customer', '2026-08-27', '20', 2, 'Cassava chips', '02', '10', 'damage', 'Verification test returnVerification test return', 0, 7, 'zaicy lumabas', '', '2026-08-27 08:51:09', '2026-08-27 08:51:09');

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
  MODIFY `return_product_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
