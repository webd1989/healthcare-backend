-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2025 at 09:43 AM
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
-- Database: `heathcare_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `appoinments`
--

CREATE TABLE `appoinments` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_mobile` varchar(255) NOT NULL,
  `doctor_id` varchar(255) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `doctor_email` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `appointment_time` time NOT NULL,
  `appointment_date` date NOT NULL,
  `fields_data` varchar(255) NOT NULL,
  `user_first_name` varchar(255) NOT NULL,
  `user_last_name` varchar(255) NOT NULL,
  `patient_id` varchar(255) DEFAULT NULL,
  `visit_id` varchar(255) DEFAULT NULL,
  `question_answers` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appoinments`
--

INSERT INTO `appoinments` (`id`, `user_id`, `user_name`, `user_email`, `user_mobile`, `doctor_id`, `doctor_name`, `doctor_email`, `created_at`, `appointment_time`, `appointment_date`, `fields_data`, `user_first_name`, `user_last_name`, `patient_id`, `visit_id`, `question_answers`) VALUES
(1, '1', 'Pankaj Sharma', '', '9571997180', '2', 'Pankaj', 'panakj2089@gmail.com', '2025-11-15 08:29:22.831447', '10:00:00', '2025-11-16', '{\"user_first_name\":\"Pankaj\",\"user_last_name\":\"Sharma\",\"user_mobile\":\"9571997180\",\"Message\":\"Here\'s a fun fact about the Roman Empire: Ancient Romans used a condiment called \\\"garum\\\" in many of their dishes. Garum was a fermented fish sauce that served as', 'Pankaj', 'Sharma', 'gAAAAABpGDnIZDWiCZObeq8sQNemCSZsW-6w7pa-Khrj-7jIKmBYAxTnzEosPilurvIIFZkqf6Ld1smmtTBqazelOX_wHHiMtVrt_oiTbHXZ1uMyIS_3sgk=', 'CONSULT-20251115-544', '');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `created_at`, `name`) VALUES
(1, '2025-09-10 11:12:00.692915', 'Canada'),
(2, '2025-09-10 11:12:00.692915', 'United Kingdom'),
(3, '2025-09-10 11:12:00.692915', 'Australia'),
(4, '2025-09-10 11:12:00.692915', 'Afghanistan'),
(5, '2025-09-10 11:12:00.692915', 'Albania'),
(6, '2025-09-10 11:12:00.692915', 'Algeria'),
(7, '2025-09-10 11:12:00.692915', 'United States'),
(8, '2025-09-10 11:12:00.692915', 'American Samoa'),
(9, '2025-09-10 11:12:00.692915', 'Andorra'),
(10, '2025-09-10 11:12:00.692915', 'Angola'),
(11, '2025-09-10 11:12:00.692915', 'Anguilla'),
(12, '2025-09-10 11:12:00.692915', 'Antarctica'),
(13, '2025-09-10 11:12:00.692915', 'Antigua and Barbuda'),
(14, '2025-09-10 11:12:00.692915', 'Argentina'),
(15, '2025-09-10 11:12:00.692915', 'Armenia'),
(16, '2025-09-10 11:12:00.692915', 'Aruba'),
(17, '2025-09-10 11:12:00.692915', 'Austria'),
(18, '2025-09-10 11:12:00.692915', 'Azerbaijan'),
(19, '2025-09-10 11:12:00.692915', 'Bahamas'),
(20, '2025-09-10 11:12:00.692915', 'Bahrain'),
(21, '2025-09-10 11:12:00.692915', 'Bangladesh'),
(22, '2025-09-10 11:12:00.692915', 'Barbados'),
(23, '2025-09-10 11:12:00.692915', 'Belarus'),
(24, '2025-09-10 11:12:00.692915', 'Belgium'),
(25, '2025-09-10 11:12:00.692915', 'Belize'),
(26, '2025-09-10 11:12:00.692915', 'Benin'),
(27, '2025-09-10 11:12:00.692915', 'Bermuda'),
(28, '2025-09-10 11:12:00.692915', 'Bhutan'),
(29, '2025-09-10 11:12:00.692915', 'Bolivia'),
(30, '2025-09-10 11:12:00.692915', 'Bonaire'),
(31, '2025-09-10 11:12:00.692915', 'Bosnia and Herzegovina'),
(32, '2025-09-10 11:12:00.692915', 'Botswana'),
(33, '2025-09-10 11:12:00.692915', 'Bouvet Island'),
(34, '2025-09-10 11:12:00.692915', 'Brazil'),
(35, '2025-09-10 11:12:00.692915', 'British Indian Ocean Territory'),
(36, '2025-09-10 11:12:00.692915', 'British Virgin Islands'),
(37, '2025-09-10 11:12:00.692915', 'Brunei'),
(38, '2025-09-10 11:12:00.692915', 'Bulgaria'),
(39, '2025-09-10 11:12:00.692915', 'Burkina Faso'),
(40, '2025-09-10 11:12:00.692915', 'Burundi'),
(41, '2025-09-10 11:12:00.692915', 'Cambodia'),
(42, '2025-09-10 11:12:00.692915', 'Cameroon'),
(43, '2025-09-10 11:12:00.692915', 'Cape Verde'),
(44, '2025-09-10 11:12:00.692915', 'Cayman Islands'),
(45, '2025-09-10 11:12:00.692915', 'Central African Republic'),
(46, '2025-09-10 11:12:00.692915', 'Chad'),
(47, '2025-09-10 11:12:00.692915', 'Chile'),
(48, '2025-09-10 11:12:00.692915', 'China'),
(49, '2025-09-10 11:12:00.692915', 'Christmas Island'),
(50, '2025-09-10 11:12:00.692915', 'Cocos [Keeling] Islands'),
(51, '2025-09-10 11:12:00.692915', 'Colombia'),
(52, '2025-09-10 11:12:00.692915', 'Comoros'),
(53, '2025-09-10 11:12:00.692915', 'Cook Islands'),
(54, '2025-09-10 11:12:00.692915', 'Costa Rica'),
(55, '2025-09-10 11:12:00.692915', 'Croatia'),
(56, '2025-09-10 11:12:00.692915', 'Cuba'),
(57, '2025-09-10 11:12:00.692915', 'Curacao'),
(58, '2025-09-10 11:12:00.692915', 'Cyprus'),
(59, '2025-09-10 11:12:00.692915', 'Czech Republic'),
(60, '2025-09-10 11:12:00.692915', 'Democratic Republic of the Congo'),
(61, '2025-09-10 11:12:00.692915', 'Denmark'),
(62, '2025-09-10 11:12:00.692915', 'Djibouti'),
(63, '2025-09-10 11:12:00.692915', 'Dominica'),
(64, '2025-09-10 11:12:00.692915', 'Dominican Republic'),
(65, '2025-09-10 11:12:00.692915', 'East Timor'),
(66, '2025-09-10 11:12:00.692915', 'Ecuador'),
(67, '2025-09-10 11:12:00.692915', 'Egypt'),
(68, '2025-09-10 11:12:00.692915', 'El Salvador'),
(69, '2025-09-10 11:12:00.692915', 'Equatorial Guinea'),
(70, '2025-09-10 11:12:00.692915', 'Eritrea'),
(71, '2025-09-10 11:12:00.692915', 'Estonia'),
(72, '2025-09-10 11:12:00.692915', 'Ethiopia'),
(73, '2025-09-10 11:12:00.692915', 'Falkland Islands'),
(74, '2025-09-10 11:12:00.692915', 'Faroe Islands'),
(75, '2025-09-10 11:12:00.692915', 'Fiji'),
(76, '2025-09-10 11:12:00.692915', 'Finland'),
(77, '2025-09-10 11:12:00.692915', 'France'),
(78, '2025-09-10 11:12:00.692915', 'French Guiana'),
(79, '2025-09-10 11:12:00.692915', 'French Polynesia'),
(80, '2025-09-10 11:12:00.692915', 'French Southern Territories'),
(81, '2025-09-10 11:12:00.692915', 'Gabon'),
(82, '2025-09-10 11:12:00.692915', 'Gambia'),
(83, '2025-09-10 11:12:00.692915', 'Georgia'),
(84, '2025-09-10 11:12:00.692915', 'Germany'),
(85, '2025-09-10 11:12:00.692915', 'Ghana'),
(86, '2025-09-10 11:12:00.692915', 'Gibraltar'),
(87, '2025-09-10 11:12:00.692915', 'Greece'),
(88, '2025-09-10 11:12:00.692915', 'Greenland'),
(89, '2025-09-10 11:12:00.692915', 'Grenada'),
(90, '2025-09-10 11:12:00.692915', 'Guadeloupe'),
(91, '2025-09-10 11:12:00.692915', 'Guam'),
(92, '2025-09-10 11:12:00.692915', 'Guatemala'),
(93, '2025-09-10 11:12:00.692915', 'Guernsey'),
(94, '2025-09-10 11:12:00.692915', 'Guinea'),
(95, '2025-09-10 11:12:00.692915', 'Guinea-Bissau'),
(96, '2025-09-10 11:12:00.692915', 'Guyana'),
(97, '2025-09-10 11:12:00.692915', 'Haiti'),
(98, '2025-09-10 11:12:00.692915', 'Heard Island and McDonald Islands'),
(99, '2025-09-10 11:12:00.692915', 'Honduras'),
(100, '2025-09-10 11:12:00.692915', 'Hong Kong'),
(101, '2025-09-10 11:12:00.692915', 'Hungary'),
(102, '2025-09-10 11:12:00.692915', 'Iceland'),
(103, '2025-09-10 11:12:00.692915', 'India'),
(104, '2025-09-10 11:12:00.692915', 'Indonesia'),
(105, '2025-09-10 11:12:00.692915', 'Iran'),
(106, '2025-09-10 11:12:00.692915', 'Iraq'),
(107, '2025-09-10 11:12:00.692915', 'Ireland'),
(108, '2025-09-10 11:12:00.692915', 'Isle of Man'),
(109, '2025-09-10 11:12:00.692915', 'Israel'),
(110, '2025-09-10 11:12:00.692915', 'Italy'),
(111, '2025-09-10 11:12:00.692915', 'Ivory Coast'),
(112, '2025-09-10 11:12:00.692915', 'Jamaica'),
(113, '2025-09-10 11:12:00.692915', 'Japan'),
(114, '2025-09-10 11:12:00.692915', 'Jersey'),
(115, '2025-09-10 11:12:00.692915', 'Jordan'),
(116, '2025-09-10 11:12:00.692915', 'Kazakhstan'),
(117, '2025-09-10 11:12:00.692915', 'Kenya'),
(118, '2025-09-10 11:12:00.692915', 'Kiribati'),
(119, '2025-09-10 11:12:00.692915', 'Kosovo'),
(120, '2025-09-10 11:12:00.692915', 'Kuwait'),
(121, '2025-09-10 11:12:00.692915', 'Kyrgyzstan'),
(122, '2025-09-10 11:12:00.692915', 'Laos'),
(123, '2025-09-10 11:12:00.692915', 'Latvia'),
(124, '2025-09-10 11:12:00.692915', 'Lebanon'),
(125, '2025-09-10 11:12:00.692915', 'Lesotho'),
(126, '2025-09-10 11:12:00.692915', 'Liberia'),
(127, '2025-09-10 11:12:00.692915', 'Libya'),
(128, '2025-09-10 11:12:00.692915', 'Liechtenstein'),
(129, '2025-09-10 11:12:00.692915', 'Lithuania'),
(130, '2025-09-10 11:12:00.692915', 'Luxembourg'),
(131, '2025-09-10 11:12:00.692915', 'Macao'),
(132, '2025-09-10 11:12:00.692915', 'Madagascar'),
(133, '2025-09-10 11:12:00.692915', 'Malawi'),
(134, '2025-09-10 11:12:00.692915', 'Malaysia'),
(135, '2025-09-10 11:12:00.692915', 'Maldives'),
(136, '2025-09-10 11:12:00.692915', 'Mali'),
(137, '2025-09-10 11:12:00.692915', 'Malta'),
(138, '2025-09-10 11:12:00.692915', 'Marshall Islands'),
(139, '2025-09-10 11:12:00.692915', 'Martinique'),
(140, '2025-09-10 11:12:00.692915', 'Mauritania'),
(141, '2025-09-10 11:12:00.692915', 'Mauritius'),
(142, '2025-09-10 11:12:00.692915', 'Mayotte'),
(143, '2025-09-10 11:12:00.692915', 'Mexico'),
(144, '2025-09-10 11:12:00.692915', 'Micronesia'),
(145, '2025-09-10 11:12:00.692915', 'Moldova'),
(146, '2025-09-10 11:12:00.692915', 'Monaco'),
(147, '2025-09-10 11:12:00.692915', 'Mongolia'),
(148, '2025-09-10 11:12:00.692915', 'Montenegro'),
(149, '2025-09-10 11:12:00.692915', 'Montserrat'),
(150, '2025-09-10 11:12:00.692915', 'Morocco'),
(151, '2025-09-10 11:12:00.692915', 'Mozambique'),
(152, '2025-09-10 11:12:00.692915', 'Myanmar [Burma]'),
(153, '2025-09-10 11:12:00.692915', 'Namibia'),
(154, '2025-09-10 11:12:00.692915', 'Nauru'),
(155, '2025-09-10 11:12:00.692915', 'Nepal'),
(156, '2025-09-10 11:12:00.692915', 'Netherlands'),
(157, '2025-09-10 11:12:00.692915', 'New Caledonia'),
(158, '2025-09-10 11:12:00.692915', 'New Zealand'),
(159, '2025-09-10 11:12:00.692915', 'Nicaragua'),
(160, '2025-09-10 11:12:00.692915', 'Niger'),
(161, '2025-09-10 11:12:00.692915', 'Nigeria'),
(162, '2025-09-10 11:12:00.692915', 'Niue'),
(163, '2025-09-10 11:12:00.692915', 'Norfolk Island'),
(164, '2025-09-10 11:12:00.692915', 'North Korea'),
(165, '2025-09-10 11:12:00.692915', 'North Macedonia'),
(166, '2025-09-10 11:12:00.692915', 'Northern Mariana Islands'),
(167, '2025-09-10 11:12:00.692915', 'Norway'),
(168, '2025-09-10 11:12:00.692915', 'Oman'),
(169, '2025-09-10 11:12:00.692915', 'Pakistan'),
(170, '2025-09-10 11:12:00.692915', 'Palau'),
(171, '2025-09-10 11:12:00.692915', 'Palestine'),
(172, '2025-09-10 11:12:00.692915', 'Panama'),
(173, '2025-09-10 11:12:00.692915', 'Papua New Guinea'),
(174, '2025-09-10 11:12:00.692915', 'Paraguay'),
(175, '2025-09-10 11:12:00.692915', 'Peru'),
(176, '2025-09-10 11:12:00.692915', 'Philippines'),
(177, '2025-09-10 11:12:00.692915', 'Pitcairn Islands'),
(178, '2025-09-10 11:12:00.692915', 'Poland'),
(179, '2025-09-10 11:12:00.692915', 'Portugal'),
(180, '2025-09-10 11:12:00.692915', 'Puerto Rico'),
(181, '2025-09-10 11:12:00.692915', 'Qatar'),
(182, '2025-09-10 11:12:00.692915', 'Republic of the Congo'),
(183, '2025-09-10 11:12:00.692915', 'Romania'),
(184, '2025-09-10 11:12:00.692915', 'Russia'),
(185, '2025-09-10 11:12:00.692915', 'Rwanda'),
(186, '2025-09-10 11:12:00.692915', 'Réunion'),
(187, '2025-09-10 11:12:00.692915', 'Saint Barthélemy'),
(188, '2025-09-10 11:12:00.692915', 'Saint Helena'),
(189, '2025-09-10 11:12:00.692915', 'Saint Kitts and Nevis'),
(190, '2025-09-10 11:12:00.692915', 'Saint Lucia'),
(191, '2025-09-10 11:12:00.692915', 'Saint Martin'),
(192, '2025-09-10 11:12:00.692915', 'Saint Pierre and Miquelon'),
(193, '2025-09-10 11:12:00.692915', 'Saint Vincent and the Grenadines'),
(194, '2025-09-10 11:12:00.692915', 'Samoa'),
(195, '2025-09-10 11:12:00.692915', 'San Marino'),
(196, '2025-09-10 11:12:00.692915', 'Saudi Arabia'),
(197, '2025-09-10 11:12:00.692915', 'Senegal'),
(198, '2025-09-10 11:12:00.692915', 'Serbia'),
(199, '2025-09-10 11:12:00.692915', 'Seychelles'),
(200, '2025-09-10 11:12:00.692915', 'Sierra Leone'),
(201, '2025-09-10 11:12:00.692915', 'Singapore'),
(202, '2025-09-10 11:12:00.692915', 'Sint Maarten'),
(203, '2025-09-10 11:12:00.692915', 'Slovakia'),
(204, '2025-09-10 11:12:00.692915', 'Slovenia'),
(205, '2025-09-10 11:12:00.692915', 'Solomon Islands'),
(206, '2025-09-10 11:12:00.692915', 'Somalia'),
(207, '2025-09-10 11:12:00.692915', 'South Africa'),
(208, '2025-09-10 11:12:00.692915', 'South Georgia and the South Sandwich Islands'),
(209, '2025-09-10 11:12:00.692915', 'South Korea'),
(210, '2025-09-10 11:12:00.692915', 'South Sudan'),
(211, '2025-09-10 11:12:00.692915', 'Spain'),
(212, '2025-09-10 11:12:00.692915', 'Sri Lanka'),
(213, '2025-09-10 11:12:00.692915', 'Sudan'),
(214, '2025-09-10 11:12:00.692915', 'Suriname'),
(215, '2025-09-10 11:12:00.692915', 'Svalbard and Jan Mayen'),
(216, '2025-09-10 11:12:00.692915', 'Swaziland'),
(217, '2025-09-10 11:12:00.692915', 'Sweden'),
(218, '2025-09-10 11:12:00.692915', 'Switzerland'),
(219, '2025-09-10 11:12:00.692915', 'Syria'),
(220, '2025-09-10 11:12:00.692915', 'São Tomé and Príncipe'),
(221, '2025-09-10 11:12:00.692915', 'Taiwan'),
(222, '2025-09-10 11:12:00.692915', 'Tajikistan'),
(223, '2025-09-10 11:12:00.692915', 'Tanzania'),
(224, '2025-09-10 11:12:00.692915', 'Thailand'),
(225, '2025-09-10 11:12:00.692915', 'Togo'),
(226, '2025-09-10 11:12:00.692915', 'Tokelau'),
(227, '2025-09-10 11:12:00.692915', 'Tonga'),
(228, '2025-09-10 11:12:00.692915', 'Trinidad and Tobago'),
(229, '2025-09-10 11:12:00.692915', 'Tunisia'),
(230, '2025-09-10 11:12:00.692915', 'Turkey'),
(231, '2025-09-10 11:12:00.692915', 'Turkmenistan'),
(232, '2025-09-10 11:12:00.692915', 'Turks and Caicos Islands'),
(233, '2025-09-10 11:12:00.692915', 'Tuvalu'),
(234, '2025-09-10 11:12:00.692915', 'U.S. Minor Outlying Islands'),
(235, '2025-09-10 11:12:00.692915', 'U.S. Virgin Islands'),
(236, '2025-09-10 11:12:00.692915', 'Uganda'),
(237, '2025-09-10 11:12:00.692915', 'Ukraine'),
(238, '2025-09-10 11:12:00.692915', 'United Arab Emirates'),
(239, '2025-09-10 11:12:00.692915', 'Uruguay'),
(240, '2025-09-10 11:12:00.692915', 'Uzbekistan'),
(241, '2025-09-10 11:12:00.692915', 'Vanuatu'),
(242, '2025-09-10 11:12:00.692915', 'Vatican City'),
(243, '2025-09-10 11:12:00.692915', 'Venezuela'),
(244, '2025-09-10 11:12:00.692915', 'Vietnam'),
(245, '2025-09-10 11:12:00.692915', 'Wallis and Futuna'),
(246, '2025-09-10 11:12:00.692915', 'Western Sahara'),
(247, '2025-09-10 11:12:00.692915', 'Yemen'),
(248, '2025-09-10 11:12:00.692915', 'Zambia'),
(249, '2025-09-10 11:12:00.692915', 'Zimbabwe'),
(250, '2025-09-10 11:12:00.692915', 'Åland');

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `address`, `logo`, `created_at`, `status`) VALUES
(6, 'SMS Hospital', 'Jaipur, Rajasthan', '1757068727155-242319005.png', '2025-09-05 08:25:47.846985', 1),
(8, 'JNU Hospita', 'Jaipur, Rajasthan', '1757069136088-639158832.png', '2025-09-05 08:42:39.876061', 1),
(11, 'Mahatma Gandhi Hospital', 'RIICO Institutional Area, Mahatma Gandhi Rd, Ricco Industrial Area, Sitapura, Jaipur, Ramchandpura, Rajasthan 302022', NULL, '2025-09-05 11:14:13.308199', 1),
(12, 'SMS Hospital', 'Jaipur, Rajasthan', '1757068727155-242319005.png', '2025-09-05 02:55:47.846985', 1),
(13, 'JNU Hospita', 'Jaipur, Rajasthan', '1757069136088-639158832.png', '2025-09-05 03:12:39.876061', 1),
(14, 'Mahatma Gandhi Hospital', 'RIICO Institutional Area, Mahatma Gandhi Rd, Ricco Industrial Area, Sitapura, Jaipur, Ramchandpura, Rajasthan 302022', NULL, '2025-09-05 05:44:13.308199', 1),
(15, 'SMS Hospital', 'Jaipur, Rajasthan', '1757068727155-242319005.png', '2025-09-05 02:55:47.846985', 1),
(16, 'JNU Hospita', 'Jaipur, Rajasthan', '1757069136088-639158832.png', '2025-09-05 03:12:39.876061', 1),
(17, 'Mahatma Gandhi Hospital', 'RIICO Institutional Area, Mahatma Gandhi Rd, Ricco Industrial Area, Sitapura, Jaipur, Ramchandpura, Rajasthan 302022', NULL, '2025-09-05 05:44:13.308199', 1),
(18, 'SMS Hospital', 'Jaipur, Rajasthan', '1757068727155-242319005.png', '2025-09-05 02:55:47.846985', 1),
(19, 'JNU Hospita', 'Jaipur, Rajasthan', '1757069136088-639158832.png', '2025-09-05 03:12:39.876061', 1),
(20, 'Mahatma Gandhi Hospital', 'RIICO Institutional Area, Mahatma Gandhi Rd, Ricco Industrial Area, Sitapura, Jaipur, Ramchandpura, Rajasthan 302022', NULL, '2025-09-05 05:44:13.308199', 1),
(21, 'Test Hospital', '#1234', NULL, '2025-09-09 10:57:47.814173', 1);

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `price` decimal(10,2) NOT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `name`, `status`, `created_at`, `price`, `logo`) VALUES
(1, 'Paracetamol', 1, '2025-09-09 11:21:48.411302', 10.00, NULL),
(2, 'Amoxicillin', 1, '2025-09-09 11:26:06.145373', 50.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `invoice_no` varchar(255) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `plan_type` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `monthly_price` decimal(10,2) NOT NULL,
  `grand_total` decimal(10,2) NOT NULL,
  `templates` varchar(255) NOT NULL,
  `medical_dictation` varchar(255) NOT NULL,
  `ai_assisted` varchar(255) NOT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `plan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `plan_id`, `user_id`, `invoice_no`, `transaction_id`, `plan_type`, `user_name`, `user_email`, `monthly_price`, `grand_total`, `templates`, `medical_dictation`, `ai_assisted`, `start_time`, `end_time`, `created_at`, `plan`) VALUES
