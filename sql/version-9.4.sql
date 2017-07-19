ALTER TABLE `user` ADD `supplierId` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '供應商id' AFTER `projectId`;
ALTER TABLE `user` CHANGE `createTime` `createTime` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';

insert into `versions`(`id`) values ('version-9.4');