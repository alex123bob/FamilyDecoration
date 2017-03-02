ALTER TABLE `business` ADD `isWaiting` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'business categorized into waiting area' AFTER `isTransfered`;
ALTER TABLE `business` ADD `isLocked` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'when isLocked is true, this business record can not be automatically distributed to other salesman' AFTER `isWaiting`;
ALTER TABLE `user` ADD `isLocked` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'user account lock status. locked account can''t be used to login' AFTER `isDeleted`;
ALTER TABLE `business` CHANGE `salesman` `salesman` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '业务员';

update `system` set `paramValue`='version-8.13' where `id`='4';