CREATE TABLE `cost_list_item` (
  `id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'name',
  `unit` varchar(20) NOT NULL COMMENT 'unit',
  `professionType` varchar(20) COMMENT 'reference table profession type.',
  `isLabour` varchar(20) NOT NULL,
  `remark` varchar(512) NOT NULL,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cost_list_item`
--
ALTER TABLE `cost_list_item`
  ADD PRIMARY KEY (`id`);


UPDATE `profession_type` SET `cname` = '装饰泥工' WHERE `profession_type`.`id` = '20160529031937146446';
UPDATE `profession_type` SET `cname` = '装饰木工' WHERE `profession_type`.`id` = '20160529031949146446';
INSERT INTO `profession_type` (`id`, `name`, `cname`, `createTime`, `isDeleted`, `value`) VALUES ('20210224154635146446', 'basiccarpenter', '基础木工', '2021-02-24 15:46:35', 'false', '0010');
INSERT INTO `profession_type` (`id`, `name`, `cname`, `createTime`, `updateTime`, `isDeleted`, `value`) VALUES ('20210224155114213124', 'steelwelding', '钢筋电焊工', '2021-02-24 15:51:59', NULL, 'false', '0011');




insert into `versions`(`id`) values ('version-10.01');