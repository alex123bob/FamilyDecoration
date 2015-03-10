ALTER TABLE  `project` DROP  `projectProgress`;
ALTER TABLE  `project` DROP  `projectProgressComment`;

CREATE TABLE  `familydecoration`.`progress` (
`id` VARCHAR( 18 ) NOT NULL COMMENT  '主键id',
`progress` TEXT NOT NULL COMMENT  '进度内容',
`comments` TEXT NOT NULL COMMENT  '进度意见',
`createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
`isDeleted` VARCHAR( 5 ) NOT NULL DEFAULT  'false',
`projectId` VARCHAR( 18 ) NOT NULL ,
PRIMARY KEY (  `id` )
) ENGINE = INNODB CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT =  '工程进度和监理意见';

ALTER TABLE  `project` ADD  `isDeleted` VARCHAR( 5 ) NOT NULL DEFAULT  'false' COMMENT  '逻辑删除标志位' AFTER  `isFrozen`;
ALTER TABLE  `project` CHANGE  `isFrozen`  `isFrozen` TINYINT( 2 ) NOT NULL DEFAULT  '0' COMMENT  '是否为死单，默认不是';
ALTER TABLE  `project` CHANGE  `projectTime`  `projectTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
