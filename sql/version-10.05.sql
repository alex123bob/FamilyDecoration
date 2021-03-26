alter table statement_bill add column `bidTime` datetime DEFAULT NULL  comment '投标保证金开标时间';
alter table statement_bill add column `accountName` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '账号名称';
alter table statement_bill add column `bank` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '开户行';
alter table statement_bill add column `accountNumber` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '开户行';

insert into `versions`(`id`) values ('version-10.05');