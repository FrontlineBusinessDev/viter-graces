-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2026 at 07:40 AM
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
(1, 'products', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"products_name\":\"aaaaa\",\"products_image\":\"\",\"products_sku\":\"asda\",\"products_category\":\"asdas\",\"products_price\":231231,\"products_cost\":131,\"products_stocks\":123123,\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":\"3\",\"products_suppliers_name\":\"asdasdasd\",\"products_sales\":\"\",\"products_unit\":\"asdasd\",\"products_barcode\":\"sdasd\",\"products_low_stock_threshold\":1312312,\"products_description\":\"\",\"products_name_old\":\"\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-13 14:23:47'),
(2, 'products', 'update', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"products_name\":\"asd\",\"products_image\":\"\",\"products_sku\":\"asd\",\"products_category\":\"asd\",\"products_price\":\"132\",\"products_cost\":\"123\",\"products_stocks\":\"1222\",\"products_owner_id\":\"4\",\"products_owner_name\":\"Cyzai Lumabas\",\"products_suppliers_id\":0,\"products_suppliers_name\":\"\",\"products_sales\":\"\",\"products_unit\":\"pcs\",\"products_barcode\":\"sada\",\"products_low_stock_threshold\":\"1\",\"products_description\":\"sdsd\",\"products_name_old\":\"asd\",\"products_image_old\":\"\",\"pendingDeleteFile\":[]}}]', '2026-05-13 14:24:41'),
(3, 'customer', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"customer_name\":\"aaaa\",\"customer_email\":\"sfdgs\",\"customer_phone\":3456356,\"customer_address\":\"dfgsdfg\",\"customer_messenger\":\"sdfgs\",\"customer_whatsapp\":\"fthfgh\",\"customer_other\":\"dfghd\",\"customer_notes\":\"fghdfgh\",\"customer_name_old\":\"\"}}]', '2026-05-13 14:29:19'),
(6, 'customer', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"customer_aid\":2,\"customer_is_active\":1,\"customer_name\":\"sdfgsdfg\",\"customer_email\":\"sfdgs\",\"customer_phone\":\"3456356\",\"customer_address\":\"dfgsdfg\",\"customer_messenger\":\"sdfgs\",\"customer_whatsapp\":\"fthfgh\",\"customer_other\":\"dfghd\",\"customer_notes\":\"fghdfgh\",\"customer_created\":\"2026-05-13 14:28:13\",\"customer_updated\":\"2026-05-13 14:37:13\",\"id\":2,\"messenger\":\"sdfgs\",\"whatsapp\":\"fthfgh\",\"other\":\"dfghd\",\"is_active\":1,\"name\":\"sdfgsdfg\",\"path\":\"active/2\",\"menu\":\"customer\",\"action\":\"archieve\"}}]', '2026-05-13 14:37:30'),
(7, 'customer', 'restore', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"customer_aid\":2,\"customer_is_active\":0,\"customer_name\":\"sdfgsdfg\",\"customer_email\":\"sfdgs\",\"customer_phone\":\"3456356\",\"customer_address\":\"dfgsdfg\",\"customer_messenger\":\"sdfgs\",\"customer_whatsapp\":\"fthfgh\",\"customer_other\":\"dfghd\",\"customer_notes\":\"fghdfgh\",\"customer_created\":\"2026-05-13 14:28:13\",\"customer_updated\":\"2026-05-13 14:37:30\",\"id\":2,\"messenger\":\"sdfgs\",\"whatsapp\":\"fthfgh\",\"other\":\"dfghd\",\"is_active\":0,\"name\":\"sdfgsdfg\",\"path\":\"active/2\",\"menu\":\"customer\",\"action\":\"restore\"}}]', '2026-05-13 14:37:41'),
(8, 'customer', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"customer_aid\":2,\"customer_is_active\":1,\"customer_name\":\"sdfgsdfg\",\"customer_email\":\"sfdgs\",\"customer_phone\":\"3456356\",\"customer_address\":\"dfgsdfg\",\"customer_messenger\":\"sdfgs\",\"customer_whatsapp\":\"fthfgh\",\"customer_other\":\"dfghd\",\"customer_notes\":\"fghdfgh\",\"customer_created\":\"2026-05-13 14:28:13\",\"customer_updated\":\"2026-05-13 14:37:41\",\"id\":2,\"messenger\":\"sdfgs\",\"whatsapp\":\"fthfgh\",\"other\":\"dfghd\",\"is_active\":1,\"name\":\"sdfgsdfg\",\"path\":\"active/2\",\"menu\":\"customer\",\"action\":\"archieve\"}}]', '2026-05-13 14:37:52'),
(9, 'customer', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"customer_aid\":2,\"customer_is_active\":0,\"customer_name\":\"sdfgsdfg\",\"customer_email\":\"sfdgs\",\"customer_phone\":\"3456356\",\"customer_address\":\"dfgsdfg\",\"customer_messenger\":\"sdfgs\",\"customer_whatsapp\":\"fthfgh\",\"customer_other\":\"dfghd\",\"customer_notes\":\"fghdfgh\",\"customer_created\":\"2026-05-13 14:28:13\",\"customer_updated\":\"2026-05-13 14:37:52\",\"id\":2,\"messenger\":\"sdfgs\",\"whatsapp\":\"fthfgh\",\"other\":\"dfghd\",\"is_active\":0,\"name\":\"sdfgsdfg\",\"path\":\"2\",\"menu\":\"customer\",\"action\":\"delete\"}}]', '2026-05-13 14:37:55'),
(10, 'suppliers', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_name\":\"ssss\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"\",\"suppliers_notes\":\"\",\"suppliers_name_old\":\"\"}}]', '2026-05-13 15:16:17'),
(11, 'suppliers', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_name\":\"ddddd\",\"suppliers_email\":\"dfsdf\",\"suppliers_phone\":353534,\"suppliers_address\":\"asa\",\"suppliers_messenger\":\"zxcsdfsdf\",\"suppliers_whatsapp\":\"sdfsdfsd\",\"suppliers_other\":\"fsdf\",\"suppliers_delivery\":\"Thursday\",\"suppliers_contact_person\":\"\",\"suppliers_notes\":\"\",\"suppliers_name_old\":\"\"}}]', '2026-05-13 15:18:01'),
(12, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":4,\"suppliers_is_active\":1,\"suppliers_name\":\"asd\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asd\\\",\\\"contact_phone\\\":\\\"324234\\\"}]\",\"suppliers_created\":\"2026-05-13 15:14:37\",\"suppliers_updated\":\"2026-05-13 15:14:37\",\"id\":4,\"is_active\":1,\"messenger\":\"asd\",\"whatsapp\":\"asd\",\"other\":\"asd\",\"name\":\"asd\",\"path\":\"active/4\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:18:35'),
(13, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":4,\"suppliers_is_active\":0,\"suppliers_name\":\"asd\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asd\\\",\\\"contact_phone\\\":\\\"324234\\\"}]\",\"suppliers_created\":\"2026-05-13 15:14:37\",\"suppliers_updated\":\"2026-05-13 15:18:35\",\"id\":4,\"is_active\":0,\"messenger\":\"asd\",\"whatsapp\":\"asd\",\"other\":\"asd\",\"name\":\"asd\",\"path\":\"4\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:18:50'),
(14, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":5,\"suppliers_is_active\":1,\"suppliers_name\":\"ssss\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asd\\\",\\\"contact_phone\\\":\\\"324234\\\"}]\",\"suppliers_created\":\"2026-05-13 15:16:17\",\"suppliers_updated\":\"2026-05-13 15:16:17\",\"id\":5,\"is_active\":1,\"messenger\":\"asd\",\"whatsapp\":\"asd\",\"other\":\"asd\",\"name\":\"ssss\",\"path\":\"active/5\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:18:52'),
(15, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":5,\"suppliers_is_active\":0,\"suppliers_name\":\"ssss\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asd\\\",\\\"contact_phone\\\":\\\"324234\\\"}]\",\"suppliers_created\":\"2026-05-13 15:16:17\",\"suppliers_updated\":\"2026-05-13 15:18:52\",\"id\":5,\"is_active\":0,\"messenger\":\"asd\",\"whatsapp\":\"asd\",\"other\":\"asd\",\"name\":\"ssss\",\"path\":\"5\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:18:56'),
(16, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":7,\"suppliers_is_active\":1,\"suppliers_name\":\"ddddd\",\"suppliers_email\":\"dfsdf\",\"suppliers_phone\":\"353534\",\"suppliers_address\":\"asa\",\"suppliers_messenger\":\"zxcsdfsdf\",\"suppliers_whatsapp\":\"sdfsdfsd\",\"suppliers_other\":\"fsdf\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Thursday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"sdfsdf\\\",\\\"contact_phone\\\":\\\"35434657\\\"}]\",\"suppliers_created\":\"2026-05-13 15:18:01\",\"suppliers_updated\":\"2026-05-13 15:18:01\",\"id\":7,\"is_active\":1,\"messenger\":\"zxcsdfsdf\",\"whatsapp\":\"sdfsdfsd\",\"other\":\"fsdf\",\"name\":\"ddddd\",\"path\":\"active/7\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:18:58'),
(17, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":7,\"suppliers_is_active\":0,\"suppliers_name\":\"ddddd\",\"suppliers_email\":\"dfsdf\",\"suppliers_phone\":\"353534\",\"suppliers_address\":\"asa\",\"suppliers_messenger\":\"zxcsdfsdf\",\"suppliers_whatsapp\":\"sdfsdfsd\",\"suppliers_other\":\"fsdf\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Thursday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"sdfsdf\\\",\\\"contact_phone\\\":\\\"35434657\\\"}]\",\"suppliers_created\":\"2026-05-13 15:18:01\",\"suppliers_updated\":\"2026-05-13 15:18:58\",\"id\":7,\"is_active\":0,\"messenger\":\"zxcsdfsdf\",\"whatsapp\":\"sdfsdfsd\",\"other\":\"fsdf\",\"name\":\"ddddd\",\"path\":\"7\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:19:04'),
(18, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":6,\"suppliers_is_active\":1,\"suppliers_name\":\"ssss\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asd\\\",\\\"contact_phone\\\":\\\"324234\\\"}]\",\"suppliers_created\":\"2026-05-13 15:16:17\",\"suppliers_updated\":\"2026-05-13 15:16:17\",\"id\":6,\"is_active\":1,\"messenger\":\"asd\",\"whatsapp\":\"asd\",\"other\":\"asd\",\"name\":\"ssss\",\"path\":\"active/6\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:19:07'),
(19, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":6,\"suppliers_is_active\":0,\"suppliers_name\":\"ssss\",\"suppliers_email\":\"asd\",\"suppliers_phone\":\"\",\"suppliers_address\":\"asd\",\"suppliers_messenger\":\"asd\",\"suppliers_whatsapp\":\"asd\",\"suppliers_other\":\"asd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asd\\\",\\\"contact_phone\\\":\\\"324234\\\"}]\",\"suppliers_created\":\"2026-05-13 15:16:17\",\"suppliers_updated\":\"2026-05-13 15:19:07\",\"id\":6,\"is_active\":0,\"messenger\":\"asd\",\"whatsapp\":\"asd\",\"other\":\"asd\",\"name\":\"ssss\",\"path\":\"6\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:19:10'),
(20, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":1,\"suppliers_is_active\":1,\"suppliers_name\":\"cycy store\",\"suppliers_email\":\"cuy@gmail.com\",\"suppliers_phone\":\"\",\"suppliers_address\":\"San Pablo City\",\"suppliers_messenger\":\"sd\",\"suppliers_whatsapp\":\"\",\"suppliers_other\":\"sd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"zai\\\",\\\"contact_phone\\\":\\\"09099877656\\\"},{\\\"contact_name\\\":\\\"zorene\\\",\\\"contact_phone\\\":\\\"09099878987\\\"}]\",\"suppliers_created\":\"2026-05-12 13:42:42\",\"suppliers_updated\":\"2026-05-12 15:13:10\",\"id\":1,\"is_active\":1,\"messenger\":\"sd\",\"whatsapp\":\"\",\"other\":\"sd\",\"name\":\"cycy store\",\"path\":\"active/1\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:19:13'),
(21, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":1,\"suppliers_is_active\":0,\"suppliers_name\":\"cycy store\",\"suppliers_email\":\"cuy@gmail.com\",\"suppliers_phone\":\"\",\"suppliers_address\":\"San Pablo City\",\"suppliers_messenger\":\"sd\",\"suppliers_whatsapp\":\"\",\"suppliers_other\":\"sd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"zai\\\",\\\"contact_phone\\\":\\\"09099877656\\\"},{\\\"contact_name\\\":\\\"zorene\\\",\\\"contact_phone\\\":\\\"09099878987\\\"}]\",\"suppliers_created\":\"2026-05-12 13:42:42\",\"suppliers_updated\":\"2026-05-13 15:19:13\",\"id\":1,\"is_active\":0,\"messenger\":\"sd\",\"whatsapp\":\"\",\"other\":\"sd\",\"name\":\"cycy store\",\"path\":\"1\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:19:16'),
(22, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":2,\"suppliers_is_active\":1,\"suppliers_name\":\"asdasdds\",\"suppliers_email\":\"\",\"suppliers_phone\":\"\",\"suppliers_address\":\"\",\"suppliers_messenger\":\"\",\"suppliers_whatsapp\":\"\",\"suppliers_other\":\"\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"[]\",\"suppliers_created\":\"2026-05-12 13:54:09\",\"suppliers_updated\":\"2026-05-12 13:54:09\",\"id\":2,\"is_active\":1,\"messenger\":\"\",\"whatsapp\":\"\",\"other\":\"\",\"name\":\"asdasdds\",\"path\":\"active/2\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:19:19'),
(23, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":2,\"suppliers_is_active\":0,\"suppliers_name\":\"asdasdds\",\"suppliers_email\":\"\",\"suppliers_phone\":\"\",\"suppliers_address\":\"\",\"suppliers_messenger\":\"\",\"suppliers_whatsapp\":\"\",\"suppliers_other\":\"\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"[]\",\"suppliers_created\":\"2026-05-12 13:54:09\",\"suppliers_updated\":\"2026-05-13 15:19:19\",\"id\":2,\"is_active\":0,\"messenger\":\"\",\"whatsapp\":\"\",\"other\":\"\",\"name\":\"asdasdds\",\"path\":\"2\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:19:24'),
(24, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":3,\"suppliers_is_active\":1,\"suppliers_name\":\"asdasdasd\",\"suppliers_email\":\"\",\"suppliers_phone\":\"\",\"suppliers_address\":\"\",\"suppliers_messenger\":\"\",\"suppliers_whatsapp\":\"\",\"suppliers_other\":\"\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"\",\"suppliers_contact_person\":\"[]\",\"suppliers_created\":\"2026-05-12 13:55:54\",\"suppliers_updated\":\"2026-05-12 15:35:02\",\"id\":3,\"is_active\":1,\"messenger\":\"\",\"whatsapp\":\"\",\"other\":\"\",\"name\":\"asdasdasd\",\"path\":\"active/3\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:19:26'),
(25, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":3,\"suppliers_is_active\":0,\"suppliers_name\":\"asdasdasd\",\"suppliers_email\":\"\",\"suppliers_phone\":\"\",\"suppliers_address\":\"\",\"suppliers_messenger\":\"\",\"suppliers_whatsapp\":\"\",\"suppliers_other\":\"\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"\",\"suppliers_contact_person\":\"[]\",\"suppliers_created\":\"2026-05-12 13:55:54\",\"suppliers_updated\":\"2026-05-13 15:19:26\",\"id\":3,\"is_active\":0,\"messenger\":\"\",\"whatsapp\":\"\",\"other\":\"\",\"name\":\"asdasdasd\",\"path\":\"3\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:19:30'),
(26, 'suppliers', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"456456dfgdfg\",\"suppliers_phone\":45646456,\"suppliers_address\":\"dgdg\",\"suppliers_messenger\":\"dfgdf\",\"suppliers_whatsapp\":\"gdfgdfg\",\"suppliers_other\":\"fdgdfgf\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"\",\"suppliers_notes\":\"\",\"suppliers_name_old\":\"\"}}]', '2026-05-13 15:19:55'),
(27, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":9,\"suppliers_is_active\":1,\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"456456dfgdfg\",\"suppliers_phone\":\"45646456\",\"suppliers_address\":\"dgdg\",\"suppliers_messenger\":\"dfgdf\",\"suppliers_whatsapp\":\"gdfgdfg\",\"suppliers_other\":\"fdgdfgf\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"dfgdfg\\\",\\\"contact_phone\\\":\\\"45645475\\\"}]\",\"suppliers_created\":\"2026-05-13 15:19:55\",\"suppliers_updated\":\"2026-05-13 15:19:55\",\"id\":9,\"is_active\":1,\"messenger\":\"dfgdf\",\"whatsapp\":\"gdfgdfg\",\"other\":\"fdgdfgf\",\"name\":\"aaaaa\",\"path\":\"active/9\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:21:13'),
(28, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":9,\"suppliers_is_active\":0,\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"456456dfgdfg\",\"suppliers_phone\":\"45646456\",\"suppliers_address\":\"dgdg\",\"suppliers_messenger\":\"dfgdf\",\"suppliers_whatsapp\":\"gdfgdfg\",\"suppliers_other\":\"fdgdfgf\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"dfgdfg\\\",\\\"contact_phone\\\":\\\"45645475\\\"}]\",\"suppliers_created\":\"2026-05-13 15:19:55\",\"suppliers_updated\":\"2026-05-13 15:21:13\",\"id\":9,\"is_active\":0,\"messenger\":\"dfgdf\",\"whatsapp\":\"gdfgdfg\",\"other\":\"fdgdfgf\",\"name\":\"aaaaa\",\"path\":\"9\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:21:15'),
(29, 'suppliers', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":8,\"suppliers_is_active\":1,\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"456456dfgdfg\",\"suppliers_phone\":\"45646456\",\"suppliers_address\":\"dgdg\",\"suppliers_messenger\":\"dfgdf\",\"suppliers_whatsapp\":\"gdfgdfg\",\"suppliers_other\":\"fdgdfgf\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"dfgdfg\\\",\\\"contact_phone\\\":\\\"45645475\\\"}]\",\"suppliers_created\":\"2026-05-13 15:19:55\",\"suppliers_updated\":\"2026-05-13 15:19:55\",\"id\":8,\"is_active\":1,\"messenger\":\"dfgdf\",\"whatsapp\":\"gdfgdfg\",\"other\":\"fdgdfgf\",\"name\":\"aaaaa\",\"path\":\"active/8\",\"menu\":\"suppliers\",\"action\":\"archieve\"}}]', '2026-05-13 15:21:19'),
(30, 'suppliers', 'delete', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_aid\":8,\"suppliers_is_active\":0,\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"456456dfgdfg\",\"suppliers_phone\":\"45646456\",\"suppliers_address\":\"dgdg\",\"suppliers_messenger\":\"dfgdf\",\"suppliers_whatsapp\":\"gdfgdfg\",\"suppliers_other\":\"fdgdfgf\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Monday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"dfgdfg\\\",\\\"contact_phone\\\":\\\"45645475\\\"}]\",\"suppliers_created\":\"2026-05-13 15:19:55\",\"suppliers_updated\":\"2026-05-13 15:21:19\",\"id\":8,\"is_active\":0,\"messenger\":\"dfgdf\",\"whatsapp\":\"gdfgdfg\",\"other\":\"fdgdfgf\",\"name\":\"aaaaa\",\"path\":\"8\",\"menu\":\"suppliers\",\"action\":\"delete\"}}]', '2026-05-13 15:21:21'),
(31, 'suppliers', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"asdasd@gmail.com\",\"suppliers_phone\":343434,\"suppliers_address\":\"asdasd\",\"suppliers_messenger\":\"asdas\",\"suppliers_whatsapp\":\"dasd\",\"suppliers_other\":\"sdasdasd\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"\",\"suppliers_notes\":\"\",\"suppliers_name_old\":\"\"}}]', '2026-05-13 15:25:42'),
(32, 'suppliers product', 'create', 3, 'Cyrene Lumabas', 'developer', '{\"suppliers_aid\":null,\"suppliers_is_active\":1,\"suppliers_name\":\"aaaaa\",\"suppliers_email\":\"asdasd@gmail.com\",\"suppliers_phone\":343434,\"suppliers_address\":\"asdasd\",\"suppliers_messenger\":\"asdas\",\"suppliers_whatsapp\":\"dasd\",\"suppliers_other\":\"sdasdasd\",\"suppliers_notes\":\"\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"[{\\\"contact_name\\\":\\\"asdasd\\\",\\\"contact_phone\\\":\\\"32345345345\\\"}]\",\"suppliers_created\":\"2026-05-13 15:25:42\",\"suppliers_updated\":\"2026-05-13 15:25:42\",\"suppliers_product_name\":\"asdasda\",\"suppliers_product_price\":\"345341\",\"suppliers_product_unit\":\"sdad\",\"suppliers_product_is_active\":1,\"suppliers_product_supplier_id\":null,\"suppliers_product_supplier_name\":\"aaaaa\",\"suppliers_product_created\":\"2026-05-13 15:25:42\",\"suppliers_product_updated\":\"2026-05-13 15:25:42\",\"connection\":{},\"lastInsertedId\":\"10\",\"tblSuppliers\":\"graces_suppliers\",\"tblSuppliersProduct\":\"graces_suppliers_product\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"max\":null}', '2026-05-13 15:25:42'),
(33, 'suppliers', 'update', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_name\":\"bb\",\"suppliers_email\":\"asdasd@gmail.com\",\"suppliers_phone\":\"343434\",\"suppliers_address\":\"asdasd\",\"suppliers_messenger\":\"asdas\",\"suppliers_whatsapp\":\"dasd\",\"suppliers_other\":\"sdasdasd\",\"suppliers_delivery\":\"Tuesday\",\"suppliers_contact_person\":\"\",\"suppliers_notes\":\"\",\"suppliers_name_old\":\"aaaaa\"}}]', '2026-05-13 15:29:50'),
(34, 'suppliers product', 'create', 3, 'Cyrene Lumabas', 'developer', '{\"suppliers_product_aid\":\"11\",\"suppliers_product_name\":\"aas\",\"suppliers_product_price\":\"111111\",\"suppliers_product_unit\":\"dfsdf1111\",\"suppliers_product_supplier_id\":null,\"suppliers_product_supplier_name\":null,\"suppliers_product_is_active\":null,\"suppliers_product_created\":null,\"suppliers_product_updated\":\"2026-05-13 15:41:27\",\"connection\":{},\"lastInsertedId\":null,\"tblSuppliersProduct\":\"graces_suppliers_product\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"max\":null}', '2026-05-13 15:41:27'),
(35, 'suppliers product', 'create', 3, 'Cyrene Lumabas', 'developer', '{\"suppliers_product_aid\":\"11\",\"suppliers_product_name\":\"aas\",\"suppliers_product_price\":\"111111s\",\"suppliers_product_unit\":\"dfsdf1111\",\"suppliers_product_supplier_id\":null,\"suppliers_product_supplier_name\":null,\"suppliers_product_is_active\":null,\"suppliers_product_created\":null,\"suppliers_product_updated\":\"2026-05-13 15:41:34\",\"connection\":{},\"lastInsertedId\":null,\"tblSuppliersProduct\":\"graces_suppliers_product\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"max\":null}', '2026-05-13 15:41:34'),
(36, 'suppliers product', 'create', 3, 'Cyrene Lumabas', 'developer', '{\"suppliers_product_aid\":\"11\",\"suppliers_product_name\":\"a\",\"suppliers_product_price\":\"111111s\",\"suppliers_product_unit\":\"dfsdf1111\",\"suppliers_product_supplier_id\":null,\"suppliers_product_supplier_name\":null,\"suppliers_product_is_active\":null,\"suppliers_product_created\":null,\"suppliers_product_updated\":\"2026-05-13 15:42:13\",\"connection\":{},\"lastInsertedId\":null,\"tblSuppliersProduct\":\"graces_suppliers_product\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"max\":null}', '2026-05-13 15:42:13'),
(37, 'suppliers product', 'archieve', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_product_aid\":11,\"suppliers_product_name\":\"a\",\"suppliers_product_price\":\"111111s\",\"suppliers_product_unit\":\"dfsdf1111\",\"suppliers_product_supplier_id\":10,\"suppliers_product_supplier_name\":\"bb\",\"suppliers_product_is_active\":1,\"suppliers_product_created\":\"2026-05-13 15:32:14\",\"suppliers_product_updated\":\"2026-05-13 15:42:13\",\"id\":11,\"is_active\":1,\"name\":\"a\",\"path\":\"active/11\",\"menu\":\"suppliers-product\",\"action\":\"archieve\"}}]', '2026-05-13 15:43:57'),
(38, 'suppliers product', 'restore', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"suppliers_product_aid\":11,\"suppliers_product_name\":\"a\",\"suppliers_product_price\":\"111111s\",\"suppliers_product_unit\":\"dfsdf1111\",\"suppliers_product_supplier_id\":10,\"suppliers_product_supplier_name\":\"bb\",\"suppliers_product_is_active\":0,\"suppliers_product_created\":\"2026-05-13 15:32:14\",\"suppliers_product_updated\":\"2026-05-13 15:43:57\",\"id\":11,\"is_active\":0,\"name\":\"a\",\"path\":\"active/11\",\"menu\":\"suppliers-product\",\"action\":\"restore\"}}]', '2026-05-13 15:43:59'),
(39, 'user', 'reset password', 3, 'Cyrene Lumabas', 'developer', '{\"user_account_aid\":\"4\",\"user_account_is_active\":null,\"user_account_first_name\":null,\"user_account_last_name\":null,\"user_account_email\":\"cyrene.lumabas@frontlinebusiness.com.ph\",\"user_account_role_id\":null,\"user_account_role\":null,\"user_account_key\":\"543e373f1ddca37d94aeabda6757f87693a321170d1c648f6c8ab4e73de34ec8\",\"user_account_password\":null,\"user_account_created\":null,\"user_account_updated\":\"2026-05-13 16:24:42\",\"isDeveloper\":null,\"connection\":{},\"lastInsertedId\":null,\"tblUserAccount\":\"graces_user_account\",\"tblActivityLog\":\"graces_activity_log\",\"tblProducts\":\"graces_products\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"column_fullname\":null,\"max\":null}', '2026-05-13 16:24:46'),
(40, 'role', 'create', 3, 'Cyrene Lumabas', 'developer', '[{\"values\":{\"role_aid\":\"\",\"role_name\":\"aaaaa\",\"role_description\":\"aaaaa\",\"role_name_old\":\"\",\"role_description_old\":\"\"}}]', '2026-05-13 16:42:41'),
(41, 'user', 'forget password', 4, 'Cyzai Lumabas', 'Product Owner', '{\"user_account_aid\":null,\"user_account_is_active\":null,\"user_account_first_name\":null,\"user_account_last_name\":null,\"user_account_email\":\"cyrene.lumabas@frontlinebusiness.com.ph\",\"user_account_role_id\":null,\"user_account_role\":null,\"user_account_key\":\"1106bb681c1ef57ffeff592d038d7775f1e641a874702fdf1216358c81096c7e\",\"user_account_password\":null,\"user_account_created\":null,\"user_account_updated\":\"2026-05-13 17:15:52\",\"isDeveloper\":null,\"connection\":{},\"lastInsertedId\":null,\"tblUserAccount\":\"graces_user_account\",\"tblActivityLog\":\"graces_activity_log\",\"tblProducts\":\"graces_products\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"column_fullname\":null,\"max\":null}', '2026-05-13 17:15:56'),
(42, 'user', 'forget password', 4, 'cyzai lumabas', 'product owner', '{\"user_account_aid\":null,\"user_account_is_active\":null,\"user_account_first_name\":null,\"user_account_last_name\":null,\"user_account_email\":\"cyrene.lumabas@frontlinebusiness.com.ph\",\"user_account_role_id\":null,\"user_account_role\":null,\"user_account_key\":\"bdade39bfeb6474260ed3629aaa7e15b046e621b82ac6677d502fb85c55aef52\",\"user_account_password\":null,\"user_account_created\":null,\"user_account_updated\":\"2026-05-13 17:18:16\",\"isDeveloper\":null,\"connection\":{},\"lastInsertedId\":null,\"tblUserAccount\":\"graces_user_account\",\"tblActivityLog\":\"graces_activity_log\",\"tblProducts\":\"graces_products\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"column_fullname\":null,\"max\":null}', '2026-05-13 17:18:20'),
(43, 'user', 'login', 3, 'cyrene lumabas', 'developer', '{\"user_account_aid\":null,\"user_account_is_active\":null,\"user_account_first_name\":null,\"user_account_last_name\":null,\"user_account_email\":\"cyrenemlumabas@gmail.com\",\"user_account_role_id\":null,\"user_account_role\":null,\"user_account_key\":null,\"user_account_password\":null,\"user_account_created\":null,\"user_account_updated\":null,\"isDeveloper\":null,\"connection\":{},\"lastInsertedId\":null,\"tblUserAccount\":\"graces_user_account\",\"tblActivityLog\":\"graces_activity_log\",\"tblProducts\":\"graces_products\",\"filters\":null,\"column_start\":null,\"column_total\":null,\"column_search\":null,\"column_fullname\":null,\"max\":null}', '2026-05-13 17:23:33'),
(44, 'purchase order', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"purchase_order_aid\":\"\",\"purchase_order_number\":\"PO-003\",\"purchase_order_supplier_id\":\"10\",\"purchase_order_supplier_name\":\"bb\",\"purchase_order_date\":\"2026-05-14\",\"purchase_order_expected_delivery\":\"2026-05-14\",\"purchase_order_total_amount\":\"\",\"purchase_order_payment\":30000,\"purchase_order_status\":\"draft\",\"purchase_order_payment_status\":\"draft\",\"purchase_order_note\":\"test data\",\"purchase_order_number_old\":\"\",\"purchase_order\":[{\"purchase_order_product_id\":\"11\",\"purchase_order_product_name\":\"a\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"100\",\"purchase_order_price\":\"10\",\"purchase_order_total_amount\":1000,\"purchase_order_total\":1000},{\"purchase_order_product_id\":\"10\",\"purchase_order_product_name\":\"asdasda\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"200\",\"purchase_order_price\":\"20\",\"id\":0,\"purchase_order_total\":4000,\"purchase_order_total_amount\":4000},{\"purchase_order_product_id\":\"11\",\"purchase_order_product_name\":\"a\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"300\",\"purchase_order_price\":\"30\",\"id\":1,\"purchase_order_total\":9000,\"purchase_order_total_amount\":9000},{\"purchase_order_product_id\":\"10\",\"purchase_order_product_name\":\"asdasda\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"400\",\"purchase_order_price\":\"40\",\"id\":2,\"purchase_order_total\":16000,\"purchase_order_total_amount\":16000}]}}]', '2026-05-14 13:03:40'),
(45, 'purchase order', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"purchase_order_aid\":\"\",\"purchase_order_number\":\"PO-001\",\"purchase_order_supplier_id\":\"10\",\"purchase_order_supplier_name\":\"bb\",\"purchase_order_date\":\"2026-05-14\",\"purchase_order_expected_delivery\":\"2026-05-14\",\"purchase_order_total_amount\":\"\",\"purchase_order_payment\":250000,\"purchase_order_status\":\"draft\",\"purchase_order_payment_status\":\"draft\",\"purchase_order_note\":\"test data\",\"purchase_order_number_old\":\"\",\"purchase_order\":[{\"purchase_order_product_id\":\"11\",\"purchase_order_product_name\":\"a\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"100\",\"purchase_order_price\":\"10\",\"purchase_order_total_amount\":1000},{\"purchase_order_product_id\":\"10\",\"purchase_order_product_name\":\"asdasda\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"200\",\"purchase_order_price\":\"20\",\"purchase_order_total_amount\":4000,\"id\":0},{\"purchase_order_product_id\":\"11\",\"purchase_order_product_name\":\"a\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"300\",\"purchase_order_price\":\"30\",\"purchase_order_total_amount\":9000,\"id\":1},{\"purchase_order_product_id\":\"10\",\"purchase_order_product_name\":\"asdasda\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"400\",\"purchase_order_price\":\"40\",\"purchase_order_total_amount\":16000,\"id\":2},{\"purchase_order_product_id\":\"10\",\"purchase_order_product_name\":\"asdasda\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"500\",\"purchase_order_price\":\"50\",\"purchase_order_total_amount\":25000,\"id\":3}]}}]', '2026-05-14 13:11:57'),
(46, 'purchase order', 'create', 3, 'cyrene lumabas', 'developer', '[{\"values\":{\"purchase_order_aid\":\"\",\"purchase_order_number\":\"PO-002\",\"purchase_order_supplier_id\":\"10\",\"purchase_order_supplier_name\":\"bb\",\"purchase_order_date\":\"2026-05-14\",\"purchase_order_expected_delivery\":\"2026-05-14\",\"purchase_order_total_amount\":\"\",\"purchase_order_payment\":\"0\",\"purchase_order_status\":\"draft\",\"purchase_order_payment_status\":\"draft\",\"purchase_order_note\":\"test data\",\"purchase_order_number_old\":\"\",\"purchase_order\":[{\"purchase_order_product_id\":\"11\",\"purchase_order_product_name\":\"a\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"1000\",\"purchase_order_price\":\"10\",\"purchase_order_total_amount\":10000},{\"purchase_order_product_id\":\"10\",\"purchase_order_product_name\":\"asdasda\",\"purchase_order_product_owner_id\":\"4\",\"purchase_order_product_owner_name\":\"Cyzai Lumabas\",\"purchase_order_qty\":\"2000\",\"purchase_order_price\":\"20\",\"purchase_order_total_amount\":40000,\"id\":0}]}}]', '2026-05-14 13:14:25');

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
(1, 'active', 0, '', 'asdasd', 'dasd', '121', '121', '121', '1112', 1, 'cycy store', 4, 'Cyzai Lumabas', '', '1212', 'asdasd', '11', 'test data', '2026-05-13 06:55:59', '2026-05-13 14:18:27'),
(2, 'active', 1, '', 'asd', 'asd', 'asd', '132', '123', '1222', 0, '', 4, 'Cyzai Lumabas', '', 'pcs', 'sada', '1', 'sdsd', '2026-05-13 14:00:32', '2026-05-13 14:24:41'),
(3, 'active', 1, '', 'aaaaa', 'asda', 'asdas', '231231', '131', '123123', 3, 'asdasdasd', 4, 'Cyzai Lumabas', '', 'asdasd', 'sdasd', '1312312', '', '2026-05-13 14:23:47', '2026-05-13 14:23:47');

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
(1, '2026-05-19', 'in stock', 'active', 1, '3', 'aaaaa', '0', '0', '100', '', '4', 'Cyzai Lumabas', '', '2026-05-19 12:39:22', '2026-05-19 12:39:22');

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
  MODIFY `activity_log_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `graces_customer`
--
ALTER TABLE `graces_customer`
  MODIFY `customer_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `graces_products`
--
ALTER TABLE `graces_products`
  MODIFY `products_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `graces_roles`
--
ALTER TABLE `graces_roles`
  MODIFY `role_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `graces_stock_movement`
--
ALTER TABLE `graces_stock_movement`
  MODIFY `stock_movement_aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