(1, 3, 2, 'ORD-000001', '', 'Yearly', 'Pankaj', 'panakj2089@gmail.com', 14.99, 179.88, 'Unlimited', 'Unlimited', '30', '2025-10-09 13:00:28', '2026-10-09 13:00:28', '2025-10-09 13:00:28.671027', '');

-- --------------------------------------------------------

--
-- Table structure for table `patientforms`
--

CREATE TABLE `patientforms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `form_field` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`form_field`)),
  `doctor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patientforms`
--

INSERT INTO `patientforms` (`id`, `name`, `status`, `created_at`, `form_field`, `doctor_id`) VALUES
(2, 'Contact Us', 1, '2025-09-16 12:53:46.193876', '\"[{\\\"type\\\":\\\"textarea\\\",\\\"label\\\":\\\"Message\\\",\\\"options\\\":[]}]\"', 2);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `patient_id` varchar(255) DEFAULT NULL,
  `visit_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `age` varchar(255) DEFAULT NULL,
  `recently_travelled` tinyint(4) DEFAULT 0,
  `consent` tinyint(4) DEFAULT 0,
  `country` varchar(255) DEFAULT 'US',
  `language` varchar(255) DEFAULT 'en',
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `first_question` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `hospital_id`, `doctor_id`, `patient_id`, `visit_id`, `first_name`, `last_name`, `mobile`, `gender`, `age`, `recently_travelled`, `consent`, `country`, `language`, `status`, `created_at`, `first_question`) VALUES
(1, 8, 2, 'gAAAAABpGBPR136LWCD0aZONwnlsQqQkmReW1td-dd3kifq6AFqNgdqZWJeAUdVJ7vE7yCn2HB_jsAgdsoddVHdVrs8alhM2uHSZww5dm4E6FWdC1LwTyQk=', 'CONSULT-20251115-098', 'Pankaj', 'Sharma', '9571997180', 'Male', '35', 0, 1, 'US', 'en', 1, '2025-11-15 05:47:24.067549', 'Why have you come in today? What is the main concern you want help with?');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `monthly_price` decimal(10,2) NOT NULL,
  `monthly_price_for_year` decimal(10,2) NOT NULL,
  `sort_description` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `templates` varchar(255) NOT NULL,
  `templates_description` varchar(255) NOT NULL,
  `medical_dictation` varchar(255) NOT NULL,
  `medical_dictation_description` varchar(255) NOT NULL,
  `ai_assisted` varchar(255) NOT NULL,
  `ai_assisted_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `monthly_price`, `monthly_price_for_year`, `sort_description`, `description`, `status`, `created_at`, `templates`, `templates_description`, `medical_dictation`, `medical_dictation_description`, `ai_assisted`, `ai_assisted_description`) VALUES
(1, 'Unlimited', 0.00, 0.00, '* No credit card required', 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.\n', 1, '2025-09-11 13:30:14.879593', '150', 'templates per month.', '15', 'Monthly minutes of Medical Dictation', '15', 'monthly credits for AI-assisted note generation.'),
(2, 'Premium', 4.99, 3.99, '', 'Unlimited expansion of dot phrases & templates.', 1, '2025-09-12 12:11:51.204450', 'Unlimited', 'use of template. create private templates.', '20', 'monthly minutes of medical dictation.', '20', 'monthly credits for AI-assisted note generation.'),
(3, 'Professional', 15.99, 14.99, '', 'Unlimited dictation with live speech to text.', 1, '2025-09-12 12:35:38.176872', 'Unlimited', 'use of template. create private templates.', 'Unlimited', 'monthly minutes of medical dictation', '30', 'monthly credits for AI-assisted note generation.'),
(4, 'Max', 99.99, 98.99, '', 'Unlimited AI Subscribe, Voice Chart, and Copilot.', 1, '2025-09-12 12:37:16.054253', 'Unlimited', 'use of template. create private templates.', 'Unlimited', 'monthly minutes of medical dictation.', 'Unlimited', 'monthly credits for AI-assisted note generation.');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `permissions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `status`, `created_at`, `permissions`) VALUES
(1, 'Super Admin', 1, '2025-09-19 12:08:27.638805', '[{\"module\":\"Users\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Hospitals\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Doctors\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Staffs\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Patients\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Medicines\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Subscription Plans\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]}]'),
(2, 'Account Manager', 1, '2025-09-19 12:15:50.694836', '[{\"module\":\"Users\",\"enabled\":false,\"permissions\":[{\"name\":\"Add\",\"checked\":false},{\"name\":\"Edit\",\"checked\":false},{\"name\":\"Delete\",\"checked\":false}]},{\"module\":\"Hospitals\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]},{\"module\":\"Doctors\",\"enabled\":false,\"permissions\":[{\"name\":\"Add\",\"checked\":false},{\"name\":\"Edit\",\"checked\":false},{\"name\":\"Delete\",\"checked\":false}]},{\"module\":\"Staffs\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":false}]},{\"module\":\"Patients\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":false},{\"name\":\"Edit\",\"checked\":false},{\"name\":\"Delete\",\"checked\":false}]},{\"module\":\"Medicines\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":false},{\"name\":\"Edit\",\"checked\":false},{\"name\":\"Delete\",\"checked\":false}]},{\"module\":\"Subscription Plans\",\"enabled\":true,\"permissions\":[{\"name\":\"Add\",\"checked\":true},{\"name\":\"Edit\",\"checked\":true},{\"name\":\"Delete\",\"checked\":true}]}]');

