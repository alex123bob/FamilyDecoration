Ext.define('FamilyDecoration.view.regionmgm.DispenseTelemarketingStaff', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-dispensetelemarketingstaff',

	requires: [
		'FamilyDecoration.store.PotentialBusiness'
	],

	resizable: false,
	modal: true,
	width: 640,
	height: 310,
	autoScroll: true,

	bodyPadding: 4,
	defaults: {
		allowBlank: false,
		width: 255
	},
    title: '分配电销人员',
	layout: 'vbox',

    region: undefined,
    grid: undefined,
    potentialBusiness: undefined,

	initComponent: function () {
		var me = this,
			st = Ext.create('FamilyDecoration.store.PotentialBusiness', {
				autoLoad: true,
				proxy: {
					type: 'rest',
					url: './libs/business.php?action=getAllPotentialBusiness',
					reader: {
						type: 'json',
						root: 'data',
						totalProperty: 'total'
					},
					extraParams: {
						regionID: me.region.getId()
					}
				},
				filters: [
					function (item){
						return item.get('isLocked') == 'false';
					}
				]
			});

		me.height = me.potentialBusiness ? 114 : 500;

		me.items = [
			me.potentialBusiness ? null : {
				xtype: 'gridpanel',
				width: '100%',
				autoScroll: true,
				flex: 15,
				selType: 'checkboxmodel',
				selModel: {
					mode: 'SIMPLE'
				},
				store: st,
				dockedItems: [{
					xtype: 'pagingtoolbar',
					store: st,   // same store GridPanel is using
					dock: 'bottom',
					displayInfo: true
				}],
				columns: {
					defaults: {
						align: 'center'
					},
					items: [
						{
							text: '地址',
							dataIndex: 'address',
							flex: 1
						},
						{
							text: '业主',
							dataIndex: 'proprietor',
							flex: 1
						},
						{
							text: '电话',
							dataIndex: 'phone',
							flex: 1
						},
						{
							text: '电销人员',
							dataIndex: 'telemarketingStaff',
							flex: 1
						},
						{
							text: '已装',
							dataIndex: 'isDecorated',
							flex: 1,
							renderer: function (val, meta, rec) {
								if (val) {
									if (val == 'false') {
										return '未装';
									}
									else if (val == 'true') {
										return '已装';
									}
									else if (val == 'no') {
										return '不装';
									}
								}
								else {
									return ''
								}
							}
						},
						{
							text: '分配历史',
							dataIndex: 'businessHistoryTelemarketingStaffs',
							flex: 1,
							renderer: function (val, meta, rec){
								var res = '';
								for (var key in val) {
									if (val.hasOwnProperty(key)) {
										var count = val[key];
										res += key + ': ' + count + '次;' + '<br />';
									}
								}
								if (res != '') {
									res = res.slice(0, -6);
								}
								return res;
							}
						}
					]
				}
			},
			{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				width: '100%',
				flex: 1,
				items: [
					{
						id: 'textfield-telemarketingStaff',
						name: 'textfield-telemarketingStaff',
						xtype: 'textfield',
						fieldLabel: '电销人员',
						allowBlank: false,
						readOnly: true,
						labelWidth:60,
						width: 255,
						height: '100%',
						value: me.potentialBusiness ? me.potentialBusiness.get('telemarketingStaff') : ''
					},
					{
						xtype: 'button',
						text: '选择',
						width: 50,
						handler: function () {
							var win = Ext.create('Ext.window.Window', {
								width: 500,
								height: 300,
								layout: 'fit',
								title: '选择电销人员',
								modal: true,
								items: [{
									xtype: 'checklog-memberlist',
									id: 'memberlist-telemarketingStaffList',
									name: 'memberlist-telemarketingStaffList',
									fullList: true
								}],
								buttons: [
									{
										text: '确定',
										handler: function () {
											var list = Ext.getCmp('memberlist-telemarketingStaffList'),
												rec = list.getSelectionModel().getSelection()[0],
												salesmanShowField = Ext.getCmp('textfield-telemarketingStaff'),
												salesmanValueField = Ext.getCmp('hiddenfield-telemarketingStaffName');

											if (rec && rec.get('name')) {
												salesmanShowField.setValue(rec.get('realname'));
												salesmanValueField.setValue(rec.get('name'));
												win.close();
											}
											else {
												showMsg('请选择电销人员！');
											}
										}
									},
									{
										text: '取消',
										handler: function () {
											win.close();
										}
									}
								]
							});
							win.show();
						}
					},
					{
						xtype: 'hiddenfield',
						hideLabel: true,
						name: 'hiddenfield-telemarketingStaffName',
						id: 'hiddenfield-telemarketingStaffName',
						value: me.potentialBusiness ? me.potentialBusiness.get('telemarketingStaffName') : ''
					},
					{
						id: 'textfield-telemarketingDeadline',
						name: 'textfield-telemarketingDeadline',
						xtype: 'datefield',
						labelWidth:60,
						flex: 0.3,
						fieldLabel: '截止日期',
						editable:false,
						format : 'Y-m-d',//日期格式
						minValue:new Date(),
						allowBlank: false,
						width: 255,
						height: '100%',
						value: me.potentialBusiness ? me.potentialBusiness.get('telemarketingDeadline') : ''
					}
				]
			}
		];

		me.buttons = [{
			text: '确定',
			handler: function () {
				var telemarketingStaff = Ext.getCmp('textfield-telemarketingStaff'),
					telemarketingStaffName = Ext.getCmp('hiddenfield-telemarketingStaffName'),
					telemarketingDeadline = Ext.getCmp('textfield-telemarketingDeadline'),
					businessGrid = !me.potentialBusiness ? me.down('grid') : undefined;
				if (telemarketingStaff.isValid()) {
					var p = {
						telemarketingStaff: telemarketingStaff.getValue(),
						telemarketingStaffName: telemarketingStaffName.getValue(),
						distributeTime: Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
						telemarketingDeadline: Ext.Date.format(telemarketingDeadline.getValue(),'Y-m-d')
					};
					if (me.potentialBusiness) {
						Ext.apply(p, {
							id: me.potentialBusiness.getId()
						});
					}
					else {
						var recs = businessGrid.getSelectionModel().getSelection();
						if (recs.length <= 0) {
							showMsg('请选择电销人员！');
							return false;
						}
						Ext.each(recs, function (rec, index, arr) {
							arr[index] = rec.getId();
						});
						Ext.apply(p, {
							id: recs.join(':')
						});
					}
					Ext.Ajax.request({
						method: 'POST',
						url: 'libs/business.php?action=editPotentialBusiness',
						params: p,
						callback: function (opts, success, res) {
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
                                    showMsg('分配成功！');
									me.close();
                                    me.grid.getStore().reload({
										callback: function (recs, ope, success){
											if (success) {
												if (me.potentialBusiness) {
													var selModel =  me.grid.getSelectionModel();
													selModel.deselectAll();
													selModel.select(me.grid.getStore().indexOf(me.potentialBusiness));
												}
											}
										}
									});
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