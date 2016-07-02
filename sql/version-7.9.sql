insert into `system` (`paramDesc`, `isDeleted`, `updateTime`, `paramName`, `createTime`, `paramValue`) 
	values ('财务单据状态更改通知短信内容模板:您好,{申请人}的财务订单{单号},{项目}项目,总金额:{总金额}元,申领金额:{申领金额}元,已被{操作人}变更为{现状态}!', 'false', '0000-00-00 00:00:00', 'msg_notice_bill_status_change', '2016-06-26 14:09:54', '您好,{申请人}的财务订单{单号},{项目}项目,总金额:{总金额}元,申领金额:{申领金额}元,已被{操作人}变更为{现状态}!');
UPDATE `familydecoration`.`system` SET `paramName` = 'msg_notice_value_limit' WHERE `system`.`id` = 11;
update `system` set `paramValue`='version-7.9' where `id`='4';
