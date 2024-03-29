Ext.define('FamilyDecoration.view.basicitem.SubItemTable', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.basicitem-subitemtable',
	requires: ['FamilyDecoration.store.WorkCategory'],

	title: '小类项目',
	width: 500,
	height: 300,
	autoScroll: true,
	listView: false,

	initComponent: function (){
		var me = this;

		me.columns = [
			{
	        	text: '编号',
	        	dataIndex: 'subItemId',
	        	flex: 0.5,
            	draggable: false,
            	align: 'center',
            	hidden: me.listView ? true : false
	        },
	        {
	        	text: '项目名称',
	        	dataIndex: 'subItemName',
	        	flex: 1,
            	draggable: false,
            	align: 'center',
            	editor: {
            		xtype: 'textfield',
            		allowBlank: false
            	}
	        },
	        {
	        	text: '单位', 
	        	dataIndex: 'subItemUnit',
	        	flex: 0.5,
            	draggable: false,
            	align: 'center',
            	editor: {
            		xtype: 'textfield',
            		allowBlank: false
            	}
	        },
	        {
	        	text: '数量',
	        	flex: 0.5, 
            	draggable: false,
            	align: 'center',
            	disabled: true,
            	hidden: me.listView ? true : false,
            	renderer: function (){
            		return '';
            	}
	        },
	        {
	        	text: '主材',
	        	columns: [
	        		{
	        			text: '单价',
	        			dataIndex: 'mainMaterialPrice',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
		            	editor: {
		            		xtype: 'textfield',
		            		allowBlank: false
		            	}
	        		},
	        		{
	        			text: '总价',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
            			disabled: true,
            			hidden: me.listView ? true : false,
            			renderer: function (){
            				return '';
            			}
	        		}
	        	],
            	draggable: false,
            	align: 'center'
	        },
	        {
	        	text: '辅材', 
	        	columns: [
	        		{
	        			text: '单价',
	        			dataIndex: 'auxiliaryMaterialPrice',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
		            	editor: {
		            		xtype: 'textfield',
		            		allowBlank: false
		            	}
	        		},
	        		{
	        			text: '总价',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
            			disabled: true,
            			hidden: me.listView ? true : false,
            			renderer: function (){
            				return '';
            			}
	        		}
	        	],
            	draggable: false,
            	align: 'center'
	        },
	        {
	        	text: '人工', 
	        	columns: [
	        		{
	        			text: '单价',
	        			dataIndex: 'manpowerPrice',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
		            	editor: {
		            		xtype: 'textfield',
		            		allowBlank: false
		            	}
	        		},
	        		{
	        			text: '总价',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
            			disabled: true,
            			hidden: me.listView ? true : false,
            			renderer: function (){
            				return '';
            			}
	        		}
	        	],
            	draggable: false,
            	align: 'center'
	        },
	        {
	        	text: '机械', 
	        	columns: [
	        		{
	        			text: '单价',
	        			dataIndex: 'machineryPrice',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
		            	editor: {
		            		xtype: 'textfield',
		            		allowBlank: false
		            	}
	        		},
	        		{
	        			text: '总价',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
            			disabled: true,
            			hidden: me.listView ? true : false,
            			renderer: function (){
            				return '';
            			}
	        		}
	        	],
            	draggable: false,
            	align: 'center'
	        },
	        {
	        	text: '损耗', 
	        	columns: [
	        		{
	        			text: '百分比',
	        			dataIndex: 'lossPercent',
	        			flex: 0.5,
            			draggable: false,
            			align: 'center',
		            	editor: {
		            		xtype: 'textfield',
		            		allowBlank: false
		            	},
            			renderer: function (val){
            				return val.mul(100) + '%';
            			}
	        		}
	        	],
            	draggable: false,
            	align: 'center'
	        },
	        {
	        	text: '成本',
	        	hidden: User.isBudgetStaff() ? true : false,
	        	columns: [
	        		{
	        			text: '人工',
	        			dataIndex: 'manpowerCost',
	        			flex: 0.5,
	        			draggable: false,
	        			align: 'center',
	        			editor: {
	        				xtype: 'textfield',
	        				allowBlank: false
	        			}
	        		},
	        		{
	        			text: '主材',
	        			dataIndex: 'mainMaterialCost',
	        			flex: 0.5,
	        			draggable: false,
	        			align: 'center',
	        			editor: {
	        				xtype: 'textfield',
	        				allowBlank: false
	        			}
	        		}
	        	]
	        },
	        {
	        	text: '备注',
	        	dataIndex: 'remark',
	        	flex: 2,
	        	draggable: false,
	        	align: 'center',
	        	editor: {
	        		xtype: 'textarea',
	        		allowBlank: false
	        	},
	        	renderer: function (val, meta, rec){
    				return val.replace(/\n/g, '<br />');
	        	}
	        },
	        {
	        	text: '工种',
	        	dataIndex: 'workCategory',
	        	flex: 1,
	        	draggable: false,
	        	align: 'center',
	        	renderer: function (val){
	        		if (val) {
	        			return FamilyDecoration.store.WorkCategory.renderer(val);
	        		}
	        		else {
	        			return '';
	        		}
	        	},
	        	editor: {
	        		xtype: 'combobox',
	        		queryMode: 'local',
	        		displayField: 'name',
	        		valueField: 'value',
	        		editable: false,
	        		store: FamilyDecoration.store.WorkCategory
	        	}
	        }
		];

		me.on('afterrender', function(grid, opts) {
	          var view = grid.getView();
	          var tip = Ext.create('Ext.tip.ToolTip', {
	                target: view.el,
	                delegate: view.cellSelector,
	                trackMouse: true,
	                renderTo: Ext.getBody(),
	                listeners: {
	                      beforeshow: function(tip) {
	                            var gridColumns = view.getGridColumns();
	                            var column = gridColumns[tip.triggerElement.cellIndex];
	                            var val = view.getRecord(tip.triggerElement.parentNode).get(column.dataIndex);
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
	    });

		this.callParent();
	}
});