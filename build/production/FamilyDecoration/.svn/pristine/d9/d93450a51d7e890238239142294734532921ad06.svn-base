-- phpMyAdmin SQL Dump
-- version 3.3.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 05, 2015 at 03:04 AM
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
-- Table structure for table `basic_item`
--

DROP TABLE IF EXISTS `basic_item`;
CREATE TABLE IF NOT EXISTS `basic_item` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `itemId` varchar(100) NOT NULL COMMENT '基础项目大项id',
  `itemName` varchar(100) NOT NULL COMMENT '基础项目大项名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `basic_item`
--

INSERT INTO `basic_item` (`id`, `itemId`, `itemName`) VALUES
(1, 'basic-201412061743412957', '吊顶工程'),
(2, 'basic-201412061745099855', '彭浩工程'),
(3, 'basic-201412061745209628', '测试工程'),
(4, 'basic-201412061745208299', '测试工程1'),
(5, 'basic-201412241009184445', '电子设备工程'),
(6, 'basic-201412241009184440', '桌面工程'),
(7, 'basic-201412241009181369', '喷漆工程'),
(8, 'basic-201412241009187201', '电灯工程'),
(9, 'basic-201412241009184474', '汽车工程'),
(10, 'basic-201412241009185763', '玻璃工程'),
(11, 'basic-201412241009184112', '室内工程');

-- --------------------------------------------------------

--
-- Table structure for table `basic_sub_item`
--

DROP TABLE IF EXISTS `basic_sub_item`;
CREATE TABLE IF NOT EXISTS `basic_sub_item` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `subItemId` varchar(120) NOT NULL COMMENT '基础项目子项id',
  `subItemName` varchar(100) NOT NULL COMMENT '基础项目子项名称',
  `subItemUnit` varchar(20) NOT NULL,
  `mainMaterialPrice` double NOT NULL COMMENT '基础项目子项主材单价',
  `auxiliaryMaterialPrice` double NOT NULL COMMENT '基础项目子项辅材单价',
  `manpowerPrice` double NOT NULL COMMENT '基础项目子项人工单价',
  `machineryPrice` double NOT NULL COMMENT '基础项目子项机械单价',
  `lossPercent` double DEFAULT NULL COMMENT '基础项目子项损耗百分比',
  `parentId` varchar(100) NOT NULL COMMENT '基础项目大项的itemId',
  `cost` double NOT NULL COMMENT '基础子项目成本',
  `remark` text NOT NULL COMMENT '多行备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `basic_sub_item`
--

