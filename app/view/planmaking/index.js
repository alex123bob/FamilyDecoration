Ext.define('FamilyDecoration.view.planmaking.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.planmaking-index',
	requires: [
 		'FamilyDecoration.view.progress.ProjectListByCaptain',
		'FamilyDecoration.view.planmaking.PlanTable', 'FamilyDecoration.view.planmaking.AddPlanTable'
	],
	layout: 'border',

	initComponent: function () {
		var me = this;

		me.getRes = function (){
			var projectPane = Ext.getCmp('treepanel-projectNameForPlanMaking'),
				project = projectPane.getSelectionModel().getSelection()[0],
				planPane = Ext.getCmp('panel-projectPlan'),
				planTable = planPane.down('planmaking-plantable'),
				planGrid = planTable.down('grid');
			return {
				projectPane: projectPane,
				project: project,
				planPane: planPane,
				planTable: planTable,
				planGrid: planGrid
			};
		};

		me.items = [
			{
				xtype: 'container',
				region: 'west',
				layout: 'fit',
				width: 200,
				margin: '0 1 0 0',
				items: [{
					xtype: 'progress-projectlistbycaptain',
					searchFilter: true,
					title: '工程项目',
					id: 'treepanel-projectNameForPlanMaking',
					name: 'treepanel-projectNameForPlanMaking',
					autoScroll: true,
					listeners: {
						itemclick: function (view, rec) {
							if (rec.get('projectName')) {
								return true;
							}
							else {
								return false;
							}
						},
						selectionchange: function (selModel, sels, opts) {
							var rec = sels[0],
								projectPlanPane = Ext.getCmp('panel-projectPlan'),
								planTable = projectPlanPane.down('planmaking-plantable'),
								btns = projectPlanPane.getButtons();
							if (rec && rec.get('projectName')) {
								btns.editPlan.enable();
								btns.deletePlan.enable();
								btns.backToProject.enable();
								planTable.rerenderGridByProject(rec);
								planTable.renderHeaderAndFooterInfo(rec);
							}
							else {
								btns.editPlan.disable();
								btns.deletePlan.disable();
								btns.backToProject.disable();
								planTable.rerenderGridByProject();
								planTable.renderHeaderAndFooterInfo();
							}

						}
					}
				}]
			},
			{
				region: 'center',
				xtype: 'panel',
				title: '工程计划',
				id: 'panel-projectPlan',
				name: 'panel-projectPlan',
				layout: 'fit',
				getButtons: function (){
					var panel = this;
					return {
						editPlan: panel.query('[name="button-editplan"]')[0],
						deletePlan: panel.query('[name="button-deleteplan"]')[0],
						backToProject: panel.query('[name="button-backToProject"]')[0]
					}
				},
				tbar: [
					{
						text: '编辑',
						icon: './resources/img/edit.png',
						name: 'button-editplan',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes(),
								period = resourceObj.project.get('period').split(':');
							ajaxGet('PlanMaking', false, {
								projectId: resourceObj.project.getId()
							}, function (obj){
								if (obj.data.length > 0) {
									var win = Ext.create('FamilyDecoration.view.planmaking.AddPlanTable', {
										planId: obj['data'][0]['id'],
										project: resourceObj.project,
										isEdit: true,
										callbackAfterClose: function (){
											var resourceObj = me.getRes();
											resourceObj.planGrid.getStore().reload();
										}
									});
									win.show();
									showMsg('进入计划编辑！');
								}
								else {
									ajaxAdd('PlanMaking', {
										projectId: resourceObj.project.getId(),
										projectAddress: resourceObj.project.get('projectName'),
										startTime: period[0],
										endTime: period[1]
									}, function (obj){
										var win = Ext.create('FamilyDecoration.view.planmaking.AddPlanTable', {
											planId: obj['data']['id'],
											project: resourceObj.project,
											callbackAfterClose: function (){
												var resourceObj = me.getRes();
												resourceObj.planTable.rerenderGridByProject(resourceObj.project);
											}
										});
										win.show();
										showMsg('已添加计划！');
									});
								}
							});
						}
					},
					{
						text: '删除',
						icon: './resources/img/delete.png',
						name: 'button-deleteplan',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes();
							Ext.Msg.warning('确定要删除此计划吗？', function (btn) {
								if ('yes' == btn) {
									ajaxGet('PlanMaking', false, {
										projectId: resourceObj.project.getId()
									}, function (obj){
										if (obj.data.length > 0) {
											var planId = obj['data'][0]['id'];
											ajaxUpdate('PlanMaking', {
												id: planId,
												isDeleted: 'true'
											}, 'id', function (obj){
												resourceObj.planTable.rerenderGridByProject(resourceObj.project);
												resourceObj.planTable.renderHeaderAndFooterInfo(resourceObj.project);
											});
										}
										else {
											showMsg('改工程暂时没有计划，不能执行删除操作！');
										}
									});
								}
							});
						}
					},
					{
						text: '返回工程',
						icon: './resources/img/back.png',
						name: 'button-backToProject',
						disabled: true,
						handler: function () {
							var sel = Ext.getCmp('treepanel-projectNameForPlanMaking').getSelectionModel().getSelection()[0];
							if (sel) {
								window.pro = {
									// year: sel.get('projectYear'),
									// month: sel.get('projectMonth'),
									captainName: sel.get('captainName'),
									pid: sel.getId()
								};

								changeMainCt('progress-index');
							}
							else {
								showMsg('请选择工程！');
							}
						}
					}
				],
				items: [
					{
						xtype: 'planmaking-plantable'
					}
				]
			}
		];

		this.callParent();
	}
});