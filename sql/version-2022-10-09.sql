ALTER TABLE `user` ADD `isArchived` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT '归档用户不显示在账号界面' AFTER `securePass`;

insert into `versions`(`id`) values ('version-2022-10-09');