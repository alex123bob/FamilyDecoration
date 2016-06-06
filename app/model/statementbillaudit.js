Ext.define('FamilyDecoration.model.StatementBillAudit', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'billId', type: 'string'},
		{name: 'comments', type: 'string'},
		{name: 'createTime', type: 'string'},
		{name: 'updateTime', type: 'string'},
		{name: 'isDeleted', type: 'string'},
		{name: 'operator', type: 'string'},
        {name: 'orignalStatus', type: 'string'},
        {name: 'orignalStatusName', type: 'string'},
        {name: 'newStatus', type: 'string'},
        {name: 'newStatusName', type: 'string'}
	]
});