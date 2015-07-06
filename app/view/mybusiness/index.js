Ext.define('FamilyDecoration.view.mybusiness.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mybusiness-index',
	requires: ['FamilyDecoration.view.mybusiness.EditCommunity', 'FamilyDecoration.view.mybusiness.EditClient',
			   'FamilyDecoration.view.mybusiness.TransferToProject', 'FamilyDecoration.view.mybusiness.EditInfo',
			   'FamilyDecoration.store.Community', 'FamilyDecoration.store.Business', 'FamilyDecoration.store.BusinessDetail'],

	autoScroll: true,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'container',
			margin: '0 1 0 0',
			flex: 1,
			layout: 'fit',
			items: [{
				autoScroll: true,
				hideHeaders: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				tbar: [{
					text: '添加',
					id: 'button-addCommunity',
					name: 'button-addCommunity',
					icon: './resources/img/add1.png',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.mybusiness.EditCommunity', {

						});
						win.show();
					}
				}, {
					text: '修改',
					id: 'button-editCommunity',
					name: 'button-editCommunity',
					icon: './resources/img/edit.png',
					disabled: true,
					handler: function (){
						var grid = Ext.getCmp('gridpanel-community'),
							rec = grid.getSelectionModel().getSelection()[0];

						var win = Ext.create('FamilyDecoration.view.mybusiness.EditCommunity', {
							community: rec
						});
						win.show();
					}
				}],
				bbar: [{
					text: '删除',
					id: 'button-delCommunity',
					name: 'button-delCommunity',
					icon: './resources/img/delete5.png',
					hidden: User.isAdmin() ? false : true,
					disabled: true,
					handler: function (){
						Ext.Msg.warning('确定要删除当前小区吗？', function (id){
							var grid = Ext.getCmp('gridpanel-community'),
								rec = grid.getSelectionModel().getSelection()[0];
							if (id == 'yes') {
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
												grid.refresh();
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
				xtype: 'gridpanel',
				title: '小区',
				id: 'gridpanel-community',
				name: 'gridpanel-community',
				columns: [{
					text: '小区名称',
					flex: 1,
					dataIndex: 'name',
					renderer: function (val, meta, rec){
						var arr = rec.get('business'),
							num = 0,
							numStr = '';
						for (var i = 0; i < arr.length; i++) {
							if (arr[i]['salesmanName'] == User.getName()) {
								num++;
							}
						}
						numStr = '<font style="color: ' + (num > 0 ? 'blue; text-shadow: #8F7 ' : 'white; text-shadow: black ') 
								+ '0.1em 0.1em 0.2em;"><strong>[' + num + ']</strong></font>';
						return val + numStr;
					}
				}],
				store: Ext.create('FamilyDecoration.store.Community', {
					autoLoad: true
				}),
				refresh: function (){
					var grid = this,
						st = this.getStore(),
						rec = grid.getSelectionModel().getSelection()[0];
					
					st.reload({
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
				},
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editCommunity'),
						delBtn = Ext.getCmp('button-delCommunity');

					editBtn.setDisabled(!rec);
					delBtn.setDisabled(!rec);
				},
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							grid = Ext.getCmp('gridpanel-community'),
							clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							frozenBusinessGrid = Ext.getCmp('gridpanel-frozenBusiness');
						grid.initBtn(rec);
						clientGrid.refresh(rec);
						frozenBusinessGrid.refresh(rec);
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 1,
			layout: 'border',
			margin: '0 1 0 0',
			items: [{
				autoScroll: true,
				region: 'center',
				hideHeaders: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'gridpanel',
				title: '地址',
				id: 'gridpanel-clientInfo',
				name: 'gridpanel-clientInfo',
				width: '100%',
				tools: [{
					type: 'gear',
					disabled: true,
					id: 'tool-frozeBusiness',
					name: 'tool-frozeBusiness',
					tooltip: '转为死单',
					callback: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							rec = clientGrid.getSelectionModel().getSelection()[0],
							communityGrid = Ext.getCmp('gridpanel-community'),
							community = communityGrid.getSelectionModel().getSelection()[0],
							fronzenGrid = Ext.getCmp('gridpanel-frozenBusiness');

						Ext.Msg.warning('确定要将	"' + rec.get('address') + '"转为死单吗？', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/business.php?action=frozeBusiness&businessId=' + rec.getId(),
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('转换成功！');
												clientGrid.refresh(community);
												fronzenGrid.refresh(community);
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
				columns: [{
					text: '门牌号',
					flex: 1,
					dataIndex: 'address',
					renderer: function (val, meta, rec){
						var level = rec.get('level');
						if (level == 'A') {
							meta.style = 'background: lightpink;';
						}
						else if (level == 'B') {
							meta.style = 'background: lightgreen;';
						}
						else if (level == 'C') {
							meta.style = 'background: cornsilk;';
						}
						else if (level == 'D') {
							meta.style = 'background: sandybrown;';
						}
						else {

						}
						if (level != '') {
							val = val + '<strong>[' + level + ']</strong>';
						}
						return val;
					}
				}],
				store: Ext.create('FamilyDecoration.store.Business', {
					autoLoad: false
				}),
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editClient'),
						delBtn = Ext.getCmp('button-delClient'),
						rankBtn = Ext.getCmp('button-categorization'),
						gearBtn = Ext.getCmp('tool-frozeBusiness');

					editBtn.setDisabled(!rec);
					delBtn.setDisabled(!rec);
					gearBtn.setDisabled(!rec);
					rankBtn.setDisabled(!rec);
				},
				refresh: function (community){
					if (community) {
						var grid = this,
							st = grid.getStore(),
							rec = grid.getSelectionModel().getSelection()[0];
						st.reload({
							params: {
								regionId: community.getId(),
								salesmanName: User.getName()
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
						this.getStore().removeAll();
					}
				},
				tbar: [{
					text: '添加',
					id: 'button-addClient',
					name: 'button-addClient',
					icon: './resources/img/add.png',
					handler: function (){
						var communityGrid = Ext.getCmp('gridpanel-community'),
							rec = communityGrid.getSelectionModel().getSelection()[0];
						if (rec) {
							var win = Ext.create('FamilyDecoration.view.mybusiness.EditClient', {
								community: rec
							});
							win.show();
						}
						else {
							showMsg('请先选择小区！');
						}
					}
				}, {
					text: '修改',
					id: 'button-editClient',
					name: 'button-editClient',
					icon: './resources/img/edit2.png',
					disabled: true,
					handler: function (){
						var communityGrid = Ext.getCmp('gridpanel-community'),
							rec = communityGrid.getSelectionModel().getSelection()[0],
							clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							client = clientGrid.getSelectionModel().getSelection()[0];
						if (rec) {
							var win = Ext.create('FamilyDecoration.view.mybusiness.EditClient', {
								community: rec,
								client: client
							});
							win.show();
						}
					}
				}],
				bbar: [{
					text: '删除',
					id: 'button-delClient',
					name: 'button-delClient',
					icon: './resources/img/delete.png',
					disabled: true,
					handler: function (){
						Ext.Msg.warning('确定要删除当前客户信息吗？', function (id){
							var grid = Ext.getCmp('gridpanel-clientInfo'),
								communityGrid = Ext.getCmp('gridpanel-community'),
								community = communityGrid.getSelectionModel().getSelection()[0],
								rec = grid.getSelectionModel().getSelection()[0];
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/business.php?action=deleteBusiness',
									method: 'POST',
									params: {
										id: rec.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												grid.refresh(community);
												communityGrid.refresh();
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
				}, {
					text: '评级',
					id: 'button-categorization',
					name: 'button-categorization',
					icon: './resources/img/category.png',
					disabled: true,
					handler: function (){
						var	clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							rec = clientGrid.getSelectionModel().getSelection()[0],
							communityGrid = Ext.getCmp('gridpanel-community'),
							community = communityGrid.getSelectionModel().getSelection()[0],
							fronzenGrid = Ext.getCmp('gridpanel-frozenBusiness');
						var win = Ext.create('Ext.window.Window', {
							width: 300,
							height: 200,
							padding: 10,
							modal: true,
							title: '客户类型评级',
							items: [{
								xtype: 'combobox',
								fieldLabel: '客户评级',
								editable: false,
								allowBlank: false,
								store: Ext.create('Ext.data.Store', {
									fields: ['name'],
									data: [
										{name: 'A'},
										{name: 'B'},
										{name: 'C'},
										{name: 'D'}
									]
								}),
								queryMode: 'local',
							    displayField: 'name',
							    valueField: 'name',
							    value: rec.get('level')
 							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var combo = win.down('combobox');
									if (combo.isValid()) {
										Ext.Ajax.request({
											url: './libs/business.php?action=clientRank',
											method: 'POST',
											params: {
												level: combo.getValue(),
												id: rec.getId()
											},
											callback: function (opts, success, res){
												if (success) {
													var obj = Ext.decode(res.responseText);
													if (obj.status == 'successful') {
														showMsg('评级成功！');
														clientGrid.refresh(community);
														fronzenGrid.refresh(community);
														win.close();
													}
													else {
														showMsg(obj.errMsg);
													}
												}
											}
										})
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}],
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							grid = Ext.getCmp('gridpanel-clientInfo'),
							detailGrid = Ext.getCmp('gridpanel-businessInfo'),
							transferBtn = Ext.getCmp('button-transferToProject');
						grid.initBtn(rec);
						detailGrid.refresh(rec);
						transferBtn.setDisabled(!rec);
					}
				}
			}, {
				autoScroll: true,
				hideHeaders: true,
				height: 200,
				region: 'south',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'gridpanel',
				title: '死单',
				id: 'gridpanel-frozenBusiness',
				name: 'gridpanel-frozenBusiness',
				columns: [{
					text: '死单名称',
					flex: 1,
					dataIndex: 'address'
				}],
				store: Ext.create('FamilyDecoration.store.Business', {
					autoLoad: false
				}),
				tools: [{
					type: 'gear',
					disabled: true,
					id: 'tool-restoreBusiness',
					name: 'tool-restoreBusiness',
					tooltip: '恢复死单',
					callback: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							communityGrid = Ext.getCmp('gridpanel-community'),
							community = communityGrid.getSelectionModel().getSelection()[0],
							fronzenGrid = Ext.getCmp('gridpanel-frozenBusiness'),
							rec = fronzenGrid.getSelectionModel().getSelection()[0];

						Ext.Msg.warning('确定要将	"' + rec.get('address') + '"恢复吗', function (id) {
							if (id == 'yes') {
								Ext.Ajax.request({
									url: './libs/business.php?action=defrostBusiness&businessId=' + rec.getId(),
									method: 'POST',
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.JSON.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('恢复成功！');
												clientGrid.refresh(community);
												fronzenGrid.refresh(community);
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
				refresh: function (community){
					if (community) {
						var grid = this,
							st = grid.getStore(),
							rec = grid.getSelectionModel().getSelection()[0];
						st.reload({
							params: {
								regionId: community.getId(),
								salesmanName: User.getName(),
								isFrozen: true
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
						this.getStore().removeAll();
					}
				},
				initBtn: function (rec){
					var gearBtn = Ext.getCmp('tool-restoreBusiness');

					gearBtn.setDisabled(!rec);
				},
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							grid = Ext.getCmp('gridpanel-frozenBusiness');
						grid.initBtn(rec);
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 4,
			layout: 'fit',
			items: [{
				autoScroll: true,
				hideHeaders: true,
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				xtype: 'gridpanel',
				id: 'gridpanel-businessInfo',
				name: 'gridpanel-businessInfo',
				title: '信息情况',
				height: 400,
				autoScroll: true,
				initBtn: function (rec){
					var editBtn = Ext.getCmp('button-editBusinessInfo'),
						delBtn = Ext.getCmp('button-delBusinessInfo');

					editBtn.setDisabled(!rec);
					delBtn.setDisabled(!rec);
				},
				refresh: function (client){
					var clientName = Ext.getCmp('textfield-clientNameOnTop'),
						businessStaff = Ext.getCmp('textfield-businessStaffOnTop'),
						businessSource = Ext.getCmp('textfield-businessSourceOnTop'),
						businessDesigner = Ext.getCmp('textfield-businessDesignerOnTop');
					if (client) {
						var grid = this,
							st = grid.getStore(),
							rec = grid.getSelectionModel().getSelection()[0];
						st.reload({
							params: {
								businessId: client.getId()
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
						clientName.setValue(client.get('customer'));
						businessStaff.setValue(client.get('salesman'));
						businessSource.setValue(client.get('source'));
						businessDesigner.setValue(client.get('designer'));
					}
					else {
						this.getStore().removeAll();
						clientName.setValue('');
						businessStaff.setValue('');
						businessSource.setValue('');
						businessDesigner.setValue('');
					}
				},
				columns: [
			        {
			        	text: '信息内容',
						flex: 1,
						dataIndex: 'content',
						renderer: function (val, meta, rec){
							return val.replace(/\n/ig, '<br />');
						}
			        }
			    ],
			    store: Ext.create('FamilyDecoration.store.BusinessDetail', {
			    	autoLoad: false
			    }),
			    tbar: [{
					xtype: 'textfield',
					name: 'textfield-clientNameOnTop',
					id: 'textfield-clientNameOnTop',
					labelWidth: 70,
					width: 160,
					readOnly: true,
					fieldLabel: ' 客户姓名'
				}, {
					xtype: 'textfield',
					name: 'textfield-businessStaffOnTop',
					id: 'textfield-businessStaffOnTop',
					labelWidth: 60,
					width: 140,
					readOnly: true,
					fieldLabel: '业务员'
				}, {
					xtype: 'textfield',
					name: 'textfield-businessDesignerOnTop',
					id: 'textfield-businessDesignerOnTop',
					labelWidth: 60,
					width: 140,
					readOnly: true,
					fieldLabel: '设计师'
				}, {
					xtype: 'textfield',
					name: 'textfield-businessSourceOnTop',
					id: 'textfield-businessSourceOnTop',
					labelWidth: 70,
					width: 180,
					readOnly: true,
					fieldLabel: '业务来源'
				}],
			    bbar: [{
					text: '添加',
					id: 'button-addBusinessInfo',
					name: 'button-addBusinessInfo',
					icon: './resources/img/add2.png',
					handler: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							rec = clientGrid.getSelectionModel().getSelection()[0];
						if (rec) {
							var win = Ext.create('FamilyDecoration.view.mybusiness.EditInfo', {

							});

							win.show();
						}
						else {
							showMsg('请先选择地址！');
						}
					}
				}, {
					text: '修改',
					id: 'button-editBusinessInfo',
					name: 'button-editBusinessInfo',
					icon: './resources/img/edit3.png',
					disabled: true,
					handler: function (){
						var detailGrid = Ext.getCmp('gridpanel-businessInfo'),
							rec = detailGrid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mybusiness.EditInfo', {
							infoObj: rec
						});

						win.show();
					}
				}, {
					text: '删除',
					id: 'button-delBusinessInfo',
					name: 'button-delBusinessInfo',
					icon: './resources/img/delete2.png',
					disabled: true,
					handler: function (){
						var clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							client = clientGrid.getSelectionModel().getSelection()[0],
							detailGrid = Ext.getCmp('gridpanel-businessInfo'),
							rec = detailGrid.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要删除当前信息吗？', function (id){
							if ('yes' == id) {
								Ext.Ajax.request({
									url: './libs/business.php?action=deleteBusinessDetail',
									method: 'POST',
									params: {
										detailId: rec.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除成功！');
												detailGrid.refresh(client);
											}
											else {
												showMsg(obj.errMsg);
											}
										}
									}
								})
							}
						})
					}
				}, {
					text: '转为工程',
					id: 'button-transferToProject',
					name: 'button-transferToProject',
					icon: './resources/img/transfer.png',
					disabled: true,
					hidden: true,
					handler: function (){
						var communityGrid = Ext.getCmp('gridpanel-community'),
							clientGrid = Ext.getCmp('gridpanel-clientInfo'),
							community = communityGrid.getSelectionModel().getSelection()[0],
							client = clientGrid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.mybusiness.TransferToProject', {
							community: community,
							client: client
						});
						win.show();
					}
				}],
			    listeners: {
			    	selectionchange: function (view, sels){
			    		var rec = sels[0],
							detailGrid = Ext.getCmp('gridpanel-businessInfo');
						detailGrid.initBtn(rec);
			    	}
			    }
			}]
		}];

		this.callParent();
	}
});