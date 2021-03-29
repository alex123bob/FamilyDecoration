alter table contract_engineering add column `AParty` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '甲方名称';
alter table contract_engineering add column `APartyPrincipal` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '甲方负责人';
alter table contract_engineering add column `APartyContact` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL default null  comment '甲方联系方式';

insert into `versions`(`id`) values ('version-10.06');