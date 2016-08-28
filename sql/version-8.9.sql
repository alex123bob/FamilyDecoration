alter table account_log modify refType varchar(20) not null comment '关联单据类型，sly:工资单(salary); loan:贷款单(loan);stb:其他(statement_bill)单据Id;edit:修改,add:新加帐户,self:自关联，转账场景';
alter table error_log add column type int default 0 comment '0:系统错误/异常，1:业务异常';
drop table supplier;
drop table supplierMaterial;

CREATE TABLE `supplier` (
  `id` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL comment '供应商名称',
  `boss` varchar(200) DEFAULT NULL comment '老板名，如李嘉',
  `address` varchar(200) DEFAULT NULL comment '地址',
  `phone` varchar(400) DEFAULT NULL comment '供应商电话，格式(描述1:号码1,描述2:号码2,描述n:号码n...)，如：座机1:025-5300560,销售:13057530560',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `supplier_material` (
  `id` varchar(20) DEFAULT NULL,
  `supplierId` varchar(20) DEFAULT NULL comment '供应商Id',
  `name` varchar(20) DEFAULT NULL comment '材料名称',
  `unit` varchar(20) DEFAULT NULL comment '单位',
  `price` float(10,2) DEFAULT NULL comment '单价',
  `professionType` varchar(5) DEFAULT NULL comment '供应种类，对应profession_type表value',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

update `system` set `paramValue`='version-8.9' where `id`='4';