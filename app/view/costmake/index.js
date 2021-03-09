Ext.define('FamilyDecoration.view.costMake.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.costmake-index',
	layout: {
		type: 'border',
	},

	requires: ['Ext.ux.form.SearchField',
		'Ext.form.ComboBox', 'FamilyDecoration.store.WorkCategory', 'Ext.grid.plugin.DragDrop'],

	initComponent: function () {
		var me = this;

		me.items = [
			{
				id: 'gridpanel-costmakeeditor',
				name: 'gridpanel-costmakeeditor',
				xtype: 'gridpanel',
                region: 'center',
				tools: [
					{
						type: 'refresh',
						tooltip: '刷新当前应用',
						callback: function (){
                            
						}
					}
				],
				plugins: [
					// Ext.create('Ext.grid.plugin.RowEditing', {
					// 	clicksToEdit: 2,
					// 	clicksToMoveEditor: 1,
					// 	listeners: {
					// 		edit: function (editor, e) {
					// 			var field = e.field,
					// 				rec = e.record,
					// 				newValues = e.newValues;
					// 			if (rec.getId()) {
					// 				ajaxUpdate('CostListItem', Ext.apply(newValues, {
					// 					id: rec.getId(),
					// 					version: rec.get('version')
					// 				}), ['id', 'version'], function () {
					// 					showMsg('更新成功!');
					// 					rec.commit();
					// 				});
					// 			}
					// 			else {
					// 				ajaxAdd('CostListItem', newValues, function (res) {
					// 					showMsg('添加成功！');
					// 					rec.setId(res.data.id);
					// 					rec.commit();
					// 				});
					// 			}
					// 		}
					// 	}
					// }),
				],
				columns: {
					defaults: {
						flex: 1,
						editor: 'textfield'
					},
					items: [
                        {
                            text: '序号',
                            dataIndex: 'serialNumber'
                        },
						{
							text: '项目名称',
							dataIndex: 'name',
						},
						{
							text: '单位',
							dataIndex: 'unit',
						},
                        {
                            text: '数量',
                            dataIndex: 'quantity'
                        },
                        {
                            text: '单价',
                            dataIndex: 'unitPrice'
                        },
                        {
                            text: '小计',
                            dataIndex: 'subtotal',
                        },
						{
							text: '备注',
							dataIndex: 'remark'
						},
					]
				},
                title: '成本制作',
				listeners: {
					selectionchange: function (selModel, items, opts) {

					}
				}
			},
		];

		me.callParent();
	}
});