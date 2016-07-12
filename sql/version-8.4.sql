CREATE TABLE `error_log` (
  `detail` text DEFAULT NULL,
  `user` varchar(500) DEFAULT NULL,
  `file` varchar(200) DEFAULT NULL,
  `line` varchar(20) DEFAULT NULL,
  `isDeleted` varchar(5) DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
update `system` set `paramValue`='version-8.4' where `id`='4';