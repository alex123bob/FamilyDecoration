Ext.define('FamilyDecoration.view.progress.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.progress-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel',
		'FamilyDecoration.view.progress.EditProgress', 'FamilyDecoration.view.progress.ProjectList',
		'FamilyDecoration.view.budget.EditBudget'
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
					id: 'tool-frozeProject',
					name: 'tool-frozeProject',
					tooltip: '封存当前项目',
					callback: function (){
						var panel = Ext.getCmp('treepanel-projectName');
						var pro = panel.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要封存项目"' + pro.get('projectName') + '"吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/editproject.php',
									method: 'POST',
									params: {
										projectId: pro.get('projectId'),
										isFrozen: 1
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText),
												frozenPanel = Ext.getCmp('treepanel-frozenProject'),
												st = frozenPanel.getStore();
											if (obj.status == 'successful') {
												showMsg('封存成功！');
												Ext.getCmp('treepanel-projectName').getStore().load({
													node: pro.parentNode.parentNode
												});
												st.proxy.url = './libs/getprojectyears.php';
												st.proxy.extraParams = {};
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
					text: '添加',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.progress.EditProject', {

						});
						win.show();
					}
				}, {
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
					text: '删除',
					disabled: true,
					id: 'button-deleteProject',
					name: 'button-deleteProject',
					handler: function (){
						var panel = Ext.getCmp('treepanel-projectName');
						var pro = panel.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要删除项目"' + pro.get('projectName') + '"吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/delproject.php',
									method: 'POST',
									params: {
										projectId: pro.get('projectId'),
										budgetId: pro.get('budgetId')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												Ext.getCmp('treepanel-projectName').getStore().load({
													node: pro.parentNode.parentNode
												});
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
						if (rec.get('projectName')) {
							Ext.getCmp('gridpanel-projectProgress').refresh(rec);
						}
						else {
							return false;
						}
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							delProjectBtn = Ext.getCmp('button-deleteProject'),
							editProjectBtn = Ext.getCmp('button-editProject'),
							addProgressBtn = Ext.getCmp('button-addProgress'),
							showChartBtn = Ext.getCmp('button-showProjectChart'),
							showBudgetBtn = Ext.getCmp('button-showBudget'),
							frozeProjectBtn = Ext.getCmp('tool-frozeProject');
						if (!rec) {
							delProjectBtn.disable();
							editProjectBtn.disable();
							addProgressBtn.disable();
							showChartBtn.disable();
							showBudgetBtn.disable();
							frozeProjectBtn.disable();
						}
						else {
							delProjectBtn.setDisabled(!rec.get('projectName'));
							editProjectBtn.setDisabled(!rec.get('projectName'));
							addProgressBtn.setDisabled(!rec.get('projectName'));
							frozeProjectBtn.setDisabled(!rec.get('projectName'));
							if (rec.get('projectName') && rec.get('projectChart') != '') {
								showChartBtn.enable();
							}
							else {
								showChartBtn.disable();
							}
							showBudgetBtn.setDisabled(!rec.get('projectName'));
						}
					}
				}
			}, {
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
									url: './libs/editproject.php',
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
												st.proxy.url = './libs/getprojectyears.php';
												st.proxy.extraParams = {};
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
				var splitFlag = '<>',
					grid = this;
				if (rec) {
					var progress = rec.get('projectProgress').split(splitFlag),
						projectId = rec.getId();
					Ext.each(progress, function (val, i, pro){
						pro[i] = {
							projectProgress: val,
							progressId: projectId + '-' + i
						};
					});
					grid.getStore().loadData(progress);
				}
				else {
					grid.getStore().loadData([]);
				}
			},
			initBtn: function (){
				var editBtn = Ext.getCmp('button-addProgress'),
					delBtn = Ext.getCmp('button-deleteProgress'),
					chartBtn = Ext.getCmp('button-showProjectChart'),
					budgetBtn = Ext.getCmp('button-showBudget');

				editBtn.disable();
				delBtn.disable();
				chartBtn.disable();
				budgetBtn.disable();
			},
			tbar: [{
				text: '修改',
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
				text: '删除',
				id: 'button-deleteProgress',
				name: 'button-deleteProgress',
				disabled: true,
				handler: function (){
					var progressPanel = Ext.getCmp('gridpanel-projectProgress'),
						proPanel = Ext.getCmp('treepanel-projectName'),
						project = proPanel.getSelectionModel().getSelection()[0],
						rec = progressPanel.getSelectionModel().getSelection()[0],
						arr = progressPanel.getStore().data.items,
						splitFlag = '<>',
						str = '', params;
					if (rec) {
						Ext.Msg.warning('确定要删除当前这条进度吗？', function (btnId){
							if ('yes' == btnId) {
								for (var i = 0; i < arr.length; i++) {
									if (arr[i].raw.progressId != rec.raw.progressId) {
										str += arr[i].get('projectProgress') + splitFlag;
									}
								}
								str = str.slice(0, str.length - splitFlag.length);
								params = {
									projectProgress: str
								};
								Ext.apply(params, {
									projectId: project.getId()
								});
								Ext.Ajax.request({
									url: './libs/editproject.php',
									method: 'POST',
									params: params,
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												proPanel.getStore().load({
													node: project.parentNode,
													callback: function (recs, ope, success){
														if (success) {
															var node = ope.node;
															var pro = node.findChild('projectId', project.getId());
															proPanel.getSelectionModel().select(pro);
															progressPanel.refresh(pro);
														}
													}
												});
												
											}
										}
									}
								});
							}
						});
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
			}],
			hideHeaders: true,
			store: Ext.create('Ext.data.Store', {
				model: 'FamilyDecoration.model.Project',
				autoLoad: false
			}),
			columns: [
		        {text: '工程进度', dataIndex: 'projectProgress', flex: 1}
		    ],
		    listeners: {
		    	selectionchange: function (view, sels){
		    		var rec = sels[0],
		    			delBtn = Ext.getCmp('button-deleteProgress');
		    		delBtn.setDisabled(!rec);
		    	}
		    }
		}];

		this.callParent();
	}
});