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

	discount: 1, // 折扣

	initComponent: function () {
		var me = this;

		me.buttons = [{
			text: '折扣',
			handler: function (){
				var win = Ext.create('Ext.window.Window', {
					width: 300,
					height: 140,
					// layout: 'fit',
					title: '折扣价格',
					items: [{
						xtype: 'numberfield',
				        anchor: '100%',
				        name: 'numberfield-discount',
				        itemId: 'numberfield-discount',
				        fieldLabel: '请输入折扣',
				        value: me.discount.mul(100),
				        maxValue: 100,
				        minValue: 1,
				        afterSubTpl: '%'
					}],
					buttons: [{
						text: '确定',
						handler: function (){
							var discount = win.getComponent('numberfield-discount'),
								val = discount.getValue();
							me.discount = val.div(100);
							showMsg('折扣设置成功，当前折扣为' + val + '%');
							win.close();
						}
					}, {
						text: '取消',
						handler: function (){
							win.close();
						}
					}]
				});
				win.show();
			}
		}, {
			text: '添加',
			handler: function (){
				var subGrid = me.items.items[0],
					subSt = subGrid.getStore(),
					subRecs = subGrid.getSelectionModel().getSelection(),
					grid = me.grid,
					data = [];

				if (subRecs.length > 0) {
					for (var i = 0; i < subRecs.length; i++) {
						data.push({
							itemName: subRecs[i].get('subItemName'),
							itemCode: me.bigItem.get('itemCode'),
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
							discount: me.discount
						});
					}
					var index = 0;
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
										showMsg(obj.errMsg);
									}
									if (index < data.length - 1) {
										add('./libs/budget.php?action=addItem', ++index);
									}
									else {
										showMsg('添加新项完毕！');
										me.grid.getStore().load({
											params: {
												budgetId: me.budgetId
											}
										});
										me.close();
									}
								}
							}
						})
					}
					add('./libs/budget.php?action=addItem', 0);
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
		    	url: './libs/subitem.php?action=get',
		        reader: {
		            type: 'json'
		        },
		        extraParams: {
		        	parentId: me.bigItem.get('basicItemId')
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