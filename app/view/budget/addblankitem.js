Ext.define('FamilyDecoration.view.budget.AddBlankItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-addblankitem',
	requires: ['FamilyDecoration.store.WorkCategory'],
	resizable: false,
	modal: true,
	layout: 'fit',
	title: '添加空白项',
	width: 560,
	height: 460,
	padding: 2,

	rec: null,
	grid: null, // 预算表格
	budgetId: undefined, // 预算id
	bigItem: undefined, // 添加到此大项下
	smallItem: undefined, // 添加到此小项上

	initComponent: function () {
		var me = this;

		if (me.rec) {
			me.title = '编辑空白项';
		}
		else {
			me.title = '添加空白项';
		}

		me.buttons = [{
			text: me.rec ? '编辑' : '添加',
			handler: function (){
				var frm = me.down('[name="formpanel-customizedFrm"]').getForm(),
					params,
					p,
					initialUrl;
				if (me.rec) {
					initialUrl = './libs/budget.php?action=editItem';
				}
				else {
					if (me.bigItem) {
						initialUrl = './libs/budget.php?action=addItem';
					}
					else if (me.smallItem) {
						initialUrl = './libs/budget.php?action=insertSmallItemBefore';
					}
				}
				if (frm.isValid()) {
					params = frm.getFieldValues();
					p = {
						itemName: params['budgetItemName'],
						itemCode: !me.rec ? (me.bigItem ? me.bigItem.get('itemCode') : me.smallItem.get('itemCode')) : '',
						budgetId: me.budgetId,
						itemUnit: params['budgetUnit'],
						mainMaterialPrice: params['budgetMainMaterialPrice'],
						auxiliaryMaterialPrice: params['budgetAuxiliaryMaterialPrice'],
						manpowerPrice: params['budgetManpowerPrice'],
						machineryPrice: params['budgetMachineryPrice'],
						lossPercent: params['budgetLossPercent'],
						remark: params['budgetRemark'],
						manpowerCost: params['budgetManpowerCost'],
						mainMaterialCost: params['budgetMainMaterialCost'],
						workCategory: params['budgetWorkCategory'],
						isCustomized: 'true'
					};
					if (me.rec) {
						Ext.apply(p, {
							budgetItemId: me.rec.getId()
						});
						// coz we don't need itemCode in editing
						delete p.itemCode;
					}
					Ext.Ajax.request({
						url: initialUrl,
						params: p,
						method: 'POST',
						callback: function (opts, success, res){
							if (success) {
								var obj = Ext.decode(res.responseText);
								if (obj.status == 'successful') {
									me.rec ? showMsg('编辑成功！') : showMsg('添加成功！');
									me.grid.getStore().load({
										params: {
											budgetId: me.budgetId
										},
										callback: function (recs, ope, success){
											if (success) {
												var selModel = me.grid.getSelectionModel(),
													view = me.grid.getView();
												selModel.deselectAll();
												if (me.rec) {
													selModel.select(me.grid.getStore().getById(me.rec.getId()));
				            						view.focusRow(me.rec, 200);
												}
												else {
													var budgetItemId = obj['budgetItemId'];
													selModel.select(me.grid.getStore().getById(budgetItemId));
													view.focusRow(budgetItemId, 200);
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
					});
				}
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];

		me.items = [
			{
				xtype: 'form',
				autoScroll: true,
				layout: 'anchor',
				name: 'formpanel-customizedFrm',
				defaultType: 'textfield',
				defaults: {
					anchor: '90%'
				},
				items: [
					{
						fieldLabel: '名称',
						name: 'budgetItemName',
						allowBlank: false,
						value: me.rec ? me.rec.get('itemName') : ''
					},
					{
						fieldLabel: '单位',
						name: 'budgetUnit',
						allowBlank: false,
						value: me.rec ? me.rec.get('itemUnit') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '主材单价(元)',
						name: 'budgetMainMaterialPrice',
						allowBlank: false,
						value: me.rec ? me.rec.get('mainMaterialPrice') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '辅材单价(元)',
						name: 'budgetAuxiliaryMaterialPrice',
						allowBlank: false,
						value: me.rec ? me.rec.get('auxiliaryMaterialPrice') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '人工单价(元)',
						name: 'budgetManpowerPrice',
						allowBlank: false,
						value: me.rec ? me.rec.get('manpowerPrice') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '机械单价(元)',
						name: 'budgetMachineryPrice',
						allowBlank: false,
						value: me.rec ? me.rec.get('machineryPrice') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '损耗单价(%)',
						name: 'budgetLossPercent',
						allowBlank: false,
						minValue: 0,
						maxValue: 1,
						step: 0.05,
						value: me.rec ? me.rec.get('lossPercent') : ''
					},
					{
						fieldLabel: '备注',
						name: 'budgetRemark',
						allowBlank: false,
						xtype: 'textarea',
						value: me.rec ? me.rec.get('remark') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '人工成本(元)',
						name: 'budgetManpowerCost',
						allowBlank: false,
						value: me.rec ? me.rec.get('manpowerCost') : ''
					},
					{
						xtype: 'numberfield',
						fieldLabel: '主材成本(元)',
						name: 'budgetMainMaterialCost',
						allowBlank: false,
						value: me.rec ? me.rec.get('mainMaterialCost') : ''
					},
					{
						fieldLabel: '工种',
						name: 'budgetWorkCategory',
						xtype: 'combobox',
						queryMode: 'local',
						displayField: 'name',
						allowBlank: false,
						valueField: 'value',
						editable: false,
						store: FamilyDecoration.store.WorkCategory,
						value: me.rec ? me.rec.get('workCategory') : ''
					}
				]
			}
		];

		this.callParent();
	}
});