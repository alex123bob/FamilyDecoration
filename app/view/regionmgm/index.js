Ext.define('FamilyDecoration.view.regionmgm.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.regionmgm-index',
	requires: ['FamilyDecoration.view.regionmgm.EditArea', 'FamilyDecoration.view.regionmgm.EditRegion'],
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
					var win = Ext.create('FamilyDecoration.view.regionmgm.EditArea', {

					});
					win.show();
				}
			}, {
				text: '修改',
				icon: './resources/img/edit.png',
				handler: function (){
					var rec;
					var win = Ext.create('FamilyDecoration.view.regionmgm.EditArea', {
						area: rec
					});
					win.show();
				}
			}],
			refresh: function (){

			},
			initBtn: function (address){

			},
			listeners: {
				selectionchange: function (view, sels){

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
					var win = Ext.create('FamilyDecoration.view.regionmgm.EditRegion', {

					});
					win.show();
				}
			}, {
				text: '修改',
				icon: './resources/img/edit1.png',
				handler: function (){
					
				}
			}],
			initBtn: function (rec){

			},
			refresh: function (client){

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

		    	}
		    }
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

					}
				}, {
					text: '修改',
					icon: './resources/img/edit2.png',
					handler: function (){
						
					}
				}],
				initBtn: function (rec){

				},
				refresh: function (client){

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

			    	}
			    }
			}, {
				xtype: 'panel',
				title: '小区简介',
				width: '100%',
				flex: 2,
				autoScroll: true
			}]
		}];

		this.callParent();
	}
});