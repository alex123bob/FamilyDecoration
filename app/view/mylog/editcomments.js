Ext.define('FamilyDecoration.view.mylog.EditComments', {
    extend: 'Ext.window.Window',
    alias: 'widget.mylog-editcomments',
    requires: [

    ],
    title: '评价',
    modal: true,
    layout: 'fit',
    width: 400,
    height: 300,
    rec: null,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                name: 'textarea-comments',
                autoScroll: true,
                value: me.rec ? rec.get('') : ''
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txtArea = me.down('textarea');
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