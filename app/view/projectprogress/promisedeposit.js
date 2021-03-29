Ext.define('FamilyDecoration.view.projectprogress.PromiseDeposit', {
    extend: 'Ext.window.Window',
    alias: 'widget.projectprogress-promisedeposit',
    requires: [
        
    ],

    modal: true,
    layout: 'fit',
    
    resizable: false,
    width: 500,
    height: 400,
    isEdit: false,
    
    title: '申请履约保证金',
    
    bodyPadding: 10,
    rec: null,

    initComponent: function() {
        var me = this;

        me.items = [
            {
                xtype: 'form',
                flex: 1,
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    readOnly: !me.isEdit,
                },

                items: [
                    {
                        fieldLabel: '工程名称',
                        name: 'projectName',
                        readOnly: true,
                        value: me.rec.get('projectName')
                    },
                    {
                        fieldLabel: '开标时间',
                        name: 'bidTime',
                        readOnly: true,
                        value: me.rec.get('projectTime')
                    },
                    {
                        fieldLabel: '保证金金额',
                        name: 'claimAmount',
                        xtype: 'numberfield',
                    },
                    {
                        fieldLabel: '联系人',
                        name: 'payee'
                    },
                    {
                        fieldLabel: '联系方式',
                        name: 'phoneNumber'
                    },
                    {
                        fieldLabel: '账号名称',
                        name: 'accountName'
                    },
                    {
                        fieldLabel: '开户行',
                        name: 'bank'
                    },
                    {
                        fieldLabel: '账号',
                        name: 'accountNumber'
                    },
                    {
                        fieldLabel: '申请人',
                        name: 'creator',
                        value: User.getRealName(),
                        readOnly: true
                    },
                ]
            },
        ];

        me.buttons = [
            {
                text: '申请',
                handler: function() {
                    var frm = me.down('form'),
                        obj = frm.getValues();
                    Ext.apply(obj, {
                        billType: 'bidbond'
                    });
                    ajaxAdd('StatementBill', obj, function (obj) {
                        showMsg('申请成功！');
                        me.close();
                        // me.callback();
                    });
                }
            },
            {
                text: '批准',
                handler: function() {

                }
            }
        ]

        me.callParent();
    }
})