Ext.define('FamilyDecoration.view.materialrequest.MaterialOrder', {
	extend: 'Ext.container.Container',
	alias: 'widget.materialrequest-materialorder',
	layout: 'vbox',
	requires: [

	],
    defaults: {
        width: '100%'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
				width: '100%',
				height: 60,
				items: [
					{
						width: 60,
						height: '100%',
						xtype: 'image',
						margin: '0 0 0 180',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-materialRequestName',
						value: '佳诚装饰<br />工程材料订购单&nbsp;&nbsp;<span style="font-size: 12px;">公司联</font>',
						hideLabel: true,
						fieldStyle: {
							fontSize: '24px',
							lineHeight: '30px'
						},
						style: {
							fontFamily: '黑体'
						},
						flex: 1,
						height: '100%'
					}
				]
            },
			{
				xtype: 'form',
				layout: 'vbox',
				height: 90,
				width: '99%',
				items: [
					{
						xtype: 'fieldcontainer',
						flex: 1,
						width: '100%',
						layout: 'hbox',
						defaults: {
							labelWidth: 70,
							margin: '0 0 0 4',
							height: '100%'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '供应商',
								flex: 1,
								name: 'supplier'
							},
							{
								xtype: 'textfield',
								fieldLabel: '工程地址',
								flex: 1,
								name: 'projectName',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '项目经理',
								flex: 1,
								name: 'captain',
								readOnly: true
							}
						]
					},
					{
						xtype: 'fieldcontainer',
						flex: 1,
						width: '100%',
						layout: 'hbox',
						defaults: {
							labelWidth: 70,
							margin: '0 0 0 4',
							height: '100%'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '联系电话',
								flex: 1,
								name: 'phoneNumber'
							},
							{
								xtype: 'textfield',
								fieldLabel: '总金额',
								flex: 1,
								name: 'totalFee',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '大写',
								flex: 1,
								name: 'totalFeeUppercase',
								readOnly: true
							}
						]
					},
					{
						xtype: 'fieldcontainer',
						flex: 1,
						width: '100%',
						layout: 'hbox',
						defaults: {
							labelWidth: 70,
							margin: '0 0 0 4',
							height: '100%'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '申购次数',
								flex: 1,
								name: 'orderTimes'
							},
							{
								xtype: 'textfield',
								fieldLabel: '完成情况(%)',
								labelWidth: 80,
								flex: 2,
								name: 'projectProgress',
								afterSubTpl: '%',
								maskRe: /[\d\.]/
							}
						]
					},
				]
			},
			{
				xtype: 'gridpanel',
				flex: 1,
				autoScroll: true,
				columns: {
					defaults: {
						align: 'center',
						flex: 1
					},
					items: [
						{
							text: '材料名称'
						},
						{
							text: '数量'
						},
						{
							text: '单位'
						},
						{
							text: '单价(元)'
						},
						{
							text: '总价(元)'
						},
						{
							text: '参考量'
						}
					]
				}
			}
        ];

        me.callParent();
    }
});