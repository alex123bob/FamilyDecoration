ALTER TABLE `supplier_material_audit` add `approved` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL default 'false' COMMENT '是否通过审核';
ALTER TABLE `supplier_material_audit` add `approver` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null COMMENT '审核人';

insert into `versions`(`id`) values('version-9.8');