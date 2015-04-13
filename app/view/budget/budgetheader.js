Ext.define('FamilyDecoration.view.budget.BudgetHeader', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.budget-budgetheader',
	requires: ['FamilyDecoration.view.progress.ProjectList'],

	title: '预算头信息',
	budget: null,

	getValue: function (){
		var grid = this,
			st = grid.getStore();
		var data = st.data.items,
			res = {};
		for (var i = 0; i < data.length; i++) {
			res[data[i].get('name')] = data[i].get('content');
		}
		return res;
	},

	isEmpty: function (){
		var grid = this,
			st = grid.getStore(),
			data = st.data.items,
			flag = false;
		for (var i = 0; i < data.length; i++) {
			if (data[i].get('content') == '') {
				flag = true;
				break;
			}
		}
		return flag;
	},

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			columns: [{
				text: '名称',
				flex: 1,
				dataIndex: 'dispValue',
				draggable: false,
				menuDisabled: true,
				sortable: false
			}, {
				text: '内容',
				flex: 1,
				dataIndex: 'content',
				draggable: false,
				menuDisabled: true,
				sortable: false,
				editor: {
					xtype: 'textfield'
				},
				renderer: function (val, index, rec){
					if (rec.get('name') == 'comments') {
						return val.replace(/\n/g, '<br />');
					}
					else {
						return val;
					}
				}
			}],
			clean: function (){
				var st = this.getStore();
				st.each(function (rec){
					rec.set('content', '');
					rec.commit();
				});
			},
			store: Ext.create('Ext.data.Store', {
				autoLoad: true,
				fields: ['name', 'dispValue', 'content'],
				data: [
					{
						name: 'custName',
						dispValue: '客户名称：',
						content: me.budget ? me.budget['custName'] : ''
					}, 
					{
						name: 'projectName',
						dispValue: '工程地址：',
						content: me.budget ? me.budget['projectName'] : ''
					}, 
					{
						name: 'areaSize',
						dispValue: '户型大小：',
						content: me.budget ? me.budget['areaSize'] : ''
					}, 
					// {
					// 	name: 'totalFee',
					// 	dispValue: '合计费用：',
					// 	content: ''
					// }, 
					{
						name: 'comments',
						dispValue: '预算说明：',
						content: me.budget ? me.budget['comments'] : ''
					}
				],
				proxy: {
					type: 'memory'
				}
			}),
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
		            clicksToEdit: 1,
		            listeners: {
		            	beforeedit: function (editor, e, opts){
		            		if (e.record.get('name') == 'comments' || e.record.get('name') == 'projectName') {
		            			return false;
		            		}
		            		else {
		            			return true;
		            		}
		            	},
		            	edit: function (editor, e){
		            		var rec = e.record,
		            			cust = Ext.ComponentQuery.query('[name="displayfield-custName"]')[0];
		            		if (rec.get('name') == 'custName') {
		            			cust.setValue(e.value);
		            		}
		            		rec.commit();
		            		editor.completeEdit();
		            	}
		            }
		        })
			],
			listeners: {
				afterrender: function (grid, opts) {
					var view = grid.getView();
					var tip = Ext.create('Ext.tip.ToolTip', {
					    target: view.el,
					    delegate: view.itemSelector,
					    trackMouse: true,
					    renderTo: Ext.getBody(),
					    listeners: {
					        beforeshow: function (tip) {
					        	var rec = view.getRecord(tip.triggerElement),
					        		content = rec.get('content');
					        	if (Ext.isEmpty(content)) {
					        		return false;
					        	}
					        	else {
					        		if (rec.get('name') == 'comments') {
					        			tip.update(rec.get('content').replace(/\n/g, '<br />'));
					        		}
					        		else {
					        			tip.update(rec.get('content'));
					        		}
					        	}
					        }
					    }
					});
				},
				itemclick: function (grid, rec, item, index, e, eOpts) {
					if (rec.get('name') == 'comments') {
						var win = Ext.create('Ext.window.Window', {
							width: 400,
							height: 280,
							layout: 'fit',
							modal: true,
							title: '请填写预算说明',
							items: [{
								xtype: 'textarea',
								value: rec.get('content') ? rec.get('content') : ''
							}],
							buttons: [{
								text: '确定',
								handler: function (){
									rec.set('content', win.items.items[0].getValue());
									rec.commit();
									win.close();
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
					else if (rec.get('name') == 'projectName' && !me.budget) {
						var win = Ext.create('Ext.window.Window', {
							width: 500,
							height: 400,
							layout: 'fit',
							modal: true,
							title: '选择对应工程',
							items: [{
								xtype: 'progress-projectlist',
								searchFilter: true,
								listeners: {
									itemclick: function (view, rec){
										return rec.get('projectName') ? true : false;
									},
									selectionchange: function (selModel, sels, opts){
										var addBtn = Ext.getCmp('button-addProjectName'),
											rec = sels[0];
										if (rec && rec.get('projectName') != '') {
											addBtn.enable();
										}
										else {
											addBtn.disable();
										}
									}
								}
							}],
							buttons: [{
								text: '确定',
								disabled: true,
								id: 'button-addProjectName',
								name: 'button-addProjectName',
								handler: function (){
									var rec = win.items.items[0].getSelectionModel().getSelection(),
										rec = rec[0],
										grid = me.items.items[0],
										st = grid.getStore(),
										addr = st.getAt(1),
		            					project = Ext.ComponentQuery.query('[name="displayfield-projectName"]')[0];
		            				if (rec) {
		            					addr.set('content', rec.get('projectName'));
										project.setValue(rec.get('projectName'));
										addr.commit();
										win.close();
		            				}
		            				else {
		            					Ext.Msg.info('请选择工程项目！');
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
				}
			}
		});

		this.callParent();
	}
})