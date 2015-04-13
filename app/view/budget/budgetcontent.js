Ext.define('FamilyDecoration.view.budget.BudgetContent', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-budgetcontent',
	requires: ['Ext.form.FieldContainer', 'FamilyDecoration.model.BudgetItem', 'FamilyDecoration.store.BudgetItem'],

	title: '预算实体',
	header: false,
	autoScroll: true,
	isForPreview: false,

	initComponent: function (){
		var me = this;

		// clean all data in this budget table
		me.clean = function (){
			var panel = this,
				custName = panel.down('[name="displayfield-custName"]'),
				projectName = panel.down('[name="displayfield-projectName"]'),
				grid = panel.down('gridpanel'),
				st = grid.getStore();
			custName.setValue('');
			projectName.setValue('');
			st.removeAll();
		}

		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'hbox',
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
					width: 700,
					height: '100%'
				}
			],
			width: '100%',
			height: 60
		}, {
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
		}, {
			autoScroll: true,
			header: false,
			xtype: 'gridpanel',
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
			store: Ext.create('FamilyDecoration.store.BudgetItem', {

			}),
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
                	renderer: function (val, meta, rec){
                		if (rec.get('itemCode') != '' && 'POR'.indexOf(rec.get('itemCode')) != -1) {
        					return val;
        				}
                		else if (!rec.get('parentId') || !rec.get('itemUnit')) {
        					return '';
        				}
        				else {
        					return val;
        				}
                	},
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
                			menuDisabled: true,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			// flex: 0.5,
		        			width: 48,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			menuDisabled: true,
                			dataIndex: 'mainMaterialTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
                					return val;
                				}
                				else if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
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
                			menuDisabled: true,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			// flex: 0.5,
		        			width: 48,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			menuDisabled: true,
                			dataIndex: 'auxiliaryMaterialTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
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
                			menuDisabled: true,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			// flex: 0.5,
		        			width: 48,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			menuDisabled: true,
                			dataIndex: 'manpowerTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
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
                			menuDisabled: true,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
		        		},
		        		{
		        			text: '总价',
		        			// flex: 0.5,
		        			width: 48,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			menuDisabled: true,
                			dataIndex: 'machineryTotalPrice',
                			renderer: function (val, meta, rec) {
                				if (!rec.get('parentId')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
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
		        			width: 48,
                			draggable: false,
                			align: 'center',
                			sortable: false,
                			menuDisabled: true,
                			renderer: function (val, meta, rec){
                				if (!rec.get('parentId') || !rec.get('itemUnit')) {
                					return '';
                				}
                				else {
                					return val;
                				}
                			}
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
                	menuDisabled: true,
		        	renderer: function (val, meta, rec){
		        		if (!rec.get('parentId') || !rec.get('itemUnit')) {
        					return '';
        				}
        				else {
        					return val.replace(/\n/g, '<br />');
        				}
		        	}
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
		        			flex: 0.5,
		        			draggable: false,
		        			align: 'center',
		        			sortable: false,
		        			menuDisabled: true,
		        			renderer: function (val, meta, rec){
		        				if (!rec.get('parentId') || !rec.get('itemUnit') || 'NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
		        					return '';
		        				}
		        				else {
		        					return val;
		        				}

		        			}
		        		},
		        		{
		        			text: '主材',
		        			dataIndex: 'mainMaterialCost',
		        			flex: 0.5,
		        			draggable: false,
		        			align: 'center',
		        			sortable: false,
		        			menuDisabled: true,
		        			renderer: function (val, meta, rec){
		        				if (!rec.get('parentId') || !rec.get('itemUnit') || 'NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
		        					return '';
		        				}
		        				else {
		        					return val;
		        				}

		        			}

		        		}
		        	]
		        }
		    ],
		    listeners: {
		    	beforeitemcontextmenu: function (view, rec, item, index, e) {
		    	},
		    	afterrender: function (grid, opts) {
					var view = grid.getView();
					var tip = Ext.create('Ext.tip.ToolTip', {
					    target: view.el,
					    delegate: view.cellSelector,
					    trackMouse: true,
					    renderTo: Ext.getBody(),
					    listeners: {
					        beforeshow: function (tip) {
					        	var gridColumns = view.getGridColumns();
					        	var column = gridColumns[tip.triggerElement.cellIndex];
				                var val=view.getRecord(tip.triggerElement.parentNode).get(column.dataIndex);
				                if (val) {
				                	val.replace && (val = val.replace(/\n/g, '<br />'));
				                	tip.update(val);
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
})