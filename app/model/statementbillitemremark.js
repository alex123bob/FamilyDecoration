Ext.define('FamilyDecoration.model.StatementBillItemRemark', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'refId', type: 'string'},
        {name: 'content', type: 'string'},
        {name: 'committer', type: 'string'},
		{name: 'committerRealName', type: 'string'},
        {name: 'createTime', type: 'string'},
        {name: 'isDeleted', type: 'string'}
	]
});