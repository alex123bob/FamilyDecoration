RENAME table contracte_engineering_notice_order to contract_engineering_notice_order;
RENAME table contracte_engineering_changelog to contract_engineering_changelog;

insert into `versions`(`id`) values ('version-10.07');