-- --------------------------------------------------------

--
-- Table structure for table `support-ticket-comments`
--

CREATE TABLE `support-ticket-comments` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `attachment` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support-ticket-comments`
--

INSERT INTO `support-ticket-comments` (`id`, `ticket_id`, `message`, `status`, `created_at`, `attachment`, `user_id`, `user_name`) VALUES
(1, 1, 'Dear,\n\nI hope this email finds you well. I am writing to formally request a two-day leave from work on [start date] to [end date]. The reason for my request is [mention the reason briefly, such as personal commitments, family matters, or any other relevan', 0, '2025-10-13 12:33:15.905272', NULL, 1, 'Pankaj Sharma'),
(2, 1, 'AiWave, an AI-driven messaging platform, adeptly communicates with users using natural language understanding. It delivers helpful responses to your inquiries and requests.', 0, '2025-10-13 12:35:55.418021', NULL, 1, 'Pankaj Sharma'),
(3, 1, 'AiWave, an AI-driven messaging platform, adeptly communicates with users using natural language understanding. It delivers helpful responses to your inquiries and requests.', 0, '2025-10-13 12:36:13.238304', NULL, 1, 'Pankaj Sharma'),
(4, 1, 'AiWave, an AI-driven messaging platform, adeptly communicates with users using natural language understanding. It delivers helpful responses to your inquiries and requests.', 0, '2025-10-13 12:36:51.252851', NULL, 1, 'Pankaj Sharma'),
(5, 1, 'AiWave, an AI-driven messaging platform, adeptly communicates with users using natural language understanding. It delivers helpful responses to your inquiries and requests.', 0, '2025-10-13 12:39:57.814383', NULL, 1, 'Pankaj Sharma'),
(6, 1, 'AiWave, an AI-driven messaging platform, adeptly communicates with users using natural language understanding. It delivers helpful responses to your inquiries and requests.', 0, '2025-10-13 12:40:34.678727', NULL, 2, 'Pankaj'),
(7, 1, 'Close this ticket', 0, '2025-10-13 13:12:06.574734', NULL, 2, 'Pankaj'),
(8, 1, 'Closed this ticket successfully', 0, '2025-10-13 13:13:43.942250', NULL, 2, 'Pankaj'),
(9, 1, 'Test', 0, '2025-10-13 13:14:21.084781', NULL, 2, 'Pankaj'),
(10, 1, '34tterte', 0, '2025-10-13 13:14:54.796372', NULL, 2, 'Pankaj'),
(11, 1, 'Closed this ticket successfully', 2, '2025-10-13 13:15:28.346937', NULL, 2, 'Pankaj');

-- --------------------------------------------------------

--
-- Table structure for table `support-tickets`
--

CREATE TABLE `support-tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `attachment` varchar(255) DEFAULT NULL,
  `ticket_no` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support-tickets`
--

INSERT INTO `support-tickets` (`id`, `user_id`, `subject`, `message`, `status`, `created_at`, `attachment`, `ticket_no`, `user_name`) VALUES
(1, 2, 'Test My New Message', 'If you share your actual JSON request body (what’s being sent from frontend or Postman), I’ll show you the exact version that will pass validation perfectly.', 2, '2025-10-13 12:19:34.346052', '1760357974312-689990447.png', 'TKT-5092850-000001', 'Pankaj');

-- --------------------------------------------------------

--
-- Table structure for table `timezones`
--

CREATE TABLE `timezones` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timezones`
--

