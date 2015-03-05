Ext.define('FamilyDecoration.model.Plan', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'projectId', type: 'string'},
		{name: 'isDeleted', type: 'boolean'},
		{name: 'createTime', type: 'string'},
		{name: 'prework', type: 'string'},  // 前期工作
		{name: 'matPrepare', type: 'string'}, // 材料准备
		{name: 'waterPower', type: 'string'}, // 水电施工
		{name: 'cementBasic', type: 'string'}, // 泥工基础施工
		{name: 'cementAdvanced', type: 'string'}, // 泥工饰面施工
		{name: 'wallFloor', type: 'string'}, // 洁具、墙纸、木地板
		{name: 'cleaning', type: 'string'}, // 保洁
		{name: 'woods', type: 'string'}, // 木工施工 
		{name: 'painting', type: 'string'} // 油漆
	],
	idProperty: 'id',
	proxy: {
		type: 'rest',
        reader: {
            type: 'json'
        },
        api: {
        	create  : './libs/plan.php?action=addPlan', // &projectId=xxx
		    read    : './libs/plan.php?action=getPlanByProjectId', // &projectId=xxx
		    update  : './libs/plan.php?action=editPlan', // &projectId=xxx
		    destroy : './libs/plan.php?action=deletePlan' // &id=xxx
        }
	}
});