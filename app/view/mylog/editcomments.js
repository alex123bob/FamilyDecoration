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
    afterEvent: Ext.emptyFn,
    staffName: undefined,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textarea',
                name: 'textarea-comments',
                autoScroll: true,
                value: me.rec ? me.rec.get('comments') : ''
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txtArea = me.down('textarea');
                    if (me.rec && me.rec.get('commentsId')) {
                        ajaxUpdate('LogList', {
                            content: txtArea.getValue(),
                            id: me.rec.get('commentsId')
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
                            logType: 2,
                            committer: me.staffName,
                            evaluator: User.getName()
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