INSERT INTO `timezones` (`id`, `name`, `created_at`) VALUES
(1, '(UTC-11:00) Niue Time ', '2025-09-10 11:01:05.946778'),
(2, '(UTC-11:00) Samoa Standard Time (Midway) ', '2025-09-10 11:01:05.946778'),
(3, '(UTC-11:00) Samoa Standard Time (Pago Pago) ', '2025-09-10 11:01:05.946778'),
(4, '(UTC-10:00) Cook Islands Standard Time (Rarotonga) ', '2025-09-10 11:01:05.946778'),
(5, '(UTC-10:00) Hawaii-Aleutian Time (Adak) ', '2025-09-10 11:01:05.946778'),
(6, '(UTC-10:00) Hawaii-Aleutian Time (Adak) (Honolulu) ', '2025-09-10 11:01:05.946778'),
(7, '(UTC-10:00) Tahiti Time ', '2025-09-10 11:01:05.946778'),
(8, '(UTC-09:30) Marquesas Time ', '2025-09-10 11:01:05.946778'),
(9, '(UTC-09:00) Alaska Time (Anchorage) ', '2025-09-10 11:01:05.946778'),
(10, '(UTC-09:00) Alaska Time (Juneau) ', '2025-09-10 11:01:05.946778'),
(11, '(UTC-09:00) Alaska Time (Metlakatla) ', '2025-09-10 11:01:05.946778'),
(12, '(UTC-09:00) Alaska Time (Nome) ', '2025-09-10 11:01:05.946778'),
(13, '(UTC-09:00) Alaska Time (Sitka) ', '2025-09-10 11:01:05.946778'),
(14, '(UTC-09:00) Alaska Time (Yakutat) ', '2025-09-10 11:01:05.946778'),
(15, '(UTC-09:00) Gambier Time ', '2025-09-10 11:01:05.946778'),
(16, '(UTC-08:00) Pacific Time (Los Angeles) ', '2025-09-10 11:01:05.946778'),
(17, '(UTC-08:00) Pacific Time (Tijuana) ', '2025-09-10 11:01:05.946778'),
(18, '(UTC-08:00) Pacific Time (Vancouver) ', '2025-09-10 11:01:05.946778'),
(19, '(UTC-08:00) Pitcairn Islands Time ', '2025-09-10 11:01:05.946778'),
(20, '(UTC-07:00) Mexican Pacific Standard Time (Hermosillo) ', '2025-09-10 11:01:05.946778'),
(21, '(UTC-07:00) Mexican Pacific Standard Time (Mazatlan) ', '2025-09-10 11:01:05.946778'),
(22, '(UTC-07:00) Mountain Time (Boise) ', '2025-09-10 11:01:05.946778'),
(23, '(UTC-07:00) Mountain Time (Cambridge Bay) ', '2025-09-10 11:01:05.946778'),
(24, '(UTC-07:00) Mountain Time (Ciudad Juarez) ', '2025-09-10 11:01:05.946778'),
(25, '(UTC-07:00) Mountain Time (Creston) ', '2025-09-10 11:01:05.946778'),
(26, '(UTC-07:00) Mountain Time (Dawson Creek) ', '2025-09-10 11:01:05.946778'),
(27, '(UTC-07:00) Mountain Time (Denver) ', '2025-09-10 11:01:05.946778'),
(28, '(UTC-07:00) Mountain Time (Edmonton) ', '2025-09-10 11:01:05.946778'),
(29, '(UTC-07:00) Mountain Time (Fort Nelson) ', '2025-09-10 11:01:05.946778'),
(30, '(UTC-07:00) Mountain Time (Inuvik) ', '2025-09-10 11:01:05.946778'),
(31, '(UTC-07:00) Mountain Time (Phoenix) ', '2025-09-10 11:01:05.946778'),
(32, '(UTC-07:00) Yukon Time (Dawson) ', '2025-09-10 11:01:05.946778'),
(33, '(UTC-07:00) Yukon Time (Whitehorse) ', '2025-09-10 11:01:05.946778'),
(34, '(UTC-06:00) Central Time (Bahia Banderas) ', '2025-09-10 11:01:05.946778'),
(35, '(UTC-06:00) Central Time (Belize) ', '2025-09-10 11:01:05.946778'),
(36, '(UTC-06:00) Central Time (Beulah, North Dakota) ', '2025-09-10 11:01:05.946778'),
(37, '(UTC-06:00) Central Time (Center, North Dakota) ', '2025-09-10 11:01:05.946778'),
(38, '(UTC-06:00) Central Time (Chicago) ', '2025-09-10 11:01:05.946778'),
(39, '(UTC-06:00) Central Time (Chihuahua) ', '2025-09-10 11:01:05.946778'),
(40, '(UTC-06:00) Central Time (Costa Rica) ', '2025-09-10 11:01:05.946778'),
(41, '(UTC-06:00) Central Time (El Salvador) ', '2025-09-10 11:01:05.946778'),
(42, '(UTC-06:00) Central Time (Guatemala) ', '2025-09-10 11:01:05.946778'),
(43, '(UTC-06:00) Central Time (Knox, Indiana) ', '2025-09-10 11:01:05.946778'),
(44, '(UTC-06:00) Central Time (Managua) ', '2025-09-10 11:01:05.946778'),
(45, '(UTC-06:00) Central Time (Matamoros) ', '2025-09-10 11:01:05.946778'),
(46, '(UTC-06:00) Central Time (Menominee) ', '2025-09-10 11:01:05.946778'),
(47, '(UTC-06:00) Central Time (Merida) ', '2025-09-10 11:01:05.946778'),
(48, '(UTC-06:00) Central Time (Mexico City) ', '2025-09-10 11:01:05.946778'),
(49, '(UTC-06:00) Central Time (Monterrey) ', '2025-09-10 11:01:05.946778'),
(50, '(UTC-06:00) Central Time (New Salem, North Dakota) ', '2025-09-10 11:01:05.946778'),
(51, '(UTC-06:00) Central Time (Ojinaga) ', '2025-09-10 11:01:05.946778'),
(52, '(UTC-06:00) Central Time (Rankin Inlet) ', '2025-09-10 11:01:05.946778'),
(53, '(UTC-06:00) Central Time (Regina) ', '2025-09-10 11:01:05.946778'),
(54, '(UTC-06:00) Central Time (Resolute) ', '2025-09-10 11:01:05.946778'),
(55, '(UTC-06:00) Central Time (Swift Current) ', '2025-09-10 11:01:05.946778'),
(56, '(UTC-06:00) Central Time (Tegucigalpa) ', '2025-09-10 11:01:05.946778'),
(57, '(UTC-06:00) Central Time (Tell City, Indiana) ', '2025-09-10 11:01:05.946778'),
(58, '(UTC-06:00) Central Time (Winnipeg) ', '2025-09-10 11:01:05.946778'),
(59, '(UTC-06:00) Easter Island Time ', '2025-09-10 11:01:05.946778'),
(60, '(UTC-06:00) Galapagos Time ', '2025-09-10 11:01:05.946778'),
(61, '(UTC-05:00) Acre Standard Time (Eirunepe) ', '2025-09-10 11:01:05.946778'),
(62, '(UTC-05:00) Acre Standard Time (Rio Branco) ', '2025-09-10 11:01:05.946778'),
(63, '(UTC-05:00) Colombia Standard Time (Bogota) ', '2025-09-10 11:01:05.946778'),
(64, '(UTC-05:00) Cuba Time ', '2025-09-10 11:01:05.946778'),
(65, '(UTC-05:00) Eastern Time (Atikokan) ', '2025-09-10 11:01:05.946778'),
(66, '(UTC-05:00) Eastern Time (Cancun) ', '2025-09-10 11:01:05.946778'),
(67, '(UTC-05:00) Eastern Time (Cayman) ', '2025-09-10 11:01:05.946778'),
(68, '(UTC-05:00) Eastern Time (Detroit) ', '2025-09-10 11:01:05.946778'),
(69, '(UTC-05:00) Eastern Time (Grand Turk) ', '2025-09-10 11:01:05.946778'),
(70, '(UTC-05:00) Eastern Time (Indianapolis) ', '2025-09-10 11:01:05.946778'),
(71, '(UTC-05:00) Eastern Time (Iqaluit) ', '2025-09-10 11:01:05.946778'),
(72, '(UTC-05:00) Eastern Time (Jamaica) ', '2025-09-10 11:01:05.946778'),
(73, '(UTC-05:00) Eastern Time (Louisville) ', '2025-09-10 11:01:05.946778'),
(74, '(UTC-05:00) Eastern Time (Marengo, Indiana) ', '2025-09-10 11:01:05.946778'),
(75, '(UTC-05:00) Eastern Time (Monticello, Kentucky) ', '2025-09-10 11:01:05.946778'),
(76, '(UTC-05:00) Eastern Time (Nassau) ', '2025-09-10 11:01:05.946778'),
(77, '(UTC-05:00) Eastern Time (New York) ', '2025-09-10 11:01:05.946778'),
(78, '(UTC-05:00) Eastern Time (Panama) ', '2025-09-10 11:01:05.946778'),
(79, '(UTC-05:00) Eastern Time (Petersburg, Indiana) ', '2025-09-10 11:01:05.946778'),
(80, '(UTC-05:00) Eastern Time (Port-au-Prince) ', '2025-09-10 11:01:05.946778'),
(81, '(UTC-05:00) Eastern Time (Toronto) ', '2025-09-10 11:01:05.946778'),
(82, '(UTC-05:00) Eastern Time (Vevay, Indiana) ', '2025-09-10 11:01:05.946778'),
(83, '(UTC-05:00) Eastern Time (Vincennes, Indiana) ', '2025-09-10 11:01:05.946778'),
(84, '(UTC-05:00) Eastern Time (Winamac, Indiana) ', '2025-09-10 11:01:05.946778'),
(85, '(UTC-05:00) Ecuador Time ', '2025-09-10 11:01:05.946778'),
(86, '(UTC-05:00) Peru Standard Time (Lima) ', '2025-09-10 11:01:05.946778'),
(87, '(UTC-04:00) Amazon Standard Time (Boa Vista) ', '2025-09-10 11:01:05.946778'),
(88, '(UTC-04:00) Amazon Standard Time (Campo Grande) ', '2025-09-10 11:01:05.946778'),
(89, '(UTC-04:00) Amazon Standard Time (Cuiaba) ', '2025-09-10 11:01:05.946778'),
(90, '(UTC-04:00) Amazon Standard Time (Manaus) ', '2025-09-10 11:01:05.946778'),
(91, '(UTC-04:00) Amazon Standard Time (Porto Velho) ', '2025-09-10 11:01:05.946778'),
(92, '(UTC-04:00) Atlantic Time (Anguilla) ', '2025-09-10 11:01:05.946778'),
(93, '(UTC-04:00) Atlantic Time (Antigua) ', '2025-09-10 11:01:05.946778'),
(94, '(UTC-04:00) Atlantic Time (Aruba) ', '2025-09-10 11:01:05.946778'),
(95, '(UTC-04:00) Atlantic Time (Barbados) ', '2025-09-10 11:01:05.946778'),
(96, '(UTC-04:00) Atlantic Time (Bermuda) ', '2025-09-10 11:01:05.946778'),
(97, '(UTC-04:00) Atlantic Time (Blanc-Sablon) ', '2025-09-10 11:01:05.946778'),
(98, '(UTC-04:00) Atlantic Time (Curaçao) ', '2025-09-10 11:01:05.946778'),
(99, '(UTC-04:00) Atlantic Time (Dominica) ', '2025-09-10 11:01:05.946778'),
(100, '(UTC-04:00) Atlantic Time (Glace Bay) ', '2025-09-10 11:01:05.946778'),
(101, '(UTC-04:00) Atlantic Time (Goose Bay) ', '2025-09-10 11:01:05.946778'),
(102, '(UTC-04:00) Atlantic Time (Grenada) ', '2025-09-10 11:01:05.946778'),
(103, '(UTC-04:00) Atlantic Time (Guadeloupe) ', '2025-09-10 11:01:05.946778'),
(104, '(UTC-04:00) Atlantic Time (Halifax) ', '2025-09-10 11:01:05.946778'),
(105, '(UTC-04:00) Atlantic Time (Kralendijk) ', '2025-09-10 11:01:05.946778'),
(106, '(UTC-04:00) Atlantic Time (Lower Prince’s Quarter) ', '2025-09-10 11:01:05.946778'),
(107, '(UTC-04:00) Atlantic Time (Marigot) ', '2025-09-10 11:01:05.946778'),
(108, '(UTC-04:00) Atlantic Time (Martinique) ', '2025-09-10 11:01:05.946778'),
(109, '(UTC-04:00) Atlantic Time (Moncton) ', '2025-09-10 11:01:05.946778'),
(110, '(UTC-04:00) Atlantic Time (Montserrat) ', '2025-09-10 11:01:05.946778'),
(111, '(UTC-04:00) Atlantic Time (Port of Spain) ', '2025-09-10 11:01:05.946778'),
(112, '(UTC-04:00) Atlantic Time (Puerto Rico) ', '2025-09-10 11:01:05.946778'),
(113, '(UTC-04:00) Atlantic Time (Santo Domingo) ', '2025-09-10 11:01:05.946778'),
(114, '(UTC-04:00) Atlantic Time (St. Barthélemy) ', '2025-09-10 11:01:05.946778'),
(115, '(UTC-04:00) Atlantic Time (St. Kitts) ', '2025-09-10 11:01:05.946778'),
(116, '(UTC-04:00) Atlantic Time (St. Lucia) ', '2025-09-10 11:01:05.946778'),
(117, '(UTC-04:00) Atlantic Time (St. Thomas) ', '2025-09-10 11:01:05.946778'),
(118, '(UTC-04:00) Atlantic Time (St. Vincent) ', '2025-09-10 11:01:05.946778'),
(119, '(UTC-04:00) Atlantic Time (Thule) ', '2025-09-10 11:01:05.946778'),
(120, '(UTC-04:00) Atlantic Time (Tortola) ', '2025-09-10 11:01:05.946778'),
(121, '(UTC-04:00) Bolivia Time ', '2025-09-10 11:01:05.946778'),
(122, '(UTC-04:00) Chile Time ', '2025-09-10 11:01:05.946778'),
(123, '(UTC-04:00) Guyana Time ', '2025-09-10 11:01:05.946778'),
(124, '(UTC-04:00) Venezuela Time ', '2025-09-10 11:01:05.946778'),
(125, '(UTC-03:30) Newfoundland Time (St. John’s) ', '2025-09-10 11:01:05.946778'),
(126, '(UTC-03:00) Argentina Standard Time (Buenos Aires) ', '2025-09-10 11:01:05.946778'),
(127, '(UTC-03:00) Argentina Standard Time (Catamarca) ', '2025-09-10 11:01:05.946778'),
(128, '(UTC-03:00) Argentina Standard Time (Cordoba) ', '2025-09-10 11:01:05.946778'),
(129, '(UTC-03:00) Argentina Standard Time (Jujuy) ', '2025-09-10 11:01:05.946778'),
(130, '(UTC-03:00) Argentina Standard Time (La Rioja) ', '2025-09-10 11:01:05.946778'),
(131, '(UTC-03:00) Argentina Standard Time (Mendoza) ', '2025-09-10 11:01:05.946778'),
(132, '(UTC-03:00) Argentina Standard Time (Rio Gallegos) ', '2025-09-10 11:01:05.946778'),
(133, '(UTC-03:00) Argentina Standard Time (Salta) ', '2025-09-10 11:01:05.946778'),
(134, '(UTC-03:00) Argentina Standard Time (San Juan) ', '2025-09-10 11:01:05.946778'),
(135, '(UTC-03:00) Argentina Standard Time (San Luis) ', '2025-09-10 11:01:05.946778'),
(136, '(UTC-03:00) Argentina Standard Time (Tucuman) ', '2025-09-10 11:01:05.946778'),
(137, '(UTC-03:00) Argentina Standard Time (Ushuaia) ', '2025-09-10 11:01:05.946778'),
(138, '(UTC-03:00) Brasilia Standard Time (Araguaina) ', '2025-09-10 11:01:05.946778'),
(139, '(UTC-03:00) Brasilia Standard Time (Bahia) ', '2025-09-10 11:01:05.946778'),
(140, '(UTC-03:00) Brasilia Standard Time (Belem) ', '2025-09-10 11:01:05.946778'),
(141, '(UTC-03:00) Brasilia Standard Time (Fortaleza) ', '2025-09-10 11:01:05.946778'),
(142, '(UTC-03:00) Brasilia Standard Time (Maceio) ', '2025-09-10 11:01:05.946778'),
(143, '(UTC-03:00) Brasilia Standard Time (Recife) ', '2025-09-10 11:01:05.946778'),
(144, '(UTC-03:00) Brasilia Standard Time (Santarem) ', '2025-09-10 11:01:05.946778'),
(145, '(UTC-03:00) Brasilia Standard Time (Sao Paulo) ', '2025-09-10 11:01:05.946778'),
(146, '(UTC-03:00) Coyhaique Time ', '2025-09-10 11:01:05.946778'),
(147, '(UTC-03:00) Falkland Islands Standard Time (Stanley) ', '2025-09-10 11:01:05.946778'),
(148, '(UTC-03:00) French Guiana Time ', '2025-09-10 11:01:05.946778'),
(149, '(UTC-03:00) Palmer Time ', '2025-09-10 11:01:05.946778'),
(150, '(UTC-03:00) Paraguay Standard Time (Asunción) ', '2025-09-10 11:01:05.946778'),
(151, '(UTC-03:00) Punta Arenas Time ', '2025-09-10 11:01:05.946778'),
(152, '(UTC-03:00) Rothera Time ', '2025-09-10 11:01:05.946778'),
(153, '(UTC-03:00) St. Pierre &amp; Miquelon Time ', '2025-09-10 11:01:05.946778'),
(154, '(UTC-03:00) Suriname Time ', '2025-09-10 11:01:05.946778'),
(155, '(UTC-03:00) Uruguay Standard Time (Montevideo) ', '2025-09-10 11:01:05.946778'),
(156, '(UTC-02:00) Fernando de Noronha Standard Time ', '2025-09-10 11:01:05.946778'),
(157, '(UTC-02:00) Ittoqqortoormiit Time ', '2025-09-10 11:01:05.946778'),
(158, '(UTC-02:00) Nuuk Time ', '2025-09-10 11:01:05.946778'),
(159, '(UTC-02:00) South Georgia Time ', '2025-09-10 11:01:05.946778'),
(160, '(UTC-01:00) Azores Time ', '2025-09-10 11:01:05.946778'),
(161, '(UTC-01:00) Cape Verde Standard Time ', '2025-09-10 11:01:05.946778'),
(162, '(UTC) Coordinated Universal Time ', '2025-09-10 11:01:05.946778'),
(163, '(UTC+00:00) Burkina Faso Time ', '2025-09-10 11:01:05.946778'),
(164, '(UTC+00:00) Côte d’Ivoire Time ', '2025-09-10 11:01:05.946778'),
(165, '(UTC+00:00) Danmarkshavn Time ', '2025-09-10 11:01:05.946778'),
(166, '(UTC+00:00) Gambia Time ', '2025-09-10 11:01:05.946778'),
(167, '(UTC+00:00) Ghana Time ', '2025-09-10 11:01:05.946778'),
(168, '(UTC+00:00) Guernsey Time ', '2025-09-10 11:01:05.946778'),
(169, '(UTC+00:00) Guinea Time ', '2025-09-10 11:01:05.946778'),
(170, '(UTC+00:00) Guinea-Bissau Time ', '2025-09-10 11:01:05.946778'),
(171, '(UTC+00:00) Iceland Time ', '2025-09-10 11:01:05.946778'),
(172, '(UTC+00:00) Ireland Time ', '2025-09-10 11:01:05.946778'),
(173, '(UTC+00:00) Isle of Man Time ', '2025-09-10 11:01:05.946778'),
(174, '(UTC+00:00) Jersey Time ', '2025-09-10 11:01:05.946778'),
(175, '(UTC+00:00) Liberia Time ', '2025-09-10 11:01:05.946778'),
(176, '(UTC+00:00) Mali Time ', '2025-09-10 11:01:05.946778'),
(177, '(UTC+00:00) Mauritania Time ', '2025-09-10 11:01:05.946778'),
(178, '(UTC+00:00) Morocco Time ', '2025-09-10 11:01:05.946778'),
(179, '(UTC+00:00) Senegal Time ', '2025-09-10 11:01:05.946778'),
(180, '(UTC+00:00) Sierra Leone Time ', '2025-09-10 11:01:05.946778'),
(181, '(UTC+00:00) St. Helena Time ', '2025-09-10 11:01:05.946778'),
(182, '(UTC+00:00) São Tomé &amp; Príncipe Time ', '2025-09-10 11:01:05.946778'),
(183, '(UTC+00:00) Togo Time ', '2025-09-10 11:01:05.946778'),
(184, '(UTC+00:00) Troll Time ', '2025-09-10 11:01:05.946778'),
(185, '(UTC+00:00) United Kingdom Time ', '2025-09-10 11:01:05.946778'),
(186, '(UTC+00:00) Western European Time (Canary) ', '2025-09-10 11:01:05.946778'),
(187, '(UTC+00:00) Western European Time (Faroe) ', '2025-09-10 11:01:05.946778'),
(188, '(UTC+00:00) Western European Time (Lisbon) ', '2025-09-10 11:01:05.946778'),
(189, '(UTC+00:00) Western European Time (Madeira) ', '2025-09-10 11:01:05.946778'),
(190, '(UTC+00:00) Western Sahara Time ', '2025-09-10 11:01:05.946778'),
(191, '(UTC+01:00) Central European Time (Algiers) ', '2025-09-10 11:01:05.946778'),
(192, '(UTC+01:00) Central European Time (Amsterdam) ', '2025-09-10 11:01:05.946778'),
(193, '(UTC+01:00) Central European Time (Andorra) ', '2025-09-10 11:01:05.946778'),
(194, '(UTC+01:00) Central European Time (Belgrade) ', '2025-09-10 11:01:05.946778'),
(195, '(UTC+01:00) Central European Time (Berlin) ', '2025-09-10 11:01:05.946778'),
(196, '(UTC+01:00) Central European Time (Bratislava) ', '2025-09-10 11:01:05.946778'),
(197, '(UTC+01:00) Central European Time (Brussels) ', '2025-09-10 11:01:05.946778'),
(198, '(UTC+01:00) Central European Time (Budapest) ', '2025-09-10 11:01:05.946778'),
(199, '(UTC+01:00) Central European Time (Busingen) ', '2025-09-10 11:01:05.946778'),
(200, '(UTC+01:00) Central European Time (Ceuta) ', '2025-09-10 11:01:05.946778'),
(201, '(UTC+01:00) Central European Time (Copenhagen) ', '2025-09-10 11:01:05.946778'),
(202, '(UTC+01:00) Central European Time (Gibraltar) ', '2025-09-10 11:01:05.946778'),
(203, '(UTC+01:00) Central European Time (Ljubljana) ', '2025-09-10 11:01:05.946778'),
(204, '(UTC+01:00) Central European Time (Longyearbyen) ', '2025-09-10 11:01:05.946778'),
(205, '(UTC+01:00) Central European Time (Luxembourg) ', '2025-09-10 11:01:05.946778'),
(206, '(UTC+01:00) Central European Time (Madrid) ', '2025-09-10 11:01:05.946778'),
(207, '(UTC+01:00) Central European Time (Malta) ', '2025-09-10 11:01:05.946778'),
(208, '(UTC+01:00) Central European Time (Monaco) ', '2025-09-10 11:01:05.946778'),
(209, '(UTC+01:00) Central European Time (Oslo) ', '2025-09-10 11:01:05.946778'),
(210, '(UTC+01:00) Central European Time (Paris) ', '2025-09-10 11:01:05.946778'),
(211, '(UTC+01:00) Central European Time (Podgorica) ', '2025-09-10 11:01:05.946778'),
(212, '(UTC+01:00) Central European Time (Prague) ', '2025-09-10 11:01:05.946778'),
(213, '(UTC+01:00) Central European Time (Rome) ', '2025-09-10 11:01:05.946778'),
(214, '(UTC+01:00) Central European Time (San Marino) ', '2025-09-10 11:01:05.946778'),
(215, '(UTC+01:00) Central European Time (Sarajevo) ', '2025-09-10 11:01:05.946778'),
(216, '(UTC+01:00) Central European Time (Skopje) ', '2025-09-10 11:01:05.946778'),
(217, '(UTC+01:00) Central European Time (Stockholm) ', '2025-09-10 11:01:05.946778'),
(218, '(UTC+01:00) Central European Time (Tirane) ', '2025-09-10 11:01:05.946778'),
(219, '(UTC+01:00) Central European Time (Tunis) ', '2025-09-10 11:01:05.946778'),
(220, '(UTC+01:00) Central European Time (Vaduz) ', '2025-09-10 11:01:05.946778'),
(221, '(UTC+01:00) Central European Time (Vatican) ', '2025-09-10 11:01:05.946778'),
(222, '(UTC+01:00) Central European Time (Vienna) ', '2025-09-10 11:01:05.946778'),
(223, '(UTC+01:00) Central European Time (Warsaw) ', '2025-09-10 11:01:05.946778'),
(224, '(UTC+01:00) Central European Time (Zagreb) ', '2025-09-10 11:01:05.946778'),
(225, '(UTC+01:00) Central European Time (Zurich) ', '2025-09-10 11:01:05.946778'),
(226, '(UTC+01:00) West Africa Standard Time (Bangui) ', '2025-09-10 11:01:05.946778'),
(227, '(UTC+01:00) West Africa Standard Time (Brazzaville) ', '2025-09-10 11:01:05.946778'),
(228, '(UTC+01:00) West Africa Standard Time (Douala) ', '2025-09-10 11:01:05.946778'),
(229, '(UTC+01:00) West Africa Standard Time (Kinshasa) ', '2025-09-10 11:01:05.946778'),
(230, '(UTC+01:00) West Africa Standard Time (Lagos) ', '2025-09-10 11:01:05.946778'),
(231, '(UTC+01:00) West Africa Standard Time (Libreville) ', '2025-09-10 11:01:05.946778'),
(232, '(UTC+01:00) West Africa Standard Time (Luanda) ', '2025-09-10 11:01:05.946778'),
(233, '(UTC+01:00) West Africa Standard Time (Malabo) ', '2025-09-10 11:01:05.946778'),
(234, '(UTC+01:00) West Africa Standard Time (Ndjamena) ', '2025-09-10 11:01:05.946778'),
(235, '(UTC+01:00) West Africa Standard Time (Niamey) ', '2025-09-10 11:01:05.946778'),
(236, '(UTC+01:00) West Africa Standard Time (Porto-Novo) ', '2025-09-10 11:01:05.946778'),
(237, '(UTC+02:00) Central Africa Time (Blantyre) ', '2025-09-10 11:01:05.946778'),
(238, '(UTC+02:00) Central Africa Time (Bujumbura) ', '2025-09-10 11:01:05.946778'),
(239, '(UTC+02:00) Central Africa Time (Gaborone) ', '2025-09-10 11:01:05.946778'),
(240, '(UTC+02:00) Central Africa Time (Harare) ', '2025-09-10 11:01:05.946778'),
(241, '(UTC+02:00) Central Africa Time (Juba) ', '2025-09-10 11:01:05.946778'),
(242, '(UTC+02:00) Central Africa Time (Khartoum) ', '2025-09-10 11:01:05.946778'),
(243, '(UTC+02:00) Central Africa Time (Kigali) ', '2025-09-10 11:01:05.946778'),
(244, '(UTC+02:00) Central Africa Time (Lubumbashi) ', '2025-09-10 11:01:05.946778'),
(245, '(UTC+02:00) Central Africa Time (Lusaka) ', '2025-09-10 11:01:05.946778'),
(246, '(UTC+02:00) Central Africa Time (Maputo) ', '2025-09-10 11:01:05.946778'),
(247, '(UTC+02:00) Central Africa Time (Windhoek) ', '2025-09-10 11:01:05.946778'),
(248, '(UTC+02:00) Eastern European Time (Athens) ', '2025-09-10 11:01:05.946778'),
(249, '(UTC+02:00) Eastern European Time (Beirut) ', '2025-09-10 11:01:05.946778'),
(250, '(UTC+02:00) Eastern European Time (Bucharest) ', '2025-09-10 11:01:05.946778'),
(251, '(UTC+02:00) Eastern European Time (Cairo) ', '2025-09-10 11:01:05.946778'),
(252, '(UTC+02:00) Eastern European Time (Chisinau) ', '2025-09-10 11:01:05.946778'),
(253, '(UTC+02:00) Eastern European Time (Gaza) ', '2025-09-10 11:01:05.946778'),
(254, '(UTC+02:00) Eastern European Time (Hebron) ', '2025-09-10 11:01:05.946778'),
(255, '(UTC+02:00) Eastern European Time (Helsinki) ', '2025-09-10 11:01:05.946778'),
(256, '(UTC+02:00) Eastern European Time (Kaliningrad) ', '2025-09-10 11:01:05.946778'),
(257, '(UTC+02:00) Eastern European Time (Kiev) ', '2025-09-10 11:01:05.946778'),
(258, '(UTC+02:00) Eastern European Time (Mariehamn) ', '2025-09-10 11:01:05.946778'),
(259, '(UTC+02:00) Eastern European Time (Nicosia) ', '2025-09-10 11:01:05.946778'),
(260, '(UTC+02:00) Eastern European Time (Riga) ', '2025-09-10 11:01:05.946778'),
(261, '(UTC+02:00) Eastern European Time (Sofia) ', '2025-09-10 11:01:05.946778'),
(262, '(UTC+02:00) Eastern European Time (Tallinn) ', '2025-09-10 11:01:05.946778'),
(263, '(UTC+02:00) Eastern European Time (Tripoli) ', '2025-09-10 11:01:05.946778'),
(264, '(UTC+02:00) Eastern European Time (Vilnius) ', '2025-09-10 11:01:05.946778'),
(265, '(UTC+02:00) Famagusta Time ', '2025-09-10 11:01:05.946778'),
(266, '(UTC+02:00) Israel Time ', '2025-09-10 11:01:05.946778'),
(267, '(UTC+02:00) South Africa Standard Time (Johannesburg) ', '2025-09-10 11:01:05.946778'),
(268, '(UTC+02:00) South Africa Standard Time (Maseru) ', '2025-09-10 11:01:05.946778'),
(269, '(UTC+02:00) South Africa Standard Time (Mbabane) ', '2025-09-10 11:01:05.946778'),
(270, '(UTC+03:00) Arabian Standard Time (Aden) ', '2025-09-10 11:01:05.946778'),
(271, '(UTC+03:00) Arabian Standard Time (Baghdad) ', '2025-09-10 11:01:05.946778'),
(272, '(UTC+03:00) Arabian Standard Time (Bahrain) ', '2025-09-10 11:01:05.946778'),
(273, '(UTC+03:00) Arabian Standard Time (Kuwait) ', '2025-09-10 11:01:05.946778'),
(274, '(UTC+03:00) Arabian Standard Time (Qatar) ', '2025-09-10 11:01:05.946778'),
(275, '(UTC+03:00) Arabian Standard Time (Riyadh) ', '2025-09-10 11:01:05.946778'),
(276, '(UTC+03:00) Belarus Time ', '2025-09-10 11:01:05.946778'),
(277, '(UTC+03:00) East Africa Time (Addis Ababa) ', '2025-09-10 11:01:05.946778'),
(278, '(UTC+03:00) East Africa Time (Antananarivo) ', '2025-09-10 11:01:05.946778'),
(279, '(UTC+03:00) East Africa Time (Asmara) ', '2025-09-10 11:01:05.946778'),
(280, '(UTC+03:00) East Africa Time (Comoro) ', '2025-09-10 11:01:05.946778'),
(281, '(UTC+03:00) East Africa Time (Dar es Salaam) ', '2025-09-10 11:01:05.946778'),
(282, '(UTC+03:00) East Africa Time (Djibouti) ', '2025-09-10 11:01:05.946778'),
(283, '(UTC+03:00) East Africa Time (Kampala) ', '2025-09-10 11:01:05.946778'),
(284, '(UTC+03:00) East Africa Time (Mayotte) ', '2025-09-10 11:01:05.946778'),
(285, '(UTC+03:00) East Africa Time (Mogadishu) ', '2025-09-10 11:01:05.946778'),
(286, '(UTC+03:00) East Africa Time (Nairobi) ', '2025-09-10 11:01:05.946778'),
(287, '(UTC+03:00) Jordan Time ', '2025-09-10 11:01:05.946778'),
(288, '(UTC+03:00) Kirov Time ', '2025-09-10 11:01:05.946778'),
(289, '(UTC+03:00) Moscow Time ', '2025-09-10 11:01:05.946778'),
(290, '(UTC+03:00) Simferopol Time ', '2025-09-10 11:01:05.946778'),
(291, '(UTC+03:00) Syowa Time ', '2025-09-10 11:01:05.946778'),
(292, '(UTC+03:00) Syria Time ', '2025-09-10 11:01:05.946778'),
(293, '(UTC+03:00) Turkey Time ', '2025-09-10 11:01:05.946778'),
(294, '(UTC+03:00) Volgograd Standard Time ', '2025-09-10 11:01:05.946778'),
(295, '(UTC+03:30) Iran Standard Time (Tehran) ', '2025-09-10 11:01:05.946778'),
(296, '(UTC+04:00) Armenia Standard Time (Yerevan) ', '2025-09-10 11:01:05.946778'),
(297, '(UTC+04:00) Astrakhan Time ', '2025-09-10 11:01:05.946778'),
(298, '(UTC+04:00) Azerbaijan Standard Time (Baku) ', '2025-09-10 11:01:05.946778'),
(299, '(UTC+04:00) Georgia Standard Time (Tbilisi) ', '2025-09-10 11:01:05.946778'),
(300, '(UTC+04:00) Gulf Standard Time (Dubai) ', '2025-09-10 11:01:05.946778'),
(301, '(UTC+04:00) Gulf Standard Time (Muscat) ', '2025-09-10 11:01:05.946778'),
(302, '(UTC+04:00) Mauritius Standard Time ', '2025-09-10 11:01:05.946778'),
(303, '(UTC+04:00) Réunion Time ', '2025-09-10 11:01:05.946778'),
(304, '(UTC+04:00) Samara Standard Time ', '2025-09-10 11:01:05.946778'),
(305, '(UTC+04:00) Saratov Time ', '2025-09-10 11:01:05.946778'),
(306, '(UTC+04:00) Seychelles Time ', '2025-09-10 11:01:05.946778'),
(307, '(UTC+04:00) Ulyanovsk Time ', '2025-09-10 11:01:05.946778'),
(308, '(UTC+04:30) Afghanistan Time ', '2025-09-10 11:01:05.946778'),
(309, '(UTC+05:00) Almaty Time ', '2025-09-10 11:01:05.946778'),
(310, '(UTC+05:00) Aqtau Time ', '2025-09-10 11:01:05.946778'),
(311, '(UTC+05:00) Aqtobe Time ', '2025-09-10 11:01:05.946778'),
(312, '(UTC+05:00) Atyrau Time ', '2025-09-10 11:01:05.946778'),
(313, '(UTC+05:00) French Southern &amp; Antarctic Time (Kerguelen) ', '2025-09-10 11:01:05.946778'),
(314, '(UTC+05:00) Kostanay Time ', '2025-09-10 11:01:05.946778'),
(315, '(UTC+05:00) Maldives Time ', '2025-09-10 11:01:05.946778'),
(316, '(UTC+05:00) Mawson Time ', '2025-09-10 11:01:05.946778'),
(317, '(UTC+05:00) Oral Time ', '2025-09-10 11:01:05.946778'),
(318, '(UTC+05:00) Pakistan Standard Time (Karachi) ', '2025-09-10 11:01:05.946778'),
(319, '(UTC+05:00) Qyzylorda Time ', '2025-09-10 11:01:05.946778'),
(320, '(UTC+05:00) Tajikistan Time ', '2025-09-10 11:01:05.946778'),
(321, '(UTC+05:00) Turkmenistan Standard Time (Ashgabat) ', '2025-09-10 11:01:05.946778'),
(322, '(UTC+05:00) Uzbekistan Standard Time (Samarkand) ', '2025-09-10 11:01:05.946778'),
(323, '(UTC+05:00) Uzbekistan Standard Time (Tashkent) ', '2025-09-10 11:01:05.946778'),
(324, '(UTC+05:00) Vostok Time ', '2025-09-10 11:01:05.946778'),
(325, '(UTC+05:00) Yekaterinburg Standard Time ', '2025-09-10 11:01:05.946778'),
(326, '(UTC+05:30) India Standard Time (Colombo) ', '2025-09-10 11:01:05.946778'),
(327, '(UTC+05:30) India Standard Time (Kolkata) ', '2025-09-10 11:01:05.946778'),
(328, '(UTC+05:45) Nepal Time ', '2025-09-10 11:01:05.946778'),
(329, '(UTC+06:00) Bangladesh Standard Time (Dhaka) ', '2025-09-10 11:01:05.946778'),
(330, '(UTC+06:00) Bhutan Time ', '2025-09-10 11:01:05.946778'),
(331, '(UTC+06:00) Indian Ocean Time (Chagos) ', '2025-09-10 11:01:05.946778'),
(332, '(UTC+06:00) Kyrgyzstan Time ', '2025-09-10 11:01:05.946778'),
(333, '(UTC+06:00) Omsk Standard Time ', '2025-09-10 11:01:05.946778'),
(334, '(UTC+06:00) Urumqi Time ', '2025-09-10 11:01:05.946778'),
(335, '(UTC+06:30) Cocos Islands Time ', '2025-09-10 11:01:05.946778'),
(336, '(UTC+06:30) Myanmar Time (Yangon) ', '2025-09-10 11:01:05.946778'),
(337, '(UTC+07:00) Barnaul Time ', '2025-09-10 11:01:05.946778'),
(338, '(UTC+07:00) Christmas Island Time ', '2025-09-10 11:01:05.946778'),
(339, '(UTC+07:00) Davis Time ', '2025-09-10 11:01:05.946778'),
(340, '(UTC+07:00) Hovd Standard Time ', '2025-09-10 11:01:05.946778'),
(341, '(UTC+07:00) Indochina Time (Bangkok) ', '2025-09-10 11:01:05.946778'),
(342, '(UTC+07:00) Indochina Time (Ho Chi Minh City) ', '2025-09-10 11:01:05.946778'),
(343, '(UTC+07:00) Indochina Time (Phnom Penh) ', '2025-09-10 11:01:05.946778'),
(344, '(UTC+07:00) Indochina Time (Vientiane) ', '2025-09-10 11:01:05.946778'),
(345, '(UTC+07:00) Krasnoyarsk Standard Time ', '2025-09-10 11:01:05.946778'),
(346, '(UTC+07:00) Krasnoyarsk Standard Time (Novokuznetsk) ', '2025-09-10 11:01:05.946778'),
(347, '(UTC+07:00) Novosibirsk Standard Time ', '2025-09-10 11:01:05.946778'),
(348, '(UTC+07:00) Tomsk Time ', '2025-09-10 11:01:05.946778'),
(349, '(UTC+07:00) Western Indonesia Time (Jakarta) ', '2025-09-10 11:01:05.946778'),
(350, '(UTC+07:00) Western Indonesia Time (Pontianak) ', '2025-09-10 11:01:05.946778'),
(351, '(UTC+08:00) Australian Western Standard Time (Casey) ', '2025-09-10 11:01:05.946778'),
(352, '(UTC+08:00) Australian Western Standard Time (Perth) ', '2025-09-10 11:01:05.946778'),
(353, '(UTC+08:00) Brunei Darussalam Time ', '2025-09-10 11:01:05.946778'),
(354, '(UTC+08:00) Central Indonesia Time (Makassar) ', '2025-09-10 11:01:05.946778'),
(355, '(UTC+08:00) China Standard Time (Macao) ', '2025-09-10 11:01:05.946778'),
(356, '(UTC+08:00) China Standard Time (Shanghai) ', '2025-09-10 11:01:05.946778'),
(357, '(UTC+08:00) Hong Kong Standard Time ', '2025-09-10 11:01:05.946778'),
(358, '(UTC+08:00) Irkutsk Standard Time ', '2025-09-10 11:01:05.946778'),
(359, '(UTC+08:00) Malaysia Time ', '2025-09-10 11:01:05.946778'),
(360, '(UTC+08:00) Malaysia Time (Kuching) ', '2025-09-10 11:01:05.946778'),
(361, '(UTC+08:00) Philippine Standard Time (Manila) ', '2025-09-10 11:01:05.946778'),
(362, '(UTC+08:00) Singapore Standard Time ', '2025-09-10 11:01:05.946778'),
(363, '(UTC+08:00) Taipei Standard Time ', '2025-09-10 11:01:05.946778'),
(364, '(UTC+08:00) Ulaanbaatar Standard Time ', '2025-09-10 11:01:05.946778'),
(365, '(UTC+08:45) Australian Central Western Standard Time (Eucla) ', '2025-09-10 11:01:05.946778'),
(366, '(UTC+09:00) East Timor Time (Dili) ', '2025-09-10 11:01:05.946778'),
(367, '(UTC+09:00) Eastern Indonesia Time (Jayapura) ', '2025-09-10 11:01:05.946778'),
(368, '(UTC+09:00) Japan Standard Time (Tokyo) ', '2025-09-10 11:01:05.946778'),
(369, '(UTC+09:00) Korean Standard Time (Pyongyang) ', '2025-09-10 11:01:05.946778'),
(370, '(UTC+09:00) Korean Standard Time (Seoul) ', '2025-09-10 11:01:05.946778'),
(371, '(UTC+09:00) Palau Time ', '2025-09-10 11:01:05.946778'),
(372, '(UTC+09:00) Yakutsk Standard Time ', '2025-09-10 11:01:05.946778'),
(373, '(UTC+09:00) Yakutsk Standard Time (Chita) ', '2025-09-10 11:01:05.946778'),
(374, '(UTC+09:00) Yakutsk Standard Time (Khandyga) ', '2025-09-10 11:01:05.946778'),
(375, '(UTC+09:30) Central Australia Time (Adelaide) ', '2025-09-10 11:01:05.946778'),
(376, '(UTC+09:30) Central Australia Time (Broken Hill) ', '2025-09-10 11:01:05.946778'),
(377, '(UTC+09:30) Central Australia Time (Darwin) ', '2025-09-10 11:01:05.946778'),
(378, '(UTC+10:00) Chamorro Standard Time (Guam) ', '2025-09-10 11:01:05.946778'),
(379, '(UTC+10:00) Chamorro Standard Time (Saipan) ', '2025-09-10 11:01:05.946778'),
(380, '(UTC+10:00) Chuuk Time ', '2025-09-10 11:01:05.946778'),
(381, '(UTC+10:00) Dumont-d’Urville Time (Dumont d’Urville) ', '2025-09-10 11:01:05.946778'),
(382, '(UTC+10:00) Eastern Australia Time (Brisbane) ', '2025-09-10 11:01:05.946778'),
(383, '(UTC+10:00) Eastern Australia Time (Hobart) ', '2025-09-10 11:01:05.946778'),
(384, '(UTC+10:00) Eastern Australia Time (Lindeman) ', '2025-09-10 11:01:05.946778'),
(385, '(UTC+10:00) Eastern Australia Time (Macquarie) ', '2025-09-10 11:01:05.946778'),
(386, '(UTC+10:00) Eastern Australia Time (Melbourne) ', '2025-09-10 11:01:05.946778'),
(387, '(UTC+10:00) Eastern Australia Time (Sydney) ', '2025-09-10 11:01:05.946778'),
(388, '(UTC+10:00) Papua New Guinea Time (Port Moresby) ', '2025-09-10 11:01:05.946778'),
(389, '(UTC+10:00) Vladivostok Standard Time ', '2025-09-10 11:01:05.946778'),
(390, '(UTC+10:00) Vladivostok Standard Time (Ust-Nera) ', '2025-09-10 11:01:05.946778'),
(391, '(UTC+10:30) Lord Howe Time ', '2025-09-10 11:01:05.946778'),
(392, '(UTC+11:00) Bougainville Time ', '2025-09-10 11:01:05.946778'),
(393, '(UTC+11:00) Kosrae Time ', '2025-09-10 11:01:05.946778'),
(394, '(UTC+11:00) Magadan Standard Time ', '2025-09-10 11:01:05.946778'),
(395, '(UTC+11:00) New Caledonia Standard Time (Noumea) ', '2025-09-10 11:01:05.946778'),
(396, '(UTC+11:00) Norfolk Island Time ', '2025-09-10 11:01:05.946778'),
(397, '(UTC+11:00) Ponape Time (Pohnpei) ', '2025-09-10 11:01:05.946778'),
(398, '(UTC+11:00) Sakhalin Standard Time ', '2025-09-10 11:01:05.946778'),
(399, '(UTC+11:00) Solomon Islands Time ', '2025-09-10 11:01:05.946778'),
(400, '(UTC+11:00) Srednekolymsk Time ', '2025-09-10 11:01:05.946778'),
(401, '(UTC+11:00) Vanuatu Standard Time (Efate) ', '2025-09-10 11:01:05.946778'),
(402, '(UTC+12:00) Anadyr Standard Time ', '2025-09-10 11:01:05.946778'),
(403, '(UTC+12:00) Fiji Standard Time ', '2025-09-10 11:01:05.946778'),
(404, '(UTC+12:00) Gilbert Islands Time (Tarawa) ', '2025-09-10 11:01:05.946778'),
(405, '(UTC+12:00) Marshall Islands Time ', '2025-09-10 11:01:05.946778'),
(406, '(UTC+12:00) Marshall Islands Time (Kwajalein) ', '2025-09-10 11:01:05.946778'),
(407, '(UTC+12:00) Nauru Time ', '2025-09-10 11:01:05.946778'),
(408, '(UTC+12:00) New Zealand Time ', '2025-09-10 11:01:05.946778'),
(409, '(UTC+12:00) New Zealand Time (McMurdo) ', '2025-09-10 11:01:05.946778'),
(410, '(UTC+12:00) Petropavlovsk-Kamchatski Standard Time (Kamchatka) ', '2025-09-10 11:01:05.946778'),
(411, '(UTC+12:00) Tuvalu Time ', '2025-09-10 11:01:05.946778'),
(412, '(UTC+12:00) Wake Island Time ', '2025-09-10 11:01:05.946778'),
(413, '(UTC+12:00) Wallis &amp; Futuna Time ', '2025-09-10 11:01:05.946778'),
(414, '(UTC+12:45) Chatham Time ', '2025-09-10 11:01:05.946778'),
(415, '(UTC+13:00) Phoenix Islands Time (Enderbury) ', '2025-09-10 11:01:05.946778'),
(416, '(UTC+13:00) Samoa Time ', '2025-09-10 11:01:05.946778'),
(417, '(UTC+13:00) Tokelau Time ', '2025-09-10 11:01:05.946778'),
(418, '(UTC+13:00) Tonga Standard Time (Tongatapu) ', '2025-09-10 11:01:05.946778'),
(419, '(UTC+14:00) Line Islands Time (Kiritimati)', '2025-09-10 11:01:05.946778');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `address` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `public_user_name` varchar(255) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `emr_use` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `user_code` varchar(255) NOT NULL,
  `plan_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `status`, `created_at`, `address`, `logo`, `type`, `hospital_id`, `mobile`, `doctor_id`, `public_user_name`, `profession`, `specialty`, `emr_use`, `country`, `timezone`, `role_id`, `user_code`, `plan_id`) VALUES
(1, 'Pankaj Sharma', 'admin@admin.com', '$2b$10$OD3x1iC4At2uVFDUg184QOjAiJw8YSLiLrBQpSk.2ao8RpQD1pLI2', 1, '2025-08-18 11:08:37.696849', '', NULL, 'Admin', 0, '', NULL, 'Pankaj Sharma', 'Physical Therapist', 'General Surgery', 'Epic', 'Austria', '(UTC-08:00) Pacific Time (Los Angeles) ', NULL, '', NULL),
(2, 'Pankaj', 'panakj2089@gmail.com', '$2b$10$Y4gAsfsVawvvJ2iUn.NUheB5cX71fxh1JxTmcyxUxOduE2XJZtHxK', 1, '2025-09-06 09:44:15.664280', '#1223 Main Road', '1757152783635-909278829.png', 'Doctor', 8, '0903920932', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', 3),
(4, 'PKS', 'pks@gmail.com', '$2b$10$FFLqVCkd81G9Kg11STRGQewVK7FMRtG1Bopj9RaweA8f.k1Glga9G', 1, '2025-09-08 12:13:28.809152', '#1234 ugfuger', '1757338864574-409039894.png', 'Staff', 6, '9512243245', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(7, 'Test', 'test@test.com', '$2b$10$WmfOkjaKiWizYPR4izfLeOCouZZ6TRbmZ4LFbpsuz/d1PQSmSYwCK', 1, '2025-09-08 12:22:23.617170', '#123 Test', NULL, 'Staff', 8, '6547655475', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(12, 'Test', 'test@test1.com', '$2b$10$7y89RCrEL2k4P0vsZVZVOuHTWlLaUOnNMaCQtRy9wW2BaaKuBy2gm', 1, '2025-09-09 10:55:44.421467', '@3234242', NULL, 'Doctor', 6, '1234567878', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(13, 'Test Staff', 'test_staff@gmail.com', '$2b$10$tShdza1.yQwIAuOlzvJR6OmAFsu2p3DKpC2tQ51OOkSYyFjxFyBdi', 1, '2025-09-13 11:29:42.396136', '#123 test road ', NULL, 'Staff', 6, '0930232039', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(14, 'New Sept', 'mew_sept@gmail.com', '$2b$10$Sl55bfWaeDfM/JKEIJLc7urOaepx7bcNhaq2Gf/v7XBDPON3Q6lyW', 1, '2025-09-13 11:30:41.194065', '#123 TT jhre GHGG', NULL, 'Staff', 8, '9898998989', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(15, 'Test Patient', 'test_patient@gmail.com', '$2b$10$CKkrMJwpYMygLTwfTAJJcuyCLTlUFgtIqV3kZQBekKTAzjK1wKrqW', 1, '2025-09-13 11:40:32.880997', '#123 YT Mkuri YUUoouu', NULL, 'Patient', 6, '8323872283', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Test_Patient_8323872283', NULL),
(16, 'Pankaj Sharma', 'pankaj.sharma2089@gmail.com', '$2b$10$UlQSYujXdAr8GABg8GfhMuqvw1dt2CuhIeNSJzR5u0JB4GhYN1OsO', 1, '2025-09-23 04:12:50.604918', '#123 Main Road', NULL, 'User', NULL, '9571997180', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '', NULL),
(24, 'Pankaj', 'panakj20891@gmail.com', '$2b$10$USC7RyTeiONHbkmcMBDWO.uwXj7DH8Mim7Ba2UletecY/sqVUcPD6', 1, '2025-10-08 10:37:00.094990', NULL, NULL, 'Doctor', NULL, NULL, NULL, 'Pankaj1759919820078', NULL, NULL, NULL, NULL, NULL, NULL, '', NULL),
(25, 'Test', 'test@ttttt.com', '$2b$10$18n14nC.Ns0HEWJInh0wwOwjQPFYmLjtyCt070upgX9cwvl4vR.yG', 1, '2025-10-08 10:49:29.320307', NULL, NULL, 'Doctor', NULL, NULL, NULL, 'Test', NULL, NULL, NULL, NULL, NULL, NULL, 'DTR-0025', NULL),
(26, 'PK Patient', 'pk_patinet@gmail.com', '$2b$10$5eNDAzXm1XBGPLBSS863IOHMK7XgdhRG99wJlMYOwTeEf3PcrcIbe', 1, '2025-10-15 11:27:30.536609', '#123 Main Road', NULL, 'Patient', 6, '9899898989', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pk-patient-9899898989', NULL),
(27, 'Test User', 'test111@test.com', '$2b$10$nhiN0oP0Hwb6owxgt5/vQukn9dlFVi6Gs6Jtvzak.i4SrcFune9I2', 1, '2025-10-15 11:46:24.900997', '#123', NULL, 'Patient', 6, '9899898989', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test-user-9899898989', NULL),
(28, 'Test PP', 'test_pp@gmail.com', '$2b$10$WsYrtSMhthCUMl2er3Cew.fIiZne5x7KC/HoWMIBGlirCvLSu.HgW', 1, '2025-10-15 12:02:40.765532', '#32323 2ojhJHJ erer', NULL, 'Patient', 8, '0983902842', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test-pp-0983902842', NULL),
(29, 'Test', 'test222@t.com', '$2b$10$K9XMI36BNazyi2ZwFGwNv.ppCuV1H8WDEtTZuKo2FaAEEzp8t6jY.', 1, '2025-11-03 11:18:15.488787', NULL, NULL, 'Doctor', NULL, NULL, NULL, 'Test', 'Physician', 'Anesthesia', 'Test', 'Azerbaijan', 'Angola', NULL, 'DTR-0029', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appoinments`
--
ALTER TABLE `appoinments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patientforms`
--
ALTER TABLE `patientforms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support-ticket-comments`
--
ALTER TABLE `support-ticket-comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support-tickets`
--
ALTER TABLE `support-tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timezones`
--
ALTER TABLE `timezones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD KEY `FK_a2cecd1a3531c0b041e29ba46e1` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appoinments`
--
ALTER TABLE `appoinments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patientforms`
--
ALTER TABLE `patientforms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `support-ticket-comments`
--
ALTER TABLE `support-ticket-comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `support-tickets`
--
ALTER TABLE `support-tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `timezones`
--
ALTER TABLE `timezones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=420;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_a2cecd1a3531c0b041e29ba46e1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
