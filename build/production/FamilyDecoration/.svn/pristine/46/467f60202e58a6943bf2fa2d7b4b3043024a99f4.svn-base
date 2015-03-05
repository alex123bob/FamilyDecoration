CREATE TABLE  `familydecoration`.`plan` (
`id` VARCHAR( 18 ) NOT NULL COMMENT  '主键id',
`projectId` VARCHAR( 18 ) NOT NULL COMMENT  '对应项目Id',
`createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT  '记录创建时间',
`prework` VARCHAR( 50 ) NOT NULL COMMENT  '前期工作',
`matPrepare` VARCHAR( 50 ) NOT NULL COMMENT  '材料准备',
`waterPower` VARCHAR( 50 ) NOT NULL COMMENT  '水电施工',
`cementBasic` VARCHAR( 50 ) NOT NULL COMMENT  '泥工基础施工',
`cementAdvanced` VARCHAR( 50 ) NOT NULL COMMENT  '泥工饰面施工',
`wallFloor` VARCHAR( 50 ) NOT NULL COMMENT  '洁具、墙纸、木地板',
`cleaning` VARCHAR( 50 ) NOT NULL COMMENT  '保洁',
`woods` VARCHAR( 50 ) NOT NULL COMMENT  '木工施工',
`painting` VARCHAR( 50 ) NOT NULL COMMENT  '油漆',
`isDeleted` VARCHAR( 5 ) NOT NULL DEFAULT  'false' COMMENT  '是否已删除',
PRIMARY KEY (  `id` )
) ENGINE = INNODB DEFAULT CHARSET=utf8;