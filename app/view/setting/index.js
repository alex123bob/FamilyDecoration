Ext.define('FamilyDecoration.view.setting.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.setting-index',
	requires: [
		'FamilyDecoration.model.User',
		'FamilyDecoration.view.setting.AddAccount',
		'FamilyDecoration.view.setting.UserList'
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
				flex: 0.5,
				dataIndex: 'realname'
			}, {
				text: '账号',
				flex: 0.6,
				dataIndex: 'name'
			}, {
				text: '等级',
				flex: 0.5,
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
				flex: 1,
				dataIndex: 'mail'
			}, {
				text: '项目',
				flex: 1,
				dataIndex: 'projectName'
			}, {
				text: '供应商',
				flex: 1,
				dataIndex: 'supplierName'
			}, {
				text: '照片',
				flex: 0.3,
				dataIndex: 'profileImage',
				renderer: function (val, meta, rec){
					if (rec.get('name')) {
						return val ? '<img src="' + val + '" width="30" height="30" />' : '无';
					}
					else {
						return '';
					}
				}
			}, {
				text: '锁定',
				hidden: true,
				flex: 0.3,
				dataIndex: 'isLocked',
				renderer: function(val, meta, rec) {
					if (rec.get('name')) {
						return val === 'true' ? '<font color="red">是</font>' : '否';
					}
					else {
						return '';
					}
				}
			}, {
				text: '工资',
				flex: 0.3,
				dataIndex: 'isInStaffSalary',
				renderer: function (val, meta, rec){
					if (rec.get('name')) {
						return val === 'true' ? '<font color="green">是</font>' : '<font color="red">否</font>';
					}
					else {
						return '';
					}
				}
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
					hidden: User.isAdmin() || User.isBusinessStaff() || User.isAdministrationManager() ? false : true,
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
					hidden: !User.isGeneral() ? false : true,
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
				},
				{
					text: '上传照片',
					hidden: User.isAdmin() ? false : true,
					icon: './resources/img/upload.png',
					name: 'button-uploadProfileImage',
					id: 'button-uploadProfileImage',
					disabled: true,
					handler: function (){
						var treepanel = me.down('treepanel'),
							rec = treepanel.getSelectionModel().getSelection()[0];
						var profileImageWin = Ext.create('FamilyDecoration.view.chart.UploadForm', {
		                    title: '用户名片图片上传',
		                    url: './libs/uploadUserProfileImage.php',
		                    supportMult: false,
		                    afterUpload: function(fp, o) {
		                        var p = {},
		                            content = '',
		                            originalName = '',
		                            details = o.result.details;

		                        if (details[0]['success']) {
		                            content = details[0]['file'];
		                            originalName = details[0]['original_file_name'];
		                            Ext.apply(p, {
		                                profileImage: content,
		                                name: rec.get('name')
		                            });

		                            Ext.Ajax.request({
		                                url: './libs/user.php?action=modifyProfileImage',
		                                method: 'POST',
		                                params: p,
		                                callback: function(opts, success, res) {
		                                    if (success) {
		                                        var obj = Ext.decode(res.responseText),
		                                            index;
		                                        if (obj.status == 'successful') {
		                                            showMsg('用户名片图片上传成功！');
		                                            profileImageWin.close();
		                                            me.down('treepanel').refresh();
		                                        }
		                                        else {
		                                            showMsg(obj.errMsg);
		                                        }
		                                    }
		                                }
		                            });
		                        }
		                    }
		                });
		                profileImageWin.show();
					}
				},
				{
					text: '锁定账号',
					hidden: User.isAdmin() ? false : true,
					name: 'button-lockAccount',
					id: 'button-lockAccount',
					icon: 'resources/img/lock2.png',
					handler: function (){
						var treepanel = me.down('treepanel'),
							rec = treepanel.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要锁定当前用户账号吗？一经锁定，该账号关联的业务将会被重置！', function (btnId){
							if ('yes' == btnId) {
								Ext.Ajax.request({
									url: './libs/user.php?action=modify',
									method: 'POST',
									params: {
										name: rec.get('name'),
										level: rec.get('level'),
										realname: rec.get('realname'),
										isLocked: 1
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('账号锁定成功!');
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
				},
				{
					text: '优先级配置',
					hidden: User.isAdmin() ? false : true,
					icon: './resources/img/priority.png',
					name: 'button-priorityConfiguration',
					id: 'button-priorityConfiguration',
					handler: function (){
						var win = Ext.create('FamilyDecoration.view.setting.UserList');
						win.show();
					}
				},
				{
					text: '工资系统配置',
					hidden: !User.isAdmin(),
					icon: './resources/img/salary_permission_setting.png',
					name: 'button-excludeFromStaffSalaryModule',
					id: 'button-excludeFromStaffSalaryModule',
					handler: function (){
						var treepanel = me.down('treepanel'),
							rec = treepanel.getSelectionModel().getSelection()[0];
						Ext.Msg.warning('确定要对当前员工工资系统权限进行配置切换？', function (btnId){
							if ('yes' == btnId) {
								Ext.Ajax.request({
									url: './libs/user.php?action=setStaffSalaryPermission',
									method: 'POST',
									params: {
										name: rec.get('name')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if ('successful' == obj.status) {
												showMsg('设置成功!');
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
						del = Ext.getCmp('button-deleteaccount'),
						upload = Ext.getCmp('button-uploadProfileImage'),
						lockAccount = Ext.getCmp('button-lockAccount'),
						excludeSalary = Ext.getCmp('button-excludeFromStaffSalaryModule');

					if (rec && rec.get('name')) {
						edit.enable();
						reset.enable();
						upload.enable();
						del.setDisabled(rec.get('level') == 1);
						lockAccount.enable();
						excludeSalary.enable();
					}
					else {
						edit.disable();
						reset.disable();
						del.disable();
						upload.disable();
						lockAccount.disable();
						excludeSalary.disable();
					}
				},
				cellclick: function (view, td, cellIndex, rec, tr, rowIndex, ev, opts){
					var treepanel = me.down('treepanel'),
						headerCt = treepanel.down('headercontainer')
						header = headerCt.getHeaderAtIndex(cellIndex),
						dataIndex = header.dataIndex;
					if (rec && rec.get('name') && dataIndex == 'profileImage') {
						var win = Ext.create('Ext.window.Window', {
							layout: 'fit',
							width: 500,
							height: 400,
							maximizable: true,
							modal: true,
							title: '帐户照片',
							items: [
								{
									xtype: 'image',
									src: rec.get('profileImage')
								}
							]
						});
						win.show();
					}
				}
			}
		}];

		this.callParent();
	}
});