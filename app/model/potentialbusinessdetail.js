Ext.define('FamilyDecoration.model.PotentialBusinessDetail', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        {name: 'potentialBusinessId', type: 'string'},
        {name: 'comments', type: 'string'},
        {name: 'committer', type: 'string'},
        {name: 'committerRealName', type: 'string'},
        {name: 'isDeleted', type: 'string'},
        {name: 'createTime', type: 'string'}
	],
	idProperty: 'id'
});