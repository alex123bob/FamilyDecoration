ALTER TABLE `region` ADD `openingTime` TIMESTAMP NULL COMMENT '开盘时间' AFTER `nameRemark`;
ALTER TABLE `potential_business` ADD `isDecorated` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否装修' AFTER `phone`;

update `system` set `paramValue`='version-8.0' where `id`='4';