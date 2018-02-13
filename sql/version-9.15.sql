CREATE TABLE `staff_salary_commission` (
  `id` varchar(20) NOT NULL,
  `staffSalaryId` varchar(20) NOT NULL COMMENT 'staff_salary item''s id',
  `projectId` varchar(20) NOT NULL COMMENT 'project id',
  `commissionAmount` double DEFAULT NULL,
  `staffName` varchar(200) NOT NULL,
  `commissionTime` datetime NOT NULL COMMENT 'year/month for this commission',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `staff_salary_commission`
--
ALTER TABLE `staff_salary_commission`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `staff_salary_commission` ADD `staffRealName` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'staffRealName, we don\'t need to join table, coz this info should be snapshotted.' AFTER `staffName`;

ALTER TABLE `statement_bill` CHANGE `billType` `billType` VARCHAR(8) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ppd:预付款,reg:普通账单,qgd:质量保证金,mtf:材料付款,rbm:报销,fdf:财务部门费用,wlf:福利,tax:税,stfs:员工工资';

ALTER TABLE `statement_bill` ADD `staffSalaryId` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'staff salary id' AFTER `businessId`;

insert into `versions`(`id`) values ('version-9.15');