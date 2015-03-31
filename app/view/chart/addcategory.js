Ext.define('FamilyDecoration.view.chart.AddCategory', {
	extend: 'Ext.window.Window',
	alias: 'widget.chart-addcategory',
	requires: ['Ext.form.field.Radio', 'FamilyDecoration.view.progress.ProjectList'],

	autoScroll: true,
	width: 500,
	height: 400,
	resizable: false,
	modal: true,

	title: '添加图库名称',

	initComponent: function (){
		var me = this;

		me.items = [{
			xtype: 'radiofield',
			boxLabel: '自定义名称',
			hideLabel: true,
			name: 'radiofield-category',
			checked: true,
			listeners: {
				change: function (radio, newVal, oldVal, opts){
					var txt = Ext.getCmp('textfield-categoryName'),
						tree = Ext.getCmp('projectlist-projectName');
					txt.setDisabled(!newVal);
					tree.setDisabled(newVal);
				}
			}
		}, {
			xtype: 'textfield',
			fieldLabel: '类别名称',
			allowBlank: false,
			id: 'textfield-categoryName',
			name: 'textfield-categoryName'
		}, {
			xtype: 'radiofield',
			boxLabel: '从已有项目选择名称',
			hideLabel: true,
			name: 'radiofield-category'
		}, {
			xtype: 'progress-projectlist',
			isForAddCategory: true,
			header: false,
			id: 'projectlist-projectName',
			name: 'projectlist-projectName',
			disabled: true,
			width: 480,
			height: 200,
			autoScroll: true,
			listeners: {
				itemclick: function (view, rec){
					return rec.get('projectName') != '' ? true : false;
				}
			}
		}];

		me.bbar = [{
			text: '添加',
			handler: function (){
				var radio = Ext.ComponentQuery.query('[name="radiofield-category"]'),
					txt = Ext.getCmp('textfield-categoryName'),
					tree = Ext.getCmp('projectlist-projectName'),
					category = Ext.getCmp('gridpanel-chartCategory'),
					projectCategory = Ext.getCmp('treepanel-chartCategory'),
					st = projectCategory.getStore(),
					pro, params = {},
					add = function (p){
						Ext.Ajax.request({
							url: './libs/addcategory.php',
							method: 'POST',
							params: p,
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										showMsg('图库类别添加成功！');
										me.close();
										category.getStore().reload();
									}
								}
							}
						});
					}
				if (radio[0].getValue()) {
					if (txt.validate()) {
						Ext.apply(params, {
							chartCategory: txt.getValue()
						});
						add(params);
					}
				}
				else if (radio[1].getValue()) {
					pro = tree.getSelectionModel().getSelection()[0];
					if (!pro) {
						Ext.Msg.info('请选择项目名称！');
					}
					else {
						Ext.apply(params, {
							projectId: pro.getId(),
							hasChart: 1
						})
						Ext.Ajax.request({
							url: './libs/project.php?action=editproject',
							method: 'POST',
							params: params,
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										showMsg('图库类别添加成功！');
										me.close();
										st.getProxy().url = 'libs/project.php?action=getProjectYears';
										st.getProxy().extraParams = {};
										st.load({
											node: projectCategory.getRootNode()
										});
									}
								}
							}
						})
					}
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
})