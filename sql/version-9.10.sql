begin;

alter table contract_engineering drop column   `totalPrice`; 
alter table contract_engineering drop column   `discount`;

alter table contract_engineering add column   `totalPrice` float(18,2) DEFAULT NULL COMMENT '合同总价';
alter table contract_engineering add column   `discount` float(18,2) DEFAULT NULL COMMENT '打折';

insert into `versions`(`id`) values ('version-9.10');
commit;