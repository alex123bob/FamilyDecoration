CREATE TABLE `statement_bill_item_remark` (
  `id` varchar(20) DEFAULT NULL,
  `refId` varchar(200) DEFAULT NULL comment 'billItemId',
  `committer` varchar(200) DEFAULT NULL comment '标记人',
  `isDeleted` varchar(5) DEFAULT 'false',
  `content` varchar(500) DEFAULT '' comment '评论',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table project_progress_audit add column `pass` int(1) default 0 comment '是否通过审核. 1:通过,0:未评审, -1:不通过'; 

update `system` set `paramValue`='version-8.8' where `id`='4';