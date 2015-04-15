Ext.define('FamilyDecoration.view.budget.BudgetPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-budgetpanel',
	width: '100%',
	height: '100%',
	layout: 'vbox',
	requires: ['Ext.form.FieldContainer', 'FamilyDecoration.store.BudgetItem', 'FamilyDecoration.view.budget.EditHeader',
			   'FamilyDecoration.view.budget.AddBasicItem', 'FamilyDecoration.view.budget.AddExistedItem',
			   'FamilyDecoration.view.budget.HistoryBudget'],

	title: '预算面板',
	header: false,

	// indicator: tells us if there is an budget existed in current panel
	budgetId: undefined,

	// obj: budgetId, custName, projectName
	loadBudget: function (obj){
		var cmp = this,
			custNameField = cmp.down('[name="displayfield-custName"]'),
			projectNameField = cmp.down('[name="displayfield-projectName"]');
		obj.custName && custNameField.setValue(obj.custName);
		obj.projectName && projectNameField.setValue(obj.projectName);
		cmp.initBtn();
		if (obj.budgetId) {
			cmp.budgetId = obj.budgetId;
			cmp.refresh();
		}
	},

	initBtn: function (rec){
		var panel = this,
			addNewBtn = panel.down('[name="button-addNewItem"]'),
			addSmallBtn = panel.down('[name="button-addSmallItemToBigItem"]'),
			delItemBtn = panel.down('[name="button-deleteItem"]');
		addNewBtn.isHidden() && addNewBtn.show();
		addSmallBtn.isHidden() && addSmallBtn.show();
		delItemBtn.isHidden() && delItemBtn.show();
		if (rec) {
			if (rec.get('basicItemId') && !rec.get('basicSubItemId')) {
    			addSmallBtn.enable();
    		}
    		else {
    			addSmallBtn.disable();
    		}
    		delItemBtn.enable();
		}
		else {
			addSmallBtn.disable();
			delItemBtn.disable();
		}
	},

	initialize: function (){
		var cmp = this,
			grid = cmp.getComponent('gridpanel-budgetContent'),
			st = grid.getStore(),
			custNameField = cmp.down('[name="displayfield-custName"]'),
			projectNameField = cmp.down('[name="displayfield-projectName"]'),
			addNewBtn = cmp.down('[name="button-addNewItem"]'),
			addSmallBtn = cmp.down('[name="button-addSmallItemToBigItem"]'),
			delItemBtn = cmp.down('[name="button-deleteItem"]');
		st.removeAll();
		cmp.budgetId = undefined;
		custNameField.setValue('');
		projectNameField.setValue('');
		addNewBtn.hide();
		addSmallBtn.hide();
		delItemBtn.hide();
	},

	refresh: function (){
		var panel = this,
			grid = panel.getComponent('gridpanel-budgetContent'),
			st = grid.getStore();
		st.load({
			params: {
				budgetId: panel.budgetId
			}
		});
	},

	initComponent: function (){
		var me = this;

		me.tbar = [
			{
				text: '预算头',
				tooltip: '新建或编辑预算头部信息',
				name: 'button-addBudget',
				handler: function (){
					if (me.budgetId) {
						Ext.Ajax.request({
							url: './libs/budget.php?action=view',
							method: 'GET',
							params: {
								budgetId: me.budgetId
							},
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									var win = Ext.create('FamilyDecoration.view.budget.EditHeader', {
										budgetPanel: me,
										budget: obj[0]
									});
									win.show();
								}
							}
						})
					}
					else {
						var win = Ext.create('FamilyDecoration.view.budget.EditHeader', {
							budgetPanel: me
						});
						win.show();
					}
				}
			},
			{
				text: '新项',
				tooltip: '添加新的基础大项',
				name: 'button-addNewItem',
				hidden: true,
				handler: function (){
					var win = Ext.create('FamilyDecoration.view.budget.AddBasicItem', {
						grid: me.getComponent('gridpanel-budgetContent'),
						budgetId: me.budgetId
					});

					win.show();
				}
			},
			{
				text: '补充',
				tooltip: '为已有大项添加小项',
				name: 'button-addSmallItemToBigItem',
				disabled: true,
				hidden: true,
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						rec = grid.getSelectionModel().getSelection()[0];
					if (rec) {
						if (rec.get('basicItemId') && !rec.get('basicSubItemId')) {
							var win = Ext.create('FamilyDecoration.view.budget.AddExistedItem', {
								grid: me.getComponent('gridpanel-budgetContent'),
								budgetId: me.budgetId,
								bigItem: rec
							});

							win.show();
						}
						else {
							showMsg('选择项不是大项！');
						}
					}
					else {
						showMsg('请选择大项！');
					}
				}
			},
			{
				text: '删除',
				tooltip: '删除预算项目',
				name: 'button-deleteItem',
				disabled: true,
				hidden: true,
				handler: function (){
					var grid = me.getComponent('gridpanel-budgetContent'),
						rec = grid.getSelectionModel().getSelection()[0];
					if (rec) {
						Ext.Msg.warning('确定要删除选中项目吗？', function (btnId){
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: 'libs/budget.php?action=delItem',
									method: 'POST',
									params: {
										budgetItemId: rec.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												me.refresh();
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						})
					}
					else {
						showMsg('请选择项目！');
					}
				}
			},
			{
				text: '历史',
				tooltip: '查看、加载历史预算',
				name: 'button-historyBudget',
				handler: function (){
					var win = Ext.create('FamilyDecoration.view.budget.HistoryBudget', {
						budgetPanel: me
					});
					win.show();
				}
			}
		];

		me.bbar = [
			{
				text: '初始化',
				tooltip: '清空当前预算信息，用于已经加载了预算情况后进行新建预算',
				name: 'button-initialize',
				handler: function (){
					me.initialize();
				}
			}
		];

		me.items = [
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				height: 60,
				items: [
					{
						width: 80,
						height: 60,
						xtype: 'image',
						margin: '0 0 0 250',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						value: '佳诚装饰室内装修装饰工程&nbsp;预算单',
						hideLabel: true,
						fieldStyle: {
							fontFamily: '黑体',
							fontSize: '24px',
							lineHeight: '60px'
						},
						width: 700
					}
				]
			},
			{
				xtype: 'fieldcontainer',
				layout: {
					type: 'hbox'
				},
				items: [{
					xtype: 'displayfield',
					fieldLabel: '客户名称',
					name: 'displayfield-custName',
					flex: 1
				}, {
					xtype: 'displayfield',
					fieldLabel: '工程地址',
					name: 'displayfield-projectName',
					flex: 1
				}],
				width: '100%',
				flex: 1
			},
			{
				xtype: 'gridpanel',
				header: false,
				autoScroll: true,
				itemId: 'gridpanel-budgetContent',
				width: '100%',
				flex: 15,
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            	beforeedit: function (editor, e) {
			            		var rec = e.record;
			            		if (e.field == 'itemAmount') {
									if (rec.get('parentId') && rec.get('itemUnit')) {
										return true;
									}
									// 效果图编辑数量
									else if (rec.get('itemCode') == 'P') {
										return true;
									}
									// 设计费百分比
									else if (rec.get('itemCode') == 'O') {
										return true;
									}
									// 税金百分比
									else if (rec.get('itemCode') == 'R') {
										return true;
									} else {
										return false;
									}
			            		}
			            		else if (e.field == 'remark') {
			            			if (rec.get('parentId') && rec.get('itemUnit')) {
			            				return true;
			            			}
			            			else {
			            				return false;
			            			}
			            		}
			            	},
			            	edit: function (editor, e){
			            		Ext.suspendLayouts();
			            		Ext.resumeLayouts();
			            	}
			            }
			        })
				],
				store: Ext.create('FamilyDecoration.store.BudgetItem'),
				columns: [
			        {
			        	text: '编号',
			        	dataIndex: 'itemCode',
			        	flex: 0.5,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true
			        },
			        {
			        	text: '项目名称',
			        	dataIndex: 'itemName',
			        	flex: 0.8,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true
			        },
			        {
			        	text: '单位', 
			        	dataIndex: 'itemUnit',
			        	flex: 0.5,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true
			        },
			        {
			        	text: '数量',
			        	flex: 0.5, 
			        	dataIndex: 'itemAmount',
	                	draggable: false,
	                	align: 'center',
	                	editor: me.isForPreview ? null : {
	                		xtype: 'textfield',
	                		allowBlank: false
	                	},
	                	sortable: false,
	                	menuDisabled: true
			        },
			        {
			        	text: '主材',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'mainMaterialPrice',
			        			// flex: 0.5,
			        			width: 49,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 48,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'mainMaterialTotalPrice'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '辅材',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'auxiliaryMaterialPrice',
			        			// flex: 0.5,
			        			width: 49,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 48,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'auxiliaryMaterialTotalPrice'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '人工',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'manpowerPrice',
			        			// flex: 0.5,
			        			width: 49,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 48,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'manpowerTotalPrice'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '机械',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'machineryPrice',
			        			// flex: 0.5,
			        			width: 49,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '总价',
			        			// flex: 0.5,
			        			width: 48,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'machineryTotalPrice'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '损耗',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '单价',
			        			dataIndex: 'lossPercent',
			        			// flex: 0.5,
			        			width: 49,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '备注',
			        	flex: 1.7,
			        	draggable: false,
			        	align: 'center',
			        	dataIndex: 'remark',
			        	sortable: false,
			        	editor: me.isForPreview ? null : {
	                		xtype: 'textarea'
	                	},
	                	menuDisabled: true
			        },
			        {
			        	text: '成本',
			        	hidden: User.isAdmin() ? false : true,
			        	draggable: false,
			        	align: 'center',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '人工',
			        			dataIndex: 'manpowerCost',
			        			width: 49,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true
			        		},
			        		{
			        			text: '主材',
			        			dataIndex: 'mainMaterialCost',
			        			width: 48,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true
			        		}
			        	]
			        }
			    ],
			    listeners: {
			    	selectionchange: function (cmp, sels, opts){
			    		var rec = sels[0];
			    		me.initBtn(rec);
			    	}
			    }
			}
		];

		me.callParent();
	}
});