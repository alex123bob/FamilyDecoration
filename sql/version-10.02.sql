ALTER TABLE `cost_list_item` ADD `version` INT(100) NOT NULL DEFAULT '0' AFTER `isDeleted`;

insert into `versions`(`id`) values ('version-10.02');