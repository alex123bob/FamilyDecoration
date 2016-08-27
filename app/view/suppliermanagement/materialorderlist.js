Ext.define('FamilyDecoration.view.suppliermanagement.MaterialOrderList', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.suppliermanagement-materialorderlist',
    title: '订购单列表',
	requires: [
		'FamilyDecoration.store.MaterialOrderList',
        'FamilyDecoration.view.suppliermanagement.ApplyForPayment'
	],

	initComponent: function () {
		var me = this;

        var st = Ext.create('FamilyDecoration.store.MaterialOrderList', {
            autoLoad: false
        });

        me.store = st;

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: st,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.tbar = [
            {
                text: '确认发货',
                name: 'confirm',
                handler: function (){
                    
                }
            },
            {
                text: '申请付款',
                name: 'request',
                handler: function (){
                    var win = Ext.create('FamilyDecoration.view.suppliermanagement.ApplyForPayment', {

                    });
                    win.show();
                }
            },
            {
                text: '申付审核通过',
                name: 'pass',
                handler: function (){
                    
                }
            },
            {
                text: '退回申付',
                name: 'return',
                handler: function (){

                }
            },
            {
                xtype: 'textfield',
                fieldLabel: '总累计金额',
                readOnly: true,
                labelWidth: 80
            }
        ];

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    text: '工程名称'
                },
                {
                    text: '项目经理'
                },
                {
                    text: '订购总金额'
                },
                {
                    text: '订购单'
                },
                {
                    text: '订购日期'
                },
                {
                    text: '是否审核'
                },
                {
                    text: '申领金额'
                },
                {
                    text: '已付金额'
                }
            ]
        };

		this.callParent();
	}
});