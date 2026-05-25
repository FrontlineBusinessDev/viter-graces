-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 10:05 AM
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
-- Table structure for table `graces_activity_log`
--

CREATE TABLE `graces_activity_log` (
  `activity_log_aid` int(11) NOT NULL,
  `activity_log_menu` varchar(100) NOT NULL,
  `activity_log_action` varchar(100) NOT NULL,
  `activity_log_user_id` int(11) NOT NULL,
  `activity_log_user_name` varchar(200) NOT NULL,
  `activity_log_user_role` varchar(100) NOT NULL,
  `activity_log_description` text NOT NULL,
  `activity_log_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_activity_log`
--

INSERT INTO `graces_activity_log` (`activity_log_aid`, `activity_log_menu`, `activity_log_action`, `activity_log_user_id`, `activity_log_user_name`, `activity_log_user_role`, `activity_log_description`, `activity_log_created`) VALUES
(1, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"products_name\":\"Banana chips\",\"products_image\":\"\",\"products_sku\":\"\",\"products_category\":\"chips\",\"products_price\":10,\"products_cost\":5,\"products_stocks\":100,\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":\"10\",\"products_suppliers_name\":\"bb\",\"products_sales\":\"\",\"products_unit\":\"pcs\",\"products_barcode\":\"\",\"products_low_stock_threshold\":10,\"products_description\":\"\",\"products_name_old\":\"\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-25 12:49:25'),
(2, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"products_name\":\"Banana chips\",\"products_image\":\"\",\"products_sku\":\"\",\"products_category\":\"chips\",\"products_price\":10,\"products_cost\":5,\"products_stocks\":100,\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":\"10\",\"products_suppliers_name\":\"bb\",\"products_sales\":\"\",\"products_unit\":\"100\",\"products_barcode\":\"\",\"products_low_stock_threshold\":10,\"products_description\":\"\",\"products_name_old\":\"\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-25 12:54:52'),
(3, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"products_name\":\"cassava chips\",\"products_image\":\"\",\"products_sku\":\"\",\"products_category\":\"chips\",\"products_price\":20,\"products_cost\":10,\"products_stocks\":100,\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":\"10\",\"products_suppliers_name\":\"bb\",\"products_sales\":\"\",\"products_unit\":\"pcs\",\"products_barcode\":\"\",\"products_low_stock_threshold\":10,\"products_description\":\"\",\"products_name_old\":\"\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-25 14:43:20'),
(4, 'sales-order', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"sales_order_date\":\"2026-05-25\",\"sales_order_customer_id\":\"4\",\"sales_order_customer_name\":\"Cyzai Lumabas\",\"sales_order_payment_method\":\"cash\",\"sales_order_product_id\":\"\",\"sales_order_product_name\":\"\",\"sales_order_qty\":\"1\",\"sales_order_price\":\"\",\"sales_order_total\":\"\",\"sales_order_discount\":\"0\",\"sales_order_tax\":\"0\",\"sales_order_paid_amount\":10,\"sales_order_notes\":\"\",\"sales_order_received_by_id\":\"4\",\"sales_order_received_by_name\":\"Cyzai Lumabas\",\"sales_order_product_owner_id\":\"\",\"sales_order_product_owner_name\":\"\",\"sales_order_installment\":\"0\",\"sales_order_due_date\":\"2026-05-25\",\"items\":[{\"sales_order_product_id\":\"1\",\"sales_order_product_name\":\"Banana chips\",\"sales_order_product_owner_id\":4,\"sales_order_product_owner_name\":\"Cyzai Lumabas\",\"sales_order_qty\":\"1\",\"sales_order_price\":\"10\",\"sales_order_total\":10}]}}]', '2026-05-25 14:50:15'),
(5, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"stock_movement_aid\":\"\",\"stock_movement_type\":\"in stock\",\"stock_movement_status\":\"\",\"stock_movement_product_id\":\"1\",\"stock_movement_product_name\":\"Banana chips\",\"stock_movement_qty\":5,\"stock_movement_location\":\"store\",\"stock_movement_product_owner_id\":4,\"stock_movement_product_owner_name\":\"Cyzai Lumabas\",\"stock_movement_notes\":\"\"}}]', '2026-05-25 15:35:16'),
(6, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"stock_movement_aid\":\"\",\"stock_movement_type\":\"in stock\",\"stock_movement_status\":\"\",\"stock_movement_product_id\":\"1\",\"stock_movement_product_name\":\"Banana chips\",\"stock_movement_qty\":5,\"stock_movement_location\":\"store\",\"stock_movement_product_owner_id\":4,\"stock_movement_product_owner_name\":\"Cyzai Lumabas\",\"stock_movement_notes\":\"\"}}]', '2026-05-25 15:37:25'),
(7, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"products_name\":\"Banana chips\",\"products_image\":\"\",\"products_sku\":\"\",\"products_category\":\"chips\",\"products_price\":10,\"products_cost\":5,\"products_stocks\":100,\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":\"10\",\"products_suppliers_name\":\"bb\",\"products_sales\":\"\",\"products_unit\":\"pcs\",\"products_barcode\":\"\",\"products_low_stock_threshold\":10,\"products_description\":\"\",\"products_name_old\":\"\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-25 15:38:40'),
(8, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"products_name\":\"Cassava chips\",\"products_image\":\"\",\"products_sku\":\"\",\"products_category\":\"chips\",\"products_price\":20,\"products_cost\":10,\"products_stocks\":100,\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":\"10\",\"products_suppliers_name\":\"bb\",\"products_sales\":\"\",\"products_unit\":\"pcs\",\"products_barcode\":\"\",\"products_low_stock_threshold\":10,\"products_description\":\"\",\"products_name_old\":\"\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-25 15:39:51'),
(9, 'products', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"stock_movement_aid\":\"\",\"stock_movement_type\":\"in stock\",\"stock_movement_status\":\"\",\"stock_movement_product_id\":\"1\",\"stock_movement_product_name\":\"Banana chips\",\"stock_movement_qty\":5,\"stock_movement_location\":\"store\",\"stock_movement_product_owner_id\":4,\"stock_movement_product_owner_name\":\"Cyzai Lumabas\",\"stock_movement_notes\":\"\"}}]', '2026-05-25 15:40:04'),
(10, 'sales-order', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"sales_order_date\":\"2026-05-25\",\"sales_order_customer_id\":\"4\",\"sales_order_customer_name\":\"Cyzai Lumabas\",\"sales_order_payment_method\":\"cash\",\"sales_order_product_id\":\"\",\"sales_order_product_name\":\"\",\"sales_order_qty\":\"1\",\"sales_order_price\":\"\",\"sales_order_total\":\"\",\"sales_order_discount\":\"0\",\"sales_order_tax\":\"0\",\"sales_order_paid_amount\":10,\"sales_order_notes\":\"\",\"sales_order_received_by_id\":\"4\",\"sales_order_received_by_name\":\"Cyzai Lumabas\",\"sales_order_product_owner_id\":\"\",\"sales_order_product_owner_name\":\"\",\"sales_order_installment\":\"0\",\"sales_order_due_date\":\"2026-05-25\",\"items\":[{\"sales_order_product_id\":\"1\",\"sales_order_product_name\":\"Banana chips\",\"sales_order_product_owner_id\":4,\"sales_order_product_owner_name\":\"Cyzai Lumabas\",\"sales_order_qty\":\"1\",\"sales_order_price\":\"10\",\"sales_order_total\":10}]}}]', '2026-05-25 15:40:23');

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
(1, 1, 'cy', 'cy@gmailc.om', '0909889878', 'San Pablo City', '', '', '', '', '2026-05-12 06:14:40', '2026-05-12 06:14:40'),
(3, 1, 'aaaa', 'sfdgs', '3456356', 'dfgsdfg', 'sdfgs', 'fthfgh', 'dfghd', 'fghdfgh', '2026-05-13 14:29:19', '2026-05-13 14:29:19');

-- --------------------------------------------------------

--
-- Table structure for table `graces_products`
--

CREATE TABLE `graces_products` (
  `products_aid` int(11) NOT NULL,
  `products_status` varchar(50) NOT NULL,
  `products_is_active` tinyint(1) NOT NULL,
  `products_image` varchar(200) NOT NULL,
  `products_name` varchar(200) NOT NULL,
  `products_sku` varchar(100) NOT NULL,
  `products_category` varchar(125) NOT NULL,
  `products_price` varchar(20) NOT NULL,
  `products_cost` varchar(20) NOT NULL,
  `products_stocks` varchar(20) NOT NULL,
  `products_suppliers_id` int(11) NOT NULL,
  `products_suppliers_name` varchar(200) NOT NULL,
  `products_owner_id` int(11) NOT NULL,
  `products_owner_name` varchar(200) NOT NULL,
  `products_sales` varchar(20) NOT NULL,
  `products_unit` varchar(125) NOT NULL,
  `products_barcode` varchar(100) NOT NULL,
  `products_low_stock_threshold` varchar(20) NOT NULL,
  `products_description` text NOT NULL,
  `products_created` datetime NOT NULL,
  `products_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_products`
--

INSERT INTO `graces_products` (`products_aid`, `products_status`, `products_is_active`, `products_image`, `products_name`, `products_sku`, `products_category`, `products_price`, `products_cost`, `products_stocks`, `products_suppliers_id`, `products_suppliers_name`, `products_owner_id`, `products_owner_name`, `products_sales`, `products_unit`, `products_barcode`, `products_low_stock_threshold`, `products_description`, `products_created`, `products_updated`) VALUES
(1, 'active', 1, '', 'Banana chips', 'SKU001', 'chips', '10', '5', '100', 10, 'bb', 4, 'Cyzai Lumabas', '', 'pcs', '01779694720', '10', '', '2026-05-25 15:38:40', '2026-05-25 15:38:40'),
(2, 'active', 1, '', 'Cassava chips', 'SKU002', 'chips', '20', '10', '100', 10, 'bb', 4, 'Cyzai Lumabas', '', 'pcs', '01779694791', '10', '', '2026-05-25 15:39:51', '2026-05-25 15:39:51');

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
(4, 1, 'r_is_cashier', 'Cashier', 'Cashier', '2026-05-07 12:47:48', '2026-05-07 12:47:48'),
(5, 1, 'r_is_aaaaa', 'aaaaa', 'aaaaa', '2026-05-13 16:42:41', '2026-05-13 16:42:41');

-- --------------------------------------------------------

--
-- Table structure for table `graces_sales_order`
--

CREATE TABLE `graces_sales_order` (
  `sales_order_aid` int(11) NOT NULL,
  `sales_order_status` varchar(20) NOT NULL,
  `sales_order_is_active` tinyint(1) NOT NULL,
  `sales_order_number` varchar(50) NOT NULL,
  `sales_order_date` date NOT NULL,
  `sales_order_customer_id` int(11) NOT NULL,
  `sales_order_customer_name` varchar(200) NOT NULL,
  `sales_order_payment_method` varchar(125) NOT NULL,
  `sales_order_product_id` int(11) NOT NULL,
  `sales_order_product_name` varchar(200) NOT NULL,
  `sales_order_qty` varchar(20) NOT NULL,
  `sales_order_price` varchar(20) NOT NULL,
  `sales_order_total` varchar(20) NOT NULL,
  `sales_order_discount` varchar(20) NOT NULL,
  `sales_order_tax` varchar(20) NOT NULL,
  `sales_order_paid_amount` varchar(20) NOT NULL,
  `sales_order_notes` text NOT NULL,
  `sales_order_received_by_id` int(11) NOT NULL,
  `sales_order_received_by_name` varchar(200) NOT NULL,
  `sales_order_product_owner_id` int(11) NOT NULL,
  `sales_order_product_owner_name` varchar(200) NOT NULL,
  `sales_order_installment` varchar(20) NOT NULL,
  `sales_order_due_date` varchar(20) NOT NULL,
  `sales_order_overall_amount` varchar(20) NOT NULL,
  `sales_order_created` datetime NOT NULL,
  `sales_order_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_sales_order`
--

INSERT INTO `graces_sales_order` (`sales_order_aid`, `sales_order_status`, `sales_order_is_active`, `sales_order_number`, `sales_order_date`, `sales_order_customer_id`, `sales_order_customer_name`, `sales_order_payment_method`, `sales_order_product_id`, `sales_order_product_name`, `sales_order_qty`, `sales_order_price`, `sales_order_total`, `sales_order_discount`, `sales_order_tax`, `sales_order_paid_amount`, `sales_order_notes`, `sales_order_received_by_id`, `sales_order_received_by_name`, `sales_order_product_owner_id`, `sales_order_product_owner_name`, `sales_order_installment`, `sales_order_due_date`, `sales_order_overall_amount`, `sales_order_created`, `sales_order_updated`) VALUES
(1, 'active', 1, 'ORD001', '2026-05-25', 4, 'Cyzai Lumabas', 'cash', 1, 'Banana chips', '1', '10', '10', '0', '0', '10', '', 4, 'Cyzai Lumabas', 4, 'Cyzai Lumabas', '0', '2026-05-25', '10', '2026-05-25 15:40:23', '2026-05-25 15:40:23');

-- --------------------------------------------------------

--
-- Table structure for table `graces_stock_movement`
--

CREATE TABLE `graces_stock_movement` (
  `stock_movement_aid` int(11) NOT NULL,
  `stock_movement_date` date NOT NULL,
  `stock_movement_type` varchar(50) NOT NULL,
  `stock_movement_status` varchar(50) NOT NULL,
  `stock_movement_is_active` tinyint(1) NOT NULL,
  `stock_movement_product_id` varchar(20) NOT NULL,
  `stock_movement_product_name` varchar(200) NOT NULL,
  `stock_movement_before_qty` varchar(20) NOT NULL,
  `stock_movement_after_qty` varchar(20) NOT NULL,
  `stock_movement_qty` varchar(20) NOT NULL,
  `stock_movement_location` varchar(200) NOT NULL,
  `stock_movement_product_owner_id` varchar(20) NOT NULL,
  `stock_movement_product_owner_name` varchar(200) NOT NULL,
  `stock_movement_notes` text NOT NULL,
  `stock_movement_created` datetime NOT NULL,
  `stock_movement_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_stock_movement`
--

INSERT INTO `graces_stock_movement` (`stock_movement_aid`, `stock_movement_date`, `stock_movement_type`, `stock_movement_status`, `stock_movement_is_active`, `stock_movement_product_id`, `stock_movement_product_name`, `stock_movement_before_qty`, `stock_movement_after_qty`, `stock_movement_qty`, `stock_movement_location`, `stock_movement_product_owner_id`, `stock_movement_product_owner_name`, `stock_movement_notes`, `stock_movement_created`, `stock_movement_updated`) VALUES
(1, '2026-05-25', 'in stock', '', 1, '1', 'Banana chips', '0', '100', '100', '', '4', 'Cyzai Lumabas', '', '2026-05-25 15:38:40', '2026-05-25 15:38:40'),
(2, '2026-05-25', 'in stock', '', 1, '2', 'Cassava chips', '0', '100', '100', '', '4', 'Cyzai Lumabas', '', '2026-05-25 15:39:51', '2026-05-25 15:39:51'),
(3, '2026-05-25', 'in stock', 'active', 1, '1', 'Banana chips', '100', '105', '5', 'store', '4', 'Cyzai Lumabas', '', '2026-05-25 15:40:04', '2026-05-25 15:40:04'),
(4, '2026-05-25', 'stock out - sales', '', 1, '1', 'Banana chips', '0', '1', '1', '', '4', 'Cyzai Lumabas', '', '2026-05-25 15:40:23', '2026-05-25 15:40:23');

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
(10, 1, 'bb', 'asdasd@gmail.com', '343434', 'asdasd', 'asdas', 'dasd', 'sdasdasd', '', 'Tuesday', '[{\"contact_name\":\"asdasd\",\"contact_phone\":\"32345345345\"}]', '2026-05-13 15:25:42', '2026-05-13 15:29:50');

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
(7, '234234', '32423', 'rwerwr', 5, 'ssss', 1, '2026-05-13 15:16:17', '2026-05-13 15:16:17'),
(8, 'sfasdgdfgh', '542', '34654', 7, 'ddddd', 1, '2026-05-13 15:18:01', '2026-05-13 15:18:01'),
(9, 'dfgdfg', '21', '12', 8, 'aaaaa', 1, '2026-05-13 15:19:55', '2026-05-13 15:19:55'),
(10, 'asdasda', '345341', 'sdad', 10, 'aaaaa', 1, '2026-05-13 15:25:42', '2026-05-13 15:25:42'),
(11, 'a', '111111s', 'dfsdf1111', 10, 'bb', 1, '2026-05-13 15:32:14', '2026-05-13 15:43:59');

-- --------------------------------------------------------

--
-- Table structure for table `graces_suppliers_purchase_order`
--

CREATE TABLE `graces_suppliers_purchase_order` (
  `purchase_order_aid` int(11) NOT NULL,
  `purchase_order_number` varchar(20) NOT NULL,
  `purchase_order_supplier_id` int(11) NOT NULL,
  `purchase_order_supplier_name` varchar(200) NOT NULL,
  `purchase_order_date` varchar(20) NOT NULL,
  `purchase_order_expected_delivery` varchar(20) NOT NULL,
  `purchase_order_total_amount` varchar(20) NOT NULL,
  `purchase_order_payment` varchar(100) NOT NULL,
  `purchase_order_is_active` tinyint(1) NOT NULL,
  `purchase_order_status` varchar(20) NOT NULL,
  `purchase_order_payment_status` varchar(20) NOT NULL,
  `purchase_order_note` text NOT NULL,
  `purchase_order_product_id` int(11) NOT NULL,
  `purchase_order_product_name` varchar(200) NOT NULL,
  `purchase_order_product_owner_id` int(11) NOT NULL,
  `purchase_order_product_owner_name` varchar(200) NOT NULL,
  `purchase_order_qty` varchar(20) NOT NULL,
  `purchase_order_price` varchar(20) NOT NULL,
  `purchase_order_created` datetime NOT NULL,
  `purchase_order_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_suppliers_purchase_order`
--

INSERT INTO `graces_suppliers_purchase_order` (`purchase_order_aid`, `purchase_order_number`, `purchase_order_supplier_id`, `purchase_order_supplier_name`, `purchase_order_date`, `purchase_order_expected_delivery`, `purchase_order_total_amount`, `purchase_order_payment`, `purchase_order_is_active`, `purchase_order_status`, `purchase_order_payment_status`, `purchase_order_note`, `purchase_order_product_id`, `purchase_order_product_name`, `purchase_order_product_owner_id`, `purchase_order_product_owner_name`, `purchase_order_qty`, `purchase_order_price`, `purchase_order_created`, `purchase_order_updated`) VALUES
(1, 'PO-001', 10, 'bb', '2026-05-14', '2026-05-14', '1000', '250000', 1, 'draft', 'draft', 'test data', 11, 'a', 4, 'Cyzai Lumabas', '100', '10', '2026-05-14 13:11:57', '2026-05-14 13:11:57'),
(2, 'PO-001', 10, 'bb', '2026-05-14', '2026-05-14', '4000', '250000', 1, 'draft', 'draft', 'test data', 10, 'asdasda', 4, 'Cyzai Lumabas', '200', '20', '2026-05-14 13:11:57', '2026-05-14 13:11:57'),
(3, 'PO-001', 10, 'bb', '2026-05-14', '2026-05-14', '9000', '250000', 1, 'draft', 'draft', 'test data', 11, 'a', 4, 'Cyzai Lumabas', '300', '30', '2026-05-14 13:11:57', '2026-05-14 13:11:57'),
(4, 'PO-001', 10, 'bb', '2026-05-14', '2026-05-14', '16000', '250000', 1, 'draft', 'draft', 'test data', 10, 'asdasda', 4, 'Cyzai Lumabas', '400', '40', '2026-05-14 13:11:57', '2026-05-14 13:11:57'),
(5, 'PO-001', 10, 'bb', '2026-05-14', '2026-05-14', '25000', '250000', 1, 'draft', 'draft', 'test data', 10, 'asdasda', 4, 'Cyzai Lumabas', '500', '50', '2026-05-14 13:11:57', '2026-05-14 13:11:57'),
(6, 'PO-002', 10, 'bb', '2026-05-14', '2026-05-14', '10000', '0', 1, 'draft', 'draft', 'test data', 11, 'a', 4, 'Cyzai Lumabas', '1000', '10', '2026-05-14 13:14:25', '2026-05-14 13:14:25'),
(7, 'PO-002', 10, 'bb', '2026-05-14', '2026-05-14', '40000', '0', 1, 'draft', 'draft', 'test data', 10, 'asdasda', 4, 'Cyzai Lumabas', '2000', '20', '2026-05-14 13:14:25', '2026-05-14 13:14:25');

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
(4, 1, 'Cyzai', 'Lumabas', 'cyrene.lumabas@frontlinebusiness.com.ph', '', 3, 'Product Owner', 'bdade39bfeb6474260ed3629aaa7e15b046e621b82ac6677d502fb85c55aef52', '', '2026-05-07 14:30:45', '2026-05-13 17:18:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_activity_log`
--
ALTER TABLE `graces_activity_log`
  ADD PRIMARY KEY (`activity_log_aid`);

--
-- Indexes for table `graces_customer`
--
ALTER TABLE `graces_customer`
  ADD PRIMARY KEY (`customer_aid`);

--
-- Indexes for table `graces_products`
--
ALTER TABLE `graces_products`
  ADD PRIMARY KEY (`products_aid`);

--
-- Indexes for table `graces_roles`
--
ALTER TABLE `graces_roles`
  ADD PRIMARY KEY (`role_aid`);

--
-- Indexes for table `graces_sales_order`
--
ALTER TABLE `graces_sales_order`
  ADD PRIMARY KEY (`sales_order_aid`);

--
-- Indexes for table `graces_stock_movement`
--
ALTER TABLE `graces_stock_movement`
  ADD PRIMARY KEY (`stock_movement_aid`);

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
-- Indexes for table `graces_suppliers_purchase_order`
--
ALTER TABLE `graces_suppliers_purchase_order`
  ADD PRIMARY KEY (`purchase_order_aid`);

--
-- Indexes for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  ADD PRIMARY KEY (`user_account_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_activity_log`
--
ALTER TABLE `graces_activity_log`
  MODIFY `activity_log_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `graces_customer`
--
ALTER TABLE `graces_customer`
  MODIFY `customer_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `graces_products`
--
ALTER TABLE `graces_products`
  MODIFY `products_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `graces_roles`
--
ALTER TABLE `graces_roles`
  MODIFY `role_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `graces_sales_order`
--
ALTER TABLE `graces_sales_order`
  MODIFY `sales_order_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `graces_stock_movement`
--
ALTER TABLE `graces_stock_movement`
  MODIFY `stock_movement_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `graces_suppliers`
--
ALTER TABLE `graces_suppliers`
  MODIFY `suppliers_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `graces_suppliers_product`
--
ALTER TABLE `graces_suppliers_product`
  MODIFY `suppliers_product_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `graces_suppliers_purchase_order`
--
ALTER TABLE `graces_suppliers_purchase_order`
  MODIFY `purchase_order_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `graces_user_account`
--
ALTER TABLE `graces_user_account`
  MODIFY `user_account_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
