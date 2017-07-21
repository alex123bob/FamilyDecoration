ALTER TABLE `supplier_material_audit` CHANGE `operation` `operation` VARCHAR(6) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '操作类型: 1.update, 2. delete, 3. add';

insert into `versions`(`id`) values('version-9.7');