INSERT INTO `basic_sub_item` (`id`, `subItemId`, `subItemName`, `subItemUnit`, `mainMaterialPrice`, `auxiliaryMaterialPrice`, `manpowerPrice`, `machineryPrice`, `lossPercent`, `parentId`, `cost`, `remark`) VALUES
(1, 'basic-sub-201412061744566090', '家装吊顶', '㎡', 1.123, 3.12, 4.125, 1.312, 0.14, 'basic-201412061743412957', 1.01, '1、50系列U型轻钢龙骨或木条龙骨.2、9mm厚纸面石膏板罩面，自攻螺丝钉固定.3、按展开平面面积计算工程量，不足1㎡按1㎡计算.4、窗帘盒另计.'),
(2, 'basic-sub-201412061744562808', '屋顶装修', '㎡', 3.12, 9.12, 11.234, 10.98, 0.1, 'basic-201412061743412957', 3.01, ''),
(3, 'basic-sub-201412061746241275', '美工', 'ml', 1.31, 9.1, 11.21, 0.13, 0.1, 'basic-201412061745099855', 0.987, ''),
(4, 'basic-sub-201412061746245245', '美化', 'km', 10.12, 9.12, 11.21, 11.98, 0.901, 'basic-201412061745099855', 0, ''),
(5, 'basic-sub-201412061747255522', '测试名称1', 'hh', 12.1, 2.01, 0.11, 9.101, 0, 'basic-201412061745209628', 0, ''),
(6, 'basic-sub-201412061747257423', '测试名称2', 'hl', 109.1, 89.1, 0.123, 98.1, 0.001, 'basic-201412061745209628', 0.1, ''),
(7, 'basic-sub-201412241015528280', '顶部翻新', 'm', 0.9, 2.2, 54, 6, 0.1, 'basic-201412061743412957', 0.4, ''),
(8, 'basic-sub-201412241015521911', '顶部装潢', 'm', 9, 3.9, 0.14, 7, 0.2, 'basic-201412061743412957', 7, ''),
(9, 'basic-sub-201412241015523660', '顶梁切除', 'm', 24.9, 0.1, 0.1, 6.31, 0.1, 'basic-201412061743412957', 14, ''),
(10, 'basic-sub-201412241015526470', '名字1', 'm', 2.3, 0.1, 4.45, 8.6, 0.4, 'basic-201412061743412957', 1.1, ''),
(11, 'basic-sub-201412241015524962', '名字2', 'f', 0.3, 0.7, 0.54, 0.4, 0.7, 'basic-201412061743412957', 0.1, ''),
(12, 'basic-sub-201412241015526366', '名字3', 'm', 0.4, 10.2, 0.2, 4.6, 0.1, 'basic-201412061743412957', 0, ''),
(13, 'basic-sub-201412241015528970', '名字4', 'a', 5, 2.4, 0.1, 0.41, 0.01, 'basic-201412061743412957', 0.5, ''),
(14, 'basic-sub-201412241136392687', '玻璃1', 'h', 1.21, 21.2, 0.21, 0.21, 0.3, 'basic-201412241009185763', 1.01, ''),
(15, 'basic-sub-201412241138575707', '玻璃2', 'k1', 12.12, 31.1, 12.1, 41.1, 0.2, 'basic-201412241009185763', 11, ''),
(16, 'basic-sub-201412241138577250', '玻璃3', 'a', 12.31, 12.21, 12.1, 19.12, 0.11, 'basic-201412241009185763', 9.1, ''),
(17, 'basic-sub-201412241138571101', '玻璃4', 'o', 91, 10.2, 0.21, 2.3, 0.08, 'basic-201412241009185763', 80, ''),
(18, 'basic-sub-201412241140029652', '汽车1', 'p', 10021.5, 1990.2, 890.12, 980.12, 0.2, 'basic-201412241009184474', 10000.12, ''),
(19, 'basic-sub-201412241140025042', '汽车2', 'i', 9809, 980, 2019, 871, 0.31, 'basic-201412241009184474', 9000, ''),
(20, 'basic-sub-201412241140509295', '热备盘', 'm', 31, 10.21, 11.2, 19.1, 0.1, 'basic-201412241009184445', 6, ''),
(21, 'basic-sub-201412241141158187', '桌面', 'k', 21, 91, 12, 21, 0.2, 'basic-201412241009184440', 10, ''),
(22, 'basic-sub-201412241141474234', '墙上漆', 'px', 12, 213, 123, 113, 0.91, 'basic-201412241009181369', 0.21, ''),
(23, 'basic-sub-201412241142148890', '灯泡', '个', 0.12, 21, 21.31, 10.2, 0.21, 'basic-201412241009187201', 0.01, ''),
(24, 'basic-sub-201501041354226726', '小项测试1', 'df', 0, 0, 0, 0, 0, 'basic-201412061745208299', 0, 'asfdas\ndfasdfasdfa\nsdfasdf\n1234\n123'),
(25, 'basic-sub-201501041356086266', '小项测试1', 'df', 0, 0, 0, 0, 0, 'basic-201412061745208299', 0, 'asfd\nasdfasdfasdf\nasdf\nasdf'),
(26, 'basic-sub-201501041417323382', 'asdfa', 'asfa', 0, 0, 0, 0, 0, 'basic-201412241009187201', 0, 'asdfasdfa\nsd\nfa\nsd\nfa\ns\ndf\na\n'),
(27, 'basic-sub-201501041417323509', 'asdfas', 'sdfa', 0, 0, 0, 0, 0, 'basic-201412241009187201', 0, 'asdfasdfasdfasdfjalksjdlkfjalksdjlfkajlsdjfal');

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
CREATE TABLE IF NOT EXISTS `budget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `budgetId` varchar(30) DEFAULT NULL,
  `custName` varchar(45) NOT NULL,
  `projectName` varchar(45) DEFAULT NULL,
  `areaSize` varchar(45) DEFAULT NULL,
  `totalFee` varchar(45) DEFAULT NULL,
  `comments` varchar(4500) DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bugetId` (`budgetId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `budget`
--

INSERT INTO `budget` (`id`, `budgetId`, `custName`, `projectName`, `areaSize`, `totalFee`, `comments`, `isDeleted`) VALUES
(1, 'budget-201412241230051238', '李先生', '测试工程', '102', '2256.78964', '阿斯顿发手机的路口附近阿拉斯加的立方阿加思考的>>><<<爱睡觉了快点交罚款辣椒水老地方加速度啊', 'false'),
(2, 'budget-201412301726085628', 'test', '西山美墅', '12342', '5016.14432', 'asdfasdfa', 'false'),
(3, 'budget-201501041440302265', 'asdfasdaf', '天鹏工程', '11111', '10.27402', 'fasdfasdfa', 'false');

-- --------------------------------------------------------

--
-- Table structure for table `budget_item`
--

DROP TABLE IF EXISTS `budget_item`;
CREATE TABLE IF NOT EXISTS `budget_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `budgetItemId` varchar(50) DEFAULT NULL,
  `itemName` varchar(45) NOT NULL,
  `budgetId` varchar(30) NOT NULL,
  `itemCode` varchar(45) DEFAULT NULL,
  `itemUnit` varchar(45) DEFAULT NULL,
  `itemAmount` double DEFAULT NULL,
  `mainMaterialPrice` double DEFAULT NULL,
  `auxiliaryMaterialPrice` double DEFAULT NULL,
  `manpowerPrice` double DEFAULT NULL,
  `machineryPrice` double DEFAULT NULL,
  `lossPercent` double DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `remark` text COMMENT '备注多行',
  `basicItemId` varchar(100) DEFAULT NULL COMMENT '基础项目大项的itemId',
  `basicSubItemId` varchar(120) DEFAULT NULL COMMENT '基础项目子项id',
  PRIMARY KEY (`id`),
  KEY `buget_item_buget_idx` (`budgetId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=74 ;

--
-- Dumping data for table `budget_item`
--

INSERT INTO `budget_item` (`id`, `budgetItemId`, `itemName`, `budgetId`, `itemCode`, `itemUnit`, `itemAmount`, `mainMaterialPrice`, `auxiliaryMaterialPrice`, `manpowerPrice`, `machineryPrice`, `lossPercent`, `isDeleted`, `remark`, `basicItemId`, `basicSubItemId`) VALUES
(1, 'budget-item-201412241230054209', '吊顶工程', 'budget-201412241230051238', 'A', 'NULL', 0, 0, 0, 0, 0, 0, 'true', 'NULL', 'basic-201412061743412957', 'NULL'),
(2, 'budget-item-201412241230057020', '家装吊顶', 'budget-201412241230051238', 'A-1', '㎡', 1.2, 1.123, 3.12, 4.125, 1.312, 0.59402, 'true', '阿拉斯加懒得开房间爱丽丝顶梁\n爱健康路发生的几率发卡机螺丝钉放', 'basic-201412061743412957', 'basic-sub-201412061744566090'),
(3, 'budget-item-201412241230055761', '屋顶装修', 'budget-201412241230051238', 'A-2', '㎡', 13.4, 3.12, 9.12, 11.234, 10.98, 1.224, 'true', 'NULL', 'basic-201412061743412957', 'basic-sub-201412061744562808'),
(4, 'budget-item-201412241230054501', '顶部翻新', 'budget-201412241230051238', 'A-3', 'm', 10.1, 0.9, 2, 54, 6, 0.29, 'true', '阿斯顿发老师讲道理阿斯蒂芬绿卡', 'basic-201412061743412957', 'basic-sub-201412241015528280'),
(5, 'budget-item-201412241230055745', '顶部装潢', 'budget-201412241230051238', 'A-4', 'm', 1.3, 9, 3.9, 0.14, 7, 2.58, 'true', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015521911'),
(6, 'budget-item-201412241230057405', '顶梁切除', 'budget-201412241230051238', 'A-5', 'm', 0.3, 24.9, 0.1, 0.1, 6.31, 2.5, 'true', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015523660'),
(7, 'budget-item-201412241230051597', '名字1', 'budget-201412241230051238', 'A-6', 'm', 11, 2.3, 0.1, 4.45, 8.6, 0.96, 'true', '阿斯顿飞机阿拉卡三等奖发了是的', 'basic-201412061743412957', 'basic-sub-201412241015526470'),
(8, 'budget-item-201412241230057903', '名字2', 'budget-201412241230051238', 'A-6', 'f', 1.3, 0.3, 0.7, 0.54, 0.4, 0.7, 'true', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015524962'),
(9, 'budget-item-201412241230059944', '名字3', 'budget-201412241230051238', 'A-7', 'm', 1.3, 0.4, 10.2, 0.2, 4.6, 1.06, 'true', '案件少两块豆腐讲我爱睡觉都疯了', 'basic-201412061743412957', 'basic-sub-201412241015526366'),
(10, 'budget-item-201412241230051312', '名字4', 'budget-201412241230051238', 'A-8', 'a', 14.1, 5, 2.4, 0.1, 0.41, 0.074, 'true', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015528970'),
(11, 'budget-item-201412241230051936', '彭浩工程', 'budget-201412241230051238', 'B', 'NULL', 0, 0, 0, 0, 0, 0, 'true', 'NULL', 'basic-201412061745099855', 'NULL'),
(12, 'budget-item-201412241230052074', '美工', 'budget-201412241230051238', 'B-1', 'ml', 1.3, 1.31, 9.1, 11.21, 0.13, 1.041, 'true', 'NULL', 'basic-201412061745099855', 'basic-sub-201412061746241275'),
(13, 'budget-item-201412241230058496', '美化', 'budget-201412241230051238', 'B-2', 'km', 1.4, 10.12, 9.12, 11.21, 11.98, 17.33524, 'true', '阿斯顿飞机阿拉斯加单份暗恋', 'basic-201412061745099855', 'basic-sub-201412061746245245'),
(14, 'budget-item-201412241230052557', '测试工程', 'budget-201412241230051238', 'C', 'NULL', 0, 0, 0, 0, 0, 0, 'true', 'NULL', 'basic-201412061745209628', 'NULL'),
(15, 'budget-item-201412241230053072', '测试名称1', 'budget-201412241230051238', 'C-1', 'hh', 23.1, 12.1, 2.01, 0.11, 9.101, 0, 'true', 'NULL', 'basic-201412061745209628', 'basic-sub-201412061747255522'),
(16, 'budget-item-201412241230051253', '测试名称2', 'budget-201412241230051238', 'C-2', 'hl', 0.4, 109.1, 89.1, 0.123, 98.1, 0.1982, 'true', 'NULL', 'basic-201412061745209628', 'basic-sub-201412061747257423'),
(17, 'budget-item-201412241230057428', '工程直接费', 'budget-201412241230051238', 'N', '元', 1, 620.870146, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(18, 'budget-item-201412241230051938', '设计费3%', 'budget-201412241230051238', 'O', '元', 0.31, 192.46974526, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(19, 'budget-item-201412241230056654', '效果图', 'budget-201412241230051238', 'P', '张', 4, 2000, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(20, 'budget-item-201412241230052349', '5%管理费', 'budget-201412241230051238', 'Q', '元', 0.05, 31.0435073, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(21, 'budget-item-201412241230051749', '0%税金', 'budget-201412241230051238', 'R', '元', 0.08, 49.66961168, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(22, 'budget-item-201412241230059936', '工程总造价', 'budget-201412241230051238', 'S', '元', 1, 2894.05301024, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(23, 'budget-item-201412241235533660', '测试名称1', 'budget-201412241230051238', 'C-1', 'hh', 0, 12.1, 2.01, 0.11, 9.101, 0, 'true', 'NULL', 'basic-201412061745209628', 'basic-sub-201412061747255522'),
(24, 'budget-item-201412241247511000', '吊顶工程', 'budget-201412241230051238', 'A', 'NULL', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'basic-201412061743412957', 'NULL'),
(25, 'budget-item-201412241247517049', '家装吊顶', 'budget-201412241230051238', 'A-1', '㎡', 1.3, 1.123, 3.12, 4.125, 1.312, 0.59402, 'false', 'asdkfasl;dkf;aks;dkfa;\nasdfjalksjdflajls', 'basic-201412061743412957', 'basic-sub-201412061744566090'),
(26, 'budget-item-201412241247511933', '屋顶装修', 'budget-201412241230051238', 'A-2', '㎡', 12.31, 3.12, 9.12, 11.234, 10.98, 1.224, 'false', 'sdjfjlkajslkjflkjalskdjk', 'basic-201412061743412957', 'basic-sub-201412061744562808'),
(27, 'budget-item-201412241247514438', '顶部翻新', 'budget-201412241230051238', 'A-3', 'm', 1, 0.9, 2, 54, 6, 0.29, 'false', 'asdflajsdjflajsdlk', 'basic-201412061743412957', 'basic-sub-201412241015528280'),
(28, 'budget-item-201412241247515055', '顶部装潢', 'budget-201412241230051238', 'A-4', 'm', 0, 9, 3.9, 0.14, 7, 2.58, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015521911'),
(29, 'budget-item-201412241247513460', '顶梁切除', 'budget-201412241230051238', 'A-5', 'm', 0.2, 24.9, 0.1, 0.1, 6.31, 2.5, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015523660'),
(30, 'budget-item-201412241247516536', '名字1', 'budget-201412241230051238', 'A-6', 'm', 0.31, 2.3, 0.1, 4.45, 8.6, 0.96, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015526470'),
(31, 'budget-item-201412241247516885', '名字2', 'budget-201412241230051238', 'A-7', 'f', 0, 0.3, 0.7, 0.54, 0.4, 0.7, 'false', '看下新装的adobe reader', 'basic-201412061743412957', 'basic-sub-201412241015524962'),
(32, 'budget-item-201412241247516425', '名字3', 'budget-201412241230051238', 'A-8', 'm', 2, 0.4, 10.2, 0.2, 4.6, 1.06, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015526366'),
(33, 'budget-item-201412241247511301', '名字4', 'budget-201412241230051238', 'A-9', 'a', 0.41, 5, 2.4, 0.1, 0.41, 0.074, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015528970'),
(34, 'budget-item-201412241254303942', '电子设备工程', 'budget-201412241230051238', 'B', 'NULL', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'basic-201412241009184445', 'NULL'),
(35, 'budget-item-201412241254303270', '热备盘', 'budget-201412241230051238', 'B-1', 'm', 0, 31, 10.21, 11.2, 19.1, 4.121, 'false', 'NULL', 'basic-201412241009184445', 'basic-sub-201412241140509295'),
(36, 'budget-item-201412241254379820', '室内工程', 'budget-201412241230051238', 'C', 'NULL', 0, 0, 0, 0, 0, 0, 'true', 'NULL', 'basic-201412241009184112', 'NULL'),
(37, 'budget-item-201412241259322651', '电灯工程', 'budget-201412241230051238', 'C', 'NULL', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'basic-201412241009187201', 'NULL'),
(38, 'budget-item-201412241259321311', '灯泡', 'budget-201412241230051238', 'C-1', '个', 1, 0.12, 21, 21.31, 10.2, 4.4352, 'false', 'NULL', 'basic-201412241009187201', 'basic-sub-201412241142148890'),
(39, 'budget-item-201412301726081859', '吊顶工程', 'budget-201412301726085628', 'A', 'NULL', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'basic-201412061743412957', 'NULL'),
(40, 'budget-item-201412301726084424', '家装吊顶', 'budget-201412301726085628', 'A-1', '㎡', 2, 1.123, 3.12, 4.125, 1.312, 0.59402, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412061744566090'),
(41, 'budget-item-201412301726087195', '屋顶装修', 'budget-201412301726085628', 'A-2', '㎡', 0.3, 3.12, 9.12, 11.234, 10.98, 1.224, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412061744562808'),
(42, 'budget-item-201412301726081923', '顶部翻新', 'budget-201412301726085628', 'A-3', 'm', 0, 0.9, 2, 54, 6, 0.29, 'false', 'sajdfjalsjdlfa<br />asdjkfalsdjl<br />丁\n俊晖将客户肯定好看', 'basic-201412061743412957', 'basic-sub-201412241015528280'),
(43, 'budget-item-201412301726088012', '顶部装潢', 'budget-201412301726085628', 'A-4', 'm', 0, 9, 3.9, 0.14, 7, 2.58, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015521911'),
(44, 'budget-item-201412301726083363', '顶梁切除', 'budget-201412301726085628', 'A-5', 'm', 0, 24.9, 0.1, 0.1, 6.31, 2.5, 'false', 'sdfajsldkfjla\nasjdfjalksdjlaf', 'basic-201412061743412957', 'basic-sub-201412241015523660'),
(45, 'budget-item-201412301726082992', '名字1', 'budget-201412301726085628', 'A-6', 'm', 123.1, 2.3, 0.1, 4.45, 8.6, 0.96, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015526470'),
(46, 'budget-item-201412301726083737', '名字2', 'budget-201412301726085628', 'A-7', 'f', 0, 0.3, 0.7, 0.54, 0.4, 0.7, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015524962'),
(47, 'budget-item-201412301726088891', '名字3', 'budget-201412301726085628', 'A-8', 'm', 1, 0.4, 10.2, 0.2, 4.6, 1.06, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015526366'),
(48, 'budget-item-201412301726082262', '名字4', 'budget-201412301726085628', 'A-9', 'a', 0, 5, 2.4, 0.1, 0.41, 0.074, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015528970'),
(49, 'budget-item-201412301726088265', '测试工程', 'budget-201412301726085628', 'B', 'NULL', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'basic-201412061745209628', 'NULL'),
(50, 'budget-item-201412301726089367', '测试名称1', 'budget-201412301726085628', 'B-1', 'hh', 13.11, 12.1, 2.01, 0.11, 9.101, 0, 'false', 'asjdfjaklsjdlfaj', 'basic-201412061745209628', 'basic-sub-201412061747255522'),
(51, 'budget-item-201412301726089864', '测试名称2', 'budget-201412301726085628', 'B-2', 'hl', 9, 109.1, 89.1, 0.123, 98.1, 0.1982, 'false', 'NULL', 'basic-201412061745209628', 'basic-sub-201412061747257423'),
(52, 'budget-item-201412301726081766', '工程直接费', 'budget-201412301726085628', 'N', '元', 1, 5043.11155, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(53, 'budget-item-201412301726085768', '设计费3%', 'budget-201412301726085628', 'O', '元', 0.3, 1512.933465, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(54, 'budget-item-201412301726084168', '效果图', 'budget-201412301726085628', 'P', '张', 11, 5500, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(55, 'budget-item-201412301726084321', '5%管理费', 'budget-201412301726085628', 'Q', '元', 0.05, 252.1555775, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(56, 'budget-item-201412301726085205', '0%税金', 'budget-201412301726085628', 'R', '元', 0.3, 1512.933465, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(57, 'budget-item-201412301726084934', '工程总造价', 'budget-201412301726085628', 'S', '元', 1, 13821.1340575, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(58, 'budget-item-201501041440305398', '吊顶工程', 'budget-201501041440302265', 'A', 'NULL', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'basic-201412061743412957', 'NULL'),
(59, 'budget-item-201501041440304307', '家装吊顶', 'budget-201501041440302265', 'A-1', '㎡', 1, 1.123, 3.12, 4.125, 1.312, 0.59402, 'false', '测试下\n换行', 'basic-201412061743412957', 'basic-sub-201412061744566090'),
(60, 'budget-item-201501041440308168', '屋顶装修', 'budget-201501041440302265', 'A-2', '㎡', 0, 3.12, 9.12, 11.234, 10.98, 1.224, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412061744562808'),
(61, 'budget-item-201501041440305624', '顶部翻新', 'budget-201501041440302265', 'A-3', 'm', 0, 0.9, 2, 54, 6, 0.29, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015528280'),
(62, 'budget-item-201501041440303222', '顶部装潢', 'budget-201501041440302265', 'A-4', 'm', 0, 9, 3.9, 0.14, 7, 2.58, 'false', 'asdfasdfa\nsd\nfa\nsd\nf\n', 'basic-201412061743412957', 'basic-sub-201412241015521911'),
(63, 'budget-item-201501041440301224', '顶梁切除', 'budget-201501041440302265', 'A-5', 'm', 0, 24.9, 0.1, 0.1, 6.31, 2.5, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015523660'),
(64, 'budget-item-201501041440306650', '名字1', 'budget-201501041440302265', 'A-6', 'm', 0, 2.3, 0.1, 4.45, 8.6, 0.96, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015526470'),
(65, 'budget-item-201501041440306918', '名字2', 'budget-201501041440302265', 'A-7', 'f', 0, 0.3, 0.7, 0.54, 0.4, 0.7, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015524962'),
(66, 'budget-item-201501041440309626', '名字3', 'budget-201501041440302265', 'A-8', 'm', 0, 0.4, 10.2, 0.2, 4.6, 1.06, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015526366'),
(67, 'budget-item-201501041440303144', '名字4', 'budget-201501041440302265', 'A-9', 'a', 0, 5, 2.4, 0.1, 0.41, 0.074, 'false', 'NULL', 'basic-201412061743412957', 'basic-sub-201412241015528970'),
(68, 'budget-item-201501041440305140', '工程直接费', 'budget-201501041440302265', 'N', '元', 1, 10.27402, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(69, 'budget-item-201501041440308128', '设计费3%', 'budget-201501041440302265', 'O', '元', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(70, 'budget-item-201501041440308904', '效果图', 'budget-201501041440302265', 'P', '张', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(71, 'budget-item-201501041440308477', '5%管理费', 'budget-201501041440302265', 'Q', '元', 0.05, 0.513701, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(72, 'budget-item-201501041440307222', '0%税金', 'budget-201501041440302265', 'R', '元', 0, 0, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL'),
(73, 'budget-item-201501041440302529', '工程总造价', 'budget-201501041440302265', 'S', '元', 1, 10.787721, 0, 0, 0, 0, 'false', 'NULL', 'NULL', 'NULL');

-- --------------------------------------------------------

--
-- Table structure for table `bulletin`
--

DROP TABLE IF EXISTS `bulletin`;
CREATE TABLE IF NOT EXISTS `bulletin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `bulletin`
--

INSERT INTO `bulletin` (`id`, `content`) VALUES
(1, '%u6D4B%u8BD5%u516C%u544A'),
(2, '%u5404%u90E8%u95E8%u6CE8%u610F%uFF1A%0A%20%20%20%20%20%20%20%20%20%20%20%20%u5168%u529B%u524D%u8FDB'),
(3, 'ajsdklfjajsdlfjalsdfasdfasdaf');

-- --------------------------------------------------------

--
-- Table structure for table `censorship`
--

DROP TABLE IF EXISTS `censorship`;
CREATE TABLE IF NOT EXISTS `censorship` (
  `id` varchar(18) NOT NULL COMMENT '主键',
  `logListId` varchar(18) NOT NULL COMMENT '对应审核的日志id',
  `content` text NOT NULL COMMENT '审核文字内容',
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false' COMMENT '是否删除',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `userName` text NOT NULL COMMENT '审核人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `censorship`
--

INSERT INTO `censorship` (`id`, `logListId`, `content`, `isDeleted`, `createTime`, `userName`) VALUES
('201503020937568573', '201502271106118102', '自己批自己的\n\n\n我是总经理', 'false', '2015-03-02 09:37:56', 'admin'),
('201503020945248955', '201502271039254073', '总经理简单说两句', 'false', '2015-03-02 09:45:24', 'admin'),
('201503020945340194', '201502271059453036', '总经理简单说两句', 'false', '2015-03-02 09:45:34', 'admin'),
('201503020945443301', '201502271035413206', '总经理简单说两句', 'false', '2015-03-02 09:45:44', 'admin'),
('201503020945481800', '201502271038351483', '总经理简单说两句', 'false', '2015-03-02 09:45:48', 'admin'),
('201503020945547739', '201502271100422854', '总经理简单说两句', 'false', '2015-03-02 09:45:54', 'admin'),
('201503020945587077', '201502271517482976', '总经理简单说两句', 'false', '2015-03-02 09:45:58', 'admin'),
('201503020946053404', '201502271046012752', '总经理简单说两句', 'false', '2015-03-02 09:46:05', 'admin'),
('201503020946099464', '201502271048004898', '总经理简单说两句', 'false', '2015-03-02 09:46:09', 'admin'),
('201503020946163384', '201502271048355656', '总经理简单说两句', 'false', '2015-03-02 09:46:16', 'admin'),
('201503020946214555', '201502271057562795', '总经理简单说两句', 'true', '2015-03-02 09:46:21', 'admin'),
('201503020946459763', '201502281745043079', '怎么忘记写东西了呢   \n\n\n\n\n我是总经理', 'false', '2015-03-02 09:46:45', 'admin'),
('201503021127176583', '201502271038351483', '我是工程部主管', 'false', '2015-03-02 11:27:17', 'pmanager'),
('201503021127278843', '201502271035413206', '哥是工程部主管', 'false', '2015-03-02 11:27:27', 'pmanager'),
('201503021127351246', '201502271517482976', '哥是工程部主管', 'false', '2015-03-02 11:27:35', 'pmanager'),
('201503021136564772', '201502271057562795', '行政主管来了', 'true', '2015-03-02 11:36:56', 'amanager'),
('201503021207495559', '201503021202101872', '擦一脚      admin', 'true', '2015-03-02 12:07:49', 'admin'),
('201503021208527808', '201503021202101872', '行政主管来了', 'true', '2015-03-02 12:08:52', 'amanager'),
('201503021211478659', '201503021211142441', '看下小兔崽子', 'true', '2015-03-02 12:11:47', 'admin'),
('201503021212362968', '201503021211142441', '设计部主管', 'true', '2015-03-02 12:12:36', 'dmanager'),
('201503021216377626', '201503021216038191', 'fasdfasdfasfa', 'true', '2015-03-02 12:16:37', 'dmanager'),
('201503021218552716', '201503021217462154', '设计主管批阅', 'true', '2015-03-02 12:18:55', 'dmanager'),
('201503021219127940', '201503021217462154', '副总经理批阅', 'true', '2015-03-02 12:19:12', 'vadmin');

-- --------------------------------------------------------

--
-- Table structure for table `chart`
--

DROP TABLE IF EXISTS `chart`;
CREATE TABLE IF NOT EXISTS `chart` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `chartId` varchar(40) NOT NULL,
  `chartCategory` varchar(100) NOT NULL,
  `chartContent` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `chart`
--

INSERT INTO `chart` (`id`, `chartId`, `chartCategory`, `chartContent`) VALUES
(13, 'chart-201411191102082014', '欧式家装', ''),
(14, 'chart-201411191110147930', '田园风情', '');

-- --------------------------------------------------------

--
-- Table structure for table `log_detail`
--

DROP TABLE IF EXISTS `log_detail`;
CREATE TABLE IF NOT EXISTS `log_detail` (
  `id` varchar(18) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false',
  `logListId` varchar(18) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `log_detail`
--

INSERT INTO `log_detail` (`id`, `createTime`, `isDeleted`, `logListId`, `content`) VALUES
('201502251159491048', '2015-02-25 11:59:49', 'true', '201502251042244648', 'test'),
('201502251159529866', '2015-02-25 11:59:52', 'true', '201502251042244648', 'haha'),
('201502271036424132', '2015-02-27 10:36:42', 'false', '201502271035413206', '我是工程部主管'),
('201502271036461196', '2015-02-27 10:36:46', 'false', '201502271035413206', '哈哈哈'),
('201502271038487922', '2015-02-27 10:38:48', 'false', '201502271038351483', '我是项目经理'),
('201502271038571874', '2015-02-27 10:38:57', 'false', '201502271038351483', '我哈哈'),
('201502271039343056', '2015-02-27 10:39:34', 'false', '201502271039254073', '哥是设计部主管'),
('201502271039388618', '2015-02-27 10:39:38', 'false', '201502271039254073', '哈哈哈'),
('201502271047244142', '2015-02-27 10:47:24', 'false', '201502271046012752', '俺是业务主管'),
('201502271047262219', '2015-02-27 10:47:26', 'false', '201502271046012752', '阿斯蒂芬'),
('201502271048103970', '2015-02-27 10:48:10', 'false', '201502271048004898', '哈我是业务员'),
('201502271048132505', '2015-02-27 10:48:13', 'false', '201502271048004898', '哈哈'),
('201502271048429255', '2015-02-27 10:48:42', 'false', '201502271048355656', '行政主管来了'),
('201502271048459439', '2015-02-27 10:48:45', 'false', '201502271048355656', '呀呼'),
('201502271048575296', '2015-02-27 10:48:57', 'false', '201502271048355656', '所发生的'),
('201502271058039994', '2015-02-27 10:58:03', 'true', '201502271057562795', '这是行政部员工'),
('201502271058071064', '2015-02-27 10:58:07', 'true', '201502271057562795', 'tada'),
('201502271059525198', '2015-02-27 10:59:52', 'false', '201502271059453036', '我是设计师'),
('201502271059564228', '2015-02-27 10:59:56', 'false', '201502271059453036', '哈哈'),
('201502271100516309', '2015-02-27 11:00:51', 'false', '201502271100422854', '哥哥是项目监理'),
('201502271100545369', '2015-02-27 11:00:54', 'false', '201502271100422854', '嘎嘎'),
('201502271104314162', '2015-02-27 11:04:31', 'false', '201502271102079613', '哥是副总经理'),
('201502271105484574', '2015-02-27 11:05:48', 'false', '201502271102079613', 'as a'),
('201502271106193266', '2015-02-27 11:06:19', 'false', '201502271106118102', '总经理日志'),
('201502271106259989', '2015-02-27 11:06:25', 'false', '201502271106118102', '哥可是总经理'),
('201502271517551735', '2015-02-27 15:17:55', 'false', '201502271517482976', '我是项目经理1'),
('201502271517586366', '2015-02-27 15:17:58', 'false', '201502271517482976', '艾弗森的a'),
('201502281707377961', '2015-02-28 17:07:37', 'false', '201502271106118102', 'test'),
('201502281707391289', '2015-02-28 17:07:39', 'false', '201502271106118102', 'tesasfd'),
('201502281707418821', '2015-02-28 17:07:41', 'false', '201502271106118102', 'test'),
('201502281707447741', '2015-02-28 17:07:44', 'false', '201502271106118102', 'asdfa sfa sda '),
('201502281707471740', '2015-02-28 17:07:47', 'false', '201502271106118102', 'fasdfas\ndf\na\nsd\nf\nas\ndf\na'),
('201502281707512460', '2015-02-28 17:07:51', 'false', '201502271106118102', 'asdfasd\nfas\nd\naf\nsd\naf\n'),
('201502281708155684', '2015-02-28 17:08:15', 'false', '201502271106118102', 'afsdfa\ns\nd\nfa\ns\nd\nfa\ns\ndf\na\nsd\n'),
('201503021212046190', '2015-03-02 12:12:04', 'true', '201503021211142441', 'fasdfasda'),
('201503021212078767', '2015-03-02 12:12:07', 'true', '201503021211142441', 'fasdfasda'),
('201503021216093577', '2015-03-02 12:16:09', 'true', '201503021216038191', '发送的发生'),
('201503021218357317', '2015-03-02 12:18:35', 'true', '201503021217462154', '睡都发生大发');

-- --------------------------------------------------------

--
-- Table structure for table `log_list`
--

DROP TABLE IF EXISTS `log_list`;
CREATE TABLE IF NOT EXISTS `log_list` (
  `id` varchar(18) NOT NULL,
  `logName` varchar(250) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false',
  `userName` varchar(45) NOT NULL COMMENT '日志创建者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户日志';

--
-- Dumping data for table `log_list`
--

INSERT INTO `log_list` (`id`, `logName`, `createTime`, `isDeleted`, `userName`) VALUES
('201502251042244648', 'test', '2015-02-25 00:00:00', 'true', 'admin'),
('201502271035413206', '工程部主管测试日志', '2015-02-27 00:00:00', 'false', 'pmanager'),
('201502271038351483', '项目经理日志', '2015-02-27 00:00:00', 'false', 'pstaff'),
('201502271039254073', '设计部主管日志', '2015-02-27 00:00:00', 'false', 'dmanager'),
('201502271046012752', '业务主管', '2015-02-27 00:00:00', 'false', 'bmanager'),
('201502271048004898', '业务员日志', '2015-02-27 00:00:00', 'false', 'bstaff'),
('201502271048355656', '行政主管日志', '2015-02-27 00:00:00', 'false', 'amanager'),
('201502271057562795', '行政部员工日志', '2015-02-27 00:00:00', 'true', 'astaff'),
('201502271059453036', '设计师日志', '2015-02-27 00:00:00', 'false', 'dstaff'),
('201502271100422854', '项目 监理日志', '2015-02-27 00:00:00', 'false', 'psupervisor'),
('201502271102079613', '副总经理日志', '2015-02-27 00:00:00', 'false', 'vadmin'),
('201502271106118102', '总经理日志', '2015-02-27 00:00:00', 'false', 'admin'),
('201502271517482976', '项目经理1日志', '2015-02-27 00:00:00', 'false', 'pstaff1'),
('201502281707255228', 'test', '2015-02-28 00:00:00', 'true', 'admin'),
('201502281745043079', '总经理测试日志1', '2015-02-28 00:00:00', 'false', 'admin'),
('201503021147202842', '行政部员工日志', '2015-03-02 00:00:00', 'false', 'astaff'),
('201503021202101872', '测试被删除之后，批阅内容是否被删除', '2015-03-02 00:00:00', 'true', 'astaff'),
('201503021211142441', '删除批阅测试', '2015-03-02 00:00:00', 'true', 'dstaff'),
('201503021213401541', 'sdfasdaf', '2015-03-02 00:00:00', 'true', 'dstaff'),
('201503021214031103', 'fasfasdaf', '2015-03-02 00:00:00', 'true', 'dstaff'),
('201503021215012408', 'fasdfa', '2015-03-02 00:00:00', 'true', 'dstaff'),
('201503021216038191', '测试下', '2015-03-02 00:00:00', 'true', 'dstaff'),
('201503021217462154', '测试最后一次', '2015-03-02 00:00:00', 'true', 'dstaff');

-- --------------------------------------------------------

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
CREATE TABLE IF NOT EXISTS `plan` (
  `id` varchar(18) NOT NULL COMMENT '主键id',
  `projectId` varchar(18) NOT NULL COMMENT '对应项目Id',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `prework` varchar(50) NOT NULL COMMENT '前期工作',
  `matPrepare` varchar(50) NOT NULL COMMENT '材料准备',
  `waterPower` varchar(50) NOT NULL COMMENT '水电施工',
  `cementBasic` varchar(50) NOT NULL COMMENT '泥工基础施工',
  `cementAdvanced` varchar(50) NOT NULL COMMENT '泥工饰面施工',
  `wallFloor` varchar(50) NOT NULL COMMENT '洁具、墙纸、木地板',
  `cleaning` varchar(50) NOT NULL COMMENT '保洁',
  `woods` varchar(50) NOT NULL COMMENT '木工施工',
  `painting` varchar(50) NOT NULL COMMENT '油漆',
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false' COMMENT '是否已删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `plan`
--

INSERT INTO `plan` (`id`, `projectId`, `createTime`, `prework`, `matPrepare`, `waterPower`, `cementBasic`, `cementAdvanced`, `wallFloor`, `cleaning`, `woods`, `painting`, `isDeleted`) VALUES
('201503031257011510', '201412301639279398', '2015-03-03 12:57:01', '11', '11', '11', '11', '11', '11', '11', '11', '11', 'true'),
('201503031324272879', '201412301639279398', '2015-03-03 13:24:27', '1', '2', '3', '1', '4', '6', '111', '3', '5', 'true'),
('201503031324401656', '201412301640035296', '2015-03-03 13:24:40', 'a', 'fa', '', '', '', '', '', 'sdfa ', '', 'false'),
('201503031324496075', '201412301639437839', '2015-03-03 13:24:49', 'as', '', '', '', 'as', 'dfa', 'sd', ' ', 'sf ', 'false'),
('201503031736418258', '201412301639279398', '2015-03-03 17:36:41', '1', '2', '2', '1', '2', '', '', '2', '2', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
CREATE TABLE IF NOT EXISTS `project` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `projectId` varchar(20) NOT NULL COMMENT '工程项目id',
  `projectName` varchar(100) NOT NULL COMMENT '工程项目名称',
  `projectProgress` text COMMENT '工程进度',
  `projectProgressComment` text NOT NULL,
  `projectChart` mediumtext COMMENT '工程图片',
  `projectTime` datetime NOT NULL,
  `budgetId` varchar(30) DEFAULT NULL COMMENT 'corresponding budget',
  `isFrozen` tinyint(2) NOT NULL COMMENT '是否为死单，默认不是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `projectId`, `projectName`, `projectProgress`, `projectProgressComment`, `projectChart`, `projectTime`, `budgetId`, `isFrozen`) VALUES
(8, '201412301639279398', '西山美墅', '啦啦<>巴拉<>哈哈<>2015/02/2710:43<>阿斯顿将法律卡加速度李开复阿斯顿解封卢卡斯的法律<>fasdfasdfa', '对应啦啦<>将阿克苏的减肥绿卡将离开\n阿斯顿发生健康的<>对应哈哈<>卡拉斯加贷款疗法讲述了开发了爱数姐弟恋发酵离开<>说的真棒。我是项目监理<>哎哟-from 项目监理', '../resources/chart/201412301639279398/201501091131157127.jpg||08f790529822720eb9ab5fe979cb0a46f21fabb8.jpg<>../resources/chart/201412301639279398/201501091131151184.jpg||9f2f070828381f30f49143b6ab014c086e06f021.jpg<>../resources/chart/201412301639279398/201501091131155389.jpg||574e9258d109b3de8106567bcebf6c81800a4c63.jpg<>../resources/chart/201412301639279398/201501091131159348.jpg||5882b2b7d0a20cf43194a4de74094b36acaf99ae.jpg<>../resources/chart/201412301639279398/201501091131152245.jpg||a6efce1b9d16fdfa58ee65e3b68f8c5494ee7b39.jpg<>../resources/chart/201412301639279398/201501091131153716.jpg||aa64034f78f0f736319e2e080855b319ebc41352.jpg<>../resources/chart/201412301639279398/201501091131155881.jpg||b8014a90f603738d3c345623b11bb051f819ecb1.jpg<>../resources/chart/201412301639279398/201501091131158899.jpg||cdbf6c81800a19d87a6555ea31fa828ba71e46ff.jpg<>../resources/chart/201412301639279398/201501091131156331.jpg||d009b3de9c82d158fb0603b0820a19d8bc3e422e.jpg<>../resources/chart/201412301639279398/201501091131151941.jpg||d31b0ef41bd5ad6e6dd475eb83cb39dbb6fd3c85.jpg<>../resources/chart/201412301639279398/201501091131157546.jpg||u=1,2239671332&fm=25&gp=0.jpg<>../resources/chart/201412301639279398/201501091131153418.jpg||u=2,596083530&fm=25&gp=0.jpg', '2014-12-23 00:00:00', 'budget-201412301726085628', 0),
(9, '201412301639437839', '天鹏工程', '阿斯顿发送到', '', '', '2011-12-07 00:00:00', 'budget-201501041440302265', 0),
(10, '201412301640035296', '测试工程', 'fasdfasd<>asdfasdaf', '', '', '2012-12-06 00:00:00', 'budget-201412241230051238', 0);

-- --------------------------------------------------------

--
-- Table structure for table `system`
--

DROP TABLE IF EXISTS `system`;
CREATE TABLE IF NOT EXISTS `system` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `paramName` varchar(250) NOT NULL COMMENT '参数名',
  `paramValue` text COMMENT '参数值',
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false' COMMENT '是否已删除',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新时间',
  `paramDesc` text NOT NULL COMMENT '参数描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='系统参数表' AUTO_INCREMENT=4 ;

--
-- Dumping data for table `system`
--

INSERT INTO `system` (`id`, `paramName`, `paramValue`, `isDeleted`, `createTime`, `updateTime`, `paramDesc`) VALUES
(1, 'adminpassword', 'admin:admin', 'false', '2014-12-24 16:59:08', '0000-00-00 00:00:00', '管理员密码'),
(2, 'sessionId', 'lavd391o4r278baa7e8ed8ph51', 'false', '2014-12-24 17:01:02', '2015-03-05 10:52:40', '用来限制admin用户同一时刻只能在一个地方登陆'),
(3, 'pageView', '0', 'false', '2014-12-24 17:01:38', '0000-00-00 00:00:00', '网页访问次数');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `projectId` varchar(18) DEFAULT NULL COMMENT '�ο��û�Ψһ���Բ鿴����ĿId',
  `realname` varchar(100) NOT NULL COMMENT '用户真实姓名',
  `password` varchar(200) NOT NULL,
  `level` varchar(10) NOT NULL COMMENT '用户等级',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `projectId`, `realname`, `password`, `level`) VALUES
(1, 'admin', NULL, '张泽南', '858c86a3843be5e3001b7db637cb67ab', '001-001'),
(10, 'vadmin', NULL, '李丹丹', '99f4f6dfdc0af4a57a98e8930966c709', '001-002'),
(11, 'dmanager', NULL, '王小二', 'f05fe7cc82606585202bd976be1c3b20', '002-001'),
(12, 'pmanager', NULL, '张小三', '25f09d7ddb6674026750f8325f26c842', '003-001'),
(13, 'bmanager', NULL, '李小四', '0ce91e898f456aee56a22a524b38ccef', '004-001'),
(14, 'visitor', NULL, '赵小二', '9a96de2483722aed08b4b190568a425a', '006-001'),
(15, 'dstaff', NULL, '孙小二', 'c1f672517aac54e099a6a51be26a2d76', '002-002'),
(16, 'pstaff', NULL, '孙小三', '7cdd7bb1ba94dd63e88cda2bf96629df', '003-002'),
(17, 'psupervisor', NULL, '周小二', 'fcc3547b30e5d847b4f1a7e059288f3a', '003-003'),
(18, 'bstaff', NULL, '吴小二', 'baf1424e94aafd8f61866515159bfc59', '004-002'),
(21, 'amanager', NULL, '吴小三', '414cc63e205d297de7ccebc3af1cbffc', '005-001'),
(22, 'astaff', NULL, '于小三', '434581bfafa03698d61eaf573f52a3ba', '005-002'),
(23, 'pstaff1', NULL, '宋小二', '83d0f04ed0dbb0c9f0140e679db8ef06', '003-002'),
(24, 'visitor1', '201412301639279398', '宋丹丹', '835d1537edaaa2c61f8b8810fbbae84e', '006-001'),
(25, 'pgmanager', '', '王老五', 'b77c4c9748930b2be23c0a0307bfd793', '007-001'),
(26, 'pgstaff', '', '王老六', '2840dafdbec73caf14aaa7b9a04c61c9', '007-002'),
(27, 'traveler', '201412301639279398', '我是游客', '4951aacd81bec0ba7392114ebb7c9dbd', '006-001'),
(28, 'test', '201412301639279398', 'test', '9dbe87d7bcd06079e681b60d5e7c43b9', '006-001');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `budget_item`
--
ALTER TABLE `budget_item`
  ADD CONSTRAINT `buget_item_buget` FOREIGN KEY (`budgetId`) REFERENCES `budget` (`budgetId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
