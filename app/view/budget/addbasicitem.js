Ext.define('FamilyDecoration.view.budget.AddBasicItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-addbasicitem',
	requires: ['FamilyDecoration.store.BasicItem', 'FamilyDecoration.store.BasicSubItem', 'Ext.ux.form.SearchField'],
	resizable: false,
	modal: true,

	title: '添加项目',
	width: 560,
	height: 420,
	layout: 'hbox',
	padding: 2,
	autoScroll: true,

	grid: null, // 预算表格
	budgetId: undefined, // 预算id

	initComponent: function () {
		var me = this;

		me.buttons = [
			{
				text: '添加',
				handler: function (){
					var mainGrid = me.items.items[0],
						mainSt = mainGrid.getStore(),
						subGrid = me.items.items[1],
						subSt = subGrid.getStore(),
						mainRec = mainGrid.getSelectionModel().getSelection()[0],
						subRecs = subGrid.getSelectionModel().getSelection(),
						grid = me.grid,
						data = [];

					if (subRecs.length > 0) {
						Ext.Msg.prompt('提示', '是否为本大类项目进行命名？不填写即为默认名称！', function (btnId, txt){
							if (btnId == 'ok') {
								data.push({
									itemName: txt == '' ? mainRec.get('itemName') : txt,
									budgetId: me.budgetId,
									basicItemId: mainRec.getId()
								});
								for (var i = 0; i < subRecs.length; i++) {
									data.push({
										itemName: subRecs[i].get('subItemName'),
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
									});
								}
								var index = 0;
								function add (url, index, code){
									var p = data[index];
									code && Ext.apply(p, {
										itemCode: code
									});
									Ext.Ajax.request({
										url: url,
										method: 'POST',
										params: data[index],
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													var itemCode = obj['itemCode'];
												}
												else {
													showMsg(obj.errMsg);
												}
												if (index < data.length - 1) {
													if (code) {
														add('./libs/budget.php?action=addItem', ++index, code);
													}
													else {
														add('./libs/budget.php?action=addItem', ++index, itemCode);
													}
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
								add('./libs/budget.php?action=addBigItem', 0);
							}
						});
					}
					else {
						showMsg('请选择小项！');
					}
				}
			}, 
			{
				text: '取消',
				handler: function (){
					me.close();
				}
			}
		];

		var biSt = Ext.create('FamilyDecoration.store.BasicItem', {
			autoLoad: true
		});

		var bsiSt = Ext.create('FamilyDecoration.store.BasicSubItem', {

		});

		me.items = [
			{
				xtype: 'gridpanel',
				title: '大类名称',
				header: false,
				height: 320,
				columns: [{
					text: '大类',
					dataIndex: 'itemName',
					flex: 1
				}],
				store: biSt,
				flex: 1,
				autoScroll: true,
				dockedItems: [{
					dock: 'top',
					xtype: 'toolbar',
					items: [{
						xtype: 'searchfield',
						flex: 1,
						store: biSt,
						paramName: 'itemName'
					}]
				}],
				listeners: {
					selectionchange: function (selModel, recs, opts){
						var mainGrid = this,
							mainSt = mainGrid.getStore(),
							subGrid = mainGrid.nextSibling(),
							subSt = subGrid.getStore(),
							rec = recs[0],
							mainId;
						if (rec) {
							mainId = rec.getId();
							subSt.getProxy().extraParams = {
								parentId: mainId
							};
							subSt.load();
						}
						else {
							subSt.removeAll();
						}
					}
				}
			}, 
			{
				xtype: 'gridpanel',
				title: '小类名称',
				header: false,
				autoScroll: true,
				height: 320,
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
				store: bsiSt,
				flex: 2
			}
		]

		this.callParent();
	}
})