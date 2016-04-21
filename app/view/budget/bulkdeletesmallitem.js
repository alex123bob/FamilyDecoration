Ext.define('FamilyDecoration.view.budget.BulkDeleteSmallItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-bulkdeletesmallitem',
	width: 550,
	height: 450,
	title: '批量删除小项',
	requires: [
		'FamilyDecoration.model.BudgetItem'
	],
	layout: 'fit',
	modal: true,
	budgetId: null,
	grid: null,

	initComponent: function (){
		var me = this;

		me.items = [
			{
				xtype: 'treepanel',
				id: 'treepanel-bulkDeleteSmallItems',
				name: 'treepanel-bulkDeleteSmallItems',
				rootVisible: false,
				store: Ext.create('Ext.data.TreeStore', {
					model: 'FamilyDecoration.model.BudgetItem',
					root: {
						expanded: true,
						text: 'Root'
					},
					proxy: {
						type: 'rest',
		                appendId: false,
		                url: './libs/budget.php',
		                extraParams: {
		                	action: 'getBudgetBigItems',
		                	budgetId: me.budgetId
		                },
		                reader: {
		                    type: 'json'
		                }
					},
					listeners: {
		            	beforeload: function (st, ope){
		            		var node = ope.node;
		            		if (node.get('basicItemId') && !node.get('basicSubItemId')) {
		            			st.proxy.url = './libs/budget.php';
		            			st.proxy.extraParams = {
		            				itemCode: node.get('itemCode'),
		            				budgetId: me.budgetId,
		            				action: 'getBudgetSmallItemsByBudgetIdAndItemCode'
		            			};
		            		}
		            	},
		            	beforeappend: function (pNode, node){
		            		if (!pNode) {
		            		}
		            		else {
		            			// big items
		            			if (node.get('basicItemId') && !node.get('basicSubItemId')) {
		            				node.set({
		            					text: node.get('itemCode') + ' ' + node.get('itemName'),
		            					leaf: false,
		            					icon: 'resources/img/folder.png',
		            					checked: false
		            				});
		            			}
		            			// small items
		            			else if (!node.get('basicItemId') && node.get('basicSubItemId')) {
		            				node.set({
		            					text: node.get('itemCode') + ' ' + node.get('itemName'),
		            					leaf: true,
		            					icon: 'resources/img/file.png',
		            					checked: pNode.get('checked')
		            				});
		            			}
		            		}
		            	},
		            	load: function (st, node, recs){
		            		
		            	}
		            }
				}),
				isCheckMode: true,
				listeners: {
					checkchange: function (node, checked, opts){
						node.cascadeBy(function(n) {
							n.set('checked', checked);
						});
						node.bubble(function (n){
							if (!n.isRoot() && n.get('basicItemId') && !n.get('basicSubItemId')) {
								var childNodes = n.childNodes;
								var isAllCheck = true;
								for (var i = childNodes.length - 1; i >= 0; i--) {
									var el = childNodes[i];
									if (el.get('checked') == false) {
										isAllCheck = false;
										break;
									}
								}
								n.set('checked', isAllCheck);
							}
						});
					}
				}
			}
		];

		me.buttons = [{
			text: '删除',
			handler: function (){
				var treepanel = Ext.getCmp('treepanel-bulkDeleteSmallItems'),
					checkedItems = treepanel.getChecked();
				if (checkedItems.length > 0) {
					var deleteArr = [];
					for (var i = checkedItems.length - 1; i >= 0; i--) {
						var item = checkedItems[i];
						if (!item.get('basicItemId') && item.get('basicSubItemId')) {
							deleteArr.push(item.getId('budgetItemId'));
						}
					}
					if (deleteArr.length > 0) {
						Ext.Msg.warning('确定要删除选中小项吗？', function (btnId){
							if ('yes' == btnId) {
								Ext.Ajax.request({
									url: './libs/budget.php?action=bulkDeleteSmallItems',
									method: 'POST',
									params: {
										budgetItemIds: deleteArr.join('>>><<<')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('删除成功！');
												me.grid.getStore().load({
													params: {
														budgetId: me.budgetId
													}
												});
												me.close();
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						});
					}
					else {
						showMsg('没有选中小项！');
					}
				}
				else{
					showMsg('请选择需要删除的小项！');
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		me.callParent();
	}
});