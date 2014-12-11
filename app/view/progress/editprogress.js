Ext.define('FamilyDecoration.view.progress.EditProgress', {
	extend: 'Ext.window.Window',
	alias: 'widget.progress-editprogress',
	requires: ['Ext.grid.plugin.CellEditing'],

	// resizable: false,
	modal: true,
	layout: 'fit',
	maximizable: true,

	title: '添加编辑工程进度',
	width: 500,
	height: 300,
	autoScroll: true,
	project: null,

	initComponent: function (){
		var me = this,
			splitFlag = '<>',
			progresses = me.project.get('projectProgress'),
			strips = progresses ? progresses.split(splitFlag) : [];
		for (var i = 0 ; i < strips.length; i++) {
			strips[i] = {
				strip: strips[i]
			};
		}

		me.items = [{
			xtype: 'gridpanel',
			name: 'gridpanel-editProgress',
			id: 'gridpanel-editProgress',
			store: Ext.create('Ext.data.Store', {
				fields: ['strip'],
				data: strips
			}),
			autoScroll: true,
			columns: [{
				header: '项目',
				dataIndex: 'strip',
				align: 'center',
				flex: 1,
				editor: 'textfield'
			}],
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
			],
			selType: 'cellmodel'
		}];

		me.tbar = [{
			xtype: 'button',
			text: '添加',
			handler: function (){
				var grid = Ext.getCmp('gridpanel-editProgress'),
					st = grid.getStore();
				st.insert(0, {
					strip: ''
				});

				grid.plugins[0].startEditByPosition({
		            row: 0, 
		            column: 0
		        });
			}
		}];

		me.bbar = [{
			xtype: 'button',
			text: '保存',
			handler: function (){
				var pro = me.project,
					grid = Ext.getCmp('gridpanel-editProgress'),
					proPanel = Ext.getCmp('treepanel-projectName'),
					progressPanel = Ext.getCmp('gridpanel-projectProgress'),
					arr = grid.getStore().data.items,
					splitFlag = '<>',
					params = '';
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].get('strip')) {
						params += arr[i].get('strip') + splitFlag;
					}
					else {
						continue;
					}
				}
				params = params.slice(0, params.length - splitFlag.length);
				params = {
					projectProgress: params
				};

				pro && Ext.apply(params, {
					projectId: pro.get('projectId')
				});
				Ext.Ajax.request({
					url: './libs/editproject.php',
					method: 'POST',
					params: params,
					callback: function (opts, success, res){
						if (success) {
							var obj = Ext.decode(res.responseText);
							if (obj.status == 'successful') {
								showMsg('编辑成功！');
								me.close();
								proPanel.getStore().load({
									node: pro.parentNode,
									callback: function (res, ope, success){
										if (success) {
											var node = ope.node;
											var newPro = node.findChild('projectId', pro.getId());
											proPanel.getSelectionModel().select(newPro);
											progressPanel.refresh(newPro);
										}
									}
								});
							}
						}
					}
				});
			}
		}, {
			xtype: 'button',
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		this.callParent();
	}
});