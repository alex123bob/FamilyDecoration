Ext.define('FamilyDecoration.model.AccountLog', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        {name: 'accountId', type: 'string'},
        {name: 'type', type: 'string'}, // in:入账  out:出账
        'amount', // 此次操作的金额
        {name: 'refId', type: 'string'}, // 关联单据，工资单(salary)或者贷款单(loan)或者其他(statement_bill)单据Id，或-1(修改余额操作)
        {name: 'refType', type: 'string'}, // 关联单据类型，sly:工资单(salary); loan:贷款单(loan);stb:其他(statement_bill)单据Id;edit:修改
        {name: 'refTypeCn', type: 'string'}, // 关联单据类型中文
        {name: 'operator', type: 'string'},
        {name: 'operatorRealName', type: 'string'},
        'balance', // 操作后余额
        {name: 'isDeleted', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'updateTime', type: 'string'}
	],
	idProperty: 'id'
});