Ext.define('FamilyDecoration.view.checkbillitem.PickBasicItemWithSameType', {
	extend: 'Ext.window.Window',
	alias: 'widget.checkbillitem-pickbasicitemwithsametype',
	requires: ['FamilyDecoration.store.BasicSubItem'],
	// resizable: false,
	modal: true,
	layout: 'fit',
	maximizable: true,

	title: '选择基础小项',
	width: 520,
	height: 300,
	workCategory: undefined,
	basicBillItem: undefined,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			store: Ext.create('FamilyDecoration.store.BasicSubItem', {
				autoLoad: true,
				proxy: {
					type: 'rest',
			        url: './libs/subitem.php',
			        reader: {
			            type: 'json'
			        },
			        extraParams: {
			        	action: 'getitemsbyworkcategory',
			        	workCategory: me.workCategory
			        }
				}
			}),
			autoScroll: true,
			columns: [{
				header: '名称',
				dataIndex: 'subItemName',
				align: 'center',
				flex: 1
			}],
			selType: 'checkboxmodel',
			selModel: {
				mode: 'SIMPLE'
			}
		}];

		me.buttons = [
			{
				text: '添加',
				handler: function (){
					var grid = me.down('gridpanel'),
						items = [],
						sels = grid.getSelectionModel().getSelection();
					for (var i = sels.length - 1; i >= 0; i--) {
						items.push(sels[i].getId());
					}
					if (items.length <= 0) {
						showMsg('请选择参考量！');
					}
					else {
						me.basicBillItem.set({
							referenceNumber: items.length,
							referenceItems: items.join(',')
						});
						me.basicBillItem.commit();
						me.close();
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

		this.callParent();
	}
});