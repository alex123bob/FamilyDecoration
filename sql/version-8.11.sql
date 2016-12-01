CREATE TABLE `account_log_monthly_check` (
  `id` varchar(20) DEFAULT NULL,
  `accountId` varchar(20) DEFAULT NULL comment '账户',
  `checkMonth` int(8) DEFAULT NULL comment '对账月',
  `scale` int(1) DEFAULT NULL comment '粒度,0：年，1：月，2：日',
  `income` float(10,2) DEFAULT NULL comment '月入账',
  `outcome` float(10,2) DEFAULT NULL comment '月出账',
  `balance` float(10,2) DEFAULT NULL comment '余额',
  `checker` varchar(20) DEFAULT NULL comment '核对人中文',
  `checkername` varchar(20) DEFAULT NULL comment '核对人英文',
  `status` varchar(10) DEFAULT 'unchecked' comment '状态：checked,unchecked',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table salary add column   `socialTaxCorp` double(16,2) DEFAULT 0 comment '社保(公司)';
update `system` set `paramValue`='version-8.11' where `id`='4';