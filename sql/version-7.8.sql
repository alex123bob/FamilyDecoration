DROP TABLE IF EXISTS `project_progress`;
CREATE TABLE `project_progress`(
  `id` varchar(20) default null,
  `projectPlanId` varchar(20) default null,
  `columnName` varchar(5) default null,
  `content` text default null,
  `committer` varchar(20) default null,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `project_progress_audit`;
CREATE TABLE `project_progress_audit`(
  `id` varchar(20) default null,
  `projectPlanId` varchar(20) default null,
  `columnName` varchar(5) default null,
  `content` text default null,
  `auditor` varchar(20) default null,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `mainmaterial` ADD `isChecked` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL AFTER `productDeliver`;
update `system` set `paramValue`='version-7.8' where `id`='4';