Ext.define('FamilyDecoration.view.manuallycheckbill.BillTable', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.manuallycheckbill-billtable',
	layout: 'vbox',
	requires: [],
	header: false,

	initComponent: function (){
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
								height: '100%'
							},
							{
								xtype: 'textfield',
								fieldLabel: '工程地址',
								flex: 2,
								height: '100%'
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
								height: '100%'
							},
							{
								xtype: 'textfield',
								fieldLabel: '总金额',
								flex: 1,
								height: '100%'
							},
							{
								xtype: 'textfield',
								fieldLabel: '申领金额',
								flex: 1,
								height: '100%'
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
								height: '100%'
							},
							{
								xtype: 'textfield',
								fieldLabel: '完成情况',
								flex: 2,
								height: '100%'
							}
						]
					},
				]
			},
			{
				xtype: 'gridpanel',
				flex: 2,
				width: '100%',
				columns: [
					{
						text: '序号',
						flex: 1,
						dataIndex: 'serialNumber'
					},
					{
						text: '项目',
						flex: 1,
						dataIndex: 'projectName'
					},
					{
						text: '单位',
						flex: 1,
						dataIndex: 'unit'
					},
					{
						text: '数量',
						flex: 1,
						dataIndex: 'amount'
					},
					{
						text: '单价(元)',
						flex: 1,
						dataIndex: 'unitPrice'
					},
					{
						text: '小计',
						flex: 1,
						dataIndex: 'subtotal'
					}
				]
			},
			{
				xtype: 'gridpanel',
				title: '单据列表',
				width: '100%',
				flex: 1,
				autoScroll: true,
				tools: [
					{
						type: 'close',
						tooltip: '删除单据',
						itemId: 'deleteBill',
						callback: function (){

						}
					}
				],
				columns: [
					{
						text: '单名',
						dataIndex: 'billName',
						flex: 1
					},
					{
						text: '单值',
						dataIndex: 'billValue',
						flex: 1
					},
					{
						text: '是否审核',
						dataIndex: 'isChecked',
						flex: 1
					},
					{
						text: '审核人',
						dataIndex: 'checker',
						flex: 1
					},
					{
						text: '是否付款',
						dataIndex: 'isPaid',
						flex: 1
					},
				]
			}
		];

		me.callParent();
	}
});