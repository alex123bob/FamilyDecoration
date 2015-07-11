Ext.define('FamilyDecoration.view.budget.EditHeader', {
	extend: 'Ext.window.Window',
	width: 500,
	height: 310,

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

	addressType: undefined,

	isValid: function (){
		var me = this,
			custName = me.getComponent('textfield-custName'),
			fc = me.down('fieldcontainer'),
			projectOrBusinessName = fc.getComponent('textfield-projectOrBusinessName'),
			areaSize = me.getComponent('textfield-areaSize'),
			desciption = me.getComponent('textarea-comments'),
			budgetName = me.getComponent('textfield-budgetName');
		return custName.isValid() && projectOrBusinessName.isValid() && areaSize.isValid() && desciption.isValid() && budgetName.isValid();
	},

	getValue: function (){
		var me = this,
			custName = me.getComponent('textfield-custName'),
			fc = me.down('fieldcontainer'),
			projectOrBusinessName = fc.getComponent('textfield-projectOrBusinessName'),
			projectOrBusinessId = fc.getComponent('hidden-projectOrBusinessId'),
			areaSize = me.getComponent('textfield-areaSize'),
			desciption = me.getComponent('textarea-comments'),
			budgetName = me.getComponent('textfield-budgetName'),
			obj = {};
		Ext.apply(obj, {
			projectOrBusinessId: projectOrBusinessId.getValue(),
			custName: custName.getValue(),
			areaSize: areaSize.getValue(),
			totalFee: "0",
			comments: desciption.getValue(),
			projectOrBusinessName: projectOrBusinessName.getValue(),
			budgetName: budgetName.getValue()
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
						fieldLabel: '工程/业务地址',
						labelWidth: 100,
						width: 348,
						xtype: 'textfield',
						itemId: 'textfield-projectOrBusinessName',
						readOnly: true,
						allowBlank: false,
						value: me.budget ? me.budget['projectOrBusinessName'] : ''
					},
					{
						xtype: 'button',
						width: 50,
						text: '浏览',
						disabled: me.budget ? true : false,
						handler: function (){
							var btn = this;
							var win = Ext.create('Ext.window.Window', {
								width: 600,
								height: 500,
								modal: true,
								layout: 'vbox',
								title: '工程或业务地址选择',
								items: [{
									title: '工程列表',
									xtype: 'progress-projectlist',
									searchFilter: true,
									flex: 2,
									width: '100%',
									listeners: {
										itemclick: function (view, rec){
											if (rec.get('projectName')) {
												return true;
											}
											else {
												return false;
											}
										},
										selectionchange: function (selModel, sels, opts){
											var rec = sels[0],
												grid = win.down('gridpanel');
											if (rec) {
												grid.getSelectionModel().deselectAll();
											}
										}
									}
								}, {
									xtype: 'gridpanel',
									flex: 1,
									width: '100%',
									title: '业务列表',
									autoScroll: true,
									columns: [{
										text: '业务名称',
										dataIndex: 'address',
										flex: 1,
										renderer: function (val, meta, rec){
											return rec.get('regionName') + ' ' + val;
										}
									}, {
										text: '客户姓名',
										dataIndex: 'customer',
										flex: 1
									}, {
										text: '业务员',
										dataIndex: 'salesman',
										flex: 1
									}, {
										text: '设计师',
										dataIndex: 'designer',
										flex: 1
									}],
									store: Ext.create('FamilyDecoration.store.Business', {
										autoLoad: true,
										proxy: {
											type: 'rest',
									    	url: './libs/business.php',
									        reader: {
									            type: 'json'
									        },
									        extraParams: {
									        	action: 'getBusinessListForBudget'
									        }
										}
									}),
									listeners: {
										selectionchange: function (selModel, sels, opts){
											var rec = sels[0],
												tree = win.down('treepanel');
											if (rec) {
												tree.getSelectionModel().deselectAll();
											}
										}
									}
								}],
								buttons: [{
									text: '选择',
									handler: function (){
										var tree = win.down('treepanel'),
											grid = win.down('gridpanel'),
											rec = tree.getSelectionModel().getSelection()[0],
											businessRec = grid.getSelectionModel().getSelection()[0];
										if ((!rec || !rec.get('projectName')) && !businessRec) {
											showMsg('请选择项目');
										}
										else if (rec && businessRec) {
											showMsg('只能选择业务和项目中的一个！');
										}
										else {
											var txt = btn.previousSibling(),
												hidden = btn.nextSibling();
											if (rec) {
												txt.setValue(rec.get('projectName'));
												hidden.setValue(rec.getId());
												me.addressType = 'project';
											}
											else if (businessRec) {
												txt.setValue(businessRec.get('regionName') + ' ' + businessRec.get('address'));
												hidden.setValue(businessRec.getId());
												me.addressType = 'business';
											}
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
						itemId: 'hidden-projectOrBusinessId',
						value: me.budget ? (me.budget['projectId'] || me.budget('businessId')) : ''
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
			{
				fieldLabel: '类型',
				itemId: 'textfield-budgetName',
				xtype: 'textfield',
				value: me.budget ? me.budget['budgetName'] : '佳诚装饰室内装修装饰工程 预算单'
			}
		];

		me.buttons = [{
			text: '确定',
			handler: function (){
				if (me.isValid()) {
					var p = me.getValue();
					Ext.apply(p, {
						addressType: me.addressType
					});
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
										projectOrBusinessName: p['projectOrBusinessName'],
										budgetName: p['budgetName']
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
					});
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