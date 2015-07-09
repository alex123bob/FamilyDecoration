Ext.define('FamilyDecoration.view.bulletin.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.bulletin-index',
    requires: [
        'FamilyDecoration.store.Bulletin', 'FamilyDecoration.view.bulletin.EditBulletin',
        'FamilyDecoration.store.Message', 'Ext.grid.column.Action'
    ],
    autoScroll: true,
    layout: 'hbox',

    initComponent: function (){
        var me = this,
            itemsPerPage = 3,
            bulletinSt = Ext.create('FamilyDecoration.store.Bulletin', {
                autoLoad: true,
                pageSize: itemsPerPage // items per page
            });

        me.items = [{
            xtype: 'fieldcontainer',
            layout: 'vbox',
            height: '100%',
            flex: 1,
            items: [{
                xtype: 'gridpanel',
                id: 'gridpanel-bulletin',
                name: 'gridpanel-bulletin',
                title: '查看公告',
                flex: 1,
                width: '100%',
                autoScroll: true,
                hideHeaders: true,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                columns: [{
                    text: '公告内容',
                    dataIndex: 'content',
                    flex: 1,
                    align: 'center',
                    renderer: function (val, meta, rec){
                        val = unescape(val);
                        if (rec.get('isStickTop') == 'true') {
                            // val += '<sup style="color: red; font-size: 10px;">置顶公告</sup>';
                            val += '<img src="./resources/img/pin.png" width="20" height="20" />';
                        }
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
                    text: '公告置顶',
                    icon: './resources/img/nail.png',
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
                    icon: './resources/img/back.png',
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
                }],
                bbar: [{
                    text: '添加公告',
                    icon: './resources/img/add.png',
                    hidden: !User.isAdmin() && !User.isAdministrationManager() && !User.isAdministrationStaff(),
                    handler: function (){
                        var win = Ext.create('FamilyDecoration.view.bulletin.EditBulletin');
                        win.show();
                    }
                }, {
                    text: '修改公告',
                    icon: './resources/img/edit.png',
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
                    icon: './resources/img/delete.png',
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
                }],
                listeners: {
                    afterrender: function(grid, opts) {
                        var view = grid.getView();
                        var tip = Ext.create('Ext.tip.ToolTip', {
                            target: view.el,
                            delegate: view.cellSelector,
                            trackMouse: true,
                            renderTo: Ext.getBody(),
                            listeners: {
                                beforeshow: function(tip) {
                                    var rec = view.getRecord(tip.triggerElement.parentNode);
                                    if (rec && rec.get('isStickTop') == 'true') {
                                        tip.update('置顶信息');
                                    }
                                    else {
                                        return false;
                                    }
                                }
                            }
                        });
                    }
                }
            }, {
                xtype: 'gridpanel',
                id: 'gridpanel-message',
                name: 'gridpanel-message',
                title: '动态消息',
                width: '100%',
                flex: 1,
                hideHeaders: true,
                autoScroll: true,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                columns: [{
                    text: '内容',
                    dataIndex: 'content',
                    flex: 12,
                    renderer: function (val){
                        if (val) {
                            return val.replace(/\n/ig, '<br />');
                        }
                        else {
                            return val;
                        }
                    }
                }, {
                    xtype: 'actioncolumn',
                    flex: 1,
                    items: [{
                        icon: './resources/img/read.png',  // Use a URL in the icon config
                        tooltip: '置为已读',
                        iconCls: 'pointerCursor',
                        handler: function(grid, rowIndex, colIndex, item, e, rec) {
                            Ext.Ajax.request({
                                url: './libs/message.php',
                                method: 'POST',
                                params: {
                                    action: 'read',
                                    id: rec.getId()
                                },
                                callback: function (otps, success, res){
                                    if (success) {
                                        var obj = Ext.decode(res.responseText),
                                            msgGrid = Ext.getCmp('gridpanel-message');
                                        if (obj.status == 'successful') {
                                            showMsg('已置为已读');
                                            msgGrid.refresh();
                                        }
                                        else {
                                            showMsg(obj.errMsg);
                                        }
                                    }
                                }
                            });
                        }
                    }]
                }],
                store: Ext.create('FamilyDecoration.store.Message', {
                    autoLoad: false
                }),
                refresh: function (){
                    var msgGrid = this,
                        msgSt = msgGrid.getStore();
                    msgSt.load({
                        params: {
                            isDeleted: 'false',
                            isRead: 'false',
                            receiver: User.getName()
                        },
                        callback: function (){
                            
                        }
                    })
                },
                listeners: {
                    afterrender: function(grid, opts) {
                        grid.refresh();
                    }
                }
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: 'vbox',
            height: '100%',
            flex: 1,
            items: [{
                title: '本周之星',
                width: '100%',
                flex: 1,
                layout: 'fit',
                id: 'panel-thisWeekStar',
                name: 'panel-thisWeekStar',
                items: [{
                    xtype: 'image',
                    src: './jz/2.php'
                }]
            }, {
                title: '本周之坑',
                width: '100%',
                flex: 1,
                layout: 'fit',
                items: [{
                    xtype: 'image',
                    src: './jz/3.php'
                }]
            }]
        }];

        this.callParent();
    }
});