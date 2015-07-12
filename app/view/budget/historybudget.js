Ext.define('FamilyDecoration.view.budget.HistoryBudget', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-historybudget',

	// resizable: false,
	modal: true,
	layout: 'fit',

	requires: ['FamilyDecoration.store.Budget'],

	title: '历史预算列表',
	width: 600,
	height: 400,
	budgetPanel: null,

	initComponent: function (){
		var me = this,
			budgetSt = Ext.create('FamilyDecoration.store.Budget', {
				autoLoad: true
			});

		me.buttons = [{
			text: '加载预算',
			handler: function (){
				var grid = me.down('gridpanel'),
					rec = grid.getSelectionModel().getSelection()[0];
				if (rec) {
					if (rec.getId() == me.budgetPanel.budgetId) {
						showMsg('该预算已经被加载！');
					}
					else {
						if (rec.get('businessId')) {
							rec.set('projectOrBusinessName', rec.get('businessRegion') + ' ' + rec.get('businessAddress'));
						}
						else if (rec.get('projectId')) {
							rec.set('projectOrBusinessName', rec.get('projectName'));
						}
						me.budgetPanel.loadBudget(rec.data);
						me.close();
					}
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
			// hideHeaders: true,
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				items: [{
					xtype: 'searchfield',
					flex: 1,
					store: budgetSt,
					paramName: 'projectName',
					emptyText: '根据工程名称搜索'
				}]
			}],
			columns: [
				{
					text: '工程地址',
					dataIndex: 'projectName',
					flex: 1
				},
				{
					text: '业务地址',
					dataIndex: 'businessAddress',
					flex: 1,
					renderer: function (val, meta, rec){
						if (rec.get('businessId')) {
							return rec.get('businessRegion') + ' ' + val;
						}
						else {
							return '';
						}
					}
				},
				{
					text: '预算名称',
					dataIndex: 'budgetName',
					flex: 1
				},
				{
		            xtype:'actioncolumn',
		            text: '删除',
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
			store: budgetSt
		}];

		this.callParent();
	}
});