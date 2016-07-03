ALTER TABLE `region` ADD `openingTime` TIMESTAMP NULL COMMENT '开盘时间' AFTER `nameRemark`;
ALTER TABLE `potential_business` ADD `isDecorated` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否装修' AFTER `phone`;
ALTER TABLE `potential_business` ADD `telemarketingStaff` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '电销人员姓名' AFTER `salesmanName`;
ALTER TABLE `potential_business` ADD `telemarketingStaffName` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '电销人员账号名' AFTER `telemarketingStaff`;

ALTER TABLE `potential_business` ADD `distributeTime` TIMESTAMP NULL DEFAULT NULL COMMENT '电销人员分配时间' AFTER `lastUpdateTime`;

update `system` set `paramValue`='version-8.0' where `id`='4';