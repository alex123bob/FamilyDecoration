ALTER TABLE `online_user` ADD `app` int(1) default 0;
ALTER TABLE `online_user` ADD `manufacturer` varchar(256) ;
ALTER TABLE `online_user` ADD `model` varchar(256) ;
ALTER TABLE `online_user` ADD `platform` varchar(256) ;
ALTER TABLE `online_user` ADD `version` varchar(256) ;

insert into `versions`(`id`) values ('version-9.3');
