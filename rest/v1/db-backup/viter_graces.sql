-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 10:09 AM
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
-- Table structure for table `graces_customer`
--

CREATE TABLE `graces_customer` (
  `customer_aid` int(11) NOT NULL,
  `customer_is_active` tinyint(1) NOT NULL,
  `customer_name` varchar(200) NOT NULL,
  `customer_email` varchar(200) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_address` varchar(200) NOT NULL,
  `customer_messenger` varchar(200) NOT NULL,
  `customer_whatsapp` varchar(200) NOT NULL,
  `customer_other` varchar(200) NOT NULL,
  `customer_notes` text NOT NULL,
  `customer_created` datetime NOT NULL,
  `customer_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_customer`
--

INSERT INTO `graces_customer` (`customer_aid`, `customer_is_active`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_messenger`, `customer_whatsapp`, `customer_other`, `customer_notes`, `customer_created`, `customer_updated`) VALUES
(1, 1, 'cy', 'cy@gmailc.om', '0909889878', 'San Pablo City', '', '', '', '', '2026-05-12 06:14:40', '2026-05-12 06:14:40');

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
(2, 1, 'r_is_developer', 'Developer', 'Developer', '2026-04-05 11:07:25', '2026-04-05 11:07:25'),
(3, 1, 'r_is_product_owner', 'Product Owner', 'Product Owner', '2026-05-07 12:46:15', '2026-05-07 12:46:15'),
(4, 1, 'r_is_cashier', 'Cashier', 'Cashier', '2026-05-07 12:47:48', '2026-05-07 12:47:48');

-- --------------------------------------------------------

--
-- Table structure for table `graces_suppliers`
--

CREATE TABLE `graces_suppliers` (
  `suppliers_aid` int(11) NOT NULL,
  `suppliers_is_active` tinyint(1) NOT NULL,
  `suppliers_name` varchar(200) NOT NULL,
  `suppliers_email` varchar(200) NOT NULL,
  `suppliers_phone` varchar(20) NOT NULL,
  `suppliers_address` varchar(200) NOT NULL,
  `suppliers_messenger` varchar(200) NOT NULL,
  `suppliers_whatsapp` varchar(200) NOT NULL,
  `suppliers_other` varchar(200) NOT NULL,
  `suppliers_notes` text NOT NULL,
  `suppliers_delivery` varchar(20) NOT NULL,
  `suppliers_contact_person` text NOT NULL,
  `suppliers_created` datetime NOT NULL,
  `suppliers_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_suppliers`
--

INSERT INTO `graces_suppliers` (`suppliers_aid`, `suppliers_is_active`, `suppliers_name`, `suppliers_email`, `suppliers_phone`, `suppliers_address`, `suppliers_messenger`, `suppliers_whatsapp`, `suppliers_other`, `suppliers_notes`, `suppliers_delivery`, `suppliers_contact_person`, `suppliers_created`, `suppliers_updated`) VALUES
(1, 1, 'cycy store', 'cuy@gmail.com', '', 'San Pablo City', 'sd', '', 'sd', '', 'Tuesday', '[{\"contact_name\":\"zai\",\"contact_phone\":\"09099877656\"},{\"contact_name\":\"zorene\",\"contact_phone\":\"09099878987\"}]', '2026-05-12 13:42:42', '2026-05-12 15:13:10'),
(2, 1, 'asdasdds', '', '', '', '', '', '', '', 'Monday', '[]', '2026-05-12 13:54:09', '2026-05-12 13:54:09'),
(3, 1, 'asdasdasd', '', '', '', '', '', '', '', '', '[]', '2026-05-12 13:55:54', '2026-05-12 15:35:02');

-- --------------------------------------------------------

--
-- Table structure for table `graces_suppliers_product`
--

CREATE TABLE `graces_suppliers_product` (
  `suppliers_product_aid` int(11) NOT NULL,
  `suppliers_product_name` varchar(200) NOT NULL,
  `suppliers_product_price` varchar(20) NOT NULL,
  `suppliers_product_unit` varchar(200) NOT NULL,
  `suppliers_product_supplier_id` int(11) NOT NULL,
  `suppliers_product_supplier_name` varchar(200) NOT NULL,
  `suppliers_product_is_active` tinyint(1) NOT NULL,
  `suppliers_product_created` datetime NOT NULL,
  `suppliers_product_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_suppliers_product`
--

INSERT INTO `graces_suppliers_product` (`suppliers_product_aid`, `suppliers_product_name`, `suppliers_product_price`, `suppliers_product_unit`, `suppliers_product_supplier_id`, `suppliers_product_supplier_name`, `suppliers_product_is_active`, `suppliers_product_created`, `suppliers_product_updated`) VALUES
(1, 'Sugar', '500', 'kilo', 1, 'cycy store', 1, '2026-05-12 13:42:42', '2026-05-12 13:42:42'),
(2, 'Oil', '198', 'asdasdasd', 0, '', 1, '2026-05-12 13:42:42', '2026-05-12 15:58:31'),
(4, 'aewweqwqw', '2000', '', 3, 'asdasdasd', 1, '2026-05-12 13:55:54', '2026-05-12 13:55:54'),
(5, 'asdasdwqe', '20000', '', 3, 'asdasdasd', 1, '2026-05-12 13:55:54', '2026-05-12 13:55:54'),
(6, 'asdasd', '121212', 'asdad', 2, 'asdasdds', 1, '2026-05-12 16:07:09', '2026-05-12 16:07:09');

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
(3, 1, 'Cyrene', 'Lumabas', 'cyrenemlumabas@gmail.com', '', 2, 'Developer', '0252ea069df07831f83be1fa04c0ca0b23da7527fa1562e42ad225b8cda491c8', '$2y$10$jXGrW7qre2K/oejlirU9luA1RtXXTxpeXdhGPqa19pygPg1k.Mn8C', '2026-04-05 21:21:37', '2026-05-06 19:24:15'),
(4, 1, 'Cyzai', 'Lumabas', 'cyrene.lumabas@frontlinebusiness.com.ph', '', 3, 'Product Owner', '099d92465ab01c25ce3cb9c9d49d6b251f4ad49172072daf1cd7b88a73efee79', '', '2026-05-07 14:30:45', '2026-05-07 15:01:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_customer`
--
ALTER TABLE `graces_customer`
  ADD PRIMARY KEY (`customer_aid`);

--
-- Indexes for table `graces_roles`
--
ALTER TABLE `graces_roles`
  ADD PRIMARY KEY (`role_aid`);

--
-- Indexes for table `graces_suppliers`
--
ALTER TABLE `graces_suppliers`
  ADD PRIMARY KEY (`suppliers_aid`);

--
-- Indexes for table `graces_suppliers_product`
--
ALTER TABLE `graces_suppliers_product`
  ADD PRIMARY KEY (`suppliers_product_aid`);

--
-- Indexes for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  ADD PRIMARY KEY (`user_account_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_customer`
--
ALTER TABLE `graces_customer`
  MODIFY `customer_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `graces_roles`
--
ALTER TABLE `graces_roles`
  MODIFY `role_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `graces_suppliers`
--
ALTER TABLE `graces_suppliers`
  MODIFY `suppliers_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `graces_suppliers_product`
--
ALTER TABLE `graces_suppliers_product`
  MODIFY `suppliers_product_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  MODIFY `user_account_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
