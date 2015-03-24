Ext.define('FamilyDecoration.view.bulletin.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.bulletin-index',
    requires: [
        'FamilyDecoration.store.Bulletin', 'FamilyDecoration.view.bulletin.EditBulletin'
    ],
    autoScroll: true,
    layout: 'fit',

    initComponent: function (){
        var me = this,
            itemsPerPage = 3,
            bulletinSt = Ext.create('FamilyDecoration.store.Bulletin', {
                autoLoad: true,
                pageSize: itemsPerPage // items per page
            });

        me.items = [{
            xtype: 'gridpanel',
            id: 'gridpanel-bulletin',
            name: 'gridpanel-bulletin',
            title: '查看公告',
            autoScroll: true,
            hideHeaders: true,
            columns: [{
                text: '公告内容',
                dataIndex: 'content',
                flex: 1,
                align: 'center',
                renderer: function (val, meta, rec){
                    val = unescape(val);
                    return val.replace(/\n/ig, '<br />');
                }
            }],
            store: bulletinSt,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: bulletinSt,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
            refresh: function (){
                var gridpanel = this;
                gridpanel.getStore().loadPage(1);
                gridpanel.getSelectionModel().deselectAll();
            },
            tbar: [{
                text: '添加公告',
                hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                handler: function (){
                    var win = Ext.create('FamilyDecoration.view.bulletin.EditBulletin');
                    win.show();
                }
            }, {
                text: '修改公告',
                hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                handler: function (){
                    var grid = Ext.getCmp('gridpanel-bulletin'),
                        rec = grid.getSelectionModel().getSelection()[0];
                    if (rec) {
                        var win = Ext.create('FamilyDecoration.view.bulletin.EditBulletin', {
                            bulletin: rec
                        });
                        win.show();
                    }
                    else {
                        showMsg('请选择要修改的公告！');
                    }
                }
            }, {
                text: '删除公告',
                hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                handler: function (){
                    var grid = Ext.getCmp('gridpanel-bulletin'),
                        rec = grid.getSelectionModel().getSelection()[0];
                    if (rec) {
                        Ext.Msg.warning('确定要删除当前选中的公告吗？', function (btnId){
                            if ('yes' == btnId) {
                                Ext.Ajax.request({
                                    url: './libs/bulletin.php?action=delete',
                                    params: {
                                        bulletinId: rec.getId()
                                    },
                                    method: 'POST',
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                showMsg('删除成功！');
                                                grid.refresh();
                                            }
                                            else {
                                                showMsg(obj.errMsg);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                    else {
                        showMsg('请选择要删除的公告！');
                    }
                }
            }, {
                text: '公告置顶',
                hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                handler: function (){
                    var grid = Ext.getCmp('gridpanel-bulletin'),
                        rec = grid.getSelectionModel().getSelection()[0];
                    if (rec) {
                        Ext.Msg.warning('确定要将当前选中的公告置顶吗？', function (btnId){
                            if ('yes' == btnId) {
                                Ext.Ajax.request({
                                    url: './libs/bulletin.php?action=stick',
                                    params: {
                                        bulletinId: rec.getId()
                                    },
                                    method: 'POST',
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                showMsg('置顶成功！');
                                                grid.refresh();
                                            }
                                            else {
                                                showMsg(obj.errMsg);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                    else {
                        showMsg('请选择要置顶的公告！');
                    }
                }
            }, {
                text: '取消置顶',
                hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                handler: function (){
                    var grid = Ext.getCmp('gridpanel-bulletin'),
                        rec = grid.getSelectionModel().getSelection()[0];
                    if (rec) {
                        if (rec.get('isStickTop') == 'true') {
                            Ext.Msg.warning('确定要取消当前置顶的公告吗？', function (btnId){
                                if ('yes' == btnId) {
                                    Ext.Ajax.request({
                                        url: './libs/bulletin.php?action=unstick',
                                        params: {
                                            bulletinId: rec.getId()
                                        },
                                        method: 'POST',
                                        callback: function (opts, success, res){
                                            if (success) {
                                                var obj = Ext.decode(res.responseText);
                                                if (obj.status == 'successful') {
                                                    showMsg('取消置顶成功！');
                                                    grid.refresh();
                                                }
                                                else {
                                                    showMsg(obj.errMsg);
                                                }
                                            }
                                        }
                                    })
                                }
                            });
                        }
                        else if (rec.get('isStickTop') == 'false') {
                            showMsg('该公告没有置顶，请选择置顶公告！');
                        }
                    }
                    else {
                        showMsg('请选择要取消置顶的公告！');
                    }
                }
            }]
        }];

        this.callParent();
    }
});