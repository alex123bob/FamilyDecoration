CREATE TABLE `bid_project_region` (
    `id` varchar(20) NOT NULL,
    `name` varchar(100) NOT NULL COMMENT 'name',
    `remark` varchar(260) NULL DEFAULT null,
    `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
insert into `versions`(`id`) values ('version-2022-10-01');