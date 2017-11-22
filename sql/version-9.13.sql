-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 22, 2017 at 06:37 AM
-- Server version: 5.7.18
-- PHP Version: 5.5.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `FamilyDecoration`
--

-- --------------------------------------------------------

--
-- Table structure for table `staff_salary`
--

CREATE TABLE `staff_salary` (
  `id` varchar(20) NOT NULL,
  `staffName` varchar(200) NOT NULL,
  `staffLevel` varchar(10) NOT NULL,
  `basicSalary` double DEFAULT NULL,
  `commission` double DEFAULT NULL,
  `fullAttendanceBonus` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `deduction` double DEFAULT NULL COMMENT '违扣',
  `total` double DEFAULT NULL COMMENT '合计',
  `insurance` double DEFAULT NULL COMMENT '五险',
  `housingFund` double DEFAULT NULL COMMENT '一金',
  `incomeTax` double DEFAULT NULL COMMENT '个税',
  `others` double DEFAULT NULL COMMENT '其他',
  `actualPaid` double DEFAULT NULL COMMENT '实发',
  `salaryDate` datetime DEFAULT NULL COMMENT '工资发放日期',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `staff_salary`
--
ALTER TABLE `staff_salary`
  ADD PRIMARY KEY (`id`);

insert into `versions`(`id`) values ('version-9.13');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
