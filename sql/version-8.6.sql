CREATE TABLE `salary` (
  `id` varchar(20) DEFAULT NULL,
  `user` varchar(20) DEFAULT NULL,
  `basicSalary` int(12) DEFAULT 0 comment '基本工资(分)',
  `positionSalary` int(12) DEFAULT 0 comment '岗位工资(分)',
  `meritSalary` int(12) DEFAULT 0 comment '绩效工资(提成,分)',
  `socialTax` int(12) DEFAULT 0 comment '社保(分)',
  `balance` int(12) DEFAULT 0 comment '结算工资(分)',
  `paid` int(12) DEFAULT 0 comment '实付(分)',
  `isDeleted` varchar(5) DEFAULT 'false',
  `paidTime` datetime DEFAULT null comment '付款时间',
  `payee` varchar(20) DEFAULT NULL comment '付款人',
  `certs` text DEFAULT NULL comment '凭证',
  `smallChange` int(12) default 0 comment '零钱抹平,加或减凑整', 
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `account` (
  `id` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL comment '账户名',
  `accountType` varchar(5) DEFAULT 'CASH' comment '账户类型,CASH:现金,CYBER:网银账户,ALI:支付宝账户,OTHER:其他种类'
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


update `system` set `paramValue`='version-8.6' where `id`='4';