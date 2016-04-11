Ext.define('FamilyDecoration.view.budget.AddBlankItem', {
	extend: 'Ext.window.Window',
	alias: 'widget.budget-addblankitem',
	resizable: false,
	modal: true,
	layout: 'fit',
	title: '添加空白项',
	width: 560,
	height: 420,
	padding: 2,

	grid: null, // 预算表格
	budgetId: undefined, // 预算id
	bigItem: undefined, // 添加到此大项下

	initComponent: function () {
		var me = this;

		me.buttons = [{
			text: '添加',
			handler: function (){
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}];

		me.items = [
			{
				xtype: 'container',
				autoScroll: true,
				layout: 'form',
				defaultType: 'textfield',
				items: [
					{
						fieldLabel: '名称',
						name: 'budgetItemName',
						allowBlank: false
					},
					{
						fieldLabel: '单位',
						name: 'budgetUnit',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						fieldLabel: '主材单价',
						name: 'budgetMainMaterialPrice',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						fieldLabel: '辅材单价',
						name: 'budgetAuxiliaryMaterialPrice',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						fieldLabel: '人工单价',
						name: 'budgetManpowerPrice',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						fieldLabel: '机械单价',
						name: 'budgetMachineryPrice',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						fieldLabel: '损耗单价',
						name: 'budgetLossPercent',
						allowBlank: false
					},
					{
						fieldLabel: '备注',
						name: 'budgetRemark',
						allowBlank: false,
						xtype: 'textarea'
					},
					{
						xtype: 'numberfield',
						fieldLabel: '人工成本',
						name: 'budgetManpowerCost',
						allowBlank: false
					},
					{
						xtype: 'numberfield',
						fieldLabel: '主材成本',
						name: 'budgetMainMaterialCost',
						allowBlank: false
					}
				]
			}
		];

		this.callParent();
	}
});