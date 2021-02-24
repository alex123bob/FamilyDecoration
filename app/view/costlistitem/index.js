Ext.define('FamilyDecoration.view.costlistitem.Index', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.costlistitem-index',
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	requires: ['FamilyDecoration.store.CostListItem', 'FamilyDecoration.view.basicitem.AddBasicItem', 'FamilyDecoration.store.BasicSubItem',
		'FamilyDecoration.view.basicitem.SubItemTable', 'FamilyDecoration.view.basicitem.AddBasicSubItem', 'Ext.ux.form.SearchField',
		'Ext.form.ComboBox', 'FamilyDecoration.store.WorkCategory'],

	initComponent: function () {
		var me = this;

		var costItemSt = Ext.create('FamilyDecoration.store.CostListItem', {
			autoLoad: false
		});

		var bsiSt = Ext.create('FamilyDecoration.store.BasicSubItem', {
			autoLoad: false
		});

		me.items = [
			{
				id: 'gridpanel-costlistitem',
				name: 'gridpanel-costlistitem',
				xtype: 'gridpanel',
				flex: 1,
				plugins: [
					Ext.create('Ext.grid.plugin.RowEditing', {
						clicksToEdit: 1,
						clicksToMoveEditor: 1,
						listeners: {
							edit: function(editor, e) {
								var field = e.field,
									rec = e.record,
									newValues = e.newValues,
									params = {};

								ajaxAdd('CostListItem', newValues, function() {
									showMsg('添加成功！');
								});
							}
						}
					})
				],
				columns: {
					defaults: {
						flex: 1,
						editor: 'textfield'
					},
					items: [
						{
							text: '名称',
							dataIndex: 'name',
						},
						{
							text: '单位',
							dataIndex: 'unit',
						},
						{
							text: '工种',
							dataIndex: 'professionType',
							editor: {
								editable: false,
								xtype: 'combobox',
								store: FamilyDecoration.store.WorkCategory,
								queryMode: 'local',
								displayField: 'name',
								valueField: 'value'
							},
							renderer: function(val, meta, rec) {
								return FamilyDecoration.store.WorkCategory.renderer(val);
							}
						},
						{
							text: '人工',
							dataIndex: 'isLabour',
							editor: {
								xtype: 'checkbox'
							},
							renderer: function(val){
								return val ? '是' : '否';
							}
						},
						{
							text: '备注',
							dataIndex: 'remark'
						}
					]
				},
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
				title: '清单项目',
				margin: '0 1 0 0',
				store: costItemSt,
				allowDeselect: true,
				tbar: [{
					text: '添加',
					icon: './resources/img/add2.png',
					handler: function () {
						var rowEditing = this.ownerCt.ownerCt.plugins[0];
						costItemSt.add(
							{
								name: '',
								unit: '',
								professionType: '',
								remark: ''
							}
						);
					}
				}, {
					text: '修改',
					disabled: true,
					icon: './resources/img/edit2.png',
					id: 'button-editBasicItem',
					name: 'button-editBasicItem',
					handler: function () {
						var grid = Ext.getCmp('gridpanel-basicitem'),
							st = grid.getStore(),
							item = grid.getSelectionModel().getSelection()[0],
							id = item.getId();

						function editBasicItemName() {
							Ext.Msg.prompt('修改名称', '输入新项目名称', function (btnId, newName) {
								if (btnId == 'ok') {
									if (!Ext.isEmpty(newName)) {
										Ext.Ajax.request({
											url: './libs/basicitem.php?action=editbasicitem',
											method: 'POST',
											params: {
												itemId: id,
												itemName: newName
											},
											callback: function (opts, success, res) {
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

						if (User.isBudgetStaff()) {
							Ext.Msg.prompt('提示', '请输入主管密码', function (btnId, pwd) {
								if (btnId == 'ok') {
									if (pwd == 'woshizzn963963') {
										editBasicItemName();
									}
									else {
										showMsg('密码不正确！请联系管理员取得密码后再进行编辑。');
									}
								}
							});
						}
						else {
							editBasicItemName();
						}
					}
				}],
				bbar: [{
					text: '删除',
					icon: './resources/img/delete2.png',
					disabled: true,
					hidden: User.isBudgetStaff() ? true : false,
					id: 'button-deleteBasicItem',
					name: 'button-deleteBasicItem',
					handler: function () {
						var grid = Ext.getCmp('gridpanel-basicitem'),
							st = grid.getStore(),
							item = grid.getSelectionModel().getSelection()[0],
							id = item.getId();

						Ext.Msg.warning('【注意】：删除基础大项会删除其下的所有小项目！<br />确定要删除此项目吗？', function (btnId) {
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: './libs/basicitem.php?action=deletebasicitem',
									method: 'POST',
									params: {
										itemId: id
									},
									callback: function (opts, success, res) {
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
					selectionchange: function (selModel, items, opts) {

					}
				}
			},
			{
				xtype: 'gridpanel',
				id: 'gridpanel-normcost',
				name: 'gridpanel-normcost',
				title: '成本定额',
				store: bsiSt,
				selModel: {
					mode: 'SIMPLE'
				},
				selType: 'checkboxmodel',
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
				columns: {
					items: [
						{
							text: '名称'
						}
					]
				},
				flex: 1,
				bbar: [{
					text: '添加',
					id: 'button-addbasicSubItem',
					name: 'button-addbasicSubItem',
					icon: './resources/img/add3.png',
					disabled: true,
					handler: function () {
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
					handler: function () {
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
							if (User.isBudgetStaff()) {
								Ext.Msg.prompt('提示', '请输入主管密码', function (btnId, pwd) {
									if (btnId == 'ok') {
										if (pwd == 'woshizzn963963') {
											win.show();
										}
										else {
											showMsg('密码不正确！请联系主管取得密码后进行更改。');
										}
									}
								});
							}
							else {
								win.show();
							}
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
					hidden: User.isBudgetStaff() ? true : false,
					disabled: true,
					handler: function () {
						var subGrid = Ext.getCmp('gridpanel-basicSubItem'),
							mainGrid = Ext.getCmp('gridpanel-basicitem'),
							recs = subGrid.getSelectionModel().getSelection();

						Ext.Msg.warning('确定要删除选中项吗？', function (btnId) {
							if (btnId == 'yes') {
								if (recs) {
									Ext.each(recs, function (rec, i, arr) {
										arr[i] = rec.getId();
									});
									recs = recs.join('>>><<<');
									Ext.Ajax.request({
										url: './libs/subitem.php?action=delete',
										method: 'POST',
										params: {
											subItemId: recs
										},
										callback: function (opts, success, res) {
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
					selectionchange: function (selModel, sels, opts) {
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