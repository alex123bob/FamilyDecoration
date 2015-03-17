Ext.define('FamilyDecoration.view.bulletin.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.bulletin-index',
    requires: [
    ],
    autoScroll: true,
    layout: 'fit',

    initComponent: function (){
        var me = this;

        me.items = [{
            xtype: 'panel',
            id: 'panel-bulletin',
            name: 'panel-bulletin',
            title: '查看公告',
            autoScroll: true,
            bodyCls: 'announcement',
            refresh: function (){
                var panel = this;
                Ext.Ajax.request({
                    url: './libs/bulletin.php?action=view',
                    method: 'GET',
                    callback: function (opts, success, res){
                        if (success) {
                            var obj = Ext.decode(res.responseText);
                            Ext.suspendLayouts();
                            if (obj.content) {
                                panel.update(polish(obj.content));
                            }
                            else {
                                panel.update('没有公告');
                            }
                            Ext.resumeLayouts(true);
                        }
                    }
                });
            },
            bbar: [{
                text: '添加公告',
                hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                handler: function (){
                    var win = Ext.create('Ext.window.Window', {
                        title: '添加公告',
                        width: 500,
                        height: 400,
                        modal: true,
                        layout: 'fit',
                        items: [{
                            xtype: 'textareafield',
                            name: 'textareafield-message',
                            id: 'textareafield-message',
                            emptyText: '请输入公告内容',
                            hideLabel: true
                        }],
                        buttons: [{
                            text: '确定',
                            handler: function (){
                                var textarea = Ext.getCmp('textareafield-message');
                                Ext.Ajax.request({
                                    url: './libs/bulletin.php?action=publish',
                                    method: 'POST',
                                    params: {
                                        content: escape(textarea.getValue())
                                    },
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                showMsg('发布成功！');
                                                Ext.getCmp('panel-bulletin').refresh();
                                                win.close();
                                            }
                                        }
                                    }
                                });
                            }
                        }, {
                            text: '取消',
                            handler: function (){
                                win.close();
                            }
                        }]
                    });
                    win.show();
                }
            }]
        }];

        me.on('add', function (cmp){
            Ext.getCmp('panel-bulletin').refresh();
        });

        this.callParent();
    }
});