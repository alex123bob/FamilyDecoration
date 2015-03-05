CREATE TABLE  `familydecoration`.`censorship` (
`id` VARCHAR( 18 ) NOT NULL COMMENT  '主键',
`logListId` VARCHAR( 18 ) NOT NULL COMMENT  '对应审核的日志id',
`content` TEXT NOT NULL COMMENT  '审核文字内容',
`isDeleted` VARCHAR( 5 ) NOT NULL DEFAULT  'false' COMMENT  '是否删除',
`createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  '创建时间',
`userName` TEXT NOT NULL COMMENT  '审核人',
PRIMARY KEY (  `id` )
) ENGINE = INNODB;