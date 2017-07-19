insert into `profession_type` ( `isDeleted`, `id`, `updateTime`, `cname`, `value`, `createTime`, `name`) values ( 'false', '20160529032030146447', null, '基础泥工', '0006', '2017-07-19 22:40:37', 'plaster_t');

update `profession_type` set cname = '贴砖泥工' where value = '0001';

insert into `versions`(`id`) values ('version-9.5');