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
    
    title: '申请投标保证金',
    
    bodyPadding: 10,
    bidProject: null,
    rec: null,

    initComponent: function() {
        var me = this,
            rec = me.rec,
            dateRenderer = Ext.util.Format.dateRenderer('Y-m-d');

        me.items = [
            {
                xtype: 'form',
                flex: 1,
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    readOnly: rec ? true : false,
                },

                items: [
                    {
                        fieldLabel: '工程名称',
                        name: 'projectName',
                        readOnly: true,
                        value: rec ? rec.projectName : me.bidProject.get('name')
                    },
                    {
                        fieldLabel: '开标时间',
                        name: 'bidTime',
                        readOnly: true,
                        value: dateRenderer(rec ? rec.bidTime : me.bidProject.get('startTime'))
                    },
                    {
                        fieldLabel: '保证金金额',
                        name: 'claimAmount',
                        xtype: 'numberfield',
                        readOnly: rec ? true : false,
                        value: rec ? rec.claimAmount : ''
                    },
                    {
                        fieldLabel: '联系人',
                        name: 'payee',
                        readOnly: rec ? true : false,
                        value: rec ? rec.payee : ''
                    },
                    {
                        fieldLabel: '联系方式',
                        name: 'phoneNumber',
                        readOnly: rec ? true : false,
                        value: rec ? rec.phoneNumber : ''
                    },
                    {
                        fieldLabel: '账号名称',
                        name: 'accountName',
                        readOnly: rec ? true : false,
                        value: rec ? rec.accountNumber : ''
                    },
                    {
                        fieldLabel: '开户行',
                        name: 'bank',
                        readOnly: rec ? true : false,
                        value: rec ? rec.bank : ''
                    },
                    {
                        fieldLabel: '账号',
                        name: 'accountNumber',
                        readOnly: rec ? true : false,
                        value: rec ? rec.accountNumber : ''
                    },
                    {
                        fieldLabel: '申请人',
                        name: 'creator',
                        value: rec ? rec.creatorRealName : User.getRealName(),
                        readOnly: true
                    },
                ]
            },
        ];

        me.buttons = [
            {
                hidden: rec ? rec.status !== 'new' : false,
                text: '申请',
                handler: function() {
                    var frm = me.down('form'),
                        obj = frm.getValues();
                    Ext.apply(obj, {
                        billType: 'bidbond',
                        refId: me.bidProject.getId()
                    });
                    obj.creator = User.getName();
                    ajaxAdd('StatementBill', obj, function (res) {
                        ajaxUpdate('StatementBill.changeStatus', {
                            id: res.data.id,
                            status: '+1',
                            currentStatus: 'new'
                        }, ['id', 'currentStatus'], function(res){
                            showMsg('申请成功！');
                            me.close();
                        }, true);
                    });
                }
            },
            {
                hidden: !( (User.isAdmin() || User.isFinanceManager()) && rec && rec.status === 'rdyck' ),
                text: '批准',
                handler: function() {
                    ajaxUpdate('StatementBill.changeStatus', {
                        id: rec.id,
                        status: '+1',
                        currentStatus: rec.status
                    }, ['id', 'currentStatus'], function(res){
                        showMsg('批准成功!');
                        me.close();
                    }, true);
                }
            }
        ]

        me.callParent();
    }
})