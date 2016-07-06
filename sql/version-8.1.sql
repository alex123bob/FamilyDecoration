ALTER TABLE `message` ADD `showTime` TIMESTAMP NULL DEFAULT NULL COMMENT 'for those message showed in a specific time for reminder' AFTER `readTime`;

# customer service staff feature
ALTER TABLE `business` ADD `csStaff` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'customer service staff' AFTER `designerName`;
ALTER TABLE `business` ADD `csStaffName` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'customer service staff account name' AFTER `csStaff`;

update `system` set `paramValue`='version-8.1' where `id`='4';