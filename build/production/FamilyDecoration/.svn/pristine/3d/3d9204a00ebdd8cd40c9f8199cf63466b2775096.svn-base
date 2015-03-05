-- phpMyAdmin SQL Dump
-- version 3.3.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 22, 2015 at 12:25 PM
-- Server version: 5.1.50
-- PHP Version: 5.3.14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `familydecoration`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `level` varchar(10) NOT NULL COMMENT '用户等级',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `level`) VALUES
(1, 'admin', '858c86a3843be5e3001b7db637cb67ab', '001-001'),
(10, 'vadmin', '99f4f6dfdc0af4a57a98e8930966c709', '001-002'),
(11, 'dmanager', 'f05fe7cc82606585202bd976be1c3b20', '002-001'),
(12, 'pmanager', '25f09d7ddb6674026750f8325f26c842', '003-001'),
(13, 'bmanager', '0ce91e898f456aee56a22a524b38ccef', '004-001'),
(14, 'visitor', '9a96de2483722aed08b4b190568a425a', '006-001'),
(15, 'dstaff', 'c1f672517aac54e099a6a51be26a2d76', '002-002'),
(16, 'pstaff', '7cdd7bb1ba94dd63e88cda2bf96629df', '003-002'),
(17, 'psupervisor', 'fcc3547b30e5d847b4f1a7e059288f3a', '003-003'),
(18, 'bstaff', 'baf1424e94aafd8f61866515159bfc59', '004-002');
