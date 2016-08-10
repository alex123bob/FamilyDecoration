CREATE TABLE `salary` (
  `id` varchar(20) DEFAULT NULL,
  `payee` varchar(20) DEFAULT NULL comment '收款人',
  `basicSalary` double(16,2) DEFAULT 0 comment '基本工资',
  `positionSalary` double(16,2) DEFAULT 0 comment '岗位工资',
  `meritSalary` double(16,2) DEFAULT 0 comment '绩效工资(提成)',
  `socialTax` double(16,2) DEFAULT 0 comment '社保',
  `balance` double(16,2) DEFAULT 0 comment '结算工资',
  `amount` double(16,2) DEFAULT 0 comment '实付',
  `isDeleted` varchar(5) DEFAULT 'false',
  `period` varchar(10) DEFAULT null comment '工资月份,如2016-05',
  `paidTime` datetime DEFAULT null comment '付款时间',
  `payer` varchar(20) DEFAULT NULL comment '付款人',
  `certs` text DEFAULT NULL comment '凭证',
  `status` varchar(10) DEFAULT 'new' comment '状态，new:刚创建,paid:已付款',
  `smallChange` double(12,2) default 0 comment '零钱抹平,加或减凑整', 
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `account` (
  `id` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL comment '账户名',
  `balance` double(16,2) DEFAULT 0 comment '余额(分)',
  `accountType` varchar(10) DEFAULT 'CASH' comment '账户类型,CASH:现金,CYBER:网银账户,ALI:支付宝账户,OTHER:其他种类,WECHAT:微信',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `account_log` (
  `id` varchar(20) not NULL,
  `accountId` varchar(20) not NULL comment '账户Id',
  `type` varchar(3) not null comment 'in/out/no 出/入/修改帐',
  `amount` double(16,2) not null comment '金额(分)',
  `balance` double(16,2) not null comment '操作后余额(分)',
  `refId` varchar(20) not null comment '关联单据，工资单(salary)或者贷款单(loan)或者其他(statement_bill)单据Id，或-1(修改余额操作)',
  `refType` varchar(20) not null comment '关联单据类型，sly:工资单(salary); loan:贷款单(loan);stb:其他(statement_bill)单据Id;edit:修改,add:新加帐户',
  `operator` varchar(25) not null comment '操作人',
  `desc` varchar(200) not null comment '修改说明',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table statement_bill add column supplierId varchar(20) comment '供应商id';
alter table statement_bill add column payer varchar(20) comment '付款人(出纳)';
alter table statement_bill add column paidAmount double(16,2) comment '实付金额';
alter table statement_bill add column paidTime datetime comment '付款时间';
alter table statement_bill add column reimbursementReason varchar(200) comment '报销事项';
alter table statement_bill add column descpt varchar(200) comment '备注';
alter table statement_bill add column deadline datetime comment '截止日期';
ALTER TABLE statement_bill modify billType varchar(8)  comment 'ppd:预付款,reg:普通账单,qgd:质量保证金,mtf:材料付款,rbm:报销,fdf:财务部门费用,wlf:福利,tax:税';

CREATE TABLE `supplier` (
  `id` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL comment '供应商名',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `supplierMaterial` (
  `id` varchar(20) DEFAULT NULL,
  `supplierId` varchar(20) DEFAULT NULL comment '供应商Id',
  `professionType` varchar(5) DEFAULT NULL comment '供应种类，对应profession_type表value',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `loan` (
  `id` varchar(20) DEFAULT NULL,
  `relevantId` varchar(20) DEFAULT NULL comment '贷款还账对应的贷款入账id',
  `type` varchar(1) DEFAULT NULL comment '0 贷款入账，贷款还账',
  `projectName` varchar(200) DEFAULT NULL comment '项目名称',
  `bankName` varchar(500) DEFAULT NULL comment '银行',
  `assignee` varchar(500) DEFAULT NULL comment '交办人',
  `amount` varchar(50) DEFAULT NULL comment '收款金额',
  `dealer` varchar(50) DEFAULT NULL comment '收/付款人',
  `dealTime` datetime DEFAULT null comment '收/付款时间',
  `interest` varchar(10) DEFAULT null comment '当前利率',
  `period` varchar(20) DEFAULT null comment '贷款期限',
  `certs` text DEFAULT NULL comment '凭证',
  `loanTime` datetime DEFAULT null comment '贷款时间',
  `status` varchar(10) DEFAULT null comment '状态. new:新创建,accepted:已收款,arch:归档,paid:已出款',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `statement_bill_tag` (
  `id` varchar(20) DEFAULT NULL,
  `tag` varchar(200) DEFAULT NULL comment '标记名称',
  `billId` varchar(200) DEFAULT NULL comment 'billId',
  `committer` varchar(200) DEFAULT NULL comment '标记人',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `upload_files` (
  `id` varchar(20) DEFAULT NULL,
  `refType` varchar(20) DEFAULT NULL comment '关联对象类型',
  `refId` varchar(20) DEFAULT NULL comment '关联对象id',
  `name` varchar(200) DEFAULT NULL comment '上传文件名',
  `path` varchar(200) DEFAULT NULL comment '存储路径',
  `size` varchar(20) DEFAULT NULL comment '文件大小',
  `type` varchar(10) DEFAULT NULL comment '文件类型：img:图片，file:文件，video:视频',
  `desc` varchar(200) DEFAULT NULL comment '备注',
  `other` varchar(200) DEFAULT NULL comment '其他，图片类型存放宽高，视频类型存放封面图片url，文本类型存放前200个字符做summary',
  `uploader` varchar(20) DEFAULT NULL comment '上传人',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null  comment '上传时间',
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `business_goal` (
  `id` varchar(20) DEFAULT NULL,
  `user` varchar(20) DEFAULT NULL comment '人员',
  `c1` int(10) DEFAULT 0 comment '市场部：扫楼，设计部：定金率',
  `c2` int(10) DEFAULT 0 comment '市场部：电销，设计部：签单额',
  `c3` int(10) DEFAULT 0 comment '市场部：到店',
  `c4` int(10) DEFAULT 0 comment '市场部：定金',
  `targetMonth` varchar(7) DEFAULT null  comment '目标月,格式2016-06',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null  comment '创建时间',
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


update statement_bill set status = 'new' where status = 'rbk';
update statement_bill_audit set newStatus = 'new' where newStatus = 'rbk';
update statement_bill_audit set orignalStatus = 'new' where orignalStatus = 'rbk';
alter table statement_bill drop column `isPaid`;
alter table statement_bill modify status varchar(10);
alter table statement_bill add column `certs` text DEFAULT NULL comment '凭证';
alter table statement_bill add column `businessId` varchar(20) DEFAULT NULL comment '业务ID';
alter table statement_bill_audit add column drt varchar(10) comment '方向，1前进，-1打回';
alter table budget add column status int(1) default 0 comment '0,正常，1 废弃';

update statement_bill_audit set drt = '1' where orignalStatus = 'chk' and newStatus = 'paid' and drt is null;
update statement_bill_audit set drt = '1' where orignalStatus = 'new' and newStatus = 'rdyck' and drt is null;
update statement_bill_audit set drt = '1' where orignalStatus = 'rdyck' and newStatus = 'chk' and drt is null;
update statement_bill_audit set drt = '-1' where orignalStatus = 'rdyck' and newStatus = 'new' and drt is null;
update statement_bill_audit set drt = '1' where orignalStatus = 'rdyck' and newStatus = 'rdyck2' and drt is null;
update statement_bill_audit set drt = '-1' where orignalStatus = 'rdyck2' and newStatus = 'rdyck' and drt is null;
alter table announcement_comment modify id varchar(20);
alter table budget modify column totalFee double(16,2) default 0 comment '预算总额，每一次加载预算详细时会计算，不一致的话会自动更新';

ALTER TABLE `upload_files` ADD INDEX(`refId`);
ALTER TABLE `upload_files` ADD INDEX(`refType`);

update `system` set `paramValue`='version-8.6' where `id`='4';