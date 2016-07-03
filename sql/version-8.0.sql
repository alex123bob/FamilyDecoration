ALTER TABLE `region` ADD `openingTime` TIMESTAMP NULL COMMENT '开盘时间' AFTER `nameRemark`;
ALTER TABLE `potential_business` ADD `isDecorated` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否装修' AFTER `phone`;
ALTER TABLE `potential_business` ADD `telemarketingStaff` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '电销人员姓名' AFTER `salesmanName`;
ALTER TABLE `potential_business` ADD `telemarketingStaffName` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '电销人员账号名' AFTER `telemarketingStaff`;

ALTER TABLE `potential_business` ADD `distributeTime` TIMESTAMP NULL DEFAULT NULL COMMENT '电销人员分配时间' AFTER `lastUpdateTime`;


update region set createTime = '2099-12-13' where id = '201508291441098100';

CREATE TABLE `potential_business_detail` (
  `id` varchar(20) DEFAULT NULL,
  `potentialBusinessId` varchar(20) DEFAULT NULL,
  `comments` varchar(500) DEFAULT NULL,
  `committer` varchar(25) DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert INTO `potential_business_detail` SELECT
	CONVERT (id, UNSIGNED INTEGER) + 1,
	id,
	STATUS,
	salesmanName,
	'false',
	CONCAT(SUBSTR(id, 1, 4),'-',
	SUBSTR(id, 5, 2),'-',
	SUBSTR(id, 7, 2),' ',
	SUBSTR(id, 9, 2),':',
	SUBSTR(id, 11, 2),':',
	SUBSTR(id, 13, 2))
FROM
	potential_business b
WHERE
	STATUS IS NOT NULL  and trim(status) != '' and trim(status) not like '%已装%' and trim(status) not like '%未装%';
	
insert INTO `potential_business_detail` SELECT
	CONVERT (id, UNSIGNED INTEGER) + 2,
	id,
	STATUS_SECOND,
	salesmanName,
	'false',
	CONCAT(SUBSTR(id, 1, 4),'-',
	SUBSTR(id, 5, 2),'-',
	SUBSTR(id, 7, 2),' ',
	SUBSTR(id, 9, 2),':',
	SUBSTR(id, 11, 2),':',
	SUBSTR(id, 13, 2))
FROM
	potential_business b
WHERE
	STATUS_SECOND IS NOT NULL and trim(STATUS_SECOND) != '' and trim(STATUS_SECOND) not like '%已装%' and trim(STATUS_SECOND);
	
insert INTO `potential_business_detail` SELECT
	CONVERT (id, UNSIGNED INTEGER) + 3,
	id,
	STATUS_THIRD,
	salesmanName,
	'false',
	CONCAT(SUBSTR(id, 1, 4),'-',
	SUBSTR(id, 5, 2),'-',
	SUBSTR(id, 7, 2),' ',
	SUBSTR(id, 9, 2),':',
	SUBSTR(id, 11, 2),':',
	SUBSTR(id, 13, 2))
FROM
	potential_business b
WHERE
	STATUS_THIRD IS NOT NULL  and trim(STATUS_THIRD) != '' and trim(STATUS_THIRD) not like '%已装%' and trim(STATUS_THIRD);

update potential_business set isDecorated = 'true' where status like '%已装%' or status_second like '%已装%' or status_third like '%已装%';
update potential_business set isDecorated = 'false' where status like '%未装%' or status_second like '%未装%' or status_third like '%未装%';
update potential_business set isDecorated = 'no' where status like '%不装%' or status_second like '%不装%' or status_third like '%不装%';
alter table potential_business drop column `status`;
alter table potential_business drop column `status_second`;
alter table potential_business drop column `status_third`;

update `system` set `paramValue`='version-8.0' where `id`='4';