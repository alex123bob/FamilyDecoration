CREATE TABLE `supplier_material_audit` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `materialId` varchar(20) DEFAULT NULL COMMENT '要修改的材料Id, 新增时为空',
  `name` varchar(20) DEFAULT NULL COMMENT '材料名称',
  `unit` varchar(20) DEFAULT NULL COMMENT '单位',
  `price` float(10,2) DEFAULT NULL COMMENT '单价',
  `professionType` varchar(5) DEFAULT NULL COMMENT '供应种类，对应profession_type表value',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `operation` varchar(10) NOT NULL COMMENT '操作类型: 1.update, 2. delete, 3. add',
  `creator` varchar(5) NOT NULL COMMENT '创建人(供应商)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

update supplier_order set status = 'rdyck' where status = 'rdyck1';
update supplier_order set status = 'chk' where status = 'rdyck2';
update supplier_order set status = 'checked' where status = 'rdyck3';
update supplier_order_audit set orignalStatus = 'rdyck' where orignalStatus = 'rdyck1';
update supplier_order_audit set orignalStatus = 'chk' where orignalStatus = 'rdyck2';
update supplier_order_audit set orignalStatus = 'checked' where orignalStatus = 'rdyck3';

update supplier_order_audit set newStatus = 'rdyck' where newStatus = 'rdyck1';
update supplier_order_audit set newStatus = 'chk' where newStatus = 'rdyck2';
update supplier_order_audit set newStatus = 'checked' where newStatus = 'rdyck3';

insert into `versions`(`id`) values ('version-9.6');