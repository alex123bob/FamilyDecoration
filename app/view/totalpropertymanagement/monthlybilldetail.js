Ext.define('FamilyDecoration.view.totalpropertymanagement.MonthlyBillDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.totalpropertymanagement-MonthlyBillDetail',
    requires: [
        'FamilyDecoration.store.AccountLog'
    ],
    layout: 'fit',
    width: 500,
    height: 300,
    title: '月现金账详细清单',
    maximizable: true,
    modal: true,
    account: undefined,
    defaults: {

    },
    html: '<iframe id="exportMonthlyBillDetail"  src="javascript:void(0);" style="display:none"></iframe>',
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.AccountLog', {
                autoLoad: false
            }),
            proxy = st.getProxy();

        Ext.apply(proxy.extraParams, {
            accountId: me.account.get('accountId'),
            date: me.account.get('checkMonth'),
            scale: me.scale.getSubmitValue()
        });
        st.load();

        me.buttons = [
            {
                text: '导出报表',
                handler: function () {
                    if (me.account) {
                        var exportFrame = document.getElementById('exportMonthlyBillDetail');
                        // exportFrame.src = './fpdf/account_log.php?accountId=' + me.account.get('accountId')
                        //                 + '&date=' + me.account.get('checkMonth') + '&scale=' + me.scale.getSubmitValue()
                        //                 + '&orderby=createTime';
                        var url = './fpdf/account_log.php?accountId=' + me.account.get('accountId')
                            + '&date=' + me.account.get('checkMonth') + '&scale=' + me.scale.getSubmitValue()
                            + '&orderby=createTime';
                        var win = window.open(url, '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                    }
                    else {
                        showMsg('没有账号!');
                    }
                }
            }
        ]

        me.items = [
            {
                xtype: 'gridpanel',
                autoScroll: true,
                store: st,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '日期',
                            dataIndex: 'createTime'
                        },
                        {
                            text: '出账',
                            dataIndex: 'amount',
                            renderer: function (val, meta, rec) {
                                return rec.get('type') == 'out' ? val : '';
                            }
                        },
                        {
                            text: '入账',
                            dataIndex: 'amount',
                            renderer: function (val, meta, rec) {
                                return rec.get('type') == 'in' ? val : '';
                            }
                        },
                        {
                            text: '账户余额',
                            dataIndex: 'balance'
                        },
                        {
                            text: '明细',
                            dataIndex: 'desc'
                        },
                        {
                            text: '核对人',
                            dataIndex: 'operatorRealName'
                        }
                    ]
                }
            }
        ]

        this.callParent();
    }
});