Ext.define('FamilyDecoration.view.regionmgm.EditPotentialBusiness', {
	extend: 'Ext.window.Window',
	alias: 'widget.regionmgm-editpotentialbusiness',

	resizable: false,
	modal: true,
	width: 500,
	height: 350,
	autoScroll: true,
	bodyPadding: 10,

	region: null,
	grid: null,
	potentialBusiness: null,

	initComponent: function () {
		var me = this,
			buildingNumber, houseNumber, unitNumber, addressArr;

		me.title = me.potentialBusiness ? '编辑' : '新建';

		if (me.potentialBusiness) {
			me.height = 280;
			addressArr = me.potentialBusiness.get('address').split('-');
			if (addressArr.length == 3) {
				buildingNumber = addressArr[0];
				unitNumber = addressArr[1];
				houseNumber = addressArr[2];
			}
			else if (addressArr.length == 2) {
				buildingNumber = addressArr[0];
				unitNumber = '';
				houseNumber = addressArr[1];
			}
			else {
				buildingNumber = '';
				unitNumber = '';
				houseNumber = me.potentialBusiness.get('address');
			}
		}
		else {
			buildingNumber = '';
			unitNumber = '';
			houseNumber = '';
		}

		me.items = [
			{
				xtype: 'form',
				defaultType: 'textfield',
				layout: 'anchor',
				defaults: {
					anchor: '100%',
					allowBlank: false
				},
				items: [
					{
						fieldLabel: '幢',
						name: 'buildingNumber',
						value: buildingNumber
					},
					{
						fieldLabel: '单元号',
						name: 'unitNumber',
						value: unitNumber,
						allowBlank: true
					},
					{
						fieldLabel: '门牌号',
						name: 'houseNumber',
						value: houseNumber
					},
					{
						fieldLabel: '业主姓名',
						name: 'proprietor',
						value: me.potentialBusiness ? me.potentialBusiness.get('proprietor') : ''
					},
					{
						fieldLabel: '联系方式',
						name: 'phone',
						value: me.potentialBusiness ? me.potentialBusiness.get('phone') : ''
					},
					{
						xtype: 'fieldcontainer',
						fieldLabel: '是否装修',
						layout: 'hbox',
						defaultType: 'radiofield',
						items: [
							{
								boxLabel: '已装',
								name: 'isDecorated',
								inputValue: 'true',
								flex: 1,
								value: me.potentialBusiness ? (me.potentialBusiness.get('isDecorated') == 'true') : ''
							},
							{
								boxLabel: '未装',
								name: 'isDecorated',
								inputValue: 'false',
								flex: 1,
								value: me.potentialBusiness ? (me.potentialBusiness.get('isDecorated') == 'false') : ''
							},
							{
								boxLabel: '不装',
								name: 'isDecorated',
								inputValue: 'no',
								flex: 1,
								value: me.potentialBusiness ? (me.potentialBusiness.get('isDecorated') == 'no') : ''
							}
						]
					},
					{
						xtype: 'textarea',
						fieldLabel: '扫楼状态',
						name: 'initialStatus',
						disabled: me.potentialBusiness,
						hidden: me.potentialBusiness
					}
				]
			}
		];

		me.buttons = [
			{
				text: '确定',
				handler: function () {
					var frm = me.down('form');
					if (frm.isValid()) {
						var frmVals = frm.getValues(),
							address = [frmVals['buildingNumber'], frmVals['unitNumber'], frmVals['houseNumber']];
						if (frmVals.isDecorated === undefined) {
							Ext.Msg.error('必须要选择是否装修状态，否则无法添加或更改！');
							return false;
						}
						if (address[1] == '') {
							address = address[0] + '-' + address[2];
						}
						else {
							address = address.join('-');
						}
						Ext.apply(frmVals, {
							address: address,
							regionID: me.region.getId(),
							salesman: User.getRealName(),
							salesmanName: User.getName()
						});
						delete frmVals.buildingNumber;
						delete frmVals.houseNumber;
						if (me.potentialBusiness) {
							Ext.apply(frmVals, {
								id: me.potentialBusiness.getId()
							});
							// there is no need to pass status when it is under edit mode.
							delete frmVals.initialStatus;
						}
						Ext.Ajax.request({
							url: me.potentialBusiness ? './libs/business.php?action=editPotentialBusiness' : './libs/business.php?action=addPotentialBusiness',
							method: 'POST',
							params: frmVals,
							callback: function (opts, success, res) {
								if (success) {
									var obj = Ext.decode(res.responseText);
									if (obj.status == 'successful') {
										me.potentialBusiness ? showMsg('编辑成功！') : showMsg('添加成功！');
										me.grid.getStore().reload({
											callback: function (recs, ope, success) {
												if (success) {
													if (me.potentialBusiness) {
														var selModel = me.grid.getSelectionModel();
														selModel.deselectAll();
														selModel.select(me.grid.getStore().indexOf(me.potentialBusiness));
													}
												}
											}
										});
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
			},
			{
				text: '取消',
				handler: function () {
					me.close();
				}
			}
		]

		this.callParent();
	}
});