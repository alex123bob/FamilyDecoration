Ext.define('FamilyDecoration.model.MainMaterial', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'projectId', type: 'string'},
		{name: 'isDeleted', type: 'boolean'},
		{name: 'createTime', type: 'string'},
		{name: 'productName', type: 'string'},  // 产品名称
		{name: 'productType', type: 'string'}, // 型号
		{name: 'productNumber', type: 'string'}, // 数量
		{name: 'productMerchant', type: 'string'}, // 商家及联系人
		{name: 'productSchedule', type: 'string'}, // 预定时间及预定人
		{name: 'productDeliver', type: 'string'}, // 送货时间
		{name: 'isChecked', type: 'string'} // 是否已经确认
	],
	idProperty: 'id'
});