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
    rec: null,
    afterEvent: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                name: 'textarea-content',
                autoScroll: true,
                value: me.rec ? me.rec.get('summarizedLog') : ''
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txtArea = me.down('textarea');
                    if (me.rec && me.rec.get('summarizedLogId')) {
                        ajaxUpdate('LogList', {
                            content: txtArea.getValue(),
                            id: me.rec.get('summarizedLogId')
                        }, 'id', function (obj) {
                            showMsg('修改成功！');
                            me.close();
                            me.afterEvent();
                        })
                    }
                    else {
                        ajaxAdd('LogList', {
                            createTime: me.rec.get('year') + '-' + me.rec.get('month') + '-' + me.rec.get('day') + ' 00:00:00',
                            content: txtArea.getValue(),
                            logType: 1,
                            committer: User.getName()
                        }, function () {
                            showMsg('添加成功!');
                            me.close();
                            me.afterEvent();
                        });
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

        this.callParent();
    }
});