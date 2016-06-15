SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `profession_type`
-- ----------------------------
DROP TABLE IF EXISTS `profession_type`;
CREATE TABLE `profession_type` (
  `id` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cname` varchar(200) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `value` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`) USING BTREE,
  KEY `idx_value` (`value`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `profession_type`
-- ----------------------------
BEGIN;
INSERT INTO `profession_type` VALUES ('20160529031937146446', 'plaster', '泥工', now(), null, 'false', '0001'), ('20160529031949146446', 'carpenter', '木工', now(), null, 'false', '0002'), ('20160529031957146446', 'painter', '油漆工', now(), null, 'false', '0003'), ('20160529032009146446', 'electrician', '水电工', now(), null, 'false', '0004'), ('20160529032021146446', 'handyman', '力工', now(), null, 'false', '0005'), ('20160529032030146446', 'other', '其他', now(), null, 'false', '0009');
COMMIT;

-- ----------------------------
--  Table structure for `statement_bill_item`
-- ----------------------------
DROP TABLE IF EXISTS `statement_bill_item`;
CREATE TABLE `statement_bill_item` (
  `id` varchar(20) NOT NULL,
  `billId` varchar(20) NOT NULL,
  `serialNumber` varchar(10) DEFAULT NULL,
  `billItemName` varchar(50) DEFAULT NULL,
  `unit` varchar(10) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `unitPrice` double DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `professionType` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `referenceItems` text DEFAULT NULL,
  `checkedNumber` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `statement_basic_item`
-- ----------------------------
DROP TABLE IF EXISTS `statement_basic_item`;
CREATE TABLE `statement_basic_item` (
  `id` varchar(20) NOT NULL,
  `serialNumber` varchar(10) DEFAULT NULL,
  `billItemName` varchar(50) DEFAULT NULL,
  `unit` varchar(10) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `unitPrice` double DEFAULT NULL,
  `subtotal` double DEFAULT NULL,
  `professionType` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `referenceItems` text DEFAULT NULL,
  `checkedNumber` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `statement_bill`;
CREATE TABLE `statement_bill` (
  `id` varchar(20) NOT NULL,
  `payee` varchar(100) DEFAULT NULL,
  `projectId` varchar(20) NOT NULL,
  `projectName` varchar(500) DEFAULT NULL,
  `totalFee` double DEFAULT NULL,
  `claimAmount` double DEFAULT NULL,
  `payedTimes` double DEFAULT NULL,
  `projectProgress` double DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `phoneNumber` varchar(30) DEFAULT NULL,
  `professionType` varchar(5) DEFAULT NULL,
  `billName` varchar(50) DEFAULT NULL,
  `billValue` varchar(50) DEFAULT NULL,
  `billType` varchar(5) DEFAULT NULL,
  `status` varchar(5) DEFAULT NULL,
  `checker` varchar(50) DEFAULT NULL,
  `creator` varchar(50) DEFAULT NULL,
  `isPaid` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `statement_bill_audit`
-- ----------------------------
DROP TABLE IF EXISTS `statement_bill_audit`;
CREATE TABLE `statement_bill_audit` (
  `id` varchar(20) DEFAULT NULL,
  `billId` varchar(20) DEFAULT NULL,
  `comments` varchar(500) DEFAULT NULL,
  `operator` varchar(25) DEFAULT NULL,
  `orignalStatus` varchar(50) DEFAULT NULL,
  `newStatus` varchar(50) DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `plan_making`;
CREATE TABLE `plan_making` (
  `id` varchar(20) DEFAULT NULL,
  `projectId` varchar(20) DEFAULT NULL,
  `projectAddress` varchar(500) DEFAULT NULL,
  `startTime` varchar(25) DEFAULT NULL,
  `endTime` varchar(50) DEFAULT NULL,
  `c1` varchar(20) DEFAULT NULL ,
  `c2` varchar(20) DEFAULT NULL ,
  `c3` varchar(20) DEFAULT NULL ,
  `c4` varchar(20) DEFAULT NULL ,
  `c5` varchar(20) DEFAULT NULL ,
  `c6` varchar(20) DEFAULT NULL ,
  `c7` varchar(20) DEFAULT NULL ,
  `c8` varchar(20) DEFAULT NULL ,
  `c9` varchar(20) DEFAULT NULL ,
  `c10` varchar(20) DEFAULT NULL ,
  `c11` varchar(20) DEFAULT NULL ,
  `c12` varchar(20) DEFAULT NULL ,
  `c13` varchar(20) DEFAULT NULL ,
  `c14` varchar(20) DEFAULT NULL ,
  `c15` varchar(20) DEFAULT NULL ,
  `c16` varchar(20) DEFAULT NULL ,
  `c17` varchar(20) DEFAULT NULL ,
  `c18` varchar(20) DEFAULT NULL ,
  `c19` varchar(20) DEFAULT NULL ,
  `c20` varchar(20) DEFAULT NULL ,
  `c21` varchar(20) DEFAULT NULL ,
  `c22` varchar(20) DEFAULT NULL ,
  `c23` varchar(20) DEFAULT NULL ,
  `c24` varchar(20) DEFAULT NULL ,
  `c25` varchar(20) DEFAULT NULL ,
  `c26` varchar(20) DEFAULT NULL ,
  `c27` varchar(20) DEFAULT NULL ,
  `c28` varchar(20) DEFAULT NULL ,
  `c29` varchar(20) DEFAULT NULL ,
  `c30` varchar(20) DEFAULT NULL ,
  `c31` varchar(20) DEFAULT NULL ,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


SET FOREIGN_KEY_CHECKS = 1;
update `familydecoration`.`system` set `paramDesc`='', `isDeleted`='false', `id`='4', `updateTime`='0000-00-00 00:00:00', `paramName`='version', `createTime`='2015-04-11 13:51:14', `paramValue`='version-7.7' where `id`='4';
