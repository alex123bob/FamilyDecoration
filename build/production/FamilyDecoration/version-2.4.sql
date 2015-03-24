ALTER TABLE  `project` ADD  `businessId` VARCHAR( 18 ) NULL DEFAULT NULL COMMENT  '如果是从业务转过来的，则保存对应业务id' AFTER  `budgetId`
