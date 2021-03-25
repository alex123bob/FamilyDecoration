Ext.define('FamilyDecoration.view.bulletin.BidDepositForm', {
    extend: 'Ext.window.Window',
    alias: 'widget.bulletin-biddepositform',
    requires: [
        
    ],

    modal: true,
    layout: 'fit',
    
    resizable: false,
    width: 500,
    height: 400,
    isEdit: false,
    
    title: '申请投标保证金',
    
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
                        name: 'name',
                        readOnly: true,
                        value: me.rec.get('name')
                    },
                    {
                        fieldLabel: '开标时间',
                        name: 'startTime',
                        readOnly: true,
                        value: me.rec.get('startTime')
                    },
                    {
                        fieldLabel: '保证金金额',
                        name: 'deposit',
                        xtype: 'numberfield',
                    },
                    {
                        fieldLabel: '联系人',
                        name: 'contact'
                    },
                    {
                        fieldLabel: '联系方式',
                        name: 'contactWay'
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
                        name: 'operator',
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