ALTER TABLE `bid_project` DROP `bidderA`, DROP `bidderB`;
ALTER TABLE `bid_project` CHANGE `bidPrice` `bidWinningPrice` VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '中标价';
ALTER TABLE `bid_project` ADD `bidPrice` VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '投标价' AFTER `budgetCost`;
ALTER TABLE `bid_project` ADD `controlledPrice` VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '控制价' AFTER `budgetCost`;
ALTER TABLE `bid_project` CHANGE `perferredBidder` `preferredBidder` VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;


ALTER TABLE `task_list` CHANGE `isFinished` `isAccepted` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT '是否验收';
ALTER TABLE `task_list` ADD `isFinished` VARCHAR(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'false' COMMENT '是否完成' AFTER `isAccepted`;



insert into `versions`(`id`) values ('version-2022-10-06');
