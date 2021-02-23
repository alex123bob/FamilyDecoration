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

insert into `versions`(`id`) values ('version-10.01');