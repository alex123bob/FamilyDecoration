Ext.define('FamilyDecoration.view.mytask.AssistantList', {
    extend: 'Ext.window.Window',
    alias: 'widget.mytask-assistantlist',
    requires: [
        'FamilyDecoration.view.checklog.MemberList'
    ],
    layout: 'fit',
    defaults: {
        
    },

    width: 500,
    height: 300,
    modal: true,
    title: '编辑任务协助人',
    task: undefined,
    assistantList: [], // user names collection.
    callback: Ext.emptyFn,
    maximizable: true,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'checklog-memberlist',
                isCheckMode: true,
                assignees: me.assistantList,
                loadAll: true
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function (){
                    var memberList = me.down('checklog-memberlist'),
                        userList = memberList.getChecked(),
                        arr = [];
                    Ext.each(userList, function (user, index, self){
                        arr.push(user.get('name'));
                    });
                    Ext.Ajax.request({
                        url: './libs/tasklist.php',
                        method: 'POST',
                        params: {
                            action: 'editTaskList',
                            id: me.task.getId(),
                            assistant: arr.join(',')
                        },
                        callback: function (opts, success, res){
                            if (success) {
                                var obj = Ext.decode(res.responseText);
                                if ('successful' == obj.status) {
                                    showMsg('编辑成功!');
                                    me.close();
                                    me.callback();
                                }
                                else {
                                    showMsg(obj.errMsg);
                                }
                            }
                        }
                    });
                }
            },
            {
                text: '取消',
                handler: function (){
                    me.close();
                }
            }
        ];
        
        this.callParent();
    }
});