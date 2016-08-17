CREATE TABLE `statement_bill_item_remark` (
  `id` varchar(20) DEFAULT NULL,
  `refId` varchar(200) DEFAULT NULL comment 'billItemId',
  `committer` varchar(200) DEFAULT NULL comment '标记人',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

update `system` set `paramValue`='version-8.7' where `id`='4';