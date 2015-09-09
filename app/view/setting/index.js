Ext.define('FamilyDecoration.view.setting.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.setting-index',
	requires: [
		'FamilyDecoration.model.User',
		'FamilyDecoration.view.setting.AddAccount'
	],
	layout: 'fit',

	initComponent: function (){
		var me = this;

		me.items = [{
			autoScroll: true,
			xtype: 'treepanel',
			useArrows: true,
			id: 'treepanel-userList',
			name: 'treepanel-userList',
			refresh: function (){
				var treepanel = this,
					st = treepanel.getStore();
				st.proxy.url = './libs/user.php';
				st.proxy.extraParams = {
					action: 'getUserDepartments'
				};
				st.reload({
					node: st.getRootNode(),
					callback: function (recs, ope, success){
						if (success) {
							treepanel.getSelectionModel().deselectAll();
						}
					}
				});
			},
			columns: [{
				xtype: 'treecolumn',
				text: '部门',
				flex: 1,
				dataIndex: 'department',
				renderer: function (val, meta, rec){
					return User.renderDepartment(val);
				}
			}, {
				text: '姓名',
				flex: 1,
				dataIndex: 'realname'
			}, {
				text: '账号',
				flex: 1,
				dataIndex: 'name'
			}, {
				text: '等级',
				flex: 1,
				dataIndex: 'level',
				renderer: function (val, meta, rec){
					if (rec.get('name')) {
						return User.renderRole(val);
					}
					else {
						return '';
					}
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
			rootVisible: false,
			store: Ext.create('Ext.data.TreeStore', {
				root: {
					expanded: true,
					text: 'root'
				},
				model: 'FamilyDecoration.model.User',
				autoLoad: true,
				proxy: {
					type: 'rest',
			    	url: './libs/user.php',
			    	appendId: false,
			    	extraParams: {
			    		action: 'getUserDepartments'
			    	},
			        reader: {
			            type: 'json'
			        }
				},
				listeners: {
					beforeload: function (st, ope){
						var node = ope.node;
						if (!node.get('name') && node.get('department')){
							st.proxy.url = './libs/user.php';
							st.proxy.extraParams = {
								department: node.get('department').split('-')[0],
								action: 'getUserListByDepartment'
							};
						}
					},
					beforeappend: function (pNode, node){
						if (pNode) {
							if (node.get('department') && !node.get('name')) {
								node.set({
									icon: 'resources/img/group.png'
								});
							}
							else if (node.get('name')) {
								node.set({
									leaf: true,
									icon: 'resources/img/user.png'
								});
							}
						}
					},
					load: function (){
						var tree = me.down('treepanel');
						tree.expandAll();
					}
				}
			}),
			tbar: [
				{
					text: '添加账号',
					icon: './resources/img/add4.png',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.setting.AddAccount', {
							treepanel: me.down('treepanel')
						});
						
						win.show();
					}
				}, 
				{
					text: '修改账号',
					icon: './resources/img/edit1.png',
					hidden: User.isAdmin() || User.isBusinessStaff() || User.isAdministrationManager() ? false : true,
					name: 'button-editaccount',
					id: 'button-editaccount',
					disabled: true,
					handler: function (){
						var treepanel = me.down('treepanel'),
							rec = treepanel.getSelectionModel().getSelection()[0];
						var win = Ext.create('FamilyDecoration.view.setting.AddAccount', {
							treepanel: treepanel,
							account: rec
						});
						
						win.show();
					}
				}, 
				{
					text: '重置密码',
					hidden: User.isAdmin() || User.isAdministrationManager() ? false : true,
					id: 'button-resetaccount',
					name: 'button-resetaccount',
					icon: './resources/img/reset.png',
					disabled: true,
					handler: function (){
						var treepanel = me.down('treepanel'),
							rec = treepanel.getSelectionModel().getSelection()[0];
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
												me.down('treepanel').refresh();
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
						var treepanel = me.down('treepanel'),
							rec = treepanel.getSelectionModel().getSelection()[0];
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
												me.down('treepanel').refresh();
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

					if (rec && rec.get('name')) {
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