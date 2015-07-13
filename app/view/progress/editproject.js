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
				fieldLabel: '项目时间',
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
					name: 'projectCaptain',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '项目经理',
					allowBlank: false
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
										captain = Ext.getCmp('textfield-projectCaptain'),
										hidden = Ext.getCmp('hidden-projectCaptainForCheckSign'),
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
					name: 'hidden-projectCaptain',
					hideLabel: true
				}]
			}, {
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				items: [{
					name: 'projectSupervisor',
					xtype: 'textfield',
					readOnly: true,
					fieldLabel: '项目监理',
					allowBlank: false
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
										supervisorTxt = Ext.getCmp('textfield-projectSupervisorForCheckSign'),
										supervisorHidden = Ext.getCmp('hidden-projectSupervisorForCheckSign'),
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
					name: 'hidden-projectSupervisor',
					hideLabel: true
				}]
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var frm = Ext.getCmp('form-editproject'),
					params = frm.getValues(),
					treepanel = Ext.getCmp('treepanel-projectName'),
					st = treepanel.getStore();
				if (frm.isValid()) {
					pro && Ext.apply(params, {
						projectId: pro.get('projectId')
					});
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
								}
								else {
									showMsg(obj.errMsg);
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