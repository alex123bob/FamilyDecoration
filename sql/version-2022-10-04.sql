ALTER TABLE `task_list` ADD `filePath` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件位置，必填项，string' AFTER `taskExecutor`;
ALTER TABLE `task_list` ADD `acceptor` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '任务验收人账号' AFTER `filePath`;
ALTER TABLE `task_list` ADD `isFinished` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT '是否完成' AFTER `acceptor`;


insert into `versions`(`id`) values ('version-2022-10-04');