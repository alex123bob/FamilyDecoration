ALTER TABLE `business` ADD `floorArea` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '建筑面积' AFTER `csStaff`;
ALTER TABLE `business` ADD `houseType` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '户型' AFTER `csStaff`;

update `system` set `paramValue`='version-8.2' where `id`='4';