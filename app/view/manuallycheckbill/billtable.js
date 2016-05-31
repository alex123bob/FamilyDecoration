Ext.define('FamilyDecoration.view.manuallycheckbill.BillTable', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.manuallycheckbill-billtable',
	layout: 'vbox',
	requires: [],
	header: false,
	isPreview: false,

	initComponent: function (){
		var me = this,
			previewMode = me.isPreview;
			
		me.refresh = function (bill){
			var form = me.down('form'),
				data, field;
			if (bill) {
				data = bill.data;
				for (var pro in data) {
					if (data.hasOwnProperty(pro)) {
						field = form.query('[name="' + pro + '"]');
						if (field.length > 0) {
							field = field[0];
							field.setValue(data[pro]);
						}
					}
				}
			}
			else {
				field = form.query('textfield');
				Ext.each(field, function (cmp, index, fld){
					cmp.setValue('');
				});
			}
		};

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
						margin: '0 0 0 60',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-budgetName',
						value: '佳诚装饰<br />单项工程施工工程款领取审批单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 12px;">公司联</font>',
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
							margin: '0 0 0 4'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '领款人',
								flex: 1,
								height: '100%',
								name: 'payee',
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '工程地址',
								flex: 2,
								height: '100%',
								name: 'projectName',
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
							margin: '0 0 0 4'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '联系电话',
								flex: 1,
								height: '100%',
								name: 'phoneNumber',
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '总金额',
								flex: 1,
								height: '100%',
								name: 'totalFee',
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: '申领金额',
								flex: 1,
								height: '100%',
								name: 'claimAmount',
								readOnly: previewMode ? true : false
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
							margin: '0 0 0 4'
						},
						items: [
							{
								xtype: 'textfield',
								fieldLabel: '领款次数',
								flex: 1,
								height: '100%',
								name: 'payedTimes',
								readOnly: previewMode ? true : false
							},
							{
								xtype: 'textfield',
								fieldLabel: '完成情况',
								flex: 2,
								height: '100%',
								name: 'projectProgress',
								readOnly: previewMode ? true : false
							}
						]
					},
				]
			},
			{
				xtype: 'gridpanel',
				flex: 1,
				width: '100%',
				autoScroll: true,
				columns: {
					items: [
						{
							text: '序号',
							dataIndex: 'serialNumber'
						},
						{
							text: '项目',
							dataIndex: 'projectName'
						},
						{
							text: '单位',
							dataIndex: 'unit'
						},
						{
							text: '数量',
							dataIndex: 'amount'
						},
						{
							text: '单价(元)',
							dataIndex: 'unitPrice'
						},
						{
							text: '小计',
							dataIndex: 'subtotal'
						}
					],
					defaults: {
						flex: 1,
						align: 'center'
					}
				}
			}
		];

		me.callParent();
	}
});