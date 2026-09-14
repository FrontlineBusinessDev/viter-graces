-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2026 at 09:39 AM
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
-- Table structure for table `graces_suppliers`
--

CREATE TABLE `graces_suppliers` (
  `suppliers_aid` int(11) NOT NULL,
  `suppliers_is_active` tinyint(1) NOT NULL,
  `suppliers_is_default` tinyint(1) NOT NULL,
  `suppliers_name` varchar(200) NOT NULL,
  `suppliers_email` varchar(200) DEFAULT NULL,
  `suppliers_phone` varchar(20) DEFAULT NULL,
  `suppliers_address` varchar(200) DEFAULT NULL,
  `suppliers_messenger` varchar(200) DEFAULT NULL,
  `suppliers_whatsapp` varchar(200) DEFAULT NULL,
  `suppliers_other` varchar(200) DEFAULT NULL,
  `suppliers_notes` text DEFAULT NULL,
  `suppliers_delivery` varchar(20) DEFAULT NULL,
  `suppliers_contact_person` text DEFAULT NULL,
  `suppliers_description_id` int(11) DEFAULT NULL,
  `suppliers_description_value` varchar(200) DEFAULT NULL,
  `suppliers_created` datetime NOT NULL,
  `suppliers_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_suppliers`
--

INSERT INTO `graces_suppliers` (`suppliers_aid`, `suppliers_is_active`, `suppliers_is_default`, `suppliers_name`, `suppliers_email`, `suppliers_phone`, `suppliers_address`, `suppliers_messenger`, `suppliers_whatsapp`, `suppliers_other`, `suppliers_notes`, `suppliers_delivery`, `suppliers_contact_person`, `suppliers_description_id`, `suppliers_description_value`, `suppliers_created`, `suppliers_updated`) VALUES
(1, 1, 0, 'Cyrene Lumabas', 'cyrene.lumabas@frontlinebusiness.com.ph', '9962356874', 'Brgy. San Cristobal San Pablo City Laguna 4000 Brgy. San Cristobal San Pablo City Laguna 4000', 'https://www.facebook.com/bananadealer', '', '', '', 'monday', '[{\"contact_name\":\"Zai\",\"contact_phone\":\"09856321475\",\"id\":0},{\"contact_name\":\"Cy\",\"contact_phone\":\"09856321479\",\"id\":1}]', 2, 'Banana Supplier', '2026-07-17 13:08:11', '2026-09-14 14:42:22'),
(4, 1, 1, 'Other operating expenses', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '', '2026-09-02 17:36:39', '2026-09-02 17:36:39'),
(5, 1, 0, 'cassava store', '', '', '', '', '', '', '', 'tuesday', '[]', 3, 'Cassava Supplier', '2026-09-07 13:12:07', '2026-09-14 12:57:25'),
(6, 1, 0, 'Test Supplier XYZ', '', '', '', '', '', '', '', 'monday', '[]', 4, 'Custom Desc Test', '2026-09-14 12:18:42', '2026-09-14 12:18:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_suppliers`
--
ALTER TABLE `graces_suppliers`
  ADD PRIMARY KEY (`suppliers_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_suppliers`
--
ALTER TABLE `graces_suppliers`
  MODIFY `suppliers_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
