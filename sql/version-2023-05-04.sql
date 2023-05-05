ALTER TABLE `statement_bill` CHANGE `status` `status` VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '\'new\', \'rdyck\', \'chk\',\'rbk\', \'paid\', \'arch\'';
UPDATE `statement_bill` SET `status` = 'arch' WHERE `billType` = 'rbm' and `isDeleted` = 'false' and `status` = 'paid';
insert into `versions`(`id`) values ('version-2023-05-04');
