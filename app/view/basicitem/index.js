Ext.define('FamilyDecoration.view.basicitem.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.basicitem-index',
	layout: 'border',

	requires: ['FamilyDecoration.store.BasicItem', 'FamilyDecoration.view.basicitem.AddBasicItem', 'FamilyDecoration.store.BasicSubItem',
			   'FamilyDecoration.view.basicitem.SubItemTable', 'FamilyDecoration.view.basicitem.AddBasicSubItem', 'Ext.ux.form.SearchField'],

	initComponent: function () {
		var me = this;

		var biSt = Ext.create('FamilyDecoration.store.BasicItem', {
			autoLoad: true
		});

		var bsiSt = Ext.create('FamilyDecoration.store.BasicSubItem', {
			autoLoad: false
		});

		me.items = [
			{
				region: 'west',
				id: 'gridpanel-basicitem',
				name: 'gridpanel-basicitem',
				xtype: 'gridpanel',
				width: 200,
				columns: [{
					text: '项目名称',
					dataIndex: 'itemName',
					flex: 1
				}],
				// dockedItems: [{
				// 	dock: 'top',
				// 	xtype: 'toolbar',
				// 	items: [{
				// 		xtype: 'searchfield',
				// 		flex: 1,
				// 		store: biSt,
				// 		paramName: 'itemName'
				// 	}]
				// }],
				title: '大类项目',
				hideHeaders: true,
				margin: '0 1 0 0',
				store: biSt,
				allowDeselect: true,
				tbar: [{
					text: '添加',
					icon: './resources/img/add2.png',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.basicitem.AddBasicItem', {

						});
						win.show();
					}
				}, {
					text: '修改',
					disabled: true,
					icon: './resources/img/edit2.png',
					id: 'button-editBasicItem',
					name: 'button-editBasicItem',
					handler: function (){
						var grid = Ext.getCmp('gridpanel-basicitem'),
							st = grid.getStore(),
							item = grid.getSelectionModel().getSelection()[0],
							id = item.getId();

						Ext.Msg.prompt('修改名称', '输入新项目名称', function (btnId, newName){
							if (btnId == 'ok') {
								if (!Ext.isEmpty(newName)) {
									Ext.Ajax.request({
										url: './libs/basicitem.php?action=editbasicitem',
										method: 'POST',
										params: {
											itemId: id,
											itemName: newName
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('修改成功！');
													st.reload();
												}
											}
										}
									});
								}
								else {
									Ext.Msg.info('名称不能为空！');
								}
							}
						}, window, false, item.get('itemName'));
					}
				}],
				bbar: [{
					text: '删除',
					icon: './resources/img/delete2.png',
					disabled: true,
					id: 'button-deleteBasicItem',
					name: 'button-deleteBasicItem',
					handler: function (){
						var grid = Ext.getCmp('gridpanel-basicitem'),
							st = grid.getStore(),
							item = grid.getSelectionModel().getSelection()[0],
							id = item.getId();

						Ext.Msg.warning('【注意】：删除基础大项会删除其下的所有小项目！<br />确定要删除此项目吗？', function (btnId){
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: './libs/basicitem.php?action=deletebasicitem',
									method: 'POST',
									params: {
										itemId: id
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												st.reload();
											}
										}
									}
								})
							}
						});
					}
				}],
				listeners: {
					selectionchange: function (selModel, items, opts){
						var btnEdit = Ext.getCmp('button-editBasicItem'),
							btnDel = Ext.getCmp('button-deleteBasicItem'),

							addSubBtn = Ext.getCmp('button-addbasicSubItem'),
							subItemGrid = Ext.getCmp('gridpanel-basicSubItem'),
							subSt = subItemGrid.getStore(),
							flag = items.length > 0,
							pid;

						btnEdit.setDisabled(!flag);
						btnDel.setDisabled(!flag);
						addSubBtn.setDisabled(!flag);

						if (flag) {
							pid = items[0].getId();
							subSt.getProxy().extraParams = {
								parentId: pid
							};
							subItemGrid.getStore().load();
						}
						else {
							subSt.removeAll();
						}
					}
				}
			}, 
			{
				region: 'center',
				xtype: 'basicitem-subitemtable',
				id: 'gridpanel-basicSubItem',
				name: 'gridpanel-basicSubItem',
				listView: true,
				title: '小类项目',
				store: bsiSt,
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
				bbar: [{
					text: '添加',
					id: 'button-addbasicSubItem',
					name: 'button-addbasicSubItem',
					icon: './resources/img/add3.png',
					disabled: true,
					handler: function (){
						var mainGrid = Ext.getCmp('gridpanel-basicitem'),
							sel = mainGrid.getSelectionModel().getSelection()[0];

						if (sel) {
							var win = Ext.create('FamilyDecoration.view.basicitem.AddBasicSubItem', {
								width: 900,
								height: 400,
								parentId: sel.getId()
							});
							win.show();
						}
						else {
							Ext.Msg.info('请选择大项！');
						}
					}
				}, {
					text: '修改',
					id: 'button-editbasicSubItem',
					name: 'button-editbasicSubItem',
					icon: './resources/img/edit3.png',
					disabled: true,
					handler: function (){
						var mainGrid = Ext.getCmp('gridpanel-basicitem'),
							subGrid = Ext.getCmp('gridpanel-basicSubItem'),
							sel = mainGrid.getSelectionModel().getSelection()[0],
							rec = subGrid.getSelectionModel().getSelection()[0];

						if (sel) {
							var win = Ext.create('FamilyDecoration.view.basicitem.AddBasicSubItem', {
								width: 900,
								height: 200,
								parentId: sel.getId(),
								subItem: rec
							});
							win.show();
						}
						else {
							Ext.Msg.info('请选择大项！');
						}
					}
				}, {
					text: '删除',
					id: 'button-delbasicSubItem',
					name: 'button-delbasicSubItem',
					icon: './resources/img/delete3.png',
					disabled: true,
					handler: function (){
						var subGrid = Ext.getCmp('gridpanel-basicSubItem'),
							mainGrid = Ext.getCmp('gridpanel-basicitem'),
							rec = subGrid.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要此条吗？', function (btnId){
							if (btnId == 'yes') {
								if (rec) {
									Ext.Ajax.request({
										url: './libs/subitem.php?action=delete',
										method: 'POST',
										params: {
											subItemId: rec.getId()
										},
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													subGrid.getStore().reload();
													showMsg('删除成功！');
												}
											}
										}
									});
								}
							}
						});
					}
				}],
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var editBtn = Ext.getCmp('button-editbasicSubItem'),
							delBtn = Ext.getCmp('button-delbasicSubItem'),
							rec = sels[0];

						editBtn.setDisabled(!rec);
						delBtn.setDisabled(!rec);
					}
				}
			}
		];

		me.callParent();
	}
});