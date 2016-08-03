Ext.define('FamilyDecoration.view.paymentrequest.EditRequest', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymentrequest-editrequest',
    requires: [
        'FamilyDecoration.view.paymentrequest.EditBelongedItem'
    ],
    width: 500,
    height: 300,
    autoScroll: true,
    layout: 'fit',
    bodyPadding: 6,
    modal: true,

    request: undefined,
    user: undefined,

    initComponent: function () {
        var me = this;

        me.title = me.request ? '编辑付款申请' : '付款申请';

        me.items = [
            {
                xtype: 'form',
                layout: 'form',
                defaultType: 'textfield',
                defaults: {
                    allowBlank: false
                },
                items: [
                    {
                        fieldLabel: '项目名称',
                        name: 'projectName'
                    },
                    {
                        fieldLabel: '归属项目',
                        name: 'reimbursementReason',
                        readOnly: true,
                        listeners: {
                            focus: function (txt, ev, opts) {
                                var win = Ext.create('FamilyDecoration.view.paymentrequest.EditBelongedItem', {
                                    callback: function (data) {
                                        txt.setValue(data);
                                    }
                                });
                                win.show();
                            }
                        }
                    },
                    {
                        fieldLabel: '申请金额',
                        maskRe: /[\d\.\-]/,
                        name: 'claimAmount'
                    },
                    {
                        fieldLabel: '申请日期',
                        xtype: 'datefield',
                        editable: false,
                        name: 'createTime',
                        submitFormat: 'Y-m-d H:i:s'
                    },
                    {
                        fieldLabel: '申请属性',
                        xtype: 'combobox',
                        valueField: 'value',
                        displayField: 'name',
                        queryMode: 'local',
                        editable: false,
                        name: 'billType',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: '报销',
                                    value: 'rbm'
                                },
                                {
                                    name: '税金',
                                    value: 'tax'
                                },
                                {
                                    name: '福利',
                                    value: 'wlf'
                                },
                                {
                                    name: '财物费用',
                                    value: 'fdf'
                                }
                            ]
                        })
                    },
                    {
                        fieldLabel: '备注',
                        name: 'descpt'
                    },
                    {
                        fieldLabel: '附件',
                        readOnly: true,
                        name: 'certs',
                        allowBlank: true,
                        listeners: {
                            focus: function (txt, ev, opts) {
                                console.log(txt);
                            }
                        }
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var frm = me.down('form'),
                        obj = frm.getValues();
                    Ext.apply(obj, {
                        payee: me.user.get('name')
                    });
                    if (frm.isValid()) {
                        ajaxAdd('StatementBill', obj, function (obj){
                            showMsg('申请成功！');
                            me.close();
                        });
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        me.callParent();
    }
});