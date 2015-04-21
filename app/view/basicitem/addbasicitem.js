Ext.define('FamilyDecoration.view.basicitem.AddBasicItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.basicitem-addbasicitem',
	requires: ['Ext.grid.plugin.CellEditing'],

	// resizable: false,
	modal: true,
	layout: 'fit',
	maximizable: true,

	title: '添加大类项目',
	width: 520,
	height: 300,
	autoScroll: true,

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'gridpanel',
			name: 'gridpanel-addBasicItem',
			id: 'gridpanel-addBasicItem',
			store: Ext.create('Ext.data.Store', {
				fields: ['itemName']
			}),
			autoScroll: true,
			columns: [{
				header: '基础项目名称',
				dataIndex: 'itemName',
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
				var grid = Ext.getCmp('gridpanel-addBasicItem'),
					st = grid.getStore();
				st.insert(0, {
					itemName: ''
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
				var grid = Ext.getCmp('gridpanel-addBasicItem'),
					st = grid.getStore(),
					data = st.data.items,
					names = [], p = {};

				for (var i = 0; i < data.length; i++) {
					if (data[i].get('itemName') != '') {
						names.push(data[i].get('itemName'));
					}
				}
				if (names.length > 0) {
					names = names.join('<>');
					p = {
						itemName: names
					};
					Ext.Ajax.request({
						url: './libs/basicitem.php?action=addbunchbasicitems',
						method: 'POST',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									grid = Ext.getCmp('gridpanel-basicitem'),
									st = grid.getStore();
								if (obj.status == 'successful') {
									showMsg('添加成功！');
									st.reload();
									me.close();
								}
							}
						}
					});
				}
				else {
					Ext.Msg.info('请输入项目名称！');
				}
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