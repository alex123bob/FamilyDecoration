Ext.define('FamilyDecoration.view.basicitem.SubItemTable', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.basicitem-subitemtable',

	title: '小类项目',
	width: 500,
	height: 300,
	autoScroll: true,

	initComponent: function (){
		var me = this;

		me.columns = [
			{
	        	text: '编号',
	        	dataIndex: 'subItemId',
	        	flex: 0.5,
            	draggable: false,
            	align: 'center'
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
	        	dataIndex: 'cost',
	        	flex: 1,
            	draggable: false,
            	align: 'center',
            	editor: {
            		xtype: 'textfield',
            		allowBlank: false
            	}
	        },
		];

		this.callParent();
	}
});