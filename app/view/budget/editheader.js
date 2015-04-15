Ext.define('FamilyDecoration.view.budget.EditHeader', {
	extend: 'Ext.window.Window',
	width: 500,
	height: 300,

	requires: ['FamilyDecoration.view.progress.ProjectList', 'Ext.form.field.Hidden'],

	budgetPanel: null,
	budget: null,

	bodyPadding: 4,
	resizable: false,
	defaults: {
		xtype: 'textfield',
		width: '100%',
		labelWidth: 100,
		width: 400,
		allowBlank: false
	},

	isValid: function (){
		var me = this,
			custName = me.getComponent('textfield-custName'),
			fc = me.down('fieldcontainer'),
			projectName = fc.getComponent('textfield-projectName'),
			areaSize = me.getComponent('textfield-areaSize'),
			desciption = me.getComponent('textarea-comments');
		return custName.isValid() && projectName.isValid() && areaSize.isValid() && desciption.isValid();
	},

	getValue: function (){
		var me = this,
			custName = me.getComponent('textfield-custName'),
			fc = me.down('fieldcontainer'),
			projectName = fc.getComponent('textfield-projectName'),
			projectId = fc.getComponent('hidden-projectId'),
			areaSize = me.getComponent('textfield-areaSize'),
			desciption = me.getComponent('textarea-comments'),
			obj = {};
		Ext.apply(obj, {
			projectId: projectId.getValue(),
			custName: custName.getValue(),
			areaSize: areaSize.getValue(),
			totalFee: "0",
			comments: desciption.getValue(),
			projectName: projectName.getValue()
		});
		return obj;
	},

	modal: true,

	initComponent: function (){
		var me = this;

		me.title = me.budget ? '编辑预算头信息' : '新建预算头信息';

		me.items = [
			{
				fieldLabel: '客户名称',
				itemId: 'textfield-custName',
				value: me.budget ? me.budget['custName'] : ''
			},
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				hideLabel: true,
				items: [
					{
						fieldLabel: '工程地址',
						labelWidth: 100,
						width: 348,
						xtype: 'textfield',
						itemId: 'textfield-projectName',
						readOnly: true,
						allowBlank: false,
						value: me.budget ? me.budget['projectName'] : ''
					},
					{
						xtype: 'button',
						width: 50,
						text: '浏览',
						disabled: me.budget ? true : false,
						handler: function (){
							var btn = this;
							var win = Ext.create('Ext.window.Window', {
								width: 500,
								height: 400,
								modal: true,
								layout: 'fit',
								items: [{
									xtype: 'progress-projectlist',
									searchFilter: true,
									listeners: {
										itemclick: function (view, rec){
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
									text: '选择',
									handler: function (){
										var tree = win.down('treepanel'),
											rec = tree.getSelectionModel().getSelection()[0];
										if (!rec || !rec.get('projectName')) {
											showMsg('请选择项目');
										}
										else {
											var txt = btn.previousSibling(),
												hidden = btn.nextSibling();
											txt.setValue(rec.get('projectName'));
											hidden.setValue(rec.getId());
											win.close();
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
					},
					{
						xtype: 'hidden',
						itemId: 'hidden-projectId',
						value: me.budget ? me.budget['projectId'] : ''
					}
				]
			},
			{
				fieldLabel: '户型大小',
				itemId: 'textfield-areaSize',
				value: me.budget ? me.budget['areaSize'] : ''
			},
			{
				fieldLabel: '预算说明',
				itemId: 'textarea-comments',
				xtype: 'textarea',
				height: 100,
				value: me.budget ? me.budget['comments'] : ''
			},
		];

		me.buttons = [{
			text: '确定',
			handler: function (){
				if (me.isValid()) {
					var p = me.getValue();
					me.budget && Ext.apply(p, {
						budgetId: me.budget['budgetId']
					});
					Ext.Ajax.request({
						url: me.budget ? './libs/budget.php?action=edit' : './libs/budget.php?action=add',
						params: p,
						method: 'POST',
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									var o = {
										custName: p['custName'],
										projectName: p['projectName']
									};
									if (me.budget) {
										showMsg('编辑头信息成功！');
									}
									else {
										Ext.apply(o, {
											budgetId: obj['budgetId']
										});
										showMsg('新建预算头信息成功！');
									}
									me.budgetPanel.loadBudget(o);
									me.close();
								}
								else {
									showMsg(obj.errMsg);
								}
							}
						}
					})
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		me.callParent();
	}
});