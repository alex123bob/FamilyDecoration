Ext.define('FamilyDecoration.view.mylog.SummarizedLog', {
    extend: 'Ext.window.Window',
    alias: 'widget.mylog-summarizedlog',
    requires: [

    ],
    title: '总结日志',
    modal: true,
    layout: 'fit',
    width: 550,
    height: 340,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                name: 'textarea-content',
                autoScroll: true
            }
        ];

        me.buttons = [
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