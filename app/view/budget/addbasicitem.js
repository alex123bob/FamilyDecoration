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
	budgetPanel: null, // 预算最外层panel

	initComponent: function () {
		var me = this;

		me.buttons = [{
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
								budgetId: budgetPanel.budgetId
							});
						}
						for (var i = 0; i < subRecs.length; i++) {
							
						}
					});
				}
				else {
					showMsg('请选择小项！');
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];

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