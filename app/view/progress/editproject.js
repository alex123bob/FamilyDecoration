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
				value: pro ? pro.get('projectName') : ''
			}, {
				xtype: 'datefield',
				fieldLabel: '项目时间',
				format: 'Y/m/d H:i:s',
				name: 'projectTime',
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
				pro && Ext.apply(params, {
					projectId: pro.get('projectId')
				});
				Ext.Ajax.request({
					url: pro ? './libs/editproject.php' : './libs/addproject.php',
					method: 'POST',
					params: params,
					callback: function (opts, success, res){
						if (success) {
							var obj = Ext.decode(res.responseText);
							if (obj.status == 'successful') {
								pro ? showMsg('编辑成功！') : showMsg('添加成功！');
								me.close();
								st.getProxy().url = 'libs/getprojectyears.php';
								st.getProxy().extraParams = {};
								treepanel.getStore().load({
									node: treepanel.getRootNode()
								});
							}
						}
					}
				});
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