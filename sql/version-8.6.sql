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
  `accountType` varchar(5) DEFAULT 'CASH' comment '账户类型,CASH:现金,CYBER:网银账户,ALI:支付宝账户,OTHER:其他种类',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table statement_bill add column supplierId varchar(20) comment '供应商id';
alter table statement_bill add column payer varchar(20) comment '付款人(出纳)';
alter table statement_bill add column paidAmount int(12) comment '实付金额';
alter table statement_bill add column paidTime datetime comment '付款时间';
alter table statement_bill add column reimbursementReason varchar(200) comment '报销事项';
ALTER TABLE statement_bill modify billType varchar(8)  comment 'ppd:预付款,reg:普通账单,qgd:质量保证金,mtf:材料付款,rbm:报销,fdf:财务部门费用,wlf:福利,tax:税';

CREATE TABLE `supplier` (
  `id` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL comment '供应商名',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `supplierDetail` (
  `id` varchar(20) DEFAULT NULL,
  `supplierId` varchar(20) DEFAULT NULL comment '供应商Id',
  `professionType` varchar(5) DEFAULT NULL comment '供应种类，对应profession_type表value',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `loan` (
  `id` varchar(20) DEFAULT NULL,
  `projectName` varchar(200) DEFAULT NULL comment '项目名称',
  `bankName` varchar(500) DEFAULT NULL comment '银行',
  `assignee` varchar(500) DEFAULT NULL comment '交办人',
  `mobile` varchar(50) DEFAULT NULL comment '交办人联系方式',
  `amount` varchar(50) DEFAULT NULL comment '收款金额',
  `payee` varchar(50) DEFAULT NULL comment '收款人',
  `receiveTime` datetime DEFAULT null comment '收款时间',
  `interest` varchar(10) DEFAULT null comment '当前利率',
  `period` varchar(20) DEFAULT null comment '贷款期限',
  `requestTime` datetime DEFAULT null comment '贷款时间',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

update `system` set `paramValue`='version-8.6' where `id`='4';