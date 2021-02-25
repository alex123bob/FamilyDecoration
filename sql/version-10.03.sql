drop table if exists  `cost_norm`;
CREATE TABLE `cost_norm` (
  `id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'name',
  `remark` varchar(512) NULL DEFAULT null,
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table if exists  `cost_ref_norm_item`;
CREATE TABLE `cost_ref_norm_item` (
  `normId` varchar(20) NOT NULL COMMENT 'cost_norm id',
  `itemId` varchar(20) NOT NULL COMMENT 'cost_list_item id',
  `version` INT(100) NOT NULL COMMENT 'cost_list_item version',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table `cost_norm` ADD PRIMARY KEY (`id`);
alter table `cost_ref_norm_item` ADD CONSTRAINT pk PRIMARY KEY(`normId`, `itemId`, `version`);

alter table `cost_list_item` drop PRIMARY KEY;
alter table `cost_list_item` ADD CONSTRAINT pk PRIMARY KEY(`id`, `version`);

insert into `versions`(`id`) values ('version-10.03');