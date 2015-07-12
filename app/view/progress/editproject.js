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