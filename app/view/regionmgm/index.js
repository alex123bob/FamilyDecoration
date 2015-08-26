Ext.define('FamilyDecoration.view.regionmgm.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.regionmgm-index',
	requires: [
		'FamilyDecoration.view.regionmgm.EditArea', 'FamilyDecoration.view.regionmgm.EditRegion',
		'FamilyDecoration.model.RegionList'],
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
					st = areaGrid.getStore();
				st.reload();
			},
			initBtn: function (rec){
				var editBtn = Ext.getCmp('button-editArea');
				editBtn.setDisabled(!rec);
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
			flex: 1,
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
			initBtn: function (rec){
				var editBtn = Ext.getCmp('button-editRegion');
				editBtn.setDisabled(!rec);
			},
			refresh: function (area){
				var grid = this,
					st = grid.getStore(),
					areaGrid = Ext.getCmp('gridpanel-areaMgm'),
					area = areaGrid.getSelectionModel().getSelection()[0] || area;
				if (area) {
					st.reload({
						params: {
							action: 'getRegionList',
							parentID: area.getId()
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
						return val;
					}
		        }
		    ],
		    listeners: {
		    	selectionchange: function (view, sels){
		    		var rec = sels[0],
		    			introGrid = Ext.getCmp('panel-regionIntroduction'),
		    			regionGrid = Ext.getCmp('gridpanel-regionMgm');
		    		regionGrid.initBtn(rec);
		    		introGrid.refresh(rec);
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
			flex: 3,
			layout: 'vbox',
			items: [{
				hideHeaders: true,
				xtype: 'gridpanel',
				id: 'gridpanel-buildingMgm',
				name: 'gridpanel-buildingMgm',
				title: '小区扫楼名单',
				width: '100%',
				flex: 5,
				autoScroll: true,
				tbar: [{
					text: '添加',
					icon: './resources/img/add2.png',
					handler: function (){
						var regionGrid = Ext.getCmp('gridpanel-regionMgm'),
							region = regionGrid.getSelectionModel().getSelection()[0];
						if (region) {

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
						
					}
				}],
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editBuilding');
					editBtn.setDisabled(!rec);
				},
				refresh: function (region){
					var grid = this,
						st = grid.getStore();
					st.reload();
				},
				columns: [
			        {
			        	text: '楼道名称',
						flex: 1,
						dataIndex: 'address',
						renderer: function (val, meta, rec){
							return val;
						}
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