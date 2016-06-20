Ext.define('FamilyDecoration.view.progress.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.progress-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel',
		'FamilyDecoration.view.progress.EditProgress', 'FamilyDecoration.view.progress.ProjectList',
		'FamilyDecoration.view.budget.BudgetPanel', 'Ext.layout.container.Form', 'FamilyDecoration.model.Progress',
		'FamilyDecoration.store.BusinessDetail', 'FamilyDecoration.view.progress.ProjectListByCaptain',
		'Ext.form.FieldSet'
	],
	// autoScroll: true,
	layout: 'border',
	projectId: undefined,

	initComponent: function (){
		var me = this;
		me.items = [{
			hidden: me.projectId ? true : false,
			xtype: 'container',
			region: 'west',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			width: 220,
			margin: '0 1 0 0',
			items: [{
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
							proPanel: Ext.getCmp('treepanel-projectName')
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
							project: pro,
							proPanel: Ext.getCmp('treepanel-projectName')
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
			}, {
				xtype: 'progress-projectlist',
				title: '已封存项目',
				id: 'treepanel-frozenProject',
				name: 'treepanel-frozenProject',
				loadAll: false,
				hidden: me.projectId || User.isGeneral() ? true : false,
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
												st = proPanel.getStore(),
												frozenSt = panel.getStore(),
												extraParams = {};
											if (obj.status == 'successful') {
												showMsg('解封成功！');
												st.proxy.url = './libs/project.php';
												extraParams = {
													action: 'getProjectCaptains'
												};
												if (User.isProjectStaff()) {
													Ext.apply(extraParams, {
														captainName: User.getName()
													});
												}
												st.proxy.extraParams = extraParams;
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
												frozenSt.proxy.url = './libs/project.php';
												frozenSt.proxy.extraParams = {
													action: 'getProjectYears'
												};
												frozenSt.load({
													node: pro.parentNode.parentNode,
													callback: function (){
														
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
					supervisor = Ext.getCmp('textfield-supervisor'),
					salesman = Ext.getCmp('textfield-salesman'),
					designer = Ext.getCmp('textfield-designer'),
					endTime;
				if (rec) {
					endTime = rec.get('period').split(':')[1]
					st.load({
						params: {
							action: 'getProgressByProjectId',
							projectId: rec.getId()
						}
					});
					period.setValue(rec.get('period'));
					captain.setValue(rec.get('captain'));
					supervisor.setValue(rec.get('supervisor'));
					salesman.setValue(rec.get('salesman'));
					designer.setValue(rec.get('designer'));
					if (endTime && (new Date(endTime.replace(/-/g, '/')) < new Date())) {
						period.markInvalid('项目到期');
					}
					else {
						period.clearInvalid();
					}
				}
				else {
					grid.getStore().loadData([]);
					period.setValue('');
					captain.setValue('');
					supervisor.setValue('');
					salesman.setValue('');
					designer.setValue('');
					period.clearInvalid();
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
			tbar: Ext.create('Ext.toolbar.Toolbar', {
				enableOverflow: true,
				items: [{
					xtype: 'textfield',
					name: 'textfield-captain',
					id: 'textfield-captain',
					labelWidth: 70,
					width: 140,
					readOnly: true,
					fieldLabel: '项目经理'
				}, {
					xtype: 'textfield',
					name: 'textfield-supervisor',
					id: 'textfield-supervisor',
					labelWidth: 60,
					width: 140,
					readOnly: true,
					fieldLabel: '项目监理'
				}, {
					xtype: 'textfield',
					name: 'textfield-salesman',
					id: 'textfield-salesman',
					labelWidth: 44,
					width: 120,
					readOnly: true,
					fieldLabel: '业务员'
				}, {
					xtype: 'textfield',
					name: 'textfield-designer',
					id: 'textfield-designer',
					labelWidth: 44,
					width: 120,
					readOnly: true,
					fieldLabel: '设计师'
				}, {
					xtype: 'textfield',
					name: 'textfield-period',
					id: 'textfield-period',
					labelWidth: 60,
					width: 220,
					readOnly: true,
					fieldLabel: '项目工期'
				}]
			}),
			tools: [{
				id: 'tool-originalBusiness',
				name: 'tool-originalBusiness',
		        type: 'down',
		        tooltip: '查看原始业务',
		        disabled: true,
		        callback: function() {
		            var treePanel = Ext.getCmp('treepanel-projectName'),
		            	pro = treePanel.getSelectionModel().getSelection()[0];

		            if (pro.get('businessId')) {
		            	var win = Ext.create('Ext.window.Window', {
		            		title: '原始业务数据',
		            		layout: 'fit',
		            		modal: true,
		            		width: 500,
		            		height: 400,
		            		tbar: [{
		            			xtype: 'displayfield',
		            			fieldLabel: '客户姓名',
		            			name: 'displayfield-customer',
		            			id: 'displayfield-customer'
		            		}, '->', {
		            			xtype: 'displayfield',
		            			fieldLabel: '业务来源',
		            			name: 'displayfield-source',
		            			id: 'displayfield-source'
		            		}],
		            		items: [{
		            			xtype: 'gridpanel',
		            			id: 'gridpanel-historyBusinessDetail',
		            			name: 'gridpanel-historyBusinessDetail',
		            			autoScroll: true,
		            			hideHeaders: true,
		            			columns: [{
		            				text: '信息',
		            				flex: 1,
		            				dataIndex: 'content',
		            				renderer: function (val, meta, rec){
										return val.replace(/\n/ig, '<br />');
									}
		            			}],
		            			store: Ext.create('FamilyDecoration.store.BusinessDetail', {
							    	autoLoad: true,
							    	proxy: {
										type: 'rest',
								    	url: './libs/business.php?action=getBusinessDetails',
								        reader: {
								            type: 'json'
								        },
								        extraParams: {
								        	businessId: pro.get('businessId')
								        }
									}
							    })
		            		}],
		            		listeners: {
		            			show: function (win){
		            				Ext.Ajax.request({
		            					url: './libs/business.php?action=getBusinessById',
		            					method: 'GET',
		            					params: {
		            						businessId: pro.get('businessId')
		            					},
		            					callback: function (opts, success, res){
		            						if (success) {
		            							var obj = Ext.decode(res.responseText),
		            								customer = Ext.getCmp('displayfield-customer'),
		            								source = Ext.getCmp('displayfield-source');
		            							if (obj.length > 0) {
		            								customer.setValue(obj[0]['customer']);
		            								source.setValue(obj[0]['source']);
		            							}
		            							else {
		            								showMsg(obj.errMsg);
		            							}
		            						}
		            					}
		            				})
		            			}
		            		}
		            	});

		            	win.show();
		            }
		            else {
		            	showMsg('没有原始业务！');
		            }
		        }
		    }],
			bbar: [{
				hidden: User.isGeneral() ? true : false,
				text: '添加',
				id: 'button-addProgress',
				name: 'button-addProgress',
				icon: './resources/img/add.png',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.progress.EditProgress', {
						progressGrid: Ext.getCmp('gridpanel-projectProgress'),
						project: project
					});
					win.show();
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '修改',
				id: 'button-editProgress',
				name: 'button-editProgress',
				icon: './resources/img/edit.png',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						gridPanel = Ext.getCmp('gridpanel-projectProgress'),
						progress = gridPanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.progress.EditProgress', {
						project: project,
						progress: progress,
						progressGrid: Ext.getCmp('gridpanel-projectProgress')
					});
					win.show();
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '删除',
				id: 'button-deleteProgress',
				name: 'button-deleteProgress',
				icon: './resources/img/delete.png',
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
				icon: './resources/img/gallery.png',
				hidden: me.projectId ? true : false,
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						// year = project.get('projectYear'),
						// month = project.get('projectMonth'),
						captainName = project.get('captainName'),
						pid = project.getId();

					if (project.get('hasChart') == '1') {
						window.pro = {
							// year: year,
							// month: month,
							captainName: captainName,
							pid: pid
						};

						changeMainCt('chart-index');
					}
					else {
						showMsg('该工程没有图库！');
					}
				}
			}, {
				hidden: User.isGeneral() ? true : false,
				text: '查看预算',
				icon: './resources/img/preview2.png',
				id: 'button-showBudget',
				name: 'button-showBudget',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						budgets = project.get('budgets');

					if (budgets && budgets.length > 0) {
						Ext.each(budgets, function (budget, index, obj){
							Ext.apply(budget, {
								projectName: project.get('projectName')
							});
						});
						var listWin = Ext.create('Ext.window.Window', {
							title: project.get('projectName') + '-预算列表',
							width: 600,
							modal: true,
							height: 400,
							layout: 'fit',
							items: [{
								xtype: 'gridpanel',
								autoScroll: true,
								columns: [
									{
										text: '项目名称',
										dataIndex: 'projectName',
										flex: 1
									},
									{
										text: '客户名称',
										dataIndex: 'custName',
										flex: 1
									},
									{
										text: '预算名称',
										dataIndex: 'budgetName',
										flex: 2
									},
									{
										text: '户型大小',
										dataIndex: 'areaSize',
										flex: 1
									}
								],
								store: Ext.create('FamilyDecoration.store.Budget', {
									data: budgets,
									autoLoad: false
								})
							}],
							buttons: [
								{
									text: '查看预算',
									handler: function (){
										var grid = listWin.down('gridpanel'),
											st = grid.getStore(),
											rec = grid.getSelectionModel().getSelection()[0];
										if (rec) {
											var win = window.open('./fpdf/index2.php?action=view&budgetId=' + rec.getId(),'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
										}
										else {
											showMsg('请选择预算！');
										}
									}
								},
								{
									text: '取消',
									handler: function (){
										listWin.close();
									}
								}
							]
						});
						listWin.show();
					}
					else {
						showMsg('没有预算！');
					}
				}
			}, {
				hidden: User.isGeneral() || me.projectId ? true : false,
				text: '查看计划',
				id: 'button-showProjectPlan',
				name: 'button-showProjectPlan',
				icon: './resources/img/plan.png',
				disabled: true,
				handler: function (){
					var proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						year, month, pid, captainName;

					if (project && project.get('projectName')) {
						// year = project.get('projectYear');
						// month = project.get('projectMonth');
						captainName = project.get('captainName');
						pid = project.getId();
						window.pro = {
							// year: year,
							// month: month,
							captainName: captainName,
							pid: pid
						};

						changeMainCt('plan-index');
					}
					else {
						showMsg('请选择工程！');
					}
				}
			}, {
				hidden: !(User.isAdmin() || User.isProjectManager() || User.isProjectStaff()),
				text: '编辑置顶信息',
				icon: './resources/img/edit4.png',
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
						height: 300,
						layout: 'form',
						modal: true,
						defaultType: 'textfield',
					    items: [{
							xtype: 'fieldset',
							collasible: false,
							layout: 'anchor',
							title: '工期',
							defaults: {
								anchor: '100%'
							},
							items: [{
								xtype: 'datefield',
								fieldLabel: '开始',
								editable: false,
								flex: 1,
								labelWidth: 40,
								name: 'projectStartTime',
								allowBlank: false,
								value: pro ? pro.get('period').split(':')[0] : ''
							}, {
								margin: '0 0 0 2px',
								xtype: 'datefield',
								fieldLabel: '结束',
								editable: false,
								flex: 1,
								labelWidth: 40,
								name: 'projectEndTime',
								allowBlank: false,
								value: pro ? pro.get('period').split(':')[1] : 0
							}]
						},{
					        fieldLabel: '项目经理',
					        name: 'projectCaptain',
					        allowBlank: false,
					        value: pro ? pro.get('captain') : ''
					    },{
					        fieldLabel: '监理',
					        name: 'projectSupervisor',
					        allowBlank: false,
					        value: pro ? pro.get('supervisor') : ''
					    },{
					        fieldLabel: '业务员',
					        name: 'projectSalesman',
					        allowBlank: false,
					        value: pro ? pro.get('salesman') : ''
					    },{
					        fieldLabel: '设计师',
					        name: 'projectDesigner',
					        allowBlank: false,
					        value: pro ? pro.get('designer') : ''
					    }],
					    buttons: [{
					    	text: '确定',
					    	handler: function (){
					    		var start = win.down('[name="projectStartTime"]'),
					    			end = win.down('[name="projectEndTime"]'),
					    			captain = win.down('[name="projectCaptain"]'),
					    			supervisor = win.down('[name="projectSupervisor"]'),
					    			salesman = win.down('[name="projectSalesman"]'),
					    			designer = win.down('[name="projectDesigner"]'),
					    			gridPanel = Ext.getCmp('gridpanel-projectProgress');
					    		Ext.Ajax.request({
					    			url: './libs/project.php?action=editProjectHeadInfo',
					    			method: 'POST',
					    			params: {
					    				projectId: pro.getId(),
					    				period: Ext.Date.format(start.getValue(), 'Y-m-d') + ':' + Ext.Date.format(end.getValue(), 'Y-m-d'),
					    				captain: captain.getValue(),
					    				supervisor: supervisor.getValue(),
					    				salesman: salesman.getValue(),
					    				designer: designer.getValue()
					    			},
					    			callback: function (opts, success, res){
					    				if (success) {
					    					var obj = Ext.decode(res.responseText);
					    					if (obj.status == 'successful') {
					    						st.proxy.url = './libs/project.php';
					    						st.proxy.extraParams = {
					    							action: 'getProjectsByCaptainName',
					    							captainName: pro.get('captainName')
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
					    									showMsg('编辑成功！');
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
		        	}
		        },
		        {
		        	text: '监理意见',
		        	dataIndex: 'comments', 
		        	flex: 1,
		        	hidden: User.isGeneral(),
		        	renderer: function (val, meta, rec){
		        		// if (User.isAdmin() || User.isSupervisor()) {
		        			meta.style = 'cursor: pointer;';
		        		// }
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
		    		// if (User.isAdmin() || User.isSupervisor()) {
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
			    										var title = '监理意见添加提醒',
			    											content = User.getRealName() + '为项目"' + pro.get('projectName') + '"添加监理意见，内容为:' + textarea.getValue();
			    										// send SMS
			    										Ext.Ajax.request({
			    											url: './libs/user.php?action=getuserphone',
			    											method: 'GET',
			    											params: {
			    												name: pro.get('captainName')
			    											},
			    											callback: function (opts, success, res){
			    												if (success) {
			    													var obj = Ext.decode(res.responseText);
			    													if ('successful' == obj.status) {
			    														sendSMS(User.getName(), pro.get('captainName'), obj['phone'], content);
			    													}
			    												}
			    											}
			    										});
			    										// send Email
			    										Ext.Ajax.request({
			    											url: './libs/user.php?action=view',
			    											method: 'GET',
			    											callback: function (opts, success, res){
			    												if (success) {
			    													var arr = Ext.decode(res.responseText);
			    													for (var i = arr.length - 1; i >= 0; i--) {
			    														var el = arr[i];
			    														if (el.level == '001-001' || el.level == '001-002'
			    															|| el.level == '003-001' || el.name == pro.get('captainName')) {
			    															sendMail(el.name, el.mail, title, content);
			    														}
			    													}
			    												}
			    											}
			    										});
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
		    		// }
		    	},
				afterrender: function(grid, opts) {
					var view = grid.getView();
					var tip = Ext.create('Ext.tip.ToolTip', {
						target: view.el,
						delegate: view.cellSelector,
						trackMouse: true,
						renderTo: Ext.getBody(),
						listeners: {
							beforeshow: function(tip) {
								var gridColumns = view.getGridColumns();
								if (tip.triggerElement.cellIndex == 1 && (User.isAdmin() || User.isSupervisor())) {
									tip.update('请点击栏目，编辑监理意见');
								}
								else {
									return false;
								}
							}
						}
					});
				}
		    }
		}];

		this.callParent();
	}
});