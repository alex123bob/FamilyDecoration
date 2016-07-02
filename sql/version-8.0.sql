ALTER TABLE `region` ADD `openingTime` TIMESTAMP NULL COMMENT '开盘时间' AFTER `nameRemark`;
update `system` set `paramValue`='version-8.0' where `id`='4';