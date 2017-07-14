CREATE TABLE `supplier_order_template` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `supplierId` varchar(20) DEFAULT NULL COMMENT '供应商id',
  `templateName` varchar(256) NOT NULL COMMENT '模板名称',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `supplier_order_item_template` (
  `id` varchar(20) NOT NULL DEFAULT '',
  `templateId` varchar(20) DEFAULT NULL COMMENT '模板id',
  `supplierId` varchar(20) DEFAULT NULL COMMENT '供应商id',
  `materialId` varchar(20) DEFAULT NULL COMMENT '对应原材料id',
  `referenceNumber` varchar(20) DEFAULT NULL COMMENT '参考量',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `versions` (
  `id` varchar(20) NOT NULL COMMENT '版本号',
  `desc` varchar(500) DEFAULT NULL COMMENT '版本描述',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) DEFAULT 'false',
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
update `system` set `paramValue`='',`paramName`='' where `id`='4';

insert into `versions`(`id`) values ('version-9.2');