ALTER TABLE `region` ADD `openingTime` TIMESTAMP NULL COMMENT '开盘时间' AFTER `nameRemark`;
ALTER TABLE `potential_business` ADD `isDecorated` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否装修' AFTER `phone`;
ALTER TABLE `potential_business` ADD `telemarketingStaff` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '电销人员姓名' AFTER `salesmanName`;
ALTER TABLE `potential_business` ADD `telemarketingStaffName` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '电销人员账号名' AFTER `telemarketingStaff`;

ALTER TABLE `potential_business` ADD `distributeTime` TIMESTAMP NULL DEFAULT NULL COMMENT '电销人员分配时间' AFTER `lastUpdateTime`;


update region set createTime = '2099-12-13' where id = '201508291441098100';

update potential_business set status = REPLACE(status,'\t','');
update potential_business set status_second = REPLACE(status_second,'\t','');
update potential_business set status_third = REPLACE(status_third,'\t','');


CREATE TABLE `potential_business_detail` (
  `id` varchar(20) DEFAULT NULL,
  `potentialBusinessId` varchar(20) DEFAULT NULL,
  `comments` varchar(500) DEFAULT NULL,
  `committer` varchar(25) DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
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
	SUBSTR(id, 13, 2)),
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
	SUBSTR(id, 13, 2)),
	CONCAT(SUBSTR(id, 1, 4),'-',
	SUBSTR(id, 5, 2),'-',
	SUBSTR(id, 7, 2),' ',
	SUBSTR(id, 9, 2),':',
	SUBSTR(id, 11, 2),':',
	SUBSTR(id, 13, 2))
FROM
	potential_business b
WHERE
	STATUS_SECOND IS NOT NULL and trim(STATUS_SECOND) != '' and trim(STATUS_SECOND) not like '%已装%' and trim(STATUS_SECOND) not like '%未装%';
	
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
	SUBSTR(id, 13, 2)),
	CONCAT(SUBSTR(id, 1, 4),'-',
	SUBSTR(id, 5, 2),'-',
	SUBSTR(id, 7, 2),' ',
	SUBSTR(id, 9, 2),':',
	SUBSTR(id, 11, 2),':',
	SUBSTR(id, 13, 2))
FROM
	potential_business b
WHERE
	STATUS_THIRD IS NOT NULL  and trim(STATUS_THIRD) != '' and trim(STATUS_THIRD) not like '%已装%' and trim(STATUS_THIRD)  not like '%未装%';

update potential_business set isDecorated = 'true' where status like '%已装%' or status_second like '%已装%' or status_third like '%已装%';
update potential_business set isDecorated = 'false' where status like '%未装%' or status_second like '%未装%' or status_third like '%未装%';
update potential_business set isDecorated = 'no' where status like '%不装%' or status_second like '%不装%' or status_third like '%不装%';
alter table potential_business drop column `status`;
alter table potential_business drop column `status_second`;
alter table potential_business drop column `status_third`;

# 2016-07-04 改动
# 为potentialBusiness增加是否转为业务字段
ALTER TABLE `potential_business` ADD `isTransfered` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT '是否已经专为业务' AFTER `isDeleted`;
# 为business_detail表添加committer，因为potential_business里面有committer，在转换成业务的时候，为防止这种数据回头丢失，我们就将business_detail里面也加上这个字段，用不用以后再说，先留出来
ALTER TABLE `business_detail` ADD `committer` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '编辑人，历史为空' ;
# 为business添加四个字段，用于签单业务接受前进行初始化的四个值
ALTER TABLE `business` ADD `ds_lp` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'layout plan平面布局' , ADD `ds_fc` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'facade construction立面施工' , ADD `ds_bs` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'building design sketch效果图' , ADD `ds_bp` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'budget plan预算' ;

# 2016-07-05 改动
# 为所有的废单业务添加废单原因的目录
ALTER TABLE `business` ADD `requestDeadBusinessTitle` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '废单目录' AFTER `budgetFinished`;
# 将当前废单业务的废单原因目录全部归结为其他
UPDATE business SET requestDeadBusinessTitle = '其它' WHERE isDeleted = 'false' AND isDead = 'true' AND isTransfered = 'false';
# 将当前的所有死单转为废单
UPDATE business SET isDead = 'true', requestDeadBusinessTitle = '其它', requestDeadBusinessReason = '来自死单' WHERE isDeleted = 'false' AND isTransfered = 'false' AND isFrozen = 'true'

update `system` set `paramValue`='version-8.0' where `id`='4';