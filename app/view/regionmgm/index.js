Ext.define('FamilyDecoration.view.regionmgm.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.regionmgm-index',
	requires: [
		'FamilyDecoration.view.regionmgm.EditArea', 'FamilyDecoration.view.regionmgm.EditRegion',
		'FamilyDecoration.model.RegionList', 'FamilyDecoration.store.PotentialBusiness',
		'FamilyDecoration.view.regionmgm.EditPotentialBusiness', 'Ext.grid.column.RowNumberer'
	],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;

		me.items = [{
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
			columns: [{
				text: '地区地址',
				dataIndex: 'name',
				flex: 1,
				renderer: function (val, meta, rec){
					return val;
				}
			}],
			tbar: [{
				text: '添加',
				icon: './resources/img/add.png',
				handler: function (){
					var areaGrid = Ext.getCmp('gridpanel-areaMgm');
					var win = Ext.create('FamilyDecoration.view.regionmgm.EditArea', {
						grid: areaGrid
					});
					win.show();
				}
			}, {
				text: '修改',
				disabled: true,
				id: 'button-editArea',
				name: 'button-editArea',
				icon: './resources/img/edit.png',
				handler: function (){
					var areaGrid = Ext.getCmp('gridpanel-areaMgm'),
						rec = areaGrid.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.regionmgm.EditArea', {
						area: rec,
						grid: areaGrid
					});
					win.show();
				}
			}],
			bbar: [{
				text: '删除',
				disabled: true,
				id: 'button-deleteArea',
				name: 'button-deleteArea',
				icon: './resources/img/delete.png',
				hidden: !User.isAdmin(),
				handler: function (){
					var areaGrid = Ext.getCmp('gridpanel-areaMgm'),
						rec = areaGrid.getSelectionModel().getSelection()[0];
					Ext.Msg.warning('确定要删除当前选中区域吗？', function (btnId){
						if (btnId == 'yes') {
							Ext.Ajax.request({
								url: './libs/business.php?action=deleteRegion',
								method: 'POST',
								params: {
									id: rec.getId()
								},
								callback: function (opts, success, res){
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
			}],
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
			refresh: function (){
				var areaGrid = Ext.getCmp('gridpanel-areaMgm'),
					st = areaGrid.getStore(),
					rec = areaGrid.getSelectionModel().getSelection()[0];
				st.reload({
					callback: function (recs, ope, success){
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
			initBtn: function (rec){
				var editBtn = Ext.getCmp('button-editArea'),
					deleteBtn = Ext.getCmp('button-deleteArea');
				editBtn.setDisabled(!rec);
				deleteBtn.setDisabled(!rec);
			},
			listeners: {
				selectionchange: function (view, sels){
					var rec = sels[0],
						regionGrid = Ext.getCmp('gridpanel-regionMgm'),
						areaGrid = Ext.getCmp('gridpanel-areaMgm');
					areaGrid.initBtn(rec);
					regionGrid.refresh(rec);
				}
			}
		}, {
			hideHeaders: true,
			xtype: 'gridpanel',
			id: 'gridpanel-regionMgm',
			name: 'gridpanel-regionMgm',
			title: '小区',
			height: '100%',
			flex: 1.2,
			autoScroll: true,
			style: {
				borderRightStyle: 'solid',
				borderRightWidth: '1px'
			},
			tbar: [{
				text: '添加',
				icon: './resources/img/add1.png',
				handler: function (){
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
			}, {
				text: '修改',
				disabled: true,
				icon: './resources/img/edit1.png',
				id: 'button-editRegion',
				name: 'button-editRegion',
				handler: function (){
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
			}],
			bbar: [{
				text: '删除',
				disabled: true,
				icon: './resources/img/delete.png',
				id: 'button-deleteRegion',
				name: 'button-deleteRegion',
				hidden: !User.isAdmin(),
				handler: function (){
					var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
						rec = regionGrid.getSelectionModel().getSelection()[0],
						areaGrid = Ext.getCmp('gridpanel-areaMgm'),
						area = areaGrid.getSelectionModel().getSelection()[0];
					Ext.Msg.warning('确定要删除当前小区吗？', function (btnId){
						if ('yes' == btnId) {
							Ext.Ajax.request({
								url: 'libs/business.php?action=deleteRegion',
								method: 'POST',
								params: {
									id: rec.getId()
								},
								callback: function (opts, success, res){
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
			}],
			initBtn: function (rec){
				var editBtn = Ext.getCmp('button-editRegion'),
					delBtn = Ext.getCmp('button-deleteRegion');
				editBtn.setDisabled(!rec);
				delBtn.setDisabled(!rec);
			},
			refresh: function (area){
				var grid = this,
					st = grid.getStore(),
					areaGrid = Ext.getCmp('gridpanel-areaMgm'),
					region = grid.getSelectionModel().getSelection()[0],
					area = areaGrid.getSelectionModel().getSelection()[0] || area;
				if (area) {
					st.reload({
						params: {
							action: 'getRegionList',
							parentID: area.getId()
						},
						callback: function (recs, ope, success){
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
		        	text: '小区地址',
					flex: 1,
					dataIndex: 'name',
					renderer: function (val, meta, rec){
						var businessList = rec.raw.businessListInfo,
							count = 0, total = 0, str;
						Ext.each(businessList, function (el, i) {
							total++;
							if (el.salesmanName == User.getName()) {
								count++;
							}
						});
						if (User.isAdmin() || User.isBusinessManager() || User.isAdministrationManager()) {
							str = '[<strong><font color="blue">' + total + '</font></strong>]';
						}
						else {
							str = '[<strong><font color="blue">' + count + '</font></strong>]';
						}
						return val + str;
					}
		        }
		    ],
		    listeners: {
		    	selectionchange: function (view, sels){
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
			}),
		}, {
			xtype: 'container',
			height: '100%',
			flex: 7.5,
			layout: 'vbox',
			items: [{
				hideHeaders: false,
				xtype: 'gridpanel',
				id: 'gridpanel-buildingMgm',
				name: 'gridpanel-buildingMgm',
				title: '小区扫楼名单',
				width: '100%',
				flex: 5,
				autoScroll: true,
				bbar: [{
					text: '删除',
					disabled: true,
					icon: 'resources/img/delete3.png',
					name: 'button-deleteBuilding',
					id: 'button-deleteBuilding',
					handler: function (){
						var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
							region = regionGrid.getSelectionModel().getSelection()[0],
							grid = Ext.getCmp('gridpanel-buildingMgm'),
							rec = grid.getSelectionModel().getSelection()[0];
						if (region) {
							if (rec) {
								Ext.Msg.warning('确定要删除当前选中项吗？', function (btnId){
									if ('yes' == btnId) {
										Ext.Ajax.request({
											url: './libs/business.php?action=deletePotentialBusiness',
											method: 'POST',
											params: {
												id: rec.getId()
											},
											callback: function (opts, success, res){
												if (success){
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
								showMsg('请选择要删除的项目！');
							}
						}
						else {
							showMsg('请选择小区！');
						}
					}
				}],
				tbar: [{
					text: '添加',
					icon: './resources/img/add2.png',
					handler: function (){
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
				}, {
					text: '修改',
					disabled: true,
					icon: './resources/img/edit2.png',
					id: 'button-editBuilding',
					name: 'button-editBuilding',
					handler: function (){
						var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
							region = regionGrid.getSelectionModel().getSelection()[0],
							grid = Ext.getCmp('gridpanel-buildingMgm'),
							rec = grid.getSelectionModel().getSelection()[0];
						if (region) {
							if (rec) {
								var win = Ext.create('FamilyDecoration.view.regionmgm.EditPotentialBusiness', {
									region: region,
									grid: grid,
									potentialBusiness: rec
								});
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
				}, {
					text: '修改状态',
					disabled: true,
					id: 'button-editStatus',
					name: 'button-editStatus',
					icon: './resources/img/edit1.png',
					handler: function (){
						var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
							region = regionGrid.getSelectionModel().getSelection()[0],
							grid = Ext.getCmp('gridpanel-buildingMgm'),
							rec = grid.getSelectionModel().getSelection()[0];
						if (region) {
							if (rec) {
								var win = Ext.create('FamilyDecoration.view.regionmgm.EditPotentialBusiness', {
									region: region,
									grid: grid,
									potentialBusiness: rec,
									onlyStatusEdit: true
								});
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
				}],
				store: Ext.create('FamilyDecoration.store.PotentialBusiness', {
					autoLoad: false,
					filters: [
						function (item){
							if (User.isAdmin() || User.isBusinessManager() || User.isAdministrationManager()) {
								return true;
							}
							else {
								return item.get('salesmanName') == User.getName();
							}
						}
					]
				}),
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editBuilding'),
						editStatus = Ext.getCmp('button-editStatus'),
						delBuilding = Ext.getCmp('button-deleteBuilding');
					editBtn.setDisabled(!rec);
					editStatus.setDisabled(!rec);
					delBuilding.setDisabled(!rec);
				},
				refresh: function (region){
					var grid = this,
						st = grid.getStore(),
						rec = grid.getSelectionModel().getSelection()[0];
					if (region) {
						st.reload({
							params: {
								regionID: region.getId()
							},
							callback: function (recs, ope, success){
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
				columns: [
					{
						xtype: 'rownumberer'
					},
			   //      {
			   //      	text: '序号',
						// flex: 0.3,
						// dataIndex: 'id'
			   //      },
			        {
			        	text: '地址',
						flex: 0.6,
						dataIndex: 'address'
			        },
			        {
			        	text: '业主',
						flex: 0.6,
						dataIndex: 'proprietor'
			        },
			        {
			        	text: '电话',
						flex: 0.8,
						dataIndex: 'phone'
			        },
			        {
			        	text: '状态1',
						flex: 1.3,
						dataIndex: 'status',
						renderer: function (val, meta, rec){
							return val.replace(/\n|\r/gi, '<br />');
						}
			        },
			        {
			        	text: '状态2',
						flex: 1.3,
						dataIndex: 'status_second',
						renderer: function (val, meta, rec){
							return val.replace(/\n|\r/gi, '<br />');
						}
			        },
			        {
			        	text: '状态3',
						flex: 1.3,
						dataIndex: 'status_third',
						renderer: function (val, meta, rec){
							return val.replace(/\n|\r/gi, '<br />');
						}
			        },
			        {
			        	text: '员工',
			        	flex: 0.5,
			        	hidden: !User.isAdmin(),
			        	dataIndex: 'salesman'
			        }
			    ],
			    listeners: {
			    	selectionchange: function (view, sels){
			    		var rec = sels[0];
			    			buildingGrid = Ext.getCmp('gridpanel-buildingMgm');
			    		buildingGrid.initBtn(rec);
			    	}
			    }
			}, {
				xtype: 'panel',
				title: '小区简介',
				width: '100%',
				flex: 2,
				autoScroll: true,
				id: 'panel-regionIntroduction',
				name: 'panel-regionIntroduction',
				refresh: function (region){
					var panel = this;
					if (region) {
						panel.update(region.get('nameRemark'));
					}
					else {
						panel.update('');
					}
				}
			}]
		}];

		this.callParent();
	}
});