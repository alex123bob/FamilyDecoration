Ext.define('FamilyDecoration.view.business.TransferToProject', {
	extend: 'Ext.window.Window',
	alias: 'widget.business-transfertoproject',

	resizable: false,
	modal: true,
	width: 400,
	height: 210,
	autoScroll: true,

	community: null,
	client: null,

	title: '创建工程',
	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 334
	},

	initComponent: function (){
		var me = this;

		me.items = [{
			id: 'textfield-clientNameForProject',
			name: 'textfield-clientNameForProject',
			xtype: 'textfield',
			readOnly: true,
			fieldLabel: '客户姓名',
			value: me.client.get('customer')
		}, {
			id: 'textfield-projectAddress',
			name: 'textfield-projectAddress',
			xtype: 'textfield',
			readOnly: true,
			fieldLabel: '工程地址',
			value: me.community.get('name') + ' ' + me.client.get('address')
		}, {
			id: 'datefield-createTime',
			name: 'datefield-createTime',
			xtype: 'datefield',
			fieldLabel: '创建日期',
			editable: false,
			value: me.community ? me.community.get('createTime') : ''
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			items: [{
				id: 'textfield-designStaff',
				name: 'textfield-designStaff',
				xtype: 'textfield',
				readOnly: true,
				fieldLabel: '设计师'
			}, {
				xtype: 'button',
				text: '选择',
				handler: function (){
					var win = Ext.create('Ext.window.Window', {
						title: '选择用户',
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
							}, {
								text: '项目名称',
								flex: 1,
								dataIndex: 'projectName'
							}],
							store: Ext.create('FamilyDecoration.store.User', {
								autoLoad: true,
								filters: [
									function (item) {
										if (User.isBusinessStaff()) {
											return item.get('level') == '006-001';
										}
										else if (User.isAdmin()) {
											return true;
										}
									}
								]
							})
						}],
						buttons: [{
							text: '确定',
							handler: function (){
								var grid = win.down('grid'),
									designer = Ext.getCmp('textfield-designStaff'),
									rec = grid.getSelectionModel().getSelection()[0];
								designer.setValue(rec.get('realname'));
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
			}]
		}];

		me.buttons = [{
			text: '确定',
			handler: function (){
				var customer = Ext.getCmp('textfield-clientNameForProject'),
					address = Ext.getCmp('textfield-projectAddress'),
					createTime = Ext.getCmp('datefield-createTime'),
					designer = Ext.getCmp('textfield-designStaff');
				if (customer.isValid() && address.isValid() && createTime.isValid() && designer.isValid()) {
					var p = {
						businessId: me.client.getId(),
						customer: customer.getValue(),
						projectName: address.getValue(),
						createTime: createTime.getValue(),
						designer: designer.getValue(),
						salesman: me.client.get('salesman')
					};
					Ext.Ajax.request({
						method: 'POST',
						url: 'libs/business.php?action=transferBusinessToProject',
						params: p,
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText),
									clientGrid = Ext.getCmp('gridpanel-clientInfo');
								if (obj.status == 'successful') {
									me.logObj ? showMsg('修改成功！') : showMsg('增加成功！');
									me.close();
									clientGrid.refresh(me.community);
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
			handler: function () {
				me.close();
			}
		}]

		this.callParent();
	}
});