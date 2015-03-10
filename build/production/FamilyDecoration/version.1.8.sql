ALTER TABLE  `project` ADD  `period` VARCHAR( 45 ) NULL COMMENT  '项目工期' AFTER  `projectName` ,
ADD  `captain` VARCHAR( 45 ) NULL COMMENT  '项目负责人' AFTER  `period` ,
ADD  `supervisor` VARCHAR( 45 ) NULL COMMENT  '项目监理' AFTER  `captain`