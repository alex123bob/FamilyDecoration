Ext.define('FamilyDecoration.view.setting.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.setting-index',
	requires: [
		'FamilyDecoration.store.User',
		'FamilyDecoration.view.setting.AddAccount'
	],
	layout: 'fit',

	initComponent: function (){
		var me = this;

		me.items = [{
			autoScroll: true,
			xtype: 'gridpanel',
			columns: [{
				text: '姓名',
				flex: 1,
				dataIndex: 'realname'
			}, {
				text: '账号',
				flex: 1,
				dataIndex: 'name'
			}, {
				text: '部门',
				flex: 1,
				dataIndex: 'level',
				renderer: function (val){
					return User.renderDepartment(val);
				}
			}, {
				text: '等级',
				flex: 1,
				dataIndex: 'level',
				renderer: function (val){
					return User.renderRole(val);
				}
			}, {
				text: '手机',
				flex: 0.7,
				dataIndex: 'phone'
			}, {
				text: '邮箱',
				flex: 1.3,
				dataIndex: 'mail'
			}, {
				text: '项目',
				flex: 1,
				dataIndex: 'projectName'
			}],
			store: Ext.create('FamilyDecoration.store.User', {
				autoLoad: true,
				filters: [
					function (item) {
						if (User.isBusinessStaff()) {
							return item.get('level') == '006-001';
						}
						else if (User.isAdmin()) {
							return true;
						}
					}
				]
			}),
			tbar: [
				{
					text: '添加账号',
					icon: './resources/img/add4.png',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.setting.AddAccount', {
							grid: me.down('gridpanel')
						});
						
						win.show();
					}
				}, 
				{
					text: '修改账号',
					icon: './resources/img/edit1.png',
					hidden: User.isAdmin() || User.isBusinessStaff() ? false : true,
					name: 'button-editaccount',
					id: 'button-editaccount',
					disabled: true,
					handler: function (){
						var grid = me.down('gridpanel'),
							rec = grid.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.setting.AddAccount', {
							grid: grid,
							account: rec
						});
						
						win.show();
					}
				}, 
				{
					text: '重置密码',
					hidden: User.isAdmin() ? false : true,
					id: 'button-resetaccount',
					name: 'button-resetaccount',
					icon: './resources/img/reset.png',
					disabled: true,
					handler: function (){
						var grid = me.down('gridpanel'),
							rec = grid.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要重置该账户密码吗？', function (btnId){
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: './libs/user.php?action=reset',
									method: 'POST',
									params: {
										name: rec.get('name')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('账号重置成功，初始密码为666666。');
												me.down('gridpanel').getStore().reload();
												if (User.isCurrent(rec.get('name'))) {
													Ext.Msg.info('重置的用户为当前所在用户，需要重新登录！点击【确定】后请重新登录！', function (){
														logout();
													});
												}
											}
										}
									}
								});
							}
						});
					}
				},
				{
					text: '删除账号',
					hidden: User.isAdmin() ? false : true,
					icon: './resources/img/delete3.png',
					name: 'button-deleteaccount',
					id: 'button-deleteaccount',
					disabled: true,
					handler: function (){
						var grid = me.down('gridpanel'),
							rec = grid.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要删除该账户吗？', function (btnId){
							if (btnId == 'yes') {
								Ext.Ajax.request({
									url: './libs/user.php?action=delete',
									method: 'POST',
									params: {
										name: rec.get('name')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.status == 'successful') {
												showMsg('账号删除成功！');
												me.down('gridpanel').getStore().reload();
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
				}
			],
			listeners: {
				selectionchange: function (selModel, sels, opts){
					var rec = sels[0],
						edit = Ext.getCmp('button-editaccount'),
						reset = Ext.getCmp('button-resetaccount'),
						del = Ext.getCmp('button-deleteaccount');

					if (rec) {
						edit.enable();
						reset.enable();
						del.setDisabled(rec.get('level') == 1);
					}
					else {
						edit.disable();
						reset.disable();
						del.disable();
					}
				}
			}
		}];

		this.callParent();
	}
});