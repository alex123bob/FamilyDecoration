Ext.define('FamilyDecoration.view.budget.HistoryBudget', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-historybudget',

	resizable: false,
	modal: true,
	layout: 'fit',

	requires: ['FamilyDecoration.store.Budget'],

	title: '历史预算列表',
	width: 400,
	height: 300,
	budgetPanel: null,

	initComponent: function (){
		var me = this;

		me.buttons = [{
			text: '加载预算',
			handler: function (){
				var grid = me.down('gridpanel'),
					rec = grid.getSelectionModel().getSelection()[0];
				if (rec) {
					me.budgetPanel.loadBudget(rec.data);
					me.close();
				}
				else {
					showMsg('请选择预算！');
				}
			}
		}, {
			text: '关闭',
			handler: function (){
				me.close();
			}
		}];

		me.items = [{
			header: false,
			xtype: 'gridpanel',
			columns: [{
				text: '工程地址',
				dataIndex: 'projectName',
				flex: 1
			}],
			store: Ext.create('FamilyDecoration.store.Budget', {
				autoLoad: true
			})
		}];

		this.callParent();
	}
});