Ext.define('FamilyDecoration.view.costanalysis.TotalCost', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.costanalysis-totalcost',

	title: '总成本',

	initComponent: function (){
		var me = this;

		me.columns = [
			{
				text: '编号',
				dataIndex: 'itemCode',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.5,
				sortable: false
			},
			{
				text: '名称',
				dataIndex: 'projectName',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.8,
				sortable: false
			},
			{
				text: '单位',
				dataIndex: 'projectName',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.5,
				sortable: false
			},
			{
				text: '数量',
				dataIndex: 'projectName',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.5,
				sortable: false
			},
			{
				text: '成本',
	        	menuDisabled: true,
	        	columns: [
	        		{
	        			text: '人工',
	        			dataIndex: 'manpowerCost',
	        			width: 60,
            			draggable: false,
            			align: 'center',
            			sortable: false,
            			menuDisabled: true
	        		},
	        		{
	        			text: '材料',
	        			width: 59,
            			draggable: false,
            			align: 'center',
            			sortable: false,
            			menuDisabled: true,
            			dataIndex: 'mainMaterialCost'
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
	        			text: '总价',
	        			dataIndex: 'manpowerTotalCost',
	        			width: 60,
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
				text: '材料',
	        	menuDisabled: true,
	        	columns: [
	        		{
	        			text: '总价',
	        			dataIndex: 'mainMaterialTotalCost',
	        			width: 60,
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
				text: '工种',
				dataIndex: 'workCategory',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.5,
				sortable: false
			}
		];

		me.callParent();
	}
});