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

insert into `versions`(`id`) values ('version-9.15');