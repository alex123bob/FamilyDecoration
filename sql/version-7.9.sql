insert into `system` (`id`, `paramDesc`, `isDeleted`, `updateTime`, `paramName`, `createTime`, `paramValue`) 
	values ( '12','财务单据状态更改通知短信内容模板:您好,{申请人}的财务订单{单号},{项目}项目,总金额:{总金额}元,申领金额:{申领金额}元,已被{操作人}变更为{现状态}!', 'false', '0000-00-00 00:00:00', 'msg_notice_bill_status_change', '2016-06-26 14:09:54', '您好,{申请人}的财务订单{单号},{项目}项目,总金额:{总金额}元,申领金额:{申领金额}元,已被{操作人}变更为{现状态}!');
update `system` set `paramValue`='version-7.9' where `id`='4';
