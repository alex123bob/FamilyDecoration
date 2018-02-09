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

insert into `versions`(`id`) values ('version-9.15');