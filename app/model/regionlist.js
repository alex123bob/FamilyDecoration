Ext.define('FamilyDecoration.model.RegionList', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		'name',
		'parentID', // -1 represents area, otherwise it is region
		'nameRemark', // the brief introduction of this region
		'isDeleted',
		'createTime',
		'updateTime'
	],
	idProperty: 'id'
});