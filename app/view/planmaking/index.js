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
				project = projectPane.getSelectionModel().getSelection()[0];
			return {
				projectPane: projectPane,
				project: project
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
								btns.addPlan.enable();
								btns.backToProject.enable();
								planTable.rerenderGridByProject(rec);
							}
							else {
								btns.addPlan.disable();
								btns.editPlan.disable();
								btns.deletePlan.disable();
								btns.backToProject.disable();
								planTable.rerenderGridByProject();
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
						addPlan: panel.query('[name="button-addplan"]')[0],
						editPlan: panel.query('[name="button-editplan"]')[0],
						deletePlan: panel.query('[name="button-deleteplan"]')[0],
						backToProject: panel.query('[name="button-backToProject"]')[0]
					}
				},
				tbar: [
					{
						text: '添加',
						icon: './resources/img/add.png',
						name: 'button-addplan',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes();
							var win = Ext.create('FamilyDecoration.view.planmaking.AddPlanTable', {

							});
							win.show();
						}
					},
					{
						text: '修改',
						name: 'button-editplan',
						icon: './resources/img/edit.png',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var treepanel = Ext.getCmp('treepanel-projectNameForPlanMaking'),
								rec = treepanel.getSelectionModel().getSelection()[0],
								grid = Ext.getCmp('gridpanel-projectPlanMaking');
							var win = Ext.create('FamilyDecoration.view.plan.EditPlan', {
								project: rec,
								projectId: rec.getId(),
								plan: grid.plan
							});
							win.show();
						}
					},
					{
						text: '删除',
						icon: './resources/img/delete.png',
						name: 'button-deleteplan',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var treepanel = Ext.getCmp('treepanel-projectNameForPlanMaking'),
								rec = treepanel.getSelectionModel().getSelection()[0],
								grid = Ext.getCmp('gridpanel-projectPlanMaking');
							Ext.Msg.warning('确定要删除此计划吗？', function (btn) {
								if ('yes' == btn) {
									Ext.Ajax.request({
										url: './libs/plan.php?action=deletePlanByProjectId',
										method: 'POST',
										params: {
											projectId: rec.getId()
										},
										callback: function (opts, success, res) {
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('删除计划成功！');
													grid.refresh(rec);
												}
											}
										}
									})
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