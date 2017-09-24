begin;

alter table budget_item add column `amountSource` varchar(512) DEFAULT NULL COMMENT '数量计算公式';

insert into `versions`(`id`) values ('version-9.12');
commit;
