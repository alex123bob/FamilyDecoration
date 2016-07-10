ALTER TABLE `potential_business` ADD `isImportant` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'false' COMMENT '是否是重要客户';
ALTER TABLE `potential_business` ADD `telemarketingDeadline` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '电销期限';


update potential_business set isImportant = 'false';
update `system` set `paramValue`='version-8.3' where `id`='4';