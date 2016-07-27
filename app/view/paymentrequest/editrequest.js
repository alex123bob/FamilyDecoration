Ext.define('FamilyDecoration.view.paymentrequest.EditRequest', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymentrequest-editrequest',
    requires: [
        'FamilyDecoration.view.paymentrequest.EditBelongedItem'
    ],
    width: 500,
    height: 300,
    autoScroll: true,
    layout: 'form',
    defaultType: 'textfield',
    bodyPadding: 6,
    modal: true,

    request: undefined,

    initComponent: function () {
        var me = this;

        me.title = me.request ? '编辑付款申请' : '付款申请';
        
        me.items = [
            {
                fieldLabel: '项目名称'
            },
            {
                fieldLabel: '归属项目',
                readOnly: true,
                listeners: {
                    focus: function (txt, ev, opts){
                        var win = Ext.create('FamilyDecoration.view.paymentrequest.EditBelongedItem', {

                        });
                        win.show();
                    }
                }
            },
            {
                fieldLabel: '申请金额'
            },
            {
                fieldLabel: '申请日期'
            },
            {
                fieldLabel: '申请属性',
                xtype: 'combobox',
                valueField: 'value',
                displayField: 'name',
                queryMode: 'local',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: '报销',
                            value: 'reimbursement'
                        },
                        {
                            name: '税金',
                            value: 'taxfee'
                        },
                        {
                            name: '福利',
                            value: 'bonus'
                        },
                        {
                            name: '财物费用',
                            value: 'financialFee'
                        }
                    ]
                })
            },
            {
                fieldLabel: '备注'
            },
            {
                fieldLabel: '附件',
                readOnly: true,
                listeners: {
                    focus: function (txt, ev, opts){
                        console.log(txt);
                    }
                }
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){

                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ];

        me.callParent();
    }
});