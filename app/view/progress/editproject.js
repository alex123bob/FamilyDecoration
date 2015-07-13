Ext.define('FamilyDecoration.view.progress.EditProject', {
	extend: 'Ext.window.Window',
	alias: 'widget.progress-editproject',
	requires: ['Ext.form.Panel', 'Ext.form.field.Date'],
	resizable: false,
	modal: true,

	title: '', // 新建 | 编辑
	project: null,

	initComponent: function (){
		var me = this,
			pro = me.project;
		if (pro) {
			me.title = '编辑项目"' + pro.get('projectName') + '"';
			pro.set('projectTime', pro.get('projectTime').split(' ')[0]);
		}
		else {
			me.title = '新建项目';
		}

		me.items = [{
			xtype: 'form',
			id: 'form-editproject',
			name: 'form-editproject',
			items: [{
				xtype: 'textfield',
				fieldLabel: '项目名称',
				name: 'projectName',
				allowBlank: false,
				value: pro ? pro.get('projectName') : ''
			}, {
				xtype: 'datefield',
				fieldLabel: '创建时间',
				// format: 'Y/m/d H:i:s',
				format: 'Y/m/d', // if the time needed, change format into the upper type
				name: 'projectTime',
				allowBlank: false,
				value: pro ? pro.get('projectTime').replace(/-/gi, '/') : ''
			}, {
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [{
					name: 'captain',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '项目经理',
					allowBlank: false,
					value: pro ? pro.get('captain') : ''
				}, {
					xtype: 'button',
					text: '选择',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '选择项目经理',
							layout: 'fit',
							modal: true,
							width: 500,
							height: 400,
							items: [{
								xtype: 'gridpanel',
								autoScroll: true,
								columns: [{
									text: '姓名',
									flex: 1,
									dataIndex: 'realname'
								}, {
									text: '用户名',
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
								}],
								store: Ext.create('FamilyDecoration.store.User', {
									autoLoad: true,
									filters: [
										function (item) {
											return /^003-\d{3}$/i.test(item.get('level'));
										}
									]
								})
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var grid = win.down('grid'),
										captain = me.down('[name="captain"]'),
										hidden = me.down('[name="captainName"]'),
										rec = grid.getSelectionModel().getSelection()[0];
									if (rec) {
										captain.setValue(rec.get('realname'));
										hidden.setValue(rec.get('name'));
										win.close();
									}
									else {
										showMsg('请选择成员！');
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}, {
					xtype: 'hidden',
					name: 'captainName',
					hideLabel: true,
					value: pro ? pro.get('captainName') : ''
				}]
			}, {
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [{
					name: 'supervisor',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '项目监理',
					allowBlank: false,
					value: pro ? pro.get('supervisor') : ''
				}, {
					xtype: 'button',
					text: '选择',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '选择项目监理',
							width: 500,
							height: 300,
							layout: 'fit',
							modal: true,
							items: [{
								xtype: 'checklog-memberlist',
								listeners: {
									itemclick: function (view, rec){
										if (!rec.get('name')) {
											return false;
										}
									}
								}
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var memberlist = win.down('treepanel'),
										supervisorTxt = me.down('[name="supervisor"]'),
										supervisorHidden = me.down('[name="supervisorName"]'),
										member = memberlist.getSelectionModel().getSelection()[0];

									if (member && member.get('name')) {
										supervisorTxt.setValue(member.get('realname'));
										supervisorHidden.setValue(member.get('name'));
										win.close();
									}
									else {
										showMsg('请选择成员！');
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}, {
					xtype: 'hidden',
					name: 'supervisorName',
					hideLabel: true,
					value: pro ? pro.get('supervisorName') : ''
				}]
			}, {
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [{
					name: 'salesman',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '业务员',
					allowBlank: false,
					value: pro ? pro.get('salesman') : ''
				}, {
					xtype: 'button',
					text: '选择',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '选择业务员',
							width: 500,
							height: 300,
							layout: 'fit',
							modal: true,
							items: [{
								xtype: 'checklog-memberlist',
								listeners: {
									itemclick: function (view, rec){
										if (!rec.get('name')) {
											return false;
										}
									}
								}
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var memberlist = win.down('treepanel'),
										supervisorTxt = me.down('[name="salesman"]'),
										supervisorHidden = me.down('[name="salesmanName"]'),
										member = memberlist.getSelectionModel().getSelection()[0];

									if (member && member.get('name')) {
										supervisorTxt.setValue(member.get('realname'));
										supervisorHidden.setValue(member.get('name'));
										win.close();
									}
									else {
										showMsg('请选择成员！');
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}, {
					xtype: 'hidden',
					name: 'salesmanName',
					hideLabel: true,
					value: pro ? pro.get('salesmanName') : ''
				}]
			}, {
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [{
					name: 'designer',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '设计师',
					allowBlank: false,
					value: pro ? pro.get('designer') : ''
				}, {
					xtype: 'button',
					text: '选择',
					handler: function (){
						var win = Ext.create('Ext.window.Window', {
							title: '选择设计师',
							layout: 'fit',
							modal: true,
							width: 500,
							height: 400,
							items: [{
								xtype: 'gridpanel',
								autoScroll: true,
								columns: [{
									text: '姓名',
									flex: 1,
									dataIndex: 'realname'
								}, {
									text: '用户名',
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
								}],
								store: Ext.create('FamilyDecoration.store.User', {
									autoLoad: true,
									filters: [
										function (item) {
											return /^002-\d{3}$/i.test(item.get('level'));
										}
									]
								})
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									var grid = win.down('grid'),
										captain = me.down('[name="designer"]'),
										hidden = me.down('[name="designerName"]'),
										rec = grid.getSelectionModel().getSelection()[0];
									if (rec) {
										captain.setValue(rec.get('realname'));
										hidden.setValue(rec.get('name'));
										win.close();
									}
									else {
										showMsg('请选择成员！');
									}
								}
							}, {
								text: '取消',
								handler: function (){
									win.close();
								}
							}]
						});

						win.show();
					}
				}, {
					xtype: 'hidden',
					name: 'designerName',
					hideLabel: true,
					value: pro ? pro.get('designerName') : ''
				}]
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var frm = Ext.getCmp('form-editproject'),
					params = frm.getForm().getFieldValues(),
					treepanel = Ext.getCmp('treepanel-projectName'),
					st = treepanel.getStore();
				if (frm.isValid()) {
					pro && Ext.apply(params, {
						projectId: pro.get('projectId')
					});
					Ext.Ajax.request({
						url: './libs/user.php?action=view',
						method: 'GET',
						callback: function (opts, success, res){
							if (success) {
								var userArr = Ext.decode(res.responseText),
									mailObjects = [];
								for (var i = 0; i < userArr.length; i++) {
									var level = userArr[i].level;
									if (/^001-\d{3}$/i.test(level) || '003-001' == level) {
										mailObjects.push(userArr[i]);
									}
								}

								if (mailObjects.length > 0) {
									Ext.Ajax.request({
										url: pro ? './libs/project.php?action=editProject' : './libs/project.php?action=addProject',
										method: 'POST',
										params: params,
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText);
												
												if (obj.status == 'successful') {
													pro ? showMsg('编辑成功！') : showMsg('添加成功！');
													me.close();
													st.getProxy().url = 'libs/project.php?action=getProjectCaptains';
													st.getProxy().extraParams = {};
													treepanel.getStore().load({
														node: treepanel.getRootNode(),
														callback: function (recs, ope, success){
															if (success) {
																treepanel.getSelectionModel().deselectAll();
															}
														}
													});

													// announce related staffs via email
													var content = User.getRealName() + '创建了工程' + params['projectName'],
														subject = '工程创建通知';
													for (i = 0; i < mailObjects.length; i++) {
														setTimeout((function (index){
															return function (){
																sendMail(mailObjects[index].name, mailObjects[index].mail, subject, content);
															}
														})(i), 1000 * (i + 1));
													}
													// end of announcement
												}
												else {
													showMsg(obj.errMsg);
												}
											}
										}
									});
								}
								else {
									showMsg('没有通知用户！');
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
		}]

		this.callParent();
	}
})