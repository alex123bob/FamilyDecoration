Ext.define('FamilyDecoration.view.mylog.SelfPlan', {
    extend: 'Ext.window.Window',
    alias: 'widget.mylog-selfplan',
    requires: [

    ],
    title: '个人计划',
    modal: true,
    layout: 'vbox',
    maximizable: true,
    width: 550,
    height: 340,
    bodyPadding: 4,
    defaults: {
        xtype: 'fieldcontainer',
        height: 20,
        width: '100%',
        layout: 'hbox'
    },
    autoScroll: true,

    initComponent: function () {
        var me = this;

        me.items = [];

        me.buttons = [
            {
                text: '添加',
                handler: function (){
                    Ext.suspendLayouts();

                    var index = me.items.items.length;
                    var config = {
                        defaults: {
                            height: '100%'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'X',
                                name: 'button-logItem',
                                margin: '0 2 0 0',
                                handler: function (){
                                    var ct = this.ownerCt,
                                        nextCt = ct.nextSibling();

                                    Ext.suspendLayouts();
                                    me.remove(ct);
                                    while (nextCt) {
                                        var logItemTxt = nextCt.down('[name="textfield-logItem"]'),
                                            labelStr = logItemTxt.getFieldLabel(),
                                            label = parseInt(labelStr, 10);
                                        logItemTxt.setFieldLabel((label - 1).toString());
                                        nextCt = nextCt.nextSibling();
                                    }
                                    Ext.resumeLayouts(true);
                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'textfield-logItem',
                                flex: 1,
                                labelWidth: 20,
                                fieldLabel: (index + 1).toString()
                            },
                            {
                                xtype: 'checkboxfield',
                                name: 'isFinished',
                                inputValue: false,
                                width: 40,
                                margin: '0 0 0 2'
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'hiddenfield-planId'
                            }
                        ]
                    };
                    me.insert(index, config);

                    Ext.resumeLayouts(true);
                }
            },
            {
                text: '确定',
                handler: function () {

                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});