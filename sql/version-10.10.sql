ALTER TABLE statement_bill modify billType varchar(20)  comment 'ppd:预付款,reg:普通账单,qgd:质量保证金,mtf:材料付款,rbm:报销,fdf:财务部门费用,wlf:福利,tax:税,bidbond:投标保证金,bidbondBk投标保证金（退回）,pmbond履约保证金,pmbondBk履约保证金（退回）';
ALTER TABLE statement_bill modify payer varchar(20) comment '财务/出纳 (入账时是收款人，出账时是付款人)';
ALTER TABLE statement_bill modify payee varchar(20) comment '财务/出纳对接方 (入账付款人，出账收款人)';

insert into `versions`(`id`) values ('version-10.10');