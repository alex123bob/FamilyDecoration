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
					name: 'conCleaHeatDefine',
					dispValue: '空调、洁具、热水器确定：',
					content: me.plan ? me.plan['conCleaHeatDefine'] : ''
				}, {
					name: 'bottomDig',
					dispValue: '底层下挖：',
					content: me.plan ? me.plan['bottomDig'] : ''
				}, {
					name: 'toiletBalCheck',
					dispValue: '卫生间、阳台养水验房：',
					content: me.plan ? me.plan['toiletBalCheck'] : ''
				}, {
					name: 'plumbElecCheck',
					dispValue: '上下水、电路检查：',
					content: me.plan ? me.plan['plumbElecCheck'] : ''
				}, {
					name: 'knockWall',
					dispValue: '敲墙：',
					content: me.plan ? me.plan['knockWall'] : ''
				}, {
					name: 'tileMarbleCabiDefine',
					dispValue: '瓷砖、大理石、橱柜确定：',
					content: me.plan ? me.plan['tileMarbleCabiDefine'] : ''
				}, {
					name: 'waterElecCheck',
					dispValue: '水电材料进场、验收：',
					content: me.plan ? me.plan['waterElecCheck'] : ''
				}, {
					name: 'waterElecConstruct',
					dispValue: '水电施工：',
					content: me.plan ? me.plan['waterElecConstruct'] : ''
				}, {
					name: 'waterElecPhoto',
					dispValue: '水电工程验收、拍照：',
					content: me.plan ? me.plan['waterElecPhoto'] : ''
				}, {
					name: 'tilerMateConstruct',
					dispValue: '泥工材料进场、施工：',
					content: me.plan ? me.plan['tilerMateConstruct'] : ''
				}, {
					name: 'tilerProCheck',
					dispValue: '泥工工程验收：',
					content: me.plan ? me.plan['tilerProCheck'] : ''
				}, {
					name: 'woodMateCheck',
					dispValue: '木工材料进场、验收：',
					content: me.plan ? me.plan['woodMateCheck'] : ''
				}, {
					name: 'woodProConstruct',
					dispValue: '木工工程施工：',
					content: me.plan ? me.plan['woodProConstruct'] : ''
				}, {
					name: 'woodProCheck',
					dispValue: '木工工程验收：',
					content: me.plan ? me.plan['woodProCheck'] : ''
				}, {
					name: 'paintMateCheck',
					dispValue: '油漆材料进场、验收：',
					content: me.plan ? me.plan['paintMateCheck'] : ''
				}, {
					name: 'paintProConstruct',
					dispValue: '油漆工程施工：',
					content: me.plan ? me.plan['paintProConstruct'] : ''
				}, {
					name: 'cabiInstall',
					dispValue: '橱柜安装：',
					content: me.plan ? me.plan['cabiInstall'] : ''
				}, {
					name: 'toilKitchSuspend',
					dispValue: '卫生间、厨房吊顶：',
					content: me.plan ? me.plan['toilKitchSuspend'] : ''
				}, {
					name: 'paintProCheck',
					dispValue: '油漆工程验收：',
					content: me.plan ? me.plan['paintProCheck'] : ''
				}, {
					name: 'switchSocketInstall',
					dispValue: '开关、插座安装：',
					content: me.plan ? me.plan['switchSocketInstall'] : ''
				}, {
					name: 'lampSanitInstall',
					dispValue: '灯具、洁具安装：',
					content: me.plan ? me.plan['lampSanitInstall'] : ''
				}, {
					name: 'floorInstall',
					dispValue: '地板安装：',
					content: me.plan ? me.plan['floorInstall'] : ''
				}, {
					name: 'paintRepair',
					dispValue: '油漆修补：',
					content: me.plan ? me.plan['paintRepair'] : ''
				}, {
					name: 'wallpaperPave',
					dispValue: '墙纸铺贴：',
					content: me.plan ? me.plan['wallpaperPave'] : ''
				}, {
					name: 'housekeepingClean',
					dispValue: '家政保洁：',
					content: me.plan ? me.plan['housekeepingClean'] : ''
				}, {
					name: 'elecInstall',
					dispValue: '电器安装：',
					content: me.plan ? me.plan['elecInstall'] : ''
				}, {
					name: 'curtainFuniInstall',
					dispValue: '窗帘、家具安装：',
					content: me.plan ? me.plan['curtainFuniInstall'] : ''
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
		        		if (val != null) {
		        			return val.replace(/\n/gi, '<br />');
		        		}
		        		else {
		        			return '';
		        		}
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