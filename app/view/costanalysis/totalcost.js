Ext.define('FamilyDecoration.view.costanalysis.TotalCost', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.costanalysis-totalcost',

	requires: ['FamilyDecoration.store.TotalCost'],

	title: '总成本',

	refresh: function (){
		var me = this,
			st = me.getStore();
		st.load();
	},

	initComponent: function (){
		var me = this;

		function columnRenderer (val, meta, rec, rowIndex, colIndex, st, view){
			// 小项
			if (rec.get('basicSubItemId') && !rec.get('basicItemId')) {
				switch (colIndex) {
					// 工种
					case 8:
					val = FamilyDecoration.store.WorkCategory.renderer(val);
					break;
				}
				return val;
			}
			// 大项
			else if (!rec.get('basicSubItemId') && rec.get('basicItemId')) {
				return '';
			}
			// 小计
			else if (!rec.get('basicItemId') && !rec.get('basicSubItemId') && rec.get('itemCode') == '') {
				switch (colIndex) {
					// 数量
					case 3:
					// 人工成本单价
					case 4:
					// 材料成本单价
					case 5:
					// 工种
					case 8:
					val = '';
					break;
				}
				return val;
			}
			else {
				return '';
			}
		}

		me.store = Ext.create('FamilyDecoration.store.TotalCost', {
			autoLoad: false
		});

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
				dataIndex: 'itemName',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.8,
				sortable: false
			},
			{
				text: '单位',
				dataIndex: 'itemUnit',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.5,
				sortable: false
			},
			{
				text: '数量',
				dataIndex: 'itemAmount',
				menuDisabled: true,
				align: 'center',
				draggable: false,
				flex: 0.5,
				sortable: false,
				renderer: columnRenderer
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
            			menuDisabled: true,
						renderer: columnRenderer
	        		},
	        		{
	        			text: '材料',
	        			width: 59,
            			draggable: false,
            			align: 'center',
            			sortable: false,
            			menuDisabled: true,
            			dataIndex: 'mainMaterialCost',
						renderer: columnRenderer
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
            			menuDisabled: true,
						renderer: columnRenderer
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
            			menuDisabled: true,
						renderer: columnRenderer
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
				sortable: false,
				renderer: columnRenderer
			}
		];

		me.callParent();
	}
});