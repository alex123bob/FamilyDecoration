Ext.define('FamilyDecoration.model.Plan', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
		{name: 'projectId', type: 'string'},
		{name: 'isDeleted', type: 'boolean'},
		{name: 'createTime', type: 'string'},
		{name: 'conCleaHeatDefine', type: 'string'},  // 空调、洁具、热水器确定
		{name: 'bottomDig', type: 'string'}, // 底层下挖
		{name: 'toiletBalCheck', type: 'string'}, // 卫生间、阳台养水验房
		{name: 'plumbElecCheck', type: 'string'}, // 上下水、电路检查
		{name: 'knockWall', type: 'string'}, // 敲墙
		{name: 'tileMarbleCabiDefine', type: 'string'}, // 瓷砖、大理石、橱柜确定
		{name: 'waterElecCheck', type: 'string'}, // 水电材料进场、验收
		{name: 'waterElecConstruct', type: 'string'}, // 水电施工 
		{name: 'waterElecPhoto', type: 'string'}, // 水电工程验收、拍照
		{name: 'tilerMateConstruct', type: 'string'}, // 泥工材料进场、施工
		{name: 'tilerProCheck', type: 'string'}, // 泥工工程验收
		{name: 'woodMateCheck', type: 'string'}, // 木工材料进场、验收
		{name: 'woodProConstruct', type: 'string'}, // 木工工程施工
		{name: 'woodProCheck', type: 'string'}, // 木工工程验收
		{name: 'paintMateCheck', type: 'string'}, // 油漆材料进场、验收
		{name: 'paintProConstruct', type: 'string'}, // 油漆工程施工
		{name: 'cabiInstall', type: 'string'}, // 橱柜安装
		{name: 'toilKitchSuspend', type: 'string'}, // 卫生间、厨房吊顶
		{name: 'paintProCheck', type: 'string'}, // 油漆工程验收
		{name: 'switchSocketInstall', type: 'string'}, // 开关、插座安装
		{name: 'lampSanitInstall', type: 'string'}, // 灯具、洁具安装
		{name: 'floorInstall', type: 'string'}, // 地板安装
		{name: 'paintRepair', type: 'string'}, // 油漆修补
		{name: 'wallpaperPave', type: 'string'}, // 墙纸铺贴
		{name: 'housekeepingClean', type: 'string'}, // 家政保洁
		{name: 'elecInstall', type: 'string'}, // 电器安装
		{name: 'curtainFuniInstall', type: 'string'} // 窗帘、家具安装
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