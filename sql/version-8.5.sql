alter table business add column levelTime datetime default null;
update business set levelTime = createTime;


alter table log_detail drop column logType;
alter table log_detail add column logType varchar(1) comment '0:普通,1:总结,2:评价';
alter table log_detail add column updateTime timestamp;
alter table log_detail add column committer varchar(200);
alter table log_detail modify content text;
alter table log_detail add column isFinished varchar(1);
update log_detail set logType = '0';
update log_detail d set committer = (select userName from log_list l where l.id = d.logListId);
update log_detail set updateTime = createTime;
insert into log_detail ( select id,createTime,isDeleted,1,logName as content ,1,createTime,userName as committer from log_list);

alter table log_list rename to log_list_temp;
alter table log_detail rename to log_list;
delete from log_list where content = '' or trim(content) = '' or content is null;
alter table log_list drop column logListId;
drop table log_list_temp;
update `system` set `paramValue`='version-8.5' where `id`='4';