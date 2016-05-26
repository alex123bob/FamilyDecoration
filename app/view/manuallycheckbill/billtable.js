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
						width: 80,
						height: 60,
						xtype: 'image',
						margin: '0 0 0 20',
						src: './resources/img/logo.jpg'
					},
					{
						xtype: 'displayfield',
						margin: '0 0 0 20',
						name: 'displayfield-budgetName',
						value: '佳诚装饰<br />单项工程施工工程款领取审批单',
						hideLabel: true,
						fieldStyle: {
							fontFamily: '黑体',
							fontSize: '24px',
							lineHeight: '30px'
						},
						width: 700
					}
				]
			}
		];

		me.callParent();
	}
});