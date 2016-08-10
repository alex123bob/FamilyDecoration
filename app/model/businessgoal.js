Ext.define('FamilyDecoration.model.BusinessGoal', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'user', type: 'string'},
        // 目标量
        {name: 'c1', type: 'string'}, // 市场部：扫楼，设计部：定金率
        {name: 'c2', type: 'string'}, // 市场部：电销，设计部：签单额
        {name: 'c3', type: 'string'}, // 市场部：到店
        {name: 'c4', type: 'string'}, // 市场部：定金
        // 汇总量
        {name: 'ac1', type: 'string'}, // 市场部：扫楼，设计部：定金率
        {name: 'ac2', type: 'string'}, // 市场部：电销，设计部：签单额
        {name: 'ac3', type: 'string'}, // 市场部：到店
        {name: 'ac4', type: 'string'}, // 市场部：定金
        {name: 'targetMonth', type: 'string'},
		{name: 'createTime', type: 'string'},
        {name: 'isDeleted', type: 'string'},
        {name: 'updateTime', type: 'string'}
	],
	idProperty: 'id'
});