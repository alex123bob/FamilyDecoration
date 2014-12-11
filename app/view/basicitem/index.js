Ext.define('FamilyDecoration.view.basicitem.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.basicitem-index',
	autoScroll: true,
	layout: 'border',

	requires: ['FamilyDecoration.store.BasicItem', 'FamilyDecoration.view.basicitem.AddBasicItem', 'FamilyDecoration.store.BasicSubItem',
			   'FamilyDecoration.view.basicitem.SubItemTable', 'FamilyDecoration.view.basicitem.AddBasicSubItem'],

	initComponent: function () {
		var me = this;

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
				title: '大类项目',
				hideHeaders: true,
				margin: '0 1 0 0',
				store: Ext.create('FamilyDecoration.store.BasicItem', {
					autoLoad: true
				}),
				allowDeselect: true,
				bbar: [{
					text: '添加',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.basicitem.AddBasicItem', {

						});
						win.show();
					}
				}, {
					text: '修改',
					disabled: true,
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
										url: './libs/editbasicitem.php',
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
				}, {
					text: '删除',
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
									url: './libs/deletebasicitem.php',
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
				title: '小类项目',
				store: Ext.create('FamilyDecoration.store.BasicSubItem', {
					autoLoad: false
				}),
				tbar: [{
					text: '添加',
					id: 'button-addbasicSubItem',
					name: 'button-addbasicSubItem',
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
					disabled: true,
					handler: function (){
						var subGrid = Ext.getCmp('gridpanel-basicSubItem'),
							mainGrid = Ext.getCmp('gridpanel-basicitem'),
							rec = subGrid.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要此条吗？', function (btnId){
							if (btnId == 'yes') {
								if (rec) {
									Ext.Ajax.request({
										url: './libs/deletebasicsubitem.php',
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