ALTER TABLE `user` ADD `supplierId` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '供應商id' AFTER `projectId`;

insert into `versions`(`id`) values ('version-9.4');