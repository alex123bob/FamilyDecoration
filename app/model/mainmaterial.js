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
		{name: 'productMerchant', type: 'string'}, // 商家
		{name: 'productContact', type: 'string'}, // 联系人及联系号码
	],
	idProperty: 'id'
});