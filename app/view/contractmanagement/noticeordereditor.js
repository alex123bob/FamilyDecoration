Ext.define('FamilyDecoration.view.contractmanagement.NoticeOrderEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.contractmanagement-noticeordereditor',
    requires: [
        'FamilyDecoration.view.contractmanagement.PickUser'
    ],
    title: '工程联系单',
    contract: null,
    preview: false,
    layout: 'fit',
    bodyPadding: 10,
    modal: true,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'form',
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                },

                // The fields
                defaultType: 'textfield',

                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'contractId',
                        itemId: 'contractId',
                        value: me.contract.getId()
                    },
                    {
                        fieldLabel: '标题',
                        name: 'title',
                        itemId: 'title'
                    },
                    {
                        fieldLabel: '内容',
                        name: 'content',
                        itemId: 'content'
                    },
                    {
                        fieldLabel: '价格',
                        name: 'price',
                        itemId: 'price',
                        xtype: 'numberfield'
                    },
                    {
                        fieldLabel: '人员',
                        name: 'creator',
                        itemId: 'creator',
                        readOnly: true,
                        listeners: {
                            focus: function(cmp, evt, opts) {
                                var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                    callback: function (rec){
                                        var ct = cmp.ownerCt,
                                            creatorName = ct.getComponent('creatorName');
                                        cmp.setValue(rec.get('realname'));
                                        creatorName.setValue(rec.get('name'));
                                        win.close();
                                    }
                                });
        
                                win.show();
                            }
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'creatorName',
                        itemId: 'creatorName'
                    },
                ]
            }
            
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function() {
                    var form = me.down('form');
                    if (form.isValid()) {
                        ajaxAdd('ContractEngineeringNoticeOrder', form.getValues(), function (obj){
                            showMsg('添加成功！');
                            me.close();
                        });
                    }
                }
            }
        ]

        this.callParent();
    }
});