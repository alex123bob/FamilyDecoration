Ext.define('FamilyDecoration.model.Business', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'regionId', type: 'string'},
		{name: 'potentialBusinessId', type: 'string'}, // 如果该任务是从扫楼业务中创建，那么这个字段存放对应扫楼业务id
		{name: 'address', type: 'string'},
		{name: 'customer', type: 'string'},
		{name: 'custContact', type: 'string'},
		{name: 'salesman', type: 'string'},  // 业务员真实姓名
		{name: 'salesmanName', type: 'string'}, // 业务员账号名
		{name: 'designer', type: 'string'},  // 设计师真实姓名
		{name: 'designerName', type: 'string'}, // 设计师账号名
		{name: 'csStaffName', type: 'string'}, // 客服帐号名
		{name: 'csStaff', type: 'string'}, // 客服真实姓名
		{name: 'source', type: 'string'},
		{name: 'level', type: 'string'}, // 我的业务的评级
		{name: 'signBusinessLevel', type: 'string'}, // 签单业务的评级
		{name: 'applyDesigner', type: 'string'}, //  0初始化，1申请设计师，2设计师申请到了,
		{name: 'applyProjectTransference', type: 'string'}, //  0初始化，1申请转换工程，2转换成了工程,
		{name: 'applyBudget', type: 'string'}, //  0初始化，1申请预算，2预算申请成功，
		{name: 'regionName', type: 'string', mapping: 'name'}, // 小区名称
		{name: 'requestDead', type: 'string'}, // 该业务是否申请废单，是为1，否为0
		{name: 'ds_lp', type: 'string'}, // designStatus: Layout Plan 平面布局
		{name: 'ds_fc', type: 'string'}, // designStatus: facade construction 立面施工
		{name: 'ds_bs', type: 'string'}, // designStatus: building design sketch 效果图
		{name: 'ds_bp', type: 'string'}, // designStatus: budget plan 预算 
		{name: 'isDead', type: 'string'}, // 该业务是否已经是废单，是为true,否为false
		{name: 'requestDeadBusinessTitle', type: 'string'}, // 申请废单的目录
		{name: 'requestDeadBusinessReason', type: 'string'}, // 该业务申请废单的原因
		{name: 'budgetFinished', type: 'string'}, // an indicator used for telling if the corresponding budget is finished or not
		{name: 'levelTime', type: 'string'}, //签单时间
		{name: 'createTime', type: 'string'},
		{name: 'houseType', type: 'string'},
		{name: 'floorArea', type: 'string'},
		{name: 'isWaiting', type: 'string'}, // if a business is set as waiting, then it will be put into another panel, waited to be distributed.
		{name: 'isLocked', type: 'string'} // locked business can't be distributed to other salesman even after 30 days' quietness
	],
	idProperty: 'id'
});