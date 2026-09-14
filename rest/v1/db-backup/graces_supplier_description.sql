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
-- Table structure for table `graces_supplier_description`
--

CREATE TABLE `graces_supplier_description` (
  `supplier_description_aid` int(11) NOT NULL,
  `supplier_description_name` varchar(200) NOT NULL,
  `supplier_description_created` datetime NOT NULL,
  `supplier_description_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graces_supplier_description`
--

INSERT INTO `graces_supplier_description` (`supplier_description_aid`, `supplier_description_name`, `supplier_description_created`, `supplier_description_updated`) VALUES
(1, 'Other', '2026-09-14 09:51:30', '2026-09-14 09:51:30'),
(2, 'Banana Supplier', '2026-09-14 12:06:46', '2026-09-14 12:06:46'),
(3, 'Cassava Supplier', '2026-09-14 12:07:44', '2026-09-14 12:07:44'),
(4, 'Custom Desc Test', '2026-09-14 12:18:42', '2026-09-14 12:18:42'),
(5, 'Brand New Description Test', '2026-09-14 12:57:11', '2026-09-14 12:57:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `graces_supplier_description`
--
ALTER TABLE `graces_supplier_description`
  ADD PRIMARY KEY (`supplier_description_aid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `graces_supplier_description`
--
ALTER TABLE `graces_supplier_description`
  MODIFY `supplier_description_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
