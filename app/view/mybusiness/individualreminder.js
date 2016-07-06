Ext.define('FamilyDecoration.view.mybusiness.IndividualReminder', {
    extend: 'Ext.window.Window',
    alias: 'widget.mybusiness-individualreminder',

    // resizable: false,
    modal: true,
    width: 500,
    height: 200,
    title: '提醒功能',
    layout: 'vbox',
    bodyPadding: 4,
    defaults: {
        allowBlank: false,
        width: '100%'
    },
    sender: undefined,
    recipient: undefined,
    type: undefined,
    extraId: undefined,
    afterClose: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                itemId: 'textarea-content',
                xtype: 'textarea',
                fieldLabel: '内容',
                flex: 3
            },
            {
                itemId: 'datefield-remindTime',
                xtype: 'datefield',
                fieldLabel: '时间',
                flex: 1,
                editable: false
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txt = me.getComponent('textarea-content'),
                        remindTime = me.getComponent('datefield-remindTime');
                    if (txt.isValid() && remindTime.isValid()) {
                        sendMsg(
                            (me.sender ? me.sender : User.getName()), 
                            (me.recipient ? me.recipient : User.getName()),
                            txt.getValue(),
                            me.type ? me.type : undefined,
                            me.extraId ? me.extraId : undefined,
                            Ext.Date.format(remindTime.getValue(), 'Y-m-d')
                        );
                        showMsg('添加提醒成功！');
                        me.close();
                        me.afterClose();
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ]

        this.callParent();
    }
});