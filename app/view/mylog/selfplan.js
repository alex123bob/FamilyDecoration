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
    initInfo: null,

    initComponent: function () {
        var me = this;

        function _generateCmp(index, rec) {
            return {
                defaults: {
                    height: '100%'
                },
                items: [
                    {
                        xtype: 'button',
                        text: 'X',
                        name: 'button-logItem',
                        margin: '0 2 0 0',
                        hidden: rec ? !rec.isToday : false,
                        handler: function () {
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
                        fieldLabel: (index + 1).toString(),
                        readOnly: rec ? rec.isToday : false,
                        value: rec ? rec.content : ''
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
                        name: 'hiddenfield-selfPlanId',
                        value: rec ? rec.id : ''
                    }
                ]
            };
        }

        me.items = [];

        me.buttons = [
            {
                text: '添加',
                handler: function () {
                    Ext.suspendLayouts();

                    var index = me.items.items.length;
                    me.insert(index, _generateCmp(index));

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

        me.addListener('afterrender', function (win, opts){
            console.log(win.initInfo);
        });

        this.callParent();
    }
});