Ext.define('FamilyDecoration.view.regionmgm.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.regionmgm-index',
	requires: [
		'FamilyDecoration.view.regionmgm.EditArea', 'FamilyDecoration.view.regionmgm.EditRegion',
		'FamilyDecoration.model.RegionList', 'FamilyDecoration.store.PotentialBusiness',
		'FamilyDecoration.view.regionmgm.EditPotentialBusiness', 'Ext.grid.column.RowNumberer',
		'FamilyDecoration.view.regionmgm.DispenseTelemarketingStaff'
	],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function () {
		var me = this;

		var potentialBusinessSt = Ext.create('FamilyDecoration.store.PotentialBusiness', {
			autoLoad: false,
			filters: [
				function (item) {
					if (User.isAdmin() || User.isBusinessManager() || User.isAdministrationManager()) {
						return true;
					}
					else {
						return item.get('salesmanName') == User.getName();
					}
				}
			]
		});

		me.items = [
			{
				xtype: 'gridpanel',
				flex: 1,
				height: '100%',
				title: '区域',
				hideHeaders: true,
				id: 'gridpanel-areaMgm',
				name: 'gridpanel-areaMgm',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				columns: [
					{
						text: '地区地址',
						dataIndex: 'name',
						flex: 1,
						renderer: function (val, meta, rec) {
							return val;
						}
					}
				],
				tbar: [
					{
						text: '添加',
						icon: './resources/img/add.png',
						handler: function () {
							var areaGrid = Ext.getCmp('gridpanel-areaMgm');
							var win = Ext.create('FamilyDecoration.view.regionmgm.EditArea', {
								grid: areaGrid
							});
							win.show();
						}
					},
					{
						text: '修改',
						disabled: true,
						id: 'button-editArea',
						name: 'button-editArea',
						icon: './resources/img/edit.png',
						handler: function () {
							var areaGrid = Ext.getCmp('gridpanel-areaMgm'),
								rec = areaGrid.getSelectionModel().getSelection()[0];
							var win = Ext.create('FamilyDecoration.view.regionmgm.EditArea', {
								area: rec,
								grid: areaGrid
							});
							win.show();
						}
					}
				],
				bbar: [
					{
						text: '删除',
						disabled: true,
						id: 'button-deleteArea',
						name: 'button-deleteArea',
						icon: './resources/img/delete.png',
						hidden: !User.isAdmin(),
						handler: function () {
							var areaGrid = Ext.getCmp('gridpanel-areaMgm'),
								rec = areaGrid.getSelectionModel().getSelection()[0];
							Ext.Msg.warning('确定要删除当前选中区域吗？', function (btnId) {
								if (btnId == 'yes') {
									Ext.Ajax.request({
										url: './libs/business.php?action=deleteRegion',
										method: 'POST',
										params: {
											id: rec.getId()
										},
										callback: function (opts, success, res) {
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('删除成功！');
													areaGrid.refresh(rec);
												}
												else {
													showMsg(obj.errMsg);
												}
											}
										}
									});
								}
							})
						}
					}
				],
				store: Ext.create('Ext.data.Store', {
					model: 'FamilyDecoration.model.RegionList',
					proxy: {
						type: 'rest',
						url: 'libs/business.php',
						reader: {
							type: 'json'
						},
						extraParams: {
							action: 'getRegionList',
							parentID: -1
						}
					},
					autoLoad: true
				}),
				refresh: function () {
					var areaGrid = Ext.getCmp('gridpanel-areaMgm'),
						st = areaGrid.getStore(),
						rec = areaGrid.getSelectionModel().getSelection()[0];
					st.reload({
						callback: function (recs, ope, success) {
							if (success) {
								areaGrid.getSelectionModel().deselectAll();
								if (rec) {
									var index = st.indexOf(rec);
									areaGrid.getSelectionModel().select(index);
								}
							}
						}
					});
				},
				initBtn: function (rec) {
					var editBtn = Ext.getCmp('button-editArea'),
						deleteBtn = Ext.getCmp('button-deleteArea');
					editBtn.setDisabled(!rec);
					deleteBtn.setDisabled(!rec);
				},
				listeners: {
					selectionchange: function (view, sels) {
						var rec = sels[0],
							regionGrid = Ext.getCmp('gridpanel-regionMgm'),
							areaGrid = Ext.getCmp('gridpanel-areaMgm');
						areaGrid.initBtn(rec);
						regionGrid.refresh(rec);
					}
				}
			},
			{
				// hideHeaders: true,
				xtype: 'gridpanel',
				id: 'gridpanel-regionMgm',
				name: 'gridpanel-regionMgm',
				title: '小区',
				height: '100%',
				flex: 2,
				autoScroll: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				tbar: [
					{
						text: '添加',
						icon: './resources/img/add1.png',
						handler: function () {
							var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
								areaGrid = Ext.getCmp('gridpanel-areaMgm'),
								area = areaGrid.getSelectionModel().getSelection()[0];
							if (area) {
								var win = Ext.create('FamilyDecoration.view.regionmgm.EditRegion', {
									grid: regionGrid,
									area: area
								});
								win.show();
							}
							else {
								showMsg('请选择区域！');
							}
						}
					},
					{
						text: '修改',
						disabled: true,
						icon: './resources/img/edit1.png',
						id: 'button-editRegion',
						name: 'button-editRegion',
						handler: function () {
							var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
								rec = regionGrid.getSelectionModel().getSelection()[0],
								areaGrid = Ext.getCmp('gridpanel-areaMgm'),
								area = areaGrid.getSelectionModel().getSelection()[0];
							var win = Ext.create('FamilyDecoration.view.regionmgm.EditRegion', {
								grid: regionGrid,
								community: rec,
								area: area
							});
							win.show();
						}
					}
				],
				bbar: [
					{
						text: '删除',
						disabled: true,
						icon: './resources/img/delete.png',
						id: 'button-deleteRegion',
						name: 'button-deleteRegion',
						hidden: !User.isAdmin(),
						handler: function () {
							var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
								rec = regionGrid.getSelectionModel().getSelection()[0],
								areaGrid = Ext.getCmp('gridpanel-areaMgm'),
								area = areaGrid.getSelectionModel().getSelection()[0];
							Ext.Msg.warning('确定要删除当前小区吗？', function (btnId) {
								if ('yes' == btnId) {
									Ext.Ajax.request({
										url: 'libs/business.php?action=deleteRegion',
										method: 'POST',
										params: {
											id: rec.getId()
										},
										callback: function (opts, success, res) {
											if (success) {
												var obj = Ext.decode(res.responseText);
												if (obj.status == 'successful') {
													showMsg('删除成功！');
													regionGrid.refresh(area);
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
					}
				],
				initBtn: function (rec) {
					var editBtn = Ext.getCmp('button-editRegion'),
						delBtn = Ext.getCmp('button-deleteRegion');
					editBtn.setDisabled(!rec);
					delBtn.setDisabled(!rec);
				},
				refresh: function (area) {
					var grid = this,
						st = grid.getStore(),
						areaGrid = Ext.getCmp('gridpanel-areaMgm'),
						region = grid.getSelectionModel().getSelection()[0],
						area = areaGrid.getSelectionModel().getSelection()[0] || area;
					if (area) {
						st.reload({
							params: {
								action: 'getRegionList2',
								parentID: area.getId(),
								myselfOnly: !(User.isAdmin() || User.isBusinessManager() || User.isAdministrationManager())
							},
							callback: function (recs, ope, success) {
								if (success) {
									grid.getSelectionModel().deselectAll();
									if (region) {
										var index = st.indexOf(region);
										grid.getSelectionModel().select(index);
									}
								}
							}
						});
					}
					else {
						st.removeAll();
					}
				},
				columns: [
					{
						text: '小区(未装/总计)',
						flex: 1.4,
						dataIndex: 'name',
						renderer: function (val, meta, rec) {
							var color = rec.raw.potentialBusinessNumber > 0 ? 'blue' : '';
							var str = '[<strong><font color="' + color + '">' + rec.raw.potentialBusinessNumber + '/' + rec.raw.totalBusinessNumber + '</font></strong>]';
							return val + str;
						}
					},
					{
						text: '开盘时间',
						flex: 1.1,
						dataIndex: 'openingTime',
						renderer: function (val, meta, rec) {
							if (val) {
								return Ext.Date.format(val, 'Y-m-d');
							}
							else {
								return '';
							}
						}
					}
				],
				listeners: {
					selectionchange: function (view, sels) {
						var rec = sels[0],
							introGrid = Ext.getCmp('panel-regionIntroduction'),
							regionGrid = Ext.getCmp('gridpanel-regionMgm'),
							potentialGrid = Ext.getCmp('gridpanel-buildingMgm');
						regionGrid.initBtn(rec);
						introGrid.refresh(rec);
						potentialGrid.refresh(rec);
					}
				},
				store: Ext.create('Ext.data.Store', {
					model: 'FamilyDecoration.model.RegionList',
					proxy: {
						type: 'rest',
						url: 'libs/business.php',
						reader: {
							type: 'json'
						},
						extraParams: {
							action: 'getRegionList'
						}
					},
					autoLoad: false
				})
			},
			{
				xtype: 'container',
				height: '100%',
				flex: 7.5,
				layout: 'vbox',
				items: [
					{
						hideHeaders: false,
						xtype: 'gridpanel',
						id: 'gridpanel-buildingMgm',
						name: 'gridpanel-buildingMgm',
						title: '小区扫楼名单',
						width: '100%',
						flex: 5,
						autoScroll: true,
						bbar: [
							{
								text: '删除',
								disabled: true,
								icon: 'resources/img/delete3.png',
								name: 'button-deleteBuilding',
								id: 'button-deleteBuilding',
								handler: function () {
									var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
										region = regionGrid.getSelectionModel().getSelection()[0],
										grid = Ext.getCmp('gridpanel-buildingMgm'),
										rec = grid.getSelectionModel().getSelection()[0];
									if (region) {
										if (rec) {
											if (rec.get('isLocked') == 'false') {
												Ext.Msg.warning('确定要删除当前选中项吗？', function (btnId) {
													if ('yes' == btnId) {
														Ext.Ajax.request({
															url: './libs/business.php?action=deletePotentialBusiness',
															method: 'POST',
															params: {
																id: rec.getId()
															},
															callback: function (opts, success, res) {
																if (success) {
																	var obj = Ext.decode(res.responseText);
																	if (obj.status == 'successful') {
																		showMsg('删除成功！');
																		grid.refresh(region);
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
												showMsg('项目被锁定,无法删除!');
											}
										}
										else {
											showMsg('请选择要删除的项目！');
										}
									}
									else {
										showMsg('请选择小区！');
									}
								}
							}
						],
						tbar: [
							{
								text: '添加',
								icon: './resources/img/add2.png',
								handler: function () {
									var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
										region = regionGrid.getSelectionModel().getSelection()[0],
										grid = Ext.getCmp('gridpanel-buildingMgm');
									if (region) {
										var win = Ext.create('FamilyDecoration.view.regionmgm.EditPotentialBusiness', {
											region: region,
											grid: grid
										});
										win.show();
									}
									else {
										showMsg('请选择小区！');
									}
								}
							},
							{
								text: '修改',
								disabled: true,
								icon: './resources/img/edit2.png',
								id: 'button-editBuilding',
								name: 'button-editBuilding',
								handler: function () {
									var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
										region = regionGrid.getSelectionModel().getSelection()[0],
										grid = Ext.getCmp('gridpanel-buildingMgm'),
										rec = grid.getSelectionModel().getSelection()[0];
									if (region) {
										if (rec) {
											if (rec.get('isLocked') == 'false') {
												var win = Ext.create('FamilyDecoration.view.regionmgm.EditPotentialBusiness', {
													region: region,
													grid: grid,
													potentialBusiness: rec
												});
											}
											else {
												showMsg('项目已经被锁定，无法编辑!');
											}
										}
										else {
											showMsg('请选择编辑项目！');
										}
										win.show();
									}
									else {
										showMsg('请选择小区！');
									}
								}
							},
							{
								text: '分配电销人员',
								disabled: true,
								id: 'button-dispenseTelemarketingStaff',
								name: 'button-dispenseTelemarketingStaff',
								icon: './resources/img/giveout.png',
								handler: function () {
									var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
										region = regionGrid.getSelectionModel().getSelection()[0],
										grid = Ext.getCmp('gridpanel-buildingMgm'),
										rec = grid.getSelectionModel().getSelection()[0];
									if (region) {
										if (rec && rec.get('isLocked') == 'true') {
											showMsg('项目被锁定,无法分配电销列表!');
										}
										else {
											var win = Ext.create('FamilyDecoration.view.regionmgm.DispenseTelemarketingStaff', {
												region: region,
												grid: grid,
												potentialBusiness: rec
											});
											win.show();
										}
									}
									else {
										showMsg('请选择小区！');
									}
								}
							}
						],
						selModel: {
							mode: 'SINGLE',
							allowDeselect: true
						},
						dockedItems: [
							{
								xtype: 'pagingtoolbar',
								store: potentialBusinessSt,   // same store GridPanel is using
								dock: 'bottom',
								displayInfo: true
							}
						],
						store: potentialBusinessSt,
						initBtn: function (rec) {
							var editBtn = Ext.getCmp('button-editBuilding'),
								delBuilding = Ext.getCmp('button-deleteBuilding');
							editBtn.setDisabled(!rec || rec.get('isLocked') == 'true');
							delBuilding.setDisabled(!rec || rec.get('isLocked') == 'true');
						},
						refresh: function (region) {
							var grid = this,
								st = grid.getStore(),
								rec = grid.getSelectionModel().getSelection()[0],
								dispenseTelemarketingStaff = Ext.getCmp('button-dispenseTelemarketingStaff');
							dispenseTelemarketingStaff.setDisabled(!region);
							if (region) {
								st.setProxy({
									url: './libs/business.php?action=getAllPotentialBusiness',
									type: 'rest',
									extraParams: {
										regionID: region.getId()
									},
									reader: {
										type: 'json',
										root: 'data'
									}
								});
								st.loadPage(1, {
									callback: function (recs, ope, success) {
										if (success) {
											grid.getSelectionModel().deselectAll();
											if (rec) {
												var index = st.indexOf(rec);
												grid.getSelectionModel().select(index);
											}
										}
									}
								});
							}
							else {
								st.removeAll();
							}
						},
						columns: {
							defaults: {
								align: 'center'
							},
							items: [
								{
									xtype: 'rownumberer',
									width: 30
								},
								{
									text: '地址',
									flex: 0.5,
									dataIndex: 'address'
								},
								{
									text: '业主',
									flex: 0.5,
									dataIndex: 'proprietor'
								},
								{
									text: '电话',
									flex: 0.8,
									dataIndex: 'phone'
								},
								{
									text: '已装',
									flex: 0.4,
									dataIndex: 'isDecorated',
									renderer: function (val, meta, rec) {
										if (val) {
											if (val == 'false') {
												return '未装';
											}
											else if (val == 'true') {
												return '已装';
											}
											else if (val == 'no') {
												return '不装';
											}
										}
										else {
											return ''
										}
									}
								},
								{
									text: '最新状态',
									flex: 1.2,
									dataIndex: 'latestBusinessStatus',
									renderer: function (val, meta, rec) {
										if (val) {
											var result = '';
											result += val.replace(/\n/gi, '<br />') + '<br />'
												+ '<span class="footnote">(' + rec.get('latestBusinessTime') + ') '
												+ rec.get('latestBusinessCommitterRealName') + '</span>'
												+ '<br />';
											return result;
										}
										else {
											return '';
										}
									}
								},
								{
									text: '扫楼人员',
									flex: 0.6,
									hidden: !User.isAdmin(),
									dataIndex: 'salesman'
								},
								{
									text: '电销人员',
									flex: 0.6,
									dataIndex: 'telemarketingStaff'
								},
								{
									text: '扫楼时间',
									flex: 0.8,
									dataIndex: 'createTime',
									renderer: function (val, meta, rec) {
										if (val) {
											return val.slice(0, val.indexOf(' '));
										}
										else {
											return '';
										}
									}
								},
								{
									text: '锁定',
									flex: 0.4,
									dataIndex: 'isLocked',
									renderer: function (val, meta, rec) {
										if (val) {
											if ('true' == val) {
												return '<font color="red">是</font>';
											}
											else if ('false' == val) {
												return '<font color="green">否</font>';
											}
										}
										else {
											return '';
										}
									}
								}
							]
						},
						listeners: {
							selectionchange: function (view, sels) {
								var rec = sels[0];
								buildingGrid = Ext.getCmp('gridpanel-buildingMgm');
								buildingGrid.initBtn(rec);
							}
						}
					},
					{
						xtype: 'panel',
						title: '小区简介',
						width: '100%',
						flex: 1,
						autoScroll: true,
						id: 'panel-regionIntroduction',
						name: 'panel-regionIntroduction',
						refresh: function (region) {
							var panel = this;
							if (region) {
								panel.update(region.get('nameRemark'));
							}
							else {
								panel.update('');
							}
						}
					}
				]
			}
		];

		this.callParent();
	}
});