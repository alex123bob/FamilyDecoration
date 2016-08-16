Ext.define('FamilyDecoration.model.ProfessionType', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'name', type: 'string'}, // plaster
		{name: 'cname', type: 'string'}, // 泥工
		{name: 'value', type: 'string'}, // 0001
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'billNumber', type: 'string', mapping: 'highLight'}, // 工种下单子的数量
		{name: 'rdyck1BillNumber', type: 'string', mapping: 'rdyck1'} // 工种下rdyck1的单子的数量
	],
	idProperty: 'id'
});