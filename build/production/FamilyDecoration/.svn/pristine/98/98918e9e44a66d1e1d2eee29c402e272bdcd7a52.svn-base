CREATE TABLE IF NOT EXISTS `log_list` (
  `id` varchar(18) NOT NULL,
  `logName` varchar(250) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false',
  `userName` varchar(45) NOT NULL COMMENT '日志创建者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户日志';



CREATE TABLE IF NOT EXISTS `log_detail` (
  `id` varchar(18) NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isDeleted` varchar(5) NOT NULL DEFAULT 'false',
  `logListId` varchar(18) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
