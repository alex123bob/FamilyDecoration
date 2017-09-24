begin;

CREATE TABLE `contract_engineering` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `businessId` varchar(20) DEFAULT NULL COMMENT '业务ID',
  `totalPrice` float(10,2) DEFAULT NULL COMMENT '合同总价',
  `discount` float(10,2) DEFAULT NULL COMMENT '打折',
  `isDeleted` varchar(5) DEFAULT 'false',
  `sid` VARCHAR(18) default null COMMENT '身份证号',
  `customer` VARCHAR(512) default null COMMENT '',
  `address` VARCHAR(512) default null COMMENT '装修地址',
  `stages` text default null COMMENT 'n期工程款,/**/分割,格式: /**/2017-09-08:17500/**/2017-09-18:27500/**/',
  `additionals` text default null COMMENT 'n条附加条款,/**/分割,格式: /**/条款1/**/条款2/**/条款n/**/',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


insert into `contract_engineering` ( `id`, `discount`, `customer`, `stages`, `isDeleted`, `additionals`, `address`, `sid`, `createTime`, `totalPrice`, `businessId`, `updateTime`) values ( '12323', '1.00', '王', '/**/2017-08-14:123/**/2017-08-14:132/**/', 'false', '/**/1123/**/456/**/', '123', '123', '2017-08-14 21:52:30', '23.00', '201503311547142812', '2017-08-14 22:14:28');

insert into `versions`(`id`) values ('version-9.9');
commit;
