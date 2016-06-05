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
		{name: 'status', type: 'string'},
		{name: 'checker', type: 'string'},
		{name: 'checkerRealName', type: 'string', mapping: 'realname'},
		{name: 'isPaid', type: 'string'},
		{name: 'professionType', type: 'string'},
		{name: 'projectId', type: 'string'}
	]
});