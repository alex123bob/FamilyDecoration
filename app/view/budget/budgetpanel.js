Ext.define('FamilyDecoration.view.budget.BudgetPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-budgetpanel',
	width: '100%',
	height: '100%',
	requires: ['Ext.form.FieldContainer', 'FamilyDecoration.store.BudgetItem', 'FamilyDecoration.view.budget.EditHeader',
			   'FamilyDecoration.view.budget.AddBasicItem'],

	title: '预算面板',
	header: false,

	// indicator: tells us if there is an budget existed in current panel
	budgetId: null,

	initBtn: function (){
		var panel = this,
			addNewBtn = panel.down('[name="button-addNewItem"]'),
			addSmallBtn = panel.down('[name="button-addSmallItemToBigItem"]');
		addNewBtn.show();
		addSmallBtn.show();
	},

	initBudgetHeader: function (custName, projectName){
		var panel = this,
			custNameField = panel.down('[name="displayfield-custName"]'),
			projectNameField = panel.down('[name="displayfield-projectName"]');
		custNameField.setValue(custName);
		projectNameField.setValue(projectName);
	},

	initComponent: function (){
		var me = this;

		me.tbar = [
			{
				text: '编辑预算头信息',
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
				text: '添加新项',
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
				text: '添加小项到已有大项',
				name: 'button-addSmallItemToBigItem',
				hidden: true,
				handler: function (){

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
				width: '100%'
			},
			{
				xtype: 'gridpanel',
				header: false,
				autoScroll: true,
				itemId: 'gridpanel-budgetContent',
				width: '100%',
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
			    ]
			}
		];

		me.callParent();
	}
});