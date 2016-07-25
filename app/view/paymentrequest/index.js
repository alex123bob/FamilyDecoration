Ext.define('FamilyDecoration.view.paymentrequest.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.paymentrequest-index',
	requires: [
        'FamilyDecoration.view.paymentrequest.PaymentListCt'
	],
	refresh: Ext.emptyFn,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        height: '100%'
    },

	initComponent: function () {
		var me = this;

        me.items = [
            {
                title: '申请人员',
                flex: 1,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                }
            },
            {
                xtype: 'paymentrequest-paymentlistct',
                flex: 5
            }
        ];

		me.callParent();
	}
});