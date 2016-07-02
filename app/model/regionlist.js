Ext.define('FamilyDecoration.model.RegionList', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		'name',
		'parentID', // -1 represents area, otherwise it is region
		'nameRemark', // the brief introduction of this region
		{
			name: 'openingTime',
			convert: function (v, rec){
				if (v) {
					return Ext.Date.parse(v, 'Y-m-d H:i:s');
				}
				else {
					return '';
				}
			}
		}, // 开盘时间
		'isDeleted',
		'createTime',
		'updateTime'
	],
	idProperty: 'id'
});