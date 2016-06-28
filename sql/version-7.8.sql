DROP TABLE IF EXISTS `project_progress`;
CREATE TABLE `project_progress`(
  `id` varchar(20) default null,
  `projectId` varchar(20) default null,
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
  `projectId` varchar(20) default null,
  `columnName` varchar(5) default null,
  `content` text default null,
  `auditor` varchar(20) default null,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `mainmaterial` ADD `isChecked` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL AFTER `productDeliver`;
ALTER TABLE `mainmaterial` ADD `materialType` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL AFTER `productDeliver`;
update `system` set `paramValue`='version-7.8' where `id`='4';

insert into `system` ( `paramDesc`, `isDeleted`, `id`, `updateTime`, `paramName`, `createTime`, `paramValue`) values ( '主材订购提醒短信:您好,{项目}还有{天}就要开始了,请提前订购{主材}!', 'false', '9', '2016-06-26 14:08:09', 'msg_notice', '2016-06-26 14:08:12', '您好,{项目}还有{几}天就要开始了,请提前订购{主材}!');
insert into `system` ( `paramDesc`, `isDeleted`, `id`, `updateTime`, `paramName`, `createTime`, `paramValue`) values ( '主材订购提醒提前发送时间', 'false', '10', '0000-00-00 00:00:00', 'msg_notice_time', '2016-06-26 14:09:54', '1,3,5');
insert into `system` ( `paramDesc`, `isDeleted`, `id`, `updateTime`, `paramName`, `createTime`, `paramValue`) values ( '财务单据申请短信验证码金额阈值(万元)', 'false', '11', '0000-00-00 00:00:00', 'msg_notice_time', '2016-06-26 14:09:54', '5');

alter table `user` add `securePass` varchar(250);
