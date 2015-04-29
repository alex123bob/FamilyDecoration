Ext.define('FamilyDecoration.view.plan.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.plan-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel', 'FamilyDecoration.view.progress.ProjectList',
		'FamilyDecoration.store.PlanCategory', 'FamilyDecoration.view.plan.EditPlan'
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
				xtype: 'progress-projectlist',
				searchFilter: true,
				title: '工程项目名称',
				id: 'treepanel-projectNameForPlan',
				name: 'treepanel-projectNameForPlan',
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
						if (rec.get('projectName')) {
							
						}
						else {
							return false;
						}
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0],
							addPlanBtn = Ext.getCmp('button-addplan'),
							editPlanBtn = Ext.getCmp('button-editplan'),
							delPlanBtn = Ext.getCmp('button-deleteplan'),
							backBtn =  Ext.getCmp('button-backToProject'),
							grid = Ext.getCmp('gridpanel-projectPlan'),
							st = grid.getStore();
						if (rec && rec.get('projectName')) {
							addPlanBtn.enable();
							backBtn.enable();
							grid.refresh(rec);
						}
						else {
							st.removeAll();
							addPlanBtn.disable();
							editPlanBtn.disable();
							delPlanBtn.disable();
							backBtn.disable();
						}
						
					}
				}
			}]
		}, {
			region: 'center',
			xtype: 'gridpanel',
			id: 'gridpanel-projectPlan',
			name: 'gridpanel-projectPlan',
			title: '工程计划',
			plan: null,
			store: Ext.create('FamilyDecoration.store.PlanCategory'),
			refresh: function (rec){
				var grid = this,
					st = grid.getStore();
				Ext.Ajax.request({
					url: './libs/plan.php?action=getPlanByProjectId&projectId=' + rec.getId(),
					method: 'GET',
					callback: function (opts, success, res){
						if (success) {
							var arr = Ext.decode(res.responseText),
								editPlanBtn = Ext.getCmp('button-editplan'),
								delPlanBtn = Ext.getCmp('button-deleteplan'),
								dataArr = [], obj;
							if (arr.length > 0) {
								obj = arr[0];
								grid.plan = obj;
								dataArr = [{
									name: 'conCleaHeatDefine',
									dispValue: '空调、洁具、热水器确定：',
									content: obj['conCleaHeatDefine']
								}, {
									name: 'bottomDig',
									dispValue: '底层下挖：',
									content: obj['bottomDig']
								}, {
									name: 'toiletBalCheck',
									dispValue: '卫生间、阳台养水验房：',
									content: obj['toiletBalCheck']
								}, {
									name: 'plumbElecCheck',
									dispValue: '上下水、电路检查：',
									content: obj['plumbElecCheck']
								}, {
									name: 'knockWall',
									dispValue: '敲墙：',
									content: obj['knockWall']
								}, {
									name: 'tileMarbleCabiDefine',
									dispValue: '瓷砖、大理石、橱柜确定：',
									content: obj['tileMarbleCabiDefine']
								}, {
									name: 'waterElecCheck',
									dispValue: '水电材料进场、验收：',
									content: obj['waterElecCheck']
								}, {
									name: 'waterElecConstruct',
									dispValue: '水电施工：',
									content: obj['waterElecConstruct']
								}, {
									name: 'waterElecPhoto',
									dispValue: '水电工程验收、拍照：',
									content: obj['waterElecPhoto']
								}, {
									name: 'tilerMateConstruct',
									dispValue: '泥工材料进场、施工：',
									content: obj['tilerMateConstruct']
								}, {
									name: 'tilerProCheck',
									dispValue: '泥工工程验收：',
									content: obj['tilerProCheck']
								}, {
									name: 'woodMateCheck',
									dispValue: '木工材料进场、验收：',
									content: obj['woodMateCheck']
								}, {
									name: 'woodProConstruct',
									dispValue: '木工工程施工：',
									content: obj['woodProConstruct']
								}, {
									name: 'woodProCheck',
									dispValue: '木工工程验收：',
									content: obj['woodProCheck']
								}, {
									name: 'paintMateCheck',
									dispValue: '油漆材料进场、验收：',
									content: obj['paintMateCheck']
								}, {
									name: 'paintProConstruct',
									dispValue: '油漆工程施工：',
									content: obj['paintProConstruct']
								}, {
									name: 'cabiInstall',
									dispValue: '橱柜安装：',
									content: obj['cabiInstall']
								}, {
									name: 'toilKitchSuspend',
									dispValue: '卫生间、厨房吊顶：',
									content: obj['toilKitchSuspend']
								}, {
									name: 'paintProCheck',
									dispValue: '油漆工程验收：',
									content: obj['paintProCheck']
								}, {
									name: 'switchSocketInstall',
									dispValue: '开关、插座安装：',
									content: obj['switchSocketInstall']
								}, {
									name: 'lampSanitInstall',
									dispValue: '灯具、洁具安装：',
									content: obj['lampSanitInstall']
								}, {
									name: 'floorInstall',
									dispValue: '地板安装：',
									content: obj['floorInstall']
								}, {
									name: 'paintRepair',
									dispValue: '油漆修补：',
									content: obj['paintRepair']
								}, {
									name: 'wallpaperPave',
									dispValue: '墙纸铺贴：',
									content: obj['wallpaperPave']
								}, {
									name: 'housekeepingClean',
									dispValue: '家政保洁：',
									content: obj['housekeepingClean']
								}, {
									name: 'elecInstall',
									dispValue: '电器安装：',
									content: obj['elecInstall']
								}, {
									name: 'curtainFuniInstall',
									dispValue: '窗帘、家具安装：',
									content: obj['curtainFuniInstall']
								}];

								editPlanBtn.enable();
								delPlanBtn.enable();
								st.loadData(dataArr);
							}
							else {
								editPlanBtn.disable();
								delPlanBtn.disable();
								st.loadData([]);
							}
						}
					}
				});
			},
			tbar: [{
				text: '添加',
				icon: './resources/img/add.png',
				id: 'button-addplan',
				name: 'button-addplan',
				hidden: User.isGeneral() ? true : false,
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForPlan'),
						rec = treepanel.getSelectionModel().getSelection()[0];
					var win = Ext.create('FamilyDecoration.view.plan.EditPlan', {
						projectId: rec.getId()
					});
					win.show();
				}
			}, {
				text: '修改',
				id: 'button-editplan',
				name: 'button-editplan',
				icon: './resources/img/edit.png',
				hidden: User.isGeneral() ? true : false,
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForPlan'),
						rec = treepanel.getSelectionModel().getSelection()[0],
						grid = Ext.getCmp('gridpanel-projectPlan');
					var win = Ext.create('FamilyDecoration.view.plan.EditPlan', {
						projectId: rec.getId(),
						plan: grid.plan
					});
					win.show();
				}
			}, {
				text: '删除',
				icon: './resources/img/delete.png',
				id: 'button-deleteplan',
				name: 'button-deleteplan',
				hidden: User.isGeneral() ? true : false,
				disabled: true,
				handler: function (){
					var treepanel = Ext.getCmp('treepanel-projectNameForPlan'),
						rec = treepanel.getSelectionModel().getSelection()[0],
						grid = Ext.getCmp('gridpanel-projectPlan');
					Ext.Msg.warning('确定要删除此计划吗？', function (btn){
						if ('yes' == btn) {
							Ext.Ajax.request({
								url: './libs/plan.php?action=deletePlanByProjectId',
								method: 'POST',
								params: {
									projectId: rec.getId()
								},
								callback: function (opts, success, res){
									if (success) {
										var obj = Ext.decode(res.responseText);
										if (obj.status == 'successful') {
											showMsg('删除计划成功！');
											grid.refresh(rec);
										}
									}
								}
							})
						}
					});
				}
			}, {
				text: '返回工程',
				icon: './resources/img/back.png',
				id: 'button-backToProject',
				name: 'button-backToProject',
				disabled: true,
				handler: function() {
					var sel = Ext.getCmp('treepanel-projectNameForPlan').getSelectionModel().getSelection()[0];
					if (sel) {
						window.pro = {
							year: sel.get('projectYear'),
							month: sel.get('projectMonth'),
							pid: sel.getId()
						};

						changeMainCt('progress-index');
					}
					else {
						showMsg('请选择工程！');
					}
				}
			}],
			columns: [
		        {
		        	text: '名称', 
		        	dataIndex: 'dispValue', 
		        	flex: 1,
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        },
		        {
		        	text: '内容',
		        	dataIndex: 'content', 
		        	flex: 1,
		        	renderer: function (val){
		        		if (val != null) {
		        			return val.replace(/\n/gi, '<br />');
		        		}
		        		else {
		        			return '';
		        		}
		        	},
		        	draggable: false,
		        	menuDisabled: true,
		        	sortable: false
		        }
		    ],
		    listeners: {
		    	selectionchange: function (view, sels){
		    		var rec = sels[0];
		    	}
		    }
		}];

		this.callParent();
	}
});