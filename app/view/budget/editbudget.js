Ext.define('FamilyDecoration.view.budget.EditBudget', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.budget-editbudget',
	requires: ['FamilyDecoration.store.BudgetItem'],

	budget: undefined,
	header: false,

	initComponent: function (){
		var me = this;

		var store = Ext.create('FamilyDecoration.store.BudgetItem', {
			
		});

		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			items: [{
				width: 80,
				height: 60,
				xtype: 'image',
				src: './resources/img/logo.jpg'
			}, {
				xtype: 'displayfield',
				margin: '0 0 0 20',
				value: '<center>佳诚装饰室内装修装饰工程&nbsp;预算单</center>',
				fieldStyle: {
					fontFamily: '黑体',
					fontSize: '24px',
					lineHeight: '60px'
				},
				width: '100%',
				height: '100%'
			}],
			width: '100%',
			height: 60
		}, {
			xtype: 'fieldcontainer',
			layout: {
				type: 'hbox',
				pack: 'end'
			},
			items: [{
				xtype: 'displayfield',
				fieldLabel: '客户名称',
				name: 'displayfield-custName',
				flex: 1,
				value: me.budget ? me.budget.custName : ''
			}, {
				xtype: 'displayfield',
				fieldLabel: '工程地址',
				name: 'displayfield-projectName',
				flex: 1,
				value: me.budget ? me.budget.projectName : ''
			}],
			width: '100%'
        }, {
        	xtype: 'gridpanel',
        	store: store,
        	columns: [
        		{
        			text: '编号',
        			dataIndex: 'itemCode',
        			flex: 0.5,
        			draggable: false,
        			align: 'center',
        			sortable: false,
        			renderer: function (val, index, rec){
        				return (rec.get('itemCode') == 'NULL') ? '' : val;
        			}
        		},
        		{
        			text: '项目名称',
        			dataIndex: 'itemName',
        			flex: 1,
        			draggable: false,
        			align: 'center',
        			sortable: false
        		},
        		{
        			text: '单位',
        			dataIndex: 'itemUnit',
        			flex: 0.5,
        			draggable: false,
        			align: 'center',
        			sortable: false,
        			renderer: function (val, index, rec){
        				return (rec.get('itemUnit') == 'NULL') ? '' : val;
        			}
        		},
        		{
        			text: '数量',
        			dataIndex: 'itemAmount',
        			flex: 0.5,
        			draggable: false,
        			align: 'center',
        			sortable: false,
        			renderer: function (val, index, rec){
        				if (
        					(rec.get('itemCode') != '' && 'NS'.indexOf(rec.get('itemCode')) != -1)
        					|| (rec.get('itemUnit') == 'NULL')
        				) {
        					return '';
        				}
        				else {
        					return val;
        				}
        			}
        		}, 
        		{
        			text: '主材',
        			draggable: false,
        			align: 'center',
        			columns: [
        				{
        					text: '单价',
        					dataIndex: 'mainMaterialPrice',
        					draggable: false,
        					flex: 1,
        					sortable: false,
        					align: 'center',
        					renderer: function (val, index, rec){
        						if (
        							(rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1)
        							|| (rec.get('itemUnit') == 'NULL')
        						) {
        							return '';
        						}
        						else {
        							return val;
        						}
        					}
        				},
        				{
        					text: '总价',
							flex: 1,
							draggable: false,
							align: 'center',
							sortable: false,
							dataIndex: 'mainMaterialTotalPrice',
							renderer: function(val, index, rec, row, col, st) {
								return val;
							}
        				}
        			]
        		},
        		{
        			text: '辅材',
        			draggable: false,
        			align: 'center',
        			columns: [
        				{
        					text: '单价',
        					dataIndex: 'auxiliaryMaterialPrice',
        					draggable: false,
        					flex: 1,
        					sortable: false,
        					align: 'center',
        					renderer: function (val, index, rec){
        						if (
        							(rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1)
        							|| (rec.get('itemUnit') == 'NULL')
        						) {
        							return '';
        						}
        						else {
        							return val;
        						}
        					}
        				},
        				{
        					text: '总价',
							flex: 1,
							draggable: false,
							align: 'center',
							sortable: false,
							dataIndex: 'auxiliaryMaterialTotalPrice',
							renderer: function(val, index, rec, row, col, st) {
								return val;
							}
        				}
        			]
        		},
        		{
        			text: '人工',
        			draggable: false,
        			align: 'center',
        			columns: [
        				{
        					text: '单价',
        					dataIndex: 'manpowerPrice',
        					draggable: false,
        					flex: 1,
        					sortable: false,
        					align: 'center',
        					renderer: function (val, index, rec){
        						if (
        							(rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1)
        							|| (rec.get('itemUnit') == 'NULL')
        						) {
        							return '';
        						}
        						else {
        							return val;
        						}
        					}
        				},
        				{
        					text: '总价',
							flex: 1,
							draggable: false,
							align: 'center',
							sortable: false,
							dataIndex: 'manpowerTotalPrice',
							renderer: function(val, index, rec, row, col, st) {
								return val;
							}
        				}
        			]
        		},
        		{
        			text: '机械',
        			draggable: false,
        			align: 'center',
        			columns: [
        				{
        					text: '单价',
        					dataIndex: 'machineryPrice',
        					draggable: false,
        					flex: 1,
        					sortable: false,
        					align: 'center',
        					renderer: function (val, index, rec){
        						if (
        							(rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1)
        							|| (rec.get('itemUnit') == 'NULL')
        						) {
        							return '';
        						}
        						else {
        							return val;
        						}
        					}
        				},
        				{
        					text: '总价',
							flex: 1,
							draggable: false,
							align: 'center',
							sortable: false,
							dataIndex: 'machineryTotalPrice',
							renderer: function(val, index, rec, row, col, st) {
								return val;
							}
        				}
        			]
        		},
        		{
        			text: '损耗',
        			draggable: false,
        			align: 'center',
        			columns: [
        				{
        					text: '单价',
        					dataIndex: 'lossPercent',
        					draggable: false,
        					flex: 1,
        					sortable: false,
        					align: 'center',
        					renderer: function (val, index, rec){
        						if (
        							(rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1)
        							|| (rec.get('itemUnit') == 'NULL')
        						) {
        							return '';
        						}
        						else {
        							return val;
        						}
        					}
        				}
        			]
        		},
        		{
        			text: '备注',
        			align: 'center',
        			dataIndex: 'remark',
        			flex: 1,
        			draggable: false,
        			sortable: false,
        			renderer: function (val, index, rec){
        				if (
							(rec.get('itemCode') != '' && 'NOPQRS'.indexOf(rec.get('itemCode')) != -1)
							|| (rec.get('remark') == 'NULL')
						) {
							return '';
						}
						else {
							return val;
						}
        			}
        		}
        	],
        	listeners: {
        		afterrender: function (grid, opts){
        			var st = grid.getStore();
        			Ext.apply(st.getProxy().extraParams, {
        				budgetId: me.budget.budgetId
        			});
        			st.load();
        		}
        	}
        }];

        me.callParent();
	}
})