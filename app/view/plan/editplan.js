Ext.define('FamilyDecoration.view.plan.EditPlan', {
	extend: 'Ext.window.Window',
	alias: 'widget.plan-editplan',
	requires: ['FamilyDecoration.store.PlanCategory', 'FamilyDecoration.model.Plan'],
	layout: 'fit',

	width: 500,
	height: 350,
	modal: true,

	plan: null,
	projectId: undefined,

	initComponent: function (){
		var me = this,
			st = Ext.create('FamilyDecoration.store.PlanCategory', {
				data: [{
					name: 'prework',
					dispValue: '前期工作：',
					content: me.plan ? me.plan['prework'] : ''
				}, {
					name: 'matPrepare',
					dispValue: '材料准备：',
					content: me.plan ? me.plan['matPrepare'] : ''
				}, {
					name: 'waterPower',
					dispValue: '水电施工：',
					content: me.plan ? me.plan['waterPower'] : ''
				}, {
					name: 'cementBasic',
					dispValue: '泥工基础施工：',
					content: me.plan ? me.plan['cementBasic'] : ''
				}, {
					name: 'cementAdvanced',
					dispValue: '泥工饰面施工：',
					content: me.plan ? me.plan['cementAdvanced'] : ''
				}, {
					name: 'woods',
					dispValue: '木工施工：',
					content: me.plan ? me.plan['woods'] : ''
				}, {
					name: 'painting',
					dispValue: '油漆施工：',
					content: me.plan ? me.plan['painting'] : ''
				}, {
					name: 'cleaning',
					dispValue: '保洁：',
					content: me.plan ? me.plan['cleaning'] : ''
				}, {
					name: 'wallFloor',
					dispValue: '洁具、墙纸、木地板：',
					content: me.plan ? me.plan['wallFloor'] : ''
				}]
			});

		me.title = (me.plan ? '编辑' : '添加') + '计划',

		me.items = [{
			xtype: 'gridpanel',
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
		        	sortable: false,
		        	editor: 'textfield'
		        }
		    ],
		    store: st,
		    plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1,
		            listeners: {
		            	edit: function (editor, e){
		            		e.record.commit();
		            		editor.completeEdit();
		            	}
		            }
		        })
			]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var arr = me.down('gridpanel').getStore().data.items,
					obj = {
						projectId: me.projectId
					};
				
				for (var i = 0; i < arr.length; i++) {
					var key = arr[i].get('name'),
						value = arr[i].get('content'),
						str = '{"' + key + '":"' + value + '"}';
					Ext.apply(obj, Ext.decode(str));
				}
				me.plan && Ext.apply(obj, {
					id: me.plan.id
				});
				Ext.Ajax.request({
					url: me.plan ? './libs/plan.php?action=editPlan' : './libs/plan.php?action=addPlan',
					method: 'POST',
					params: obj,
					callback: function (opts, success, res){
						if (success) {
							var obj = Ext.decode(res.responseText),
								treepanel = Ext.getCmp('treepanel-projectNameForPlan'),
								rec = treepanel.getSelectionModel().getSelection()[0],
								gridpanel = Ext.getCmp('gridpanel-projectPlan');
							if (obj.status == 'successful') {
								me.plan ? showMsg('编辑计划成功！') : showMsg('添加计划成功！');
								me.close();
								gridpanel.refresh(rec);
							}
							else {
								Ext.Msg.error(obj.errMsg);
							}
						}
					}
				});
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];

		this.callParent();
	}
});