Ext.define('FamilyDecoration.view.budget.AddExistedItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-addexisteditem',
	requires: ['FamilyDecoration.store.BasicSubItem', 'Ext.ux.form.SearchField'],
	resizable: false,
	modal: true,

	title: '添加到已有大项',
	width: 560,
	height: 420,
	layout: 'fit',
	padding: 2,

	grid: null, // 预算表格
	budgetId: undefined, // 预算id
	bigItem: undefined, // 添加到此大项下
	smallItem: undefined, // 添加到对应小项上方

	initComponent: function () {
		var me = this;

		me.buttons = [{
			text: '添加',
			handler: function (){
				var subGrid = me.items.items[0],
					subSt = subGrid.getStore(),
					subRecs = subGrid.getSelectionModel().getSelection(),
					grid = me.grid,
					data = [];

				if (subRecs.length > 0) {
					for (var i = 0; i < subRecs.length; i++) {
						var dataObj = {
							itemName: subRecs[i].get('subItemName'),
							itemCode: me.bigItem ? me.bigItem.get('itemCode') : me.smallItem.get('itemCode'),
							budgetId: me.budgetId,
							basicSubItemId: subRecs[i].getId(),
							itemUnit: subRecs[i].get('subItemUnit'),
							mainMaterialPrice: subRecs[i].get('mainMaterialPrice'),
							auxiliaryMaterialPrice: subRecs[i].get('auxiliaryMaterialPrice'),
							manpowerPrice: subRecs[i].get('manpowerPrice'),
							machineryPrice: subRecs[i].get('machineryPrice'),
							lossPercent: subRecs[i].get('lossPercent'),
							remark: subRecs[i].get('remark'),
							manpowerCost: subRecs[i].get('manpowerCost'),
							mainMaterialCost: subRecs[i].get('mainMaterialCost'),
							workCategory: subRecs[i].get('workCategory')
						};
						if (me.bigItem) {
							data.push(dataObj);
						}
						else if (me.smallItem) {
							data.unshift(dataObj);
						}
					}
					var index = 0,
						errList = [],
						resend = 0,
						initialUrl;
					if (me.bigItem) {
						initialUrl = './libs/budget.php?action=addItem';
					}
					else if (me.smallItem) {
						initialUrl = './libs/budget.php?action=insertSmallItemBefore';
					}
					function add (url, index){
						var p = data[index];
						Ext.Ajax.request({
							url: url,
							method: 'POST',
							params: data[index],
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
									}
									else {
										errList.push(data[index]);
										showMsg(obj.errMsg);
									}
									if (index < data.length - 1) {
										add(url, ++index);
									}
									else {
										if (errList.length > 0) {
											if (resend < 4) {
												resend++;
												showMsg('网络原因，有若干项未能添加，补充添加中，请耐心等待。[第' + resend + '次重发。]');
												console.log(errList);
												data = errList;
												errList = [];
												add(url, 0);
											}
											else {
												showMsg('由于网络原因，已经重发' + resend + '次，还有若干项未能添加，请手动添加。建议切换至网络较好的地方进行操作');
												console.log(errList);
												me.grid.getStore().load({
													params: {
														budgetId: me.budgetId
													},
													callback: function (recs, ope, success) {
														if (success) {
															var index = me.grid.getStore().find('itemCode', obj.itemCode),
																rec = me.grid.getStore().getAt(index);
															me.grid.getView().focusRow(rec, 200);
															me.grid.getSelectionModel().select(rec);
														}
													}
												});
												me.close();
												var errWin = Ext.create('Ext.window.Window', {
													title: '未能添加项目列表',
													width: 300,
													height: 200,
													layout: 'fit',
													modal: true,
													items: [
														{
															xtype: 'gridpanel',
															autoScroll: true,
															store: Ext.create('FamilyDecoration.store.BudgetItem', {
																data: errList,
																autoLoad: false
															}),
															columns: [
																{
																	text: '名称',
																	dataIndex: 'itemName',
																	flex: 1
																}
															]
														}
													],
													buttons: [{
														text: '添加所有',
														handler: function (){
															data = errList;
															errList = [];
															add('./libs/budget.php?action=addItem', 0);
															errWin.close();
														}
													}, {
														text: '关闭',
														handler: function () {
															errWin.close();
														}
													}]
												});
												errWin.show();
											}
										}
										else {
											showMsg('添加新项完毕！');
											me.grid.getStore().load({
												params: {
													budgetId: me.budgetId
												},
												callback: function (recs, ope, success){
													if (success) {
														var index = me.grid.getStore().find('itemCode', obj.itemCode),
															rec = me.grid.getStore().getAt(index);
														me.grid.getView().focusRow(rec, 200);
														me.grid.getSelectionModel().select(rec);
													}
												}
											});
											me.close();
										}
									}
								}
							}
						})
					}
					add(initialUrl, 0);
				}
				else {
					showMsg('请选择项目！');
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];
		
		var bsiSt = Ext.create('FamilyDecoration.store.BasicSubItem', {
			proxy: {
				type: 'rest',
		    	url: './libs/subitem.php?action=getSortedItems',
		        reader: {
		            type: 'json'
		        },
		        extraParams: {
		        	parentId: me.bigItem ? me.bigItem.get('basicItemId') : me.smallItem.get('parentId')
		        }
			},
			autoLoad: true
		});

		me.items = [
			{
				xtype: 'gridpanel',
				title: '小类名称',
				header: false,
				autoScroll: true,
				selType: 'checkboxmodel',
				columns: [{
					text: '项目',
					dataIndex: 'subItemName',
					flex: 1
				}],
				dockedItems: [{
					dock: 'top',
					xtype: 'toolbar',
					items: [{
						xtype: 'searchfield',
						flex: 1,
						store: bsiSt,
						paramName: 'subItemName'
					}]
				}],
				selModel: {
					mode: 'SIMPLE',
					allowDeselect: true
				},
				store: bsiSt
			}
		]

		this.callParent();
	}
});