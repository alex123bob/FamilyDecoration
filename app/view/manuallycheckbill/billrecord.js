Ext.define('FamilyDecoration.view.manuallycheckbill.BillRecord', {
	extend: 'Ext.window.Window',
	alias: 'widget.manuallycheckbill-billrecord',

	requires: [
		'FamilyDecoration.store.StatementBillAudit'
	],

	layout: 'fit',
	width: 700,
	height: 410,
	modal: true,
	title: '账单历史记录',
	maximizable: true,

	bill: undefined, // bill indicates the statementBill attached to the window.

	callbackAfterClose: Ext.emptyFn, // we could define the content of callback function whereever we instantiate this class.

	initComponent: function () {
		var me = this;
        
        var st = Ext.create('FamilyDecoration.store.StatementBillAudit', {
            autoLoad: false
        });
        
        st.load({
            params: {
                billId: me.bill.getId()
            }
        });

		me.items = [
			{
				xtype: 'gridpanel',
                store: st,
                columns: {
                    items: [
                        {
                            text: '原状态',
                            dataIndex: 'orignalStatusName'
                        },
                        {
                            text: '新状态',
                            dataIndex: 'newStatusName'
                        },
                        {
                            text: '评论',
                            dataIndex: 'comments',
                            flex: 3
                        },
                        {
                            text: '经办人',
                            dataIndex: 'operator',
                            flex: 0.8
                        },
                        {
                            text: '时间',
                            dataIndex: 'createTime',
                            flex: 2
                        }
                    ],
                    defaults: {
                        align: 'center',
                        flex: 1
                    }
                }
			}
		];
		me.buttons = [
			{
				text: '关闭',
				handler: function () {
					me.close();
				}
			}
		];

		this.callParent();
	}
});