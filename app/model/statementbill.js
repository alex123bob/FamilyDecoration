Ext.define('FamilyDecoration.model.StatementBill', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'payee', type: 'string'},
		{name: 'projectName', type: 'string'},
		{name: 'totalFee', type: 'float'},
		{name: 'claimAmount', type: 'float'},
		{name: 'payedTimes', type: 'int'},
		{name: 'projectProgress', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'phoneNumber', type: 'string'},
		{name: 'billName', type: 'string'},
		{name: 'billValue', type: 'string'},
		{name: 'status', type: 'string'}, // 'new', 'rdyck', 'chk','rbk'
		{name: 'statusName', type: 'string'}, // '新创建', '待审核', '已审核', '打回'
		{name: 'checker', type: 'string'},
		{name: 'checkerRealName', type: 'string'},
		{name: 'isPaid', type: 'string'},
		{name: 'professionType', type: 'string'},
		{name: 'projectId', type: 'string'}
	]
});