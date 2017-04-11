ALTER TABLE `project` ADD `settled` tinyint(1)  DEFAULT 0 COMMENT '是否已经结算完成, 默认0, 未结算完成, 1: 结算完成';
ALTER TABLE `project` ADD `updateTime` datetime  DEFAULT null;
update `system` set `paramValue`='version-9.0' where `id`='4';