CREATE TABLE `supplier_order` (
  `id` varchar(20) DEFAULT NULL,
  `projectId` varchar(20) DEFAULT NULL comment 'projectId',
  `supplierId` varchar(20) DEFAULT NULL comment 'projectId',
  `creator` varchar(200) DEFAULT NULL comment '创建人',
  `totalFee` float(10,2) DEFAULT NULL comment '总价',
  `payedTimes` varchar(20) DEFAULT NULL comment '申购次数',
  `projectProgress` varchar(20) DEFAULT NULL comment '项目进度',
  `status` varchar(10) DEFAULT 'new',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `supplier_order_item` (
  `id` varchar(20) DEFAULT NULL,
  `billId` varchar(20) DEFAULT NULL comment '单号',
  `supplierId` varchar(20) DEFAULT NULL comment '供应商id',
  `materialId` varchar(20) DEFAULT NULL comment '对应原材料id',
  `billItemName` varchar(20) DEFAULT NULL comment '材料名称',
  `referenceNumber` varchar(20) DEFAULT NULL comment '参考量',
  `unit` varchar(20) DEFAULT NULL comment '单位',
  `amount` double DEFAULT NULL comment '数量',
  `unitPrice` float(10,2) DEFAULT NULL comment '单价',
  `professionType` varchar(5) DEFAULT NULL comment '供应种类，对应profession_type表value',
  `isDeleted` varchar(5) DEFAULT 'false',
  `createTime` datetime DEFAULT null,
  `updateTime` datetime DEFAULT null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


update `system` set `paramValue`='version-8.9' where `id`='4';