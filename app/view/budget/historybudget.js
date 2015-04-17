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
			hideHeaders: true,
			columns: [
				{
					text: '工程地址',
					dataIndex: 'projectName',
					flex: 1
				},
				{
		            xtype:'actioncolumn',
		            width: 50,
		            items: [
			            {
			                icon: './resources/img/trash_can_delete.ico',  // Use a URL in the icon config
			                tooltip: '删除选中预算',
			                handler: function(grid, rowIndex, colIndex) {
			                    var rec = grid.getStore().getAt(rowIndex);
			                    if (rec) {
			                    	Ext.Msg.warning('确定要删除当前选中预算吗？', function (btnId){
			                    		if (btnId == 'yes') {
			                    			if (rec.getId() == me.budgetPanel.budgetId) {
						                    	showMsg('该预算正在编辑中，无法删除！');
						                    }
						                    else {
						                    	Ext.Ajax.request({
						                    		url: './libs/budget.php?action=delete',
						                    		method: 'POST',
						                    		params: {
						                    			budgetId: rec.getId()
						                    		},
						                    		callback: function (opts, success, res){
						                    			if (success) {
						                    				var obj = Ext.decode(res.responseText);
						                    				if (obj.status == 'successful') {
						                    					showMsg('删除成功！');
						                    					grid.getStore().load();
						                    				}
						                    				else {
						                    					showMsg(obj.errMsg);
						                    				}
						                    			}
						                    		}
							                    });
						                    }
			                    		}
			                    	});
			                    }
			                    else {
			                    	showMsg('请选择预算！');
			                    }
			                }
			            }
		            ]
		        }
			],
			store: Ext.create('FamilyDecoration.store.Budget', {
				autoLoad: true
			})
		}];

		this.callParent();
	}
});