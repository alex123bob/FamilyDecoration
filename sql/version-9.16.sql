ALTER TABLE `user` ADD `isInStaffSalary` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'true' COMMENT 'exclude current account out of staff salary module' AFTER `isLocked`;

insert into `versions`(`id`) values ('version-9.16');