CREATE TABLE `bid_project` (
    `id` varchar(20) NOT NULL,
    `name` varchar(100) NOT NULL COMMENT 'name',
    `startTime` varchar(512) NULL DEFAULT null,
    `specificTime` varchar(512) NULL DEFAULT null,
    `requirement` varchar(512) NULL DEFAULT null,
    `location` varchar(512) NULL DEFAULT null,
    `depositProperty` varchar(512) NULL DEFAULT null,
    `statementBillId` varchar(512) NULL DEFAULT null,
    `agency` varchar(512) NULL DEFAULT null,
    `bidderA` varchar(512) NULL DEFAULT null,
    `bidderB` varchar(512) NULL DEFAULT null,
    `budgetCost` varchar(512) NULL DEFAULT null,
    `perferredBidder` varchar(512) NULL DEFAULT null,
    `bidPrice` varchar(512) NULL DEFAULT null,
    `floatDownRate` varchar(512) NULL DEFAULT null,
    `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `isDeleted` varchar(5) NOT NULL DEFAULT 'false'
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
insert into `versions`(`id`)
values ('version-10.04');