begin;

ALTER TABLE supplier add isLongTerm varchar(5)  comment '是否是长期供应商' NOT NULL DEFAULT 'false';
ALTER TABLE supplier add remark varchar(400)  comment '备注' NOT NULL DEFAULT '';
ALTER TABLE supplier add `type` varchar(10)  comment '类型, material,材料供应商; device设备供应商' NOT NULL DEFAULT 'material';
ALTER TABLE supplier_order_item add  checkedNumber int(100)  comment '审核数量';
ALTER TABLE supplier_order add  professionType varchar(4)  comment 'professionType' default '0001';

insert into `versions`(`id`) values ('version-11.01');

commit;