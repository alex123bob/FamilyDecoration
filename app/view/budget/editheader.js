Ext.define('FamilyDecoration.view.budget.EditHeader', {
	extend: 'Ext.window.Window',
	width: 500,
	height: 350,

	requires: [
		'FamilyDecoration.view.progress.ProjectList', 'Ext.form.field.Hidden',
		'FamilyDecoration.store.BudgetTemplate'
	],

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
			fc = me.getComponent('fieldcontainer-projectOrBusinessNameCt'),
			projectOrBusinessName = fc.getComponent('textfield-projectOrBusinessName'),
			areaSize = me.getComponent('textfield-areaSize'),
			desciption = me.getComponent('textarea-comments'),
			budgetName = me.getComponent('textfield-budgetName');
		return custName.isValid() && projectOrBusinessName.isValid() && areaSize.isValid() && desciption.isValid() && budgetName.isValid();
	},

	getValue: function (){
		var me = this,
			custName = me.getComponent('textfield-custName'),
			fc = me.getComponent('fieldcontainer-projectOrBusinessNameCt'),
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
				itemId: 'fieldcontainer-projectOrBusinessNameCt',
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
						value: me.budget ? (me.budget['projectName'] || (me.budget['businessRegion'] + ' ' + me.budget['businessAddress'])) : ''
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
									isForBudgetProjectList: true,
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
						value: me.budget ? (me.budget['projectId'] || me.budget['businessId']) : ''
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
			},
			{
				xtype: 'fieldcontainer',
				itemId: 'fieldcontainer-budgetTemplateCt',
				layout: 'hbox',
				hideLabel: true,
				hidden: me.budget ? true : false,
				items: [
					{
						fieldLabel: '使用模板',
						labelWidth: 100,
						width: 348,
						xtype: 'textfield',
						itemId: 'textfield-createBudgetFromTemplate',
						readOnly: true,
						allowBlank: false
					},
					{
						xtype: 'button',
						width: 50,
						text: '选择',
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								layout: 'fit',
								width: 500,
								height: 300,
								modal: true,
								title: '引用模板列表',
								items: [{
									xtype: 'grid',
									columns: [{
										text: '名称',
										flex: 1,
										align: 'center',
										dataIndex: 'budgetTemplateName'
									}, {
										hidden: !User.isAdmin(),
							            xtype:'actioncolumn',
							            text: '删除',
							            width: 50,
							            items: [
								            {
								                icon: './resources/img/trash_can_delete.ico',  // Use a URL in the icon config
								                tooltip: '删除选中模板',
								                handler: function(grid, rowIndex, colIndex) {
								                	var rec = grid.getStore().getAt(rowIndex);
								                    if (rec) {
								                    	Ext.Msg.warning('确定要删除当前选中模板吗？', function (btnId){
								                    		if (btnId == 'yes') {
										                    	Ext.Ajax.request({
										                    		url: './libs/budget.php?action=deleteBudgetTemplate',
										                    		method: 'POST',
										                    		params: {
										                    			budgetTemplateId: rec.getId()
										                    		},
										                    		callback: function (opts, success, res){
										                    			if (success) {
										                    				var obj = Ext.decode(res.responseText);
										                    				if (obj.status == 'successful') {
										                    					showMsg('删除成功！');
										                    					grid.getStore().load();
										                    				}
										                    				else {
										                    					showMsg(obj.errMsg);
										                    				}
										                    			}
										                    		}
											                    });
								                    		}
								                    	});
								                    }
								                    else {
								                    	showMsg('请选择要删除模板！');
								                    }
								                }
								            }
								        ]
								    }],
									autoScroll: true,
									store: Ext.create('FamilyDecoration.store.BudgetTemplate', {
										autoLoad: true
									})
								}],
								buttons: [{
									text: '确定',
									handler: function (){
										var grid = win.down('gridpanel'),
											rec = grid.getSelectionModel().getSelection()[0],
											fc = me.getComponent('fieldcontainer-budgetTemplateCt'),
											hiddenField = fc.getComponent('hidden-budgetTemplateId'),
											textField = fc.getComponent('textfield-createBudgetFromTemplate');
										if (rec) {
											hiddenField.setValue(rec.getId());
											textField.setValue(rec.get('budgetTemplateName'));
											win.close();
										}
										else {
											showMsg('没有选中模板！');
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
						itemId: 'hidden-budgetTemplateId',
						value: ''
					}
				]
			}
		];

		me.buttons = [{
			text: '确定',
			handler: function (){
				if (me.isValid()) {
					var p = me.getValue(),
						budgetTemplateCt = me.getComponent('fieldcontainer-budgetTemplateCt'),
						budgetTemplateId = budgetTemplateCt.getComponent('hidden-budgetTemplateId').getValue();
					if (me.addressType) {
						if (me.addressType == 'business') {
							Ext.apply(p, {
								businessId: p.projectOrBusinessId,
								businessName: p.projectOrBusinessName
							});
						}
						else if (me.addressType == 'project') {
							Ext.apply(p, {
								projectId: p.projectOrBusinessId,
								projectName: p.projectOrBusinessName
							});
						}
						delete p.projectOrBusinessId;
						delete p.projectOrBusinessName;
					}
					else {
						showMsg('没有对应的预算地址类型！');
						return;
					}
					me.budget && Ext.apply(p, {
						budgetId: me.budget['budgetId']
					});
					if (budgetTemplateId != '' && !me.budget) {
						Ext.apply(p, {
							budgetTemplateId: budgetTemplateId
						});
					}
					Ext.Ajax.request({
						url: me.budget ? './libs/budget.php?action=edit' : (budgetTemplateId == '' ? './libs/budget.php?action=add' : './libs/budget.php?action=createBudgetFromTemplate'),
						params: p,
						method: 'POST',
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									var o = {
										custName: p['custName'],
										projectOrBusinessName: p['projectName'] || p['businessName'],
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