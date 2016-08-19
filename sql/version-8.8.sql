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

alter table mail modify mailReceiver text not null comment '邮件接收人，多个用逗号分割';
alter table mail modify receiverAddress text not null comment '邮件接收人，多个用逗号分割';
alter table mail add column result text default '' comment '结果，多次发送结果追加。';
alter table mail add column status int default 0 comment '0未发送，100发送成功，1~n 发送失败次数';
alter table mail add column updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
alter table mail change mailId id varchar(20);
alter table mail change mailTime createTime TIMESTAMP;
alter table msg_log modify status int default 0 comment '0未发送，100发送成功，1~n 发送失败次数';
alter table msg_log add column isDeleted varchar(5) default 'false';
alter table msg_log add column updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP

update mail set status = 100;
update msg_log set status = 100;

# potential_business
ALTER TABLE `potential_business` ADD `isLocked` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'potential business will be locked when business with the same address has been created' AFTER `isTransfered`;
ALTER TABLE `business` ADD `potentialBusinessId` VARCHAR(18) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'corresponding potential business id. only when potential business is locked, does this field have value.' AFTER `regionId`;
	
update `system` set `paramValue`='version-8.8' where `id`='4';