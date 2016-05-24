Ext.define('FamilyDecoration.view.manuallycheckbill.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.manuallycheckbill-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel',
		'FamilyDecoration.view.progress.EditProgress', 'FamilyDecoration.view.progress.ProjectList',
		'FamilyDecoration.view.budget.BudgetPanel', 'Ext.layout.container.Form', 'FamilyDecoration.model.Progress',
		'FamilyDecoration.store.BusinessDetail', 'FamilyDecoration.view.progress.ProjectListByCaptain',
		'Ext.form.FieldSet'
	],
	// autoScroll: true,
	layout: 'hbox',
	projectId: undefined,

	initComponent: function (){
		var me = this;
		me.items = [{
			hidden: me.projectId ? true : false,
			xtype: 'container',
			layout: 'fit',
			flex: 1,
			height: '100%',
			items: [{
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'progress-projectlistbycaptain',
				projectId: me.projectId,
				searchFilter: true,
				title: '工程项目名称',
				id: 'treepanel-projectName',
				name: 'treepanel-projectName',
				tools: [{
					type: 'gear',
					disabled: true,
					hidden: User.isGeneral() || me.projectId ? true : false,
					id: 'tool-frozeProject',
					name: 'tool-frozeProject',
					tooltip: '工程完工',
					callback: function (){
						var panel = Ext.getCmp('treepanel-projectName');
						var pro = panel.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要封存项目"' + pro.get('projectName') + '"吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/project.php?action=editProject',
									method: 'POST',
									params: {
										projectId: pro.get('projectId'),
										isFrozen: 1
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText),
												treePanel = Ext.getCmp('treepanel-projectName'),
												frozenPanel = Ext.getCmp('treepanel-frozenProject'),
												st = frozenPanel.getStore();
											if (obj.status == 'successful') {
												showMsg('封存成功！');
												treePanel.getStore().load({
													node: pro.parentNode
												});
												treePanel.getSelectionModel().deselectAll();
												st.proxy.url = './libs/project.php';
												st.proxy.extraParams = {
													action: 'getProjectYears'
												};
												st.load({
													node: frozenPanel.getRootNode(),
													callback: function (){
														var progressGrid = Ext.getCmp('gridpanel-projectProgress');
														frozenPanel.getSelectionModel().deselectAll();
														progressGrid.initBtn();
														progressGrid.refresh();
														Ext.getCmp('tool-frozeProject').disable();
													}
												});
											}
										}
									}
								})
							}
						});
					}
				}],
				bbar: [{
					hidden: User.isGeneral() || me.projectId ? true : false,
					text: '添加',
					icon: './resources/img/add5.png',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.progress.EditProject', {

						});
						win.show();
					}
				}, {
					hidden: User.isGeneral() ? true : false,
					text: '修改',
					disabled: true,
					id: 'button-editProject',
					name: 'button-editProject',
					icon: './resources/img/edit2.png',
					handler: function (){
						var panel = Ext.getCmp('treepanel-projectName');
						var pro = panel.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.progress.EditProject', {
							project: pro
						});
						win.show();
					}
				}, {
					hidden: User.isGeneral() ? true : false,
					text: '删除',
					disabled: true,
					icon: './resources/img/delete3.png',
					id: 'button-deleteProject',
					name: 'button-deleteProject',
					handler: function (){
						var panel = Ext.getCmp('treepanel-projectName');
						var pro = panel.getSelectionModel().getSelection()[0];
						var progressGrid = Ext.getCmp('gridpanel-projectProgress');

						Ext.Msg.warning('【注意】删除项目会删除项目下所有的进度内容。<br />确定要删除项目"' + pro.get('projectName') + '"吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/project.php?action=delProject',
									method: 'POST',
									params: {
										projectId: pro.get('projectId')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText);
											if (obj.status == 'successful') {
												panel.getStore().load({
													node: pro.parentNode.parentNode
												});
												panel.getSelectionModel().deselectAll();
												Ext.Ajax.request({
													url: './libs/progress.php?action=deleteProgressByProjectId',
													method: 'POST',
													params: {
														projectId: pro.getId()
													},
													callback: function (opts, success, res){
														if (success) {
															var obj = Ext.decode(res.responseText);
															if (obj.status == 'successful') {
																showMsg('删除成功！');
																progressGrid.refresh();
																progressGrid.initBtn();
															}
															else {
																showMsg(obj.errMsg);
															}
														}
													}
												})
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						});
					}
				}],
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
						return rec.get('projectName') ? true : false;
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							delProjectBtn = Ext.getCmp('button-deleteProject'),
							editProjectBtn = Ext.getCmp('button-editProject'),
							addProgressBtn = Ext.getCmp('button-addProgress'),
							showChartBtn = Ext.getCmp('button-showProjectChart'),
							showBudgetBtn = Ext.getCmp('button-showBudget'),
							frozeProjectBtn = Ext.getCmp('tool-frozeProject'),
							showPlanBtn = Ext.getCmp('button-showProjectPlan'),
							editHeadInfoBtn = Ext.getCmp('button-editTopInfo'),
							progressPanel = Ext.getCmp('gridpanel-projectProgress'),
							checkBusinessBtn = Ext.getCmp('tool-originalBusiness');
						if (!rec) {
							delProjectBtn.disable();
							editProjectBtn.disable();
							addProgressBtn.disable();
							showChartBtn.disable();
							showBudgetBtn.disable();
							frozeProjectBtn.disable();
							editHeadInfoBtn.disable();
							progressPanel.refresh();
							checkBusinessBtn.disable();
						}
						else {
							delProjectBtn.setDisabled(!rec.get('projectName'));
							editProjectBtn.setDisabled(!rec.get('projectName'));
							addProgressBtn.setDisabled(!rec.get('projectName'));
							frozeProjectBtn.setDisabled(!rec.get('projectName'));
							editHeadInfoBtn.setDisabled(!rec.get('projectName'));
							checkBusinessBtn.setDisabled(!rec.get('projectName'));
							if (rec.get('projectName') && rec.get('projectChart') != '') {
								showChartBtn.enable();
							}
							else {
								showChartBtn.disable();
							}
							showBudgetBtn.setDisabled(!rec.get('projectName'));
							progressPanel.refresh(rec);
						}

						rec && Ext.Ajax.request({
							url: './libs/plan.php?action=getPlanByProjectId&projectId=' + rec.getId(),
							method: 'GET',
							callback: function (opts, success, res){
								if (success) {
									var arr = Ext.decode(res.responseText);
									showPlanBtn.setDisabled(arr.length <= 0);
								}
								else {
									showPlanBtn.disable();
								}
							}
						});
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 2,
			height: '100%'
		}];

		this.callParent();
	}
});