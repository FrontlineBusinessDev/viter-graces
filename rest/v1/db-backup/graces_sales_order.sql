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
-- Table structure for table `graces_sales_order`
--

CREATE TABLE `graces_sales_order` (
  `sales_order_aid` int(11) NOT NULL,
  `sales_order_status` varchar(20) DEFAULT NULL,
  `sales_order_is_active` tinyint(1) NOT NULL,
  `sales_order_number` varchar(50) NOT NULL,
  `sales_order_date` date NOT NULL,
  `sales_order_customer_id` int(11) NOT NULL,
  `sales_order_customer_name` varchar(200) NOT NULL,
  `sales_order_payment_method` varchar(125) DEFAULT NULL,
  `sales_order_product_id` int(11) NOT NULL,
  `sales_order_product_name` varchar(200) NOT NULL,
  `sales_order_qty` varchar(20) DEFAULT NULL,
  `sales_order_price` varchar(20) DEFAULT NULL,
  `sales_order_total` varchar(20) DEFAULT NULL,
  `sales_order_total_amount` varchar(20) DEFAULT NULL,
  `sales_order_discount` varchar(20) DEFAULT NULL,
  `sales_order_tax` varchar(20) DEFAULT NULL,
  `sales_order_tax_amount` varchar(20) DEFAULT NULL,
  `sales_order_vat` varchar(20) DEFAULT NULL,
  `sales_order_discounted_with_vat_amount` varchar(20) DEFAULT NULL,
  `sales_order_paid_amount` varchar(20) DEFAULT NULL,
  `sales_order_notes` text DEFAULT NULL,
  `sales_order_received_by_id` int(11) NOT NULL,
  `sales_order_received_by_name` varchar(200) NOT NULL,
  `sales_order_product_owner_id` int(11) NOT NULL,
  `sales_order_product_owner_name` varchar(200) NOT NULL,
  `sales_order_installment` varchar(20) DEFAULT NULL,
  `sales_order_due_date` varchar(20) DEFAULT NULL,
  `sales_order_total_receivable_amount` varchar(20) DEFAULT NULL,
  `sales_order_total_balance_amount` varchar(20) DEFAULT NULL,
  `sales_order_is_return` tinyint(1) NOT NULL,
  `sales_order_return_qty` varchar(20) DEFAULT NULL,
  `sales_order_payment_terms` varchar(200) DEFAULT NULL,
  `sales_order_balance_per_product` varchar(20) DEFAULT NULL,
  `sales_order_paid_per_product` varchar(20) DEFAULT NULL,
  `sales_order_cash` varchar(20) DEFAULT NULL,
  `sales_order_check` varchar(20) DEFAULT NULL,
  `sales_order_online_transaction` varchar(20) DEFAULT NULL,
  `sales_order_installment_type` varchar(50) DEFAULT NULL,
  `sales_order_installment_type_day` varchar(50) DEFAULT NULL,
  `sales_order_installment_count` varchar(20) DEFAULT NULL,
  `sales_order_installment_amount` varchar(20) DEFAULT NULL,
  `sales_order_discount_percentage` varchar(20) DEFAULT NULL,
  `sales_order_discount_type` varchar(20) DEFAULT NULL,
  `sales_order_created` datetime NOT NULL,
  `sales_order_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_sales_order`
--

INSERT INTO `graces_sales_order` (`sales_order_aid`, `sales_order_status`, `sales_order_is_active`, `sales_order_number`, `sales_order_date`, `sales_order_customer_id`, `sales_order_customer_name`, `sales_order_payment_method`, `sales_order_product_id`, `sales_order_product_name`, `sales_order_qty`, `sales_order_price`, `sales_order_total`, `sales_order_total_amount`, `sales_order_discount`, `sales_order_tax`, `sales_order_tax_amount`, `sales_order_vat`, `sales_order_discounted_with_vat_amount`, `sales_order_paid_amount`, `sales_order_notes`, `sales_order_received_by_id`, `sales_order_received_by_name`, `sales_order_product_owner_id`, `sales_order_product_owner_name`, `sales_order_installment`, `sales_order_due_date`, `sales_order_total_receivable_amount`, `sales_order_total_balance_amount`, `sales_order_is_return`, `sales_order_return_qty`, `sales_order_payment_terms`, `sales_order_balance_per_product`, `sales_order_paid_per_product`, `sales_order_cash`, `sales_order_check`, `sales_order_online_transaction`, `sales_order_installment_type`, `sales_order_installment_type_day`, `sales_order_installment_count`, `sales_order_installment_amount`, `sales_order_discount_percentage`, `sales_order_discount_type`, `sales_order_created`, `sales_order_updated`) VALUES
(1, 'partial', 1, 'ORD001', '2026-08-07', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '300', '5', '1500', '1500', '0', '0.12', '180', '180', '1680', '1000', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '1', '2026-09-07', '1680', '680', 0, '', 'Installment', '680', '1000', '', '', '', '', '', '', '', '', '', '2026-08-07 08:09:22', '2026-08-07 08:09:22'),
(2, 'partial', 1, 'ORD002', '2026-08-07', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '100', '10', '1000', '1250', '0', '0.12', '150', '120', '1120', '1200', '', 3, 'Cyrene Lumabas', 7, 'zaicy lumabas', '1', '2026-09-07', '1400', '200', 0, '', 'Installment', '160', '960', '', '', '', '', '', '', '', '', '', '2026-08-07 08:10:08', '2026-08-25 15:35:22'),
(3, 'partial', 1, 'ORD002', '2026-08-07', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '50', '5', '250', '1250', '0', '0.12', '150', '30', '280', '1200', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '1', '2026-09-07', '1400', '200', 0, '', 'Installment', '40', '240', '', '', '', '', '', '', '', '', '', '2026-08-07 08:10:08', '2026-08-10 16:01:58'),
(5, 'paid', 1, 'ORD004', '2026-08-07', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '300', '10', '3000', '3000', '0', '0.12', '360', '360', '3360', '3360', '', 3, 'Cyrene Lumabas', 7, 'zaicy lumabas', '1', '2026-08-25', '3360', '0', 0, '', 'due on receipt - due on the same day the sales order', '0', '3360', '', '', '', '', '', '', '', '', '', '2026-08-07 08:10:41', '2026-08-25 15:57:30'),
(6, 'partial', 1, 'ORD005', '2026-08-07', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '100', '10', '1000', '1250', '0', '0', '0', '0', '1000', '1000', '', 3, 'Cyrene Lumabas', 7, 'zaicy lumabas', '1', '2026-09-06', '1250', '250', 0, '', 'Net 30 - Due within 30 days', '200', '800', '', '', '', '', '', '', '', '', '', '2026-08-07 12:08:31', '2026-08-25 15:35:22'),
(7, 'partial', 1, 'ORD005', '2026-08-07', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '50', '5', '250', '1250', '0', '0', '0', '0', '250', '1000', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '1', '2026-09-06', '1250', '250', 0, '', 'Net 30 - Due within 30 days', '50', '200', '', '', '', '', '', '', '', '', '', '2026-08-07 12:08:31', '2026-08-07 12:08:31'),
(8, 'paid', 1, 'ORD006', '2026-08-07', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '50', '5', '250', '1250', '0', '0.12', '150', '30', '280', '1400', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '1', '2026-08-25', '1400', '0', 0, '', 'due on receipt - due on the same day the sales order', '0', '280', '', '', '', '', '', '', '', '', '', '2026-08-07 12:11:11', '2026-08-25 10:04:13'),
(9, 'paid', 1, 'ORD006', '2026-08-07', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '100', '10', '1000', '1250', '0', '0.12', '150', '120', '1120', '1400', '', 3, 'Cyrene Lumabas', 7, 'zaicy lumabas', '1', '2026-08-25', '1400', '0', 0, '', 'due on receipt - due on the same day the sales order', '0', '1120', '', '', '', '', '', '', '', '', '', '2026-08-07 12:11:11', '2026-08-25 15:35:22'),
(10, 'paid', 1, 'ORD007', '2026-08-07', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '50', '5', '250', '1250', '0', '0.12', '150', '30', '280', '1400', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '1', '2026-08-26', '1400', '0', 0, '', 'due on receipt - due on the same day the sales order', '0', '280', '', '', '', '', '', '', '', '', '', '2026-08-07 12:13:17', '2026-08-26 07:28:57'),
(11, 'paid', 1, 'ORD007', '2026-08-07', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '100', '10', '1000', '1250', '0', '0.12', '150', '120', '1120', '1400', '', 3, 'Cyrene Lumabas', 7, 'zaicy lumabas', '1', '2026-08-26', '1400', '0', 0, '', 'due on receipt - due on the same day the sales order', '0', '1120', '', '', '', '', '', '', '', '', '', '2026-08-07 12:13:17', '2026-08-26 07:28:57'),
(12, 'unpaid', 1, 'ORD008', '2026-08-10', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '100', '5', '500', '500', '0', '0.12', '60', '60', '560', '0', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '1', '2026-09-09', '560', '560', 0, '', 'Net 30 - Due within 30 days', '560', '0', '', '', '', '', '', '', '', '', '', '2026-08-10 15:52:58', '2026-08-10 15:52:58'),
(13, 'paid', 1, 'ORD009', '2026-08-14', 1, 'Walk in customer', 'cash', 3, 'asdasda', '10', '11', '110', '110', '0', '0.12', '13.2', '13.2', '123.2', '123.2', '', 8, 'cy lumabas', 8, 'cy lumabas', '1', '2026-08-14', '123.2', '0', 0, NULL, 'due on receipt - due on the same day the sales order', '0', '123.2', '', '', '', '', '', '', '', '', '', '2026-08-14 11:00:00', '2026-08-14 11:00:00'),
(14, 'paid', 1, 'ORD010', '2026-08-14', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '10', '10', '100', '100', '0', '0', '0', '0', '100', '100', '', 4, 'Cyzai Lumabas', 7, 'zaicy lumabas', '1', '2026-08-14', '100', '0', 0, NULL, 'due on receipt - due on the same day the sales order', '0', '100', '', '', '', '', '', '', '', '', '', '2026-08-14 13:14:03', '2026-08-25 15:35:22'),
(15, 'overdue', 1, 'ORD011', '2026-08-14', 1, 'Walk in customer', 'cash', 2, 'Cassava chips', '10', '10', '100', '100', '0', '0', '0', '0', '100', '0', '', 4, 'Cyzai Lumabas', 7, 'zaicy lumabas', '1', '2026-08-14', '100', '100', 0, NULL, 'due on receipt - due on the same day the sales order', '100', '0', '', '', '', '', '', '', '', '', '', '2026-08-14 13:37:10', '2026-08-25 15:35:22'),
(16, 'paid', 1, 'ORD012', '2026-08-14', 1, 'Walk in customer', 'cash', 3, 'asdasda', '80', '11', '880', '880', '0', '0', '0', '0', '880', '880', '', 4, 'Cyzai Lumabas', 8, 'cy lumabas', '1', '2026-08-14', '880', '0', 0, NULL, 'due on receipt - due on the same day the sales order', '0', '880', '', '', '', '', '', '', '', '', '', '2026-08-14 13:37:27', '2026-08-14 14:06:15'),
(22, 'partial', 1, 'ORD013', '2026-08-25', 2, 'cy lumabas', 'mutiple payment', 1, 'Banana chips', '100', '5', '500', '1500', '0', '0.12', '180', '60', '560', '626.67', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '0', '2026-10-10', '1680', '1053.33', 0, NULL, 'Installment', '351.11', '208.89', '10', '20', '70', 'monthly', '10', '3', '526.6667', '', '', '2026-08-25 14:27:23', '2026-08-25 15:57:50'),
(23, 'partial', 1, 'ORD013', '2026-08-25', 2, 'cy lumabas', 'mutiple payment', 2, 'Cassava chips', '100', '10', '1000', '1500', '0', '0.12', '180', '120', '1120', '626.67', '', 3, 'Cyrene Lumabas', 7, 'zaicy lumabas', '0', '2026-10-10', '1680', '1053.33', 0, NULL, 'Installment', '702.22', '417.78', '10', '20', '70', 'monthly', '10', '3', '526.6667', '', '', '2026-08-25 14:27:23', '2026-08-25 15:57:50'),
(24, 'overdue', 1, 'ORD014', '2026-08-26', 1, 'Walk in customer', 'cash', 1, 'Banana chips', '100', '5', '500', '500', '100', '0.12', '48', '48', '448', '0', '', 3, 'Cyrene Lumabas', 6, 'Herlyn Torres', '0', '2026-08-26', '448', '448', 0, NULL, 'due on receipt - due on the same day the sales order', '448', '0', '0', '0', '0', 'monthly', '0', '0', '0', '20', 'percentage', '2026-08-26 14:22:13', '2026-08-26 14:22:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_sales_order`
--
ALTER TABLE `graces_sales_order`
  ADD PRIMARY KEY (`sales_order_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_sales_order`
--
ALTER TABLE `graces_sales_order`
  MODIFY `sales_order_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
