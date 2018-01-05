begin;

alter table supplier_order add column `desc` varchar(256) default null;
insert into `versions`(`id`) values ('version-9.14');
commit;
