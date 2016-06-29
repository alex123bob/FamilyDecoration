Ext.define('FamilyDecoration.view.setting.AddAccount', {
	extend: 'Ext.window.Window',
	requires: ['Ext.form.field.ComboBox', 'FamilyDecoration.view.progress.ProjectListByCaptain'],
	alias: 'widget.setting-addaccount',

	autoScroll: true,
	resizable: false,
	modal: true,
	width: 400,
	height: 330,

	title: '添加账号',

	treepanel: undefined,
	account: undefined,

	getRoleData: function () {
		var roleArr = User.role,
			res = {};
		for (var i = 0; i < roleArr.length; i++) {
			var obj = roleArr[i],
				val = obj.value,
				depa = val.split('-')[0],
				role = val.split('-')[1];
			if (Ext.isArray(res[depa])) {
				res[depa].push({
					name: obj.name,
					value: role
				});
			}
			else {
				res[depa] = [{
					name: obj.name,
					value: role
				}];
			}
		}
		return res;
	},

	initComponent: function () {
		var me = this,
			account = me.account,
			levelSt, isLevelFieldReadOnly = false;

		function createLevelStByDepa(depaStr) {
			if (!depaStr) {
				depaStr = '002';
			}
			var data = me.getRoleData()[depaStr];
			var levelSt = Ext.create('Ext.data.Store', {
				fields: ['name', 'value'],
				proxy: {
					type: 'memory'
				},
				data: data
			});
			return levelSt;
		}

		if (User.isAdmin() || User.isAdministrationManager()) {
			if (account) {
				levelSt = createLevelStByDepa(account.get('level').split('-')[0]);
			}
			else {
				levelSt = createLevelStByDepa();
			}
			isLevelFieldReadOnly = false;
		}
		else if (User.isBusinessStaff()) {
			if (account) {
				levelSt = createLevelStByDepa(account.get('level').split('-')[0]);
				isLevelFieldReadOnly = account.get('level').split('-')[0] != '006';
			}
			else {
				levelSt = createLevelStByDepa('006');
				isLevelFieldReadOnly = false;
			}
		}
		else {
			if (account) {
				levelSt = createLevelStByDepa(account.get('level').split('-')[0]);
			}
			else {
			}
			isLevelFieldReadOnly = true;
		}

		me.title = account ? '编辑账号' : '添加账号';

		me.items = [{
			xtype: 'form',
			margin: '4 0 0 0',
			defaultType: 'textfield',
			defaults: {
				width: 255
			},
			items: [
				{
					fieldLabel: '用户名',
					name: 'name',
					regex: new RegExp('^(?!.*/)', 'ig'),
					regexText: '用户名不能含有符号"/"',
					allowBlank: false,
					readOnly: account ? true : false,
					value: account ? account.get('name') : ''
				},
				{
					fieldLabel: '姓名',
					name: 'realname',
					allowBlank: false,
					value: account ? account.get('realname') : ''
				},
				{
					inputType: 'password',
					fieldLabel: '密码',
					name: 'pwd',
					allowBlank: false,
					validator: function (val) {
						var confirm = this.nextSibling(),
							pwd = this;

						if (pwd.getValue() != confirm.getValue()) {
							return '两次密码不一致';
						}
						else {
							return true;
						}
					}
				},
				{
					inputType: 'password',
					fieldLabel: '确认密码',
					name: 'confirm',
					allowBlank: false,
					validator: function (val) {
						var pwd = this.previousSibling(),
							confirm = this;

						if (pwd.getValue() != confirm.getValue()) {
							return '两次密码不一致';
						}
						else {
							return true;
						}
					}
				},
				{
					fieldLabel: '手机号码',
					name: 'phone',
					vtype: 'phone',
					allowBlank: true,
					value: account ? account.get('phone') : ''
				},
				{
					fieldLabel: '邮箱地址',
					name: 'mail',
					vtype: 'mail',
					allowBlank: true,
					value: account ? account.get('mail') : ''
				},
				{
					xtype: 'combobox',
					fieldLabel: '部门',
					allowBlank: false,
					editable: false,
					readOnly: isLevelFieldReadOnly,
					name: 'department',
					displayField: 'name',
					valueField: 'value',
					value: account ? account.get('level').split('-')[0] : '',
					store: Ext.create('Ext.data.Store', {
						fields: [
							{
								name: 'name',
								convert: function (v, rec) {
									return User.renderDepartment(rec.raw.value);
								}
							},
							{
								name: 'value',
								convert: function (v, rec) {
									return rec.raw.value.split('-')[0];
								}
							}
						],
						proxy: {
							type: 'memory'
						},
						data: User.role,
						filters: [
							function (item) {
								if (User.isAdmin() || User.isAdministrationManager()) {
									return true;
								}
								else if (User.isBusinessStaff()) {
									if (account) {
										return item.get('level') == account.get('level');
									}
									else {
										return item.get('value') == '006';
									}
								}
								else {
									if (account) {
										return item.get('level') == account.get('level');
									}
									else {
										return false;
									}
								}
							}
						],
						listeners: {
							load: function (st, recs) {
								var hits = {};
								st.filterBy(function (record) {
									var department = record.get('value');
									if (hits[department]) {
										return false;
									}
									else {
										hits[department] = true;
										return true;
									}
								});
								delete st.snapshot;
							}
						}
					}),
					queryMode: 'local',
					listeners: {
						change: function (combo, newVal, oldVal) {
							var levelCombo = combo.nextSibling(),
								st = levelCombo.getStore(),
								data = me.getRoleData()[newVal];

							levelCombo.clearValue();
							st.loadData(data);
						}
					}
				},
				{
					xtype: 'combobox',
					fieldLabel: '等级',
					allowBlank: false,
					editable: false,
					name: 'level',
					displayField: 'name',
					valueField: 'value',
					value: account ? account.get('level').split('-')[1] : '',
					queryMode: 'local',
					readOnly: isLevelFieldReadOnly,
					store: levelSt,
					listeners: {
						change: function (combo, newVal, oldVal) {
							if (newVal == '001' && combo.previousSibling().getValue() == '006') {
								combo.nextSibling().show();
							}
							else {
								combo.nextSibling().hide();
							}
						}
					}
				},
				{
					xtype: 'fieldcontainer',
					fieldLabel: '项目名称',
					name: 'projectId',
					id: 'fieldcontainer-projectId',
					hidden: true,
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					width: 300,
					items: [{
						xtype: 'textfield',
						hideLabel: true,
						width: 150,
						readOnly: true
					}, {
							xtype: 'button',
							text: '浏览',
							flex: 1,
							handler: function () {
								var browseBtn = this;
								var win = Ext.create('Ext.window.Window', {
									width: 500,
									height: 400,
									title: '选择项目',
									layout: 'fit',
									items: [{
										xtype: 'progress-projectlistbycaptain',
										searchFilter: true,
										listeners: {
											itemclick: function (view, rec) {
												if (rec.get('projectName')) {
													return true;
												}
												else {
													return false;
												}
											}
										}
									}],
									buttons: [{
										text: '确定',
										handler: function () {
											var tree = win.down('treepanel'),
												rec = tree.getSelectionModel().getSelection()[0];
											if (!rec || !rec.get('projectName')) {
												showMsg('请选择项目');
											}
											else {
												var txt = browseBtn.previousSibling(),
													hidden = browseBtn.nextSibling();
												txt.setValue(rec.get('projectName'));
												hidden.setValue(rec.getId());
												win.close();
											}
										}
									}, {
											text: '取消',
											handler: function () {
												win.close();
											}
										}]
								});
								win.show();
							}
						}, {
							xtype: 'hidden',
							id: 'hidden-projectId'
						}]
				}
			]
		}];

		me.buttons = [{
			text: '保存',
			handler: function () {
				var frm = me.down('form'),
					container = Ext.getCmp('fieldcontainer-projectId'),
					projectTxt = container.down('textfield');
				if (frm.isValid()) {
					if (container.isHidden() || (!container.isHidden() && projectTxt.getValue())) {
						var data = frm.getValues(),
							p = {
								name: data.name,
								password: data.pwd,
								level: data.department + '-' + data.level,
								realname: data.realname
							};
						if (!container.isHidden() && projectTxt.getValue()) {
							Ext.apply(p, {
								projectId: Ext.getCmp('hidden-projectId').getValue()
							});
						}
						if (data.phone) {
							Ext.apply(p, {
								phone: data.phone
							});
						}
						if (data.mail) {
							Ext.apply(p, {
								mail: data.mail
							});
						}
						Ext.Ajax.request({
							url: account ? './libs/user.php?action=modify' : './libs/user.php?action=register',
							params: p,
							method: 'POST',
							callback: function (opts, success, res) {
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										account ? showMsg('编辑用户成功！') : showMsg('用户创建成功！');
										me.treepanel.refresh();
										me.close();
										if (account && User.isCurrent(data.name)) {
											Ext.Msg.info('修改的用户为当前所在用户，需要重新登录！点击【确定】后请重新登录！', function () {
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
					else {
						showMsg('游客账号请选择项目！');
					}
				}
			}
		}, {
				text: '取消',
				handler: function () {
					me.close();
				}
			}];

		me.listeners = {
			show: function (win) {
				if (account && account.get('level') == '006-001') {
					var ct = Ext.getCmp('fieldcontainer-projectId'),
						txt = ct.down('textfield'),
						hidden = ct.down('hidden');
					txt.setValue(account.get('projectName'));
					hidden.setValue(account.get('projectId'));
					ct.show();
				}
			}
		}

		this.callParent();
	}
});