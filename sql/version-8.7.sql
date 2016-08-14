alter table statement_bill add column refId varchar(20) default 0 comment '质保金关联的原单子';

update `system` set `paramValue`='version-8.7' where `id`='4';