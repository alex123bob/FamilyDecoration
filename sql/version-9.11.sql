begin;

alter table contract_engineering add column   `signatoryRepName` varchar(256) DEFAULT NULL COMMENT '签约代表';
alter table contract_engineering add column   `signatoryRep` varchar(256) DEFAULT NULL COMMENT '签约代表(code/ID)';

insert into `versions`(`id`) values ('version-9.11');
commit;