Ext.define('FamilyDecoration.model.BusinessGoal', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'user', type: 'string', mapping: 'u'},
        {name: 'userRealName', type: 'string', mapping: 'n'},
        // 目标量
        {name: 'c1'}, // 市场部：扫楼，设计部：定金率
        {name: 'c2'}, // 市场部：电销，设计部：签单额
        {name: 'c3'}, // 市场部：到店
        {name: 'c4'}, // 市场部：定金
        // 汇总量
        {name: 'a1'}, // 市场部：扫楼，设计部：定金率
        {name: 'a2'}, // 市场部：电销，设计部：签单额
        {name: 'a3'}, // 市场部：到店
        {name: 'a4'}, // 市场部：定金
        {name: 'targetMonth', type: 'string'},
		{name: 'createTime', type: 'string'},
        {name: 'isDeleted', type: 'string'},
        {name: 'updateTime', type: 'string'}
	],
	idProperty: 'id'
});