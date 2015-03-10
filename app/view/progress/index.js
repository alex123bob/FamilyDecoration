Ext.define('FamilyDecoration.view.progress.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.progress-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel',
		'FamilyDecoration.view.progress.EditProgress', 'FamilyDecoration.view.progress.ProjectList',
		'FamilyDecoration.view.budget.EditBudget', 'Ext.layout.container.Form', 'FamilyDecoration.model.Progress'
	],
	autoScroll: true,
	layout: 'border',

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			region: 'west',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			width: 200,
			margin: '0 1 0 0',
			items: [{
				xtype: 'progress-projectlist',
				title: '工程项目名称',
				id: 'treepanel-projectName',
				name: 'treepanel-projectName',
				tools: [{
					type: 'gear',
					disabled: true,
					hidden: User.isGeneral() ? true : false,
					id: 'tool-frozeProject',
					name: 'tool-frozeProject',
					tooltip: '封存当前项目',
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
													node: pro.parentNode.parentNode
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
				tbar: [{
					hidden: User.isGeneral() ? true : false,
					text: '添加',
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
										projectId: pro.get('projectId'),
										budgetId: pro.get('budgetId')
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
				flex: 4,
				width: '100%',
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
							progressPanel = Ext.getCmp('gridpanel-projectProgress');
						if (!rec) {
							delProjectBtn.disable();
							editProjectBtn.disable();
							addProgressBtn.disable();
							showChartBtn.disable();
							showBudgetBtn.disable();
							frozeProjectBtn.disable();
							editHeadInfoBtn.disable();
							progressPanel.refresh();
						}
						else {
							delProjectBtn.setDisabled(!rec.get('projectName'));
							editProjectBtn.setDisabled(!rec.get('projectName'));
							addProgressBtn.setDisabled(!rec.get('projectName'));
							frozeProjectBtn.setDisabled(!rec.get('projectName'));
							editHeadInfoBtn.setDisabled(!rec.get('projectName'));
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
			}, {
				hidden: User.isGeneral() ? true : false,
				xtype: 'progress-projectlist',
				title: '已封存项目',
				id: 'treepanel-frozenProject',
				name: 'treepanel-frozenProject',
				tools: [{
					type: 'gear',
					disabled: true,
					id: 'tool-unfreezeProject',
					name: 'tool-unfreezeProject',
					tooltip: '解封当前项目',
					callback: function (){
						var panel = Ext.getCmp('treepanel-frozenProject');
						var pro = panel.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要解封项目"' + pro.get('projectName') + '"吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/project.php?action=editProject',
									method: 'POST',
									params: {
										projectId: pro.get('projectId'),
										isFrozen: 0
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText),
												proPanel = Ext.getCmp('treepanel-projectName'),
												st = proPanel.getStore();
											if (obj.status == 'successful') {
												showMsg('解封成功！');
												Ext.getCmp('treepanel-projectName').getStore().load({
													node: pro.parentNode.parentNode
												});
												st.proxy.url = './libs/project.php';
												st.proxy.extraParams = {
													action: 'getProjectYears'
												};
												st.load({
													node: proPanel.getRootNode(),
													callback: function (){
														var progressGrid = Ext.getCmp('gridpanel-projectProgress');
														proPanel.getSelectionModel().deselectAll();
														progressGrid.initBtn();
														progressGrid.refresh();
														Ext.getCmp('tool-unfreezeProject').disable();
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
				isForFrozen: true,
				flex: 2,
				width: '100%',
				autoScroll: true,
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							unfreezeProjectBtn = Ext.getCmp('tool-unfreezeProject');
						if (!rec) {
							unfreezeProjectBtn.disable();
						}
						else {
							unfreezeProjectBtn.setDisabled(!rec.get('projectName'));
						}
					}
				}
			}]
		}, {
			region: 'center',
			xtype: 'gridpanel',
			id: 'gridpanel-projectProgress',
			name: 'gridpanel-projectProgress',
			title: '工程进度查看情况',
			refresh: function (rec){
				var grid = this,
					st = grid.getStore(),
					period = Ext.getCmp('textfield-period'),
					captain = Ext.getCmp('textfield-captain'),
					supervisor = Ext.getCmp('textfield-supervisor');
				if (rec) {
					st.load({
						params: {
							action: 'getProgressByProjectId',
							projectId: rec.getId()
						}
					});
					period.setValue(rec.get('period'));
					captain.setValue(rec.get('captain'));
					supervisor.setValue(rec.get('supervisor'));
				}
				else {
					grid.getStore().loadData([]);
					period.setValue('');
					captain.setValue('');
					supervisor.setValue('');
				}
			},
			initBtn: function (){
				var addBtn = Ext.getCmp('button-addProgress'),
					editBtn = Ext.getCmp('button-editProgress'),
					delBtn = Ext.getCmp('button-deleteProgress'),
					chartBtn = Ext.getCmp('button-showProjectChart'),
					budgetBtn = Ext.getCmp('button-showBudget'),
					headInfoBtn = Ext.getCmp('button-editTopInfo');

				addBtn.disable();
				editBtn.disable();
				delBtn.disable();
				chartBtn.disable();
				budgetBtn.disable();
				headInfoBtn.disable();
			},
			tbar: [{
				xtype: 'textfield',
				name: 'textfield-period',
				id: 'textfield-period',
				labelWidth: 70,
				width: 240,
				readOnly: true,
				fieldLabel: '项目工期'
			}, {
				xtype: 'textfield',
				name: 'textfield-captain',
				id: 'textfield-captain',
				labelWidth: 70,
				width: 240,
				readOnly: true,
				fieldLabel: '项目负责人'
			}, {
				xtype: 'textfield',
				name: 'textfield-supervisor',
				id: 'textfield-supervisor',
				labelWidth: 70,
				width: 240,
				readOnly: true,
				fieldLabel: '项目监理'
			}],
			bbar: [{
				hidden: User.isGeneral() ? true : false,
				text: '添加',
				id: 'button-addProgress',
				name: 'button-addProgress',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.progress.EditProgress', {
						project: project
					});
					win.show();
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '修改',
				id: 'button-editProgress',
				name: 'button-editProgress',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						gridPanel = Ext.getCmp('gridpanel-projectProgress'),
						progress = gridPanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.progress.EditProgress', {
						project: project,
						progress: progress
					});
					win.show();
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '删除',
				id: 'button-deleteProgress',
				name: 'button-deleteProgress',
				disabled: true,
				handler: function (){
					var progressPanel = Ext.getCmp('gridpanel-projectProgress'),
						proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						rec = progressPanel.getSelectionModel().getSelection()[0];
					if (rec) {
						Ext.Msg.warning('确定删除该条进度吗？', function (btn){
							if (btn == 'yes') {
								Ext.Ajax.request({
									url: './libs/progress.php?action=deleteProgress',
									method: 'POST',
									params: {
										id: rec.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除进度成功！');
												progressPanel.refresh(project);
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								});
							}
						});
					}
					else {
						showMsg('请选择进度！');
					}
				}
			}, {
				text: '查看图库',
				id: 'button-showProjectChart',
				name: 'button-showProjectChart',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						year = project.get('projectYear'),
						month = project.get('projectMonth'),
						pid = project.getId();

					window.pro = {
						year: year,
						month: month,
						pid: pid
					};

					changeMainCt('chart-index');
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '查看预算',
				id: 'button-showBudget',
				name: 'button-showBudget',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						budgetId = project.get('budgetId');

					if (budgetId != 'NULL' && budgetId != '') {
						Ext.Ajax.request({
							url: './libs/budget.php?action=view',
							method: 'GET',
							params: {
								budgetId: budgetId
							},
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.length > 0) {
										var win = Ext.create('Ext.window.Window', {
											items: [{
												budget: obj[0],
												xtype: 'budget-editbudget'
											}],
											maximizable: true,
											modal: true,
											layout: 'fit'
										});
										win.show();
									}
									else {
										showMsg('找不到对应预算！');
									}
								}
							}
						})
						
					}
					else {
						showMsg('没有对应预算！');
					}
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '查看计划',
				id: 'button-showProjectPlan',
				name: 'button-showProjectPlan',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						year = project.get('projectYear'),
						month = project.get('projectMonth'),
						pid = project.getId();

					window.pro = {
						year: year,
						month: month,
						pid: pid
					};

					changeMainCt('plan-index');
				}
			}, {
				hidden: !(User.isAdmin() || User.isProjectManager() || User.isProjectStaff()),
				text: '编辑置顶信息',
				disabled: true,
				id: 'button-editTopInfo',
				name: 'button-editTopInfo',
				handler: function (){
					var treePanel = Ext.getCmp('treepanel-projectName'),
						st = treePanel.getStore(),
						pro = treePanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('Ext.window.Window', {
						title: '编辑置顶信息',
						width: 500,
						height: 200,
						layout: 'form',
						modal: true,
						defaultType: 'textfield',
					    items: [{
					       	fieldLabel: '工期',
					        name: 'projectPeriod',
					        allowBlank:false,
					        value: pro ? pro.get('period') : ''
					    },{
					        fieldLabel: '项目负责人',
					        name: 'projectCaptain',
					        allowBlank: false,
					        value: pro ? pro.get('captain') : ''
					    },{
					        fieldLabel: '监理',
					        name: 'projectSupervisor',
					        allowBlank: false,
					        value: pro ? pro.get('supervisor') : ''
					    }],
					    buttons: [{
					    	text: '确定',
					    	handler: function (){
					    		var period = win.down('[name="projectPeriod"]'),
					    			captain = win.down('[name="projectCaptain"]'),
					    			supervisor = win.down('[name="projectSupervisor"]'),
					    			gridPanel = Ext.getCmp('gridpanel-projectProgress');
					    		Ext.Ajax.request({
					    			url: './libs/project.php?action=editProjectHeadInfo',
					    			method: 'POST',
					    			params: {
					    				projectId: pro.getId(),
					    				period: period.getValue(),
					    				captain: captain.getValue(),
					    				supervisor: supervisor.getValue()
					    			},
					    			callback: function (opts, success, res){
					    				if (success) {
					    					var obj = Ext.decode(res.responseText);
					    					if (obj.status == 'successful') {
					    						st.proxy.url = './libs/project.php';
					    						st.proxy.extraParams = {
					    							action: 'getProjects',
					    							year: pro.get('projectYear'),
					    							month: pro.get('projectMonth')
					    						};
					    						st.load({
					    							node: pro.parentNode,
					    							callback: function (recs, ope, success){
					    								if (success) {
					    									var newPro;
					    									for (var i = 0; i < recs.length; i++) {
					    										if (recs[i].getId() == pro.getId()) {
					    											newPro = recs[i];
					    											break;
					    										}
					    									}
					    									treePanel.getSelectionModel().deselectAll()
					    									treePanel.getSelectionModel().select(newPro);
					    									win.close();
					    								}
					    							}
					    						})
					    					}
					    					else {
					    						Ext.Msg.error(obj.errMsg);
					    					}
					    				}
					    			}
					    		})
					    	}
					    }, {
					    	text: '取消',
					    	handler: function (){
					    		win.close();
					    	}
					    }]
					});

					win.show();
				}
			}],
			// hideHeaders: true,
			store: Ext.create('Ext.data.Store', {
				model: 'FamilyDecoration.model.Progress',
				autoLoad: false
			}),
			columns: [
		        {
		        	text: '工程进度', 
		        	dataIndex: 'progress', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false,
		        	renderer: function (val){
		        		if (val) {
		        			return val.replace(/\n/gi, '<br />');
		        		}
		        		else {
		        			return val;
		        		}
		        	},
		        },
		        {
		        	text: '监理意见',
		        	dataIndex: 'comments', 
		        	flex: 1,
		        	renderer: function (val){
		        		if (val) {
		        			return val.replace(/\n/gi, '<br />');
		        		}
		        		else {
		        			return val;
		        		}
		        	},
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        }
		    ],
		    listeners: {
		    	selectionchange: function (view, sels){
		    		var rec = sels[0],
		    			delBtn = Ext.getCmp('button-deleteProgress'),
		    			editBtn = Ext.getCmp('button-editProgress');
		    		delBtn.setDisabled(!rec);
		    		editBtn.setDisabled(!rec);
		    	},
		    	cellclick: function (table, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
		    		if (User.isAdmin() || User.isSupervisor()) {
	    				if (1 == cellIndex) {
		    				var win = Ext.create('Ext.window.Window', {
			    				title: '添加监理意见',
			    				width: 500,
			    				height: 200,
			    				modal: true,
			    				layout: 'fit',
			    				items: [{
			    					id: 'textarea-progresscomment',
			    					name: 'textarea-progresscomment',
			    					xtype: 'textarea',
			    					value: rec.get('comments')
			    				}],
			    				buttons: [{
			    					text: '添加',
			    					handler: function (){
			    						var pro = Ext.getCmp('treepanel-projectName').getSelectionModel().getSelection()[0],
			    							textarea = Ext.getCmp('textarea-progresscomment');
			    						Ext.Ajax.request({
			    							url: './libs/progress.php?action=editProgress',
			    							method: 'POST',
			    							params: {
			    								id: rec.getId(),
			    								comments: textarea.getValue()
			    							},
			    							callback: function (opts, success, res){
			    								if (success) {
			    									var obj = Ext.decode(res.responseText),
			    										progressPanel = Ext.getCmp('gridpanel-projectProgress');
			    									if (obj.status == 'successful') {
			    										win.close();
			    										showMsg('监理意见添加成功！');
			    										progressPanel.refresh(pro);
			    									}
			    								}
			    							}
			    						})
			    					}
			    				}, {
			    					text: '取消',
			    					handler: function (){
			    						win.close();
			    					}
			    				}]
			    			});
			    			win.show();
		    			}
		    		}
		    	}
		    }
		}];

		this.callParent();
	}
});