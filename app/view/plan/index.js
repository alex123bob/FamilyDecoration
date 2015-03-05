Ext.define('FamilyDecoration.view.plan.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.plan-index',
	requires: [
		'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject', 'Ext.tree.Panel', 'FamilyDecoration.view.progress.ProjectList',
		'FamilyDecoration.store.PlanCategory', 'FamilyDecoration.view.plan.EditPlan'
	],
	autoScroll: true,
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
							grid = Ext.getCmp('gridpanel-projectPlan'),
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
									name: 'prework',
									dispValue: '前期工作：',
									content: obj['prework']
								}, {
									name: 'matPrepare',
									dispValue: '材料准备：',
									content: obj['matPrepare']
								}, {
									name: 'waterPower',
									dispValue: '水电施工：',
									content: obj['waterPower']
								}, {
									name: 'cementBasic',
									dispValue: '泥工基础施工：',
									content: obj['cementBasic']
								}, {
									name: 'cementAdvanced',
									dispValue: '泥工饰面施工：',
									content: obj['cementAdvanced']
								}, {
									name: 'woods',
									dispValue: '木工施工：',
									content: obj['woods']
								}, {
									name: 'painting',
									dispValue: '油漆施工：',
									content: obj['painting']
								}, {
									name: 'cleaning',
									dispValue: '保洁：',
									content: obj['cleaning']
								}, {
									name: 'wallFloor',
									dispValue: '洁具、墙纸、木地板：',
									content: obj['wallFloor']
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
				id: 'button-addplan',
				name: 'button-addplan',
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
				id: 'button-deleteplan',
				name: 'button-deleteplan',
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
					})
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
		        		return val.replace(/\n/gi, '<br />');
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