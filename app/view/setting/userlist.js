Ext.define('FamilyDecoration.view.setting.UserList', {
	extend: 'Ext.window.Window',
	alias: 'widget.setting-userlist',

	requires: [
		'FamilyDecoration.store.User',
		'Ext.grid.plugin.RowEditing'
	],

	resizable: false,
	modal: true,
	width: 500,
	height: 300,
	autoScroll: true,

	initComponent: function() {
		var me = this;

		me.title = '设计师优先级及对应称谓编辑';

		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clickToEdit: 1,
			clicksToMoveEditor: 1,
			listeners: {
				edit: function(editor, e) {
					var field = e.field,
						action = '',
						params = e.newValues,
						grid = Ext.getCmp('gridpanel-userListForPriorityConfiguration');
					Ext.apply(params, {
						name: e.record.get('name')
					});
					Ext.Ajax.request({
						url: './libs/user.php?action=modifyPriority',
						method: 'POST',
						params: params,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									showMsg('修改成功！');
									grid.getStore().reload();
								}
								else {
									showMsg(obj.errMsg);
								}
							}
						}
					});
					e.record.commit();
				}
			}
		});

		me.items = [{
			xtype: 'gridpanel',
			plugins: [rowEditing],
			id: 'gridpanel-userListForPriorityConfiguration',
			name: 'gridpanel-userListForPriorityConfiguration',
			columns: [{
				text: '姓名',
				dataIndex: 'realname',
				flex: 1
			}, {
				text: '部门',
				dataIndex: 'level',
				flex: 1,
				renderer: function(val) {
					return User.renderDepartment(val);
				}
			}, {
				text: '职位',
				dataIndex: 'level',
				flex: 1,
				renderer: function(val) {
					return User.renderRole(val);
				}
			}, {
				text: '优先级',
				dataIndex: 'priority',
				flex: 1,
				editor: {
					xtype: 'numberfield',
					minValue: 1,
					maxValue: 99,
					value: 99,
					allowBlank: false,
					editable: false
				}
			}, {
				text: '称谓',
				dataIndex: 'priorityTitle',
				flex: 1,
				editor: {
					xtype: 'textfield'
				}
			}],
			selType: 'rowmodel',
			store: Ext.create('FamilyDecoration.store.User', {
				autoLoad: true,
				filters: [
					function(item) {
						if (/^002-\d{3}$/i.test(item.get('level'))) {
							return true;
						}
					}
				]
			}),
			autoScroll: true
		}];

		me.buttons = [{
			text: '关闭',
			handler: function() {
				me.close();
			}
		}];

		this.callParent();
	}
})