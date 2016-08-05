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
    callback: Ext.emptyFn,

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
                        name: 'projectName',
                        value: me.request ? me.request.get('projectName') : ''
                    },
                    {
                        fieldLabel: '归属项目',
                        name: 'reimbursementReason',
                        readOnly: true,
                        value: me.request ? me.request.get('reimbursementReason') : '',
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
                        name: 'claimAmount',
                        value: me.request ? me.request.get('claimAmount') : ''
                    },
                    {
                        fieldLabel: '申请日期',
                        xtype: 'datefield',
                        editable: false,
                        name: 'createTime',
                        submitFormat: 'Y-m-d H:i:s',
                        value: me.request ? me.request.get('createTime').slice(0, 10) : ''
                    },
                    {
                        fieldLabel: '申请属性',
                        xtype: 'combobox',
                        valueField: 'value',
                        displayField: 'name',
                        queryMode: 'local',
                        editable: false,
                        name: 'billType',
                        value: me.request ? me.request.get('billType') : '',
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
                        name: 'descpt',
                        value: me.request ? me.request.get('descpt') : ''
                    },
                    {
                        fieldLabel: '附件',
                        readOnly: true,
                        name: 'certs',
                        value: me.request ? me.request.get('certs') : '',
                        listeners: {
                            focus: function (txt, ev, opts) {
                                var certUpload = Ext.create('FamilyDecoration.view.chart.UploadForm', {
                                    title: '附件上传',
                                    url: './libs/upload_certs_pic.php',
                                    supportMult: true,
                                    afterUpload: function (fp, o) {
                                        var p = {},
                                            content = '',
                                            originalName = '',
                                            details = o.result.details,
                                            flag = ',';

                                        Ext.each(details, function (obj, i, arr){
                                            if (obj['success']) {
                                                content += obj['file'] + flag;
                                                originalName += obj['original_file_name'] + flag;
                                            }
                                        });
                                        content = content.slice(0, parseInt('-' + flag.length, 10));
                                        originalName = originalName.slice(0, parseInt('-' + flag.length, 10));
                                        txt.setValue(content);
                                        certUpload.close();
                                    }
                                });
                                certUpload.show();
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
                    if (me.request) {
                        Ext.apply(obj, {
                            id: me.request.getId(),
                            status: me.request.get('status')
                        });
                    }
                    if (frm.isValid()) {
                        if (me.request) {
                            ajaxUpdate('StatementBill', obj, ['id'], function (obj) {
                                showMsg('更新成功！');
                                me.close();
                                me.callback();
                            });
                        }
                        else {
                            ajaxAdd('StatementBill', obj, function (obj) {
                                showMsg('申请成功！');
                                me.close();
                                me.callback();
                            });
                        }
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