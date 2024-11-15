alter table business add column `custRemark` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '客户其他信息';

CREATE TABLE `contracte_engineering_changelog` (
    `id` varchar(20) NOT NULL,
    `contractId` varchar(20) NOT NULL COMMENT '合同id',
    `changeContent` text NOT NULL COMMENT '变更内容',
    `creator` varchar(512) NULL DEFAULT null,
    `creatorName` varchar(512) NULL DEFAULT null,
    `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `contracte_engineering_notice_order` (
    `id` varchar(20) NOT NULL,
    `contractId` varchar(20) NOT NULL COMMENT '合同id',
    `title` text NOT NULL COMMENT '变更内容',
    `content` varchar(512) NULL DEFAULT null,
    `price` varchar(512) NULL DEFAULT null,
    `creator` varchar(512) NULL DEFAULT null,
    `creatorName` varchar(512) NULL DEFAULT null,
    `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

insert into `versions`(`id`) values ('version-10.06');