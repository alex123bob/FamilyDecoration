Ext.define('FamilyDecoration.view.setting.AddAccount', {
	extend: 'Ext.window.Window',
	requires: ['Ext.form.field.ComboBox'],
	alias: 'widget.setting-addaccount',
	
	autoScroll: true,
	resizable: false,
	modal: true,
	width: 400,
	height: 260,

	title: '添加账号',

	grid: undefined,
	account: undefined,

	initComponent: function (){
		var me = this,
			account = me.account;

		me.title = account ? '编辑账号' : '添加账号';

		me.items = [{
			xtype: 'form',
			margin: '4 0 0 0',
			defaultType: 'textfield',
			items: [{
				fieldLabel: '用户名',
				name: 'name',
				allowBlank: false,
				readOnly: account ? true : false,
				value: account ? account.get('name') : ''
			}, {
				inputType: 'password',
				fieldLabel: '密码',
				name: 'pwd',
				allowBlank: false,
				validator: function (val){
					var confirm = this.nextSibling(),
						pwd = this;

					if (pwd.getValue() != confirm.getValue()) {
						return '两次密码不一致';
					}
					else {
						return true;
					}
				}
			}, {
				inputType: 'password',
				fieldLabel: '确认密码',
				name: 'confirm',
				allowBlank: false,
				validator: function (val){
					var pwd = this.previousSibling(),
						confirm = this;

					if (pwd.getValue() != confirm.getValue()) {
						return '两次密码不一致';
					}
					else {
						return true;
					}
				}
			}, {
				xtype: 'combobox',
				fieldLabel: '角色',
				allowBlank: false,
				editable: false,
				name: 'level',
				displayField: 'name',
				valueField: 'value',
				value: account ? account.get('level') : '',
				store: Ext.create('Ext.data.Store', {
					fields: ['name', 'value'],
					proxy: {
						type: 'memory'
					},
					data: User.role
				})
			}]
		}];

		me.buttons = [{
			text: '保存',
			handler: function (){
				var frm = me.down('form');
				if (frm.isValid()) {
					var data = frm.getValues();
					Ext.Ajax.request({
						url: account ? './libs/user.php?action=modify' : './libs/user.php?action=register',
						params: {
							name: data.name,
							password: data.pwd,
							level: data.level
						},
						method: 'POST',
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									account ? showMsg('编辑用户成功！') : showMsg('用户创建成功！');
									me.grid.getStore().reload();
									me.close();
									if (account && User.isCurrent(data.name)) {
										Ext.Msg.info('修改的用户为当前所在用户，需要重新登录！点击【确定】后请重新登录！', function (){
											logout();
										});
									}
								}
								else {
									Ext.Msg.info(obj.errMsg);
								}
							}
						}
					});
				}
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