ALTER TABLE `project` modify `businessId` varchar(20) NULL DEFAULT '';

INSERT INTO `region` (`id`, `name`, `parentID`, `nameRemark`, `openingTime`, `isDeleted`, `createTime`, `updateTime`) VALUES ('000000000000000001', '投标工程', '-1', '', NULL, 'false', '2015-03-19 09:44:45', '2015-03-19 18:51:42');

insert into `versions`(`id`) values ('version-10.08');