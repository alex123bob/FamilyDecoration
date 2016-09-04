---以下五个单子置为未付:
'20160824132349031068',
'20160810200932097053',
'20160810154359093547',
'20160707190906055015',
'20160810211822035550'

SELECT * FROM statement_bill WHERE payee LIKE  '彭炳焰%'

UPDATE  `app_dqjczs`.`statement_bill` SET  `status` =  'chk',`payer` =  '',`paidAmount` =  '',`paidTime` =  null,
`descpt` =  '统一修改置为已付--第二次修改置为未付' WHERE  `statement_bill`.`id` =  '20160810211822035550'


