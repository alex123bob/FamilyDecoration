alter table account_log modify refType varchar(20) not null comment '关联单据类型，sly:工资单(salary); loan:贷款单(loan);stb:其他(statement_bill)单据Id;edit:修改,add:新加帐户,self:自关联，转账场景';
alter table error_log add column type int default 0 comment '0:系统错误/异常，1:业务异常';

update `system` set `paramValue`='version-8.9' where `id`='4';