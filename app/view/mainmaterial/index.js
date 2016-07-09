Ext.define('FamilyDecoration.view.mainmaterial.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainmaterial-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel', 
		'FamilyDecoration.view.progress.ProjectList', 'FamilyDecoration.store.MainMaterial', 
		'FamilyDecoration.view.mainmaterial.EditMainMaterial', 'FamilyDecoration.view.progress.ProjectListByCaptain'
	],
	layout: 'border',

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			region: 'west',
			layout: 'fit',
			width: 200,
			margin: '0 1 0 0',
			items: [{
				xtype: 'progress-projectlistbycaptain',
				searchFilter: true,
				title: '工程项目名称',
				id: 'treepanel-projectNameForMainMaterial',
				name: 'treepanel-projectNameForMainMaterial',
				autoScroll: true,
				listeners: {
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							addPlanBtn = Ext.getCmp('button-addmaterial'),
							editPlanBtn = Ext.getCmp('button-editmaterial'),
							delPlanBtn = Ext.getCmp('button-deletematerial'),
							confirmBtn = Ext.getCmp('button-confirmmaterial'),
							grid = Ext.getCmp('gridpanel-mainMaterialContent'),
							st = grid.getStore();
						if (rec && rec.get('projectName')) {
							addPlanBtn.enable();
							grid.refresh(rec);
						}
						else {
							st.removeAll();
							addPlanBtn.disable();
							editPlanBtn.disable();
							delPlanBtn.disable();
							confirmBtn.disable();
						}
					}
				}
			}]
		}, {
			region: 'center',
			xtype: 'gridpanel',
			id: 'gridpanel-mainMaterialContent',
			name: 'gridpanel-mainMaterialContent',
			title: '主材订购内容',
			plan: null,
			store: Ext.create('FamilyDecoration.store.MainMaterial'),
			refresh: function (rec){
				var grid = this,
					st = grid.getStore();
				st.load({
					params: {
						projectId: rec.getId()
					},
					callback: function (recs, ope, success){
						if (success) {
							grid.getSelectionModel().deselectAll();
						}
					}
				});
			},
			tbar: [{
				text: '添加',
				id: 'button-addmaterial',
				name: 'button-addmaterial',
				icon: './resources/img/add1.png',
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForMainMaterial'),
						rec = treepanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.mainmaterial.EditMainMaterial', {
						projectId: rec.getId(),
						project: rec
					});
					win.show();
				}
			}, {
				text: '修改',
				id: 'button-editmaterial',
				name: 'button-editmaterial',
				icon: './resources/img/edit1.png',
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForMainMaterial'),
						rec = treepanel.getSelectionModel().getSelection()[0],
						grid = Ext.getCmp('gridpanel-mainMaterialContent'),
						material = grid.getSelectionModel().getSelection()[0];
					if (material) {
						var win = Ext.create('FamilyDecoration.view.mainmaterial.EditMainMaterial', {
							projectId: rec.getId(),
							mainmaterial: material,
							project: rec
						});
						win.show();
					}
					else {
						showMsg('请选择主材！');
					}
				}
			}, {
				text: '删除',
				id: 'button-deletematerial',
				name: 'button-deletematerial',
				icon: './resources/img/delete1.png',
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForMainMaterial'),
						rec = treepanel.getSelectionModel().getSelection()[0],
						grid = Ext.getCmp('gridpanel-mainMaterialContent'),
						material = grid.getSelectionModel().getSelection()[0];
					if (material) {
						Ext.Msg.warning('确定要删除此主材订购内容吗？', function (btn){
							if ('yes' == btn) {
								Ext.Ajax.request({
									url: './libs/mainmaterial.php?action=deleteMaterial',
									method: 'POST',
									params: {
										id: material.getId()
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('删除主材成功！');
												grid.refresh(rec);
											}
										}
									}
								})
							}
						});
					}
					else {
						showMsg('请选择主材！');
					}
				}
			}, {
				text: '确认项目',
				id: 'button-confirmmaterial',
				name: 'button-confirmmaterial',
				icon: './resources/img/confirm.png',
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForMainMaterial'),
						rec = treepanel.getSelectionModel().getSelection()[0],
						grid = Ext.getCmp('gridpanel-mainMaterialContent'),
						material = grid.getSelectionModel().getSelection()[0];
					if (material) {
						Ext.Msg.warning('确定要确认当前主材订购条目吗?', function (btnId){
							if ('yes' == btnId) {
								Ext.Ajax.request({
									url: 'libs/mainmaterial.php?action=checkMaterial',
									method: 'POST',
									params: {
										isChecked: 'true',
										projectId: rec.getId(),
										id: material.getId(),
										materialType: material.get('materialType'),
										productName: material.get('productName')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('已经确认！');
												grid.refresh(rec);
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
						showMsg('请选择主材！');
					}
				}
			}],
			columns: [
		        {
		        	text: '产品名称', 
		        	dataIndex: 'productName', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
		        {
		        	text: '型号',
		        	dataIndex: 'productType', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
		        {
		        	text: '数量',
		        	dataIndex: 'productNumber', 
		        	flex: 0.5,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
		        {
		        	text: '商家及联系人',
		        	dataIndex: 'productMerchant', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
		        {
		        	text: '预定时间及预定人',
		        	dataIndex: 'productSchedule', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
		        {
		        	text: '送货时间',
		        	dataIndex: 'productDeliver', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
				{
					text: '是否已确认',
					dataIndex: 'isChecked',
					flex: 1,
					draggable: false,
					menuDisabled: true,
					sortable: false,
					renderer: function (val, meta, rec){
						if (val === 'true') {
							return '<font color="green">已确认</font>';
						}
						else {
							return '<font color="red">未确认</font>';
						}
					}
				}
		    ],
		    listeners: {
		    	selectionchange: function (view, sels){
		    		var rec = sels[0],
		    			editBtn = Ext.getCmp('button-editmaterial'),
						delBtn = Ext.getCmp('button-deletematerial'),
						confirmBtn = Ext.getCmp('button-confirmmaterial');
		    		editBtn.setDisabled(!rec);
		    		delBtn.setDisabled(!rec);
					confirmBtn.setDisabled(!rec);
		    	}
		    }
		}];

		this.callParent();
	}
});