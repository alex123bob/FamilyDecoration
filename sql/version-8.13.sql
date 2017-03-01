ALTER TABLE `business` ADD `isWaiting` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'business categorized into waiting area' AFTER `isTransfered`;
ALTER TABLE `business` ADD `isLocked` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT 'when isLocked is true, this business record can not be automatically distributed to other salesman' AFTER `isWaiting`;


update `system` set `paramValue`='version-8.13' where `id`='4';