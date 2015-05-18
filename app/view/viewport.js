Ext.define('FamilyDecoration.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.layout.container.Border',
        'FamilyDecoration.store.Feature',
        'FamilyDecoration.view.chat.Index',
        'FamilyDecoration.view.user.Index'
    ],

    layout: {
        type: 'border'
    },

    minWidth: 960,
    minHeight: 600,
    autoScroll: true,

    initComponent: function (){
        var featureStore = Ext.create('FamilyDecoration.store.Feature', {
            listeners: {
                beforeappend: function (pNode, node, opts){
                    return FamilyDecoration.store.Feature.filterFeature(node);
                }
            }
        });

        this.items = [{
            xtype: 'treepanel',
            region: 'west',
            split: true,
            collapsible: true,
            title: '选项',
            rootVisible: false,
            width: 200,
            minWidth: 200,
            maxWidth: 400,
            store: featureStore,
            name: 'treepanel-generalList',
            id: 'treepanel-generalList',
            margin: '8 1 2 8',
            tools: [{
                type: 'help',
                hidden: !User.isAdmin(),
                tooltip: '用户监管平台',
                callback: function() {
                    var win = Ext.create('FamilyDecoration.view.user.Index');
                    win.show();
                }
            }],
            listeners: {
                itemclick: function (view, rec){
                    if (/-parent/i.test(rec.get('cmp'))) {
                        return false;
                    }
                },
                selectionchange: function (selModel, sels){
                    var rec = sels[0], xtype;
                    if (rec && /-index/i.test(rec.get('cmp'))) {
                        xtype = rec.get('cmp');
                        changeMainCt(xtype);
                    }
                }
            }
        }, {
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            margin: '8 8 2 1',
            items: [{
                // xtype: 'bulletin-index'
            }]
        }, {
            xtype: 'container',
            region: 'south',
            margin: '2 4 4 4',
            contentEl: 'userInfo'
        }];

        this.on('afterrender', function (){
            var tree = this.down('treepanel'),
                root = tree.getStore().getRootNode(),
                bulletin = root.findChild('cmp', 'bulletin-index', true),
                chartPanel;

            Ext.util.Cookies.clear('lastXtype');
            if (User.isGeneral()) {
                chartPanel = root.findChild('cmp', 'chart-index', true);
                tree.getSelectionModel().select(chartPanel);
            }
            else {
                tree.getSelectionModel().select(bulletin);
            }

            Ext.select('[name="realname"]').elements[0].innerHTML = User.getRealName();
            Ext.select('[name="authority"]').elements[0].innerHTML = User.getStatus();
            Ext.select('[name="account"]').elements[0].innerHTML = User.getName();

            function heartBeat (){
                Ext.Ajax.request({
                    url: './libs/user.php?action=checkUserOnlineUniqueness',
                    method: 'GET'
                });
            }

            if (User.isAdmin()) {
                Ext.defer(heartBeat, 2000);
                // Heartbeat
                setInterval(heartBeat, 60000);
            }

            if (User.getPhoneNumber()) {
                // todo
            }
            else {
                var win = Ext.create('Ext.window.Window', {
                    title: '设置用户手机号',
                    width: 350,
                    height: 140,
                    resizable: false,
                    modal: true,
                    padding: 10,
                    items: [{
                        xtype: 'textfield',
                        vtype: 'phone',
                        fieldLabel: '手机号码',
                        allowBlank: false,
                        id: 'textfield-addUserPhoneNumber',
                        name: 'textfield-addUserPhoneNumber'
                    }],
                    buttons: [{
                        text: '确定',
                        handler: function (){
                            var txt = Ext.getCmp('textfield-addUserPhoneNumber');
                            if (txt.isValid()) {
                                Ext.Ajax.request({
                                    url: './libs/user.php?action=modifyPhoneNumber',
                                    method: 'POST',
                                    params: {
                                        name: User.name,
                                        phone: txt.getValue()
                                    },
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                showMsg('手机号码设置成功！');
                                                win.close();
                                            }
                                            else {
                                                showMsg(obj.errMsg);
                                            }
                                        }
                                    }
                                });
                            }
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

        });
        
        this.callParent();
    }
});

function changeMainCt (xtype){
    Ext.Ajax.abortAll();
    Ext.suspendLayouts();

    var viewport = Ext.ComponentQuery.query('viewport')[0];
    var items = viewport.items.items;

    var i = 0, newCt, center, option,
        len = items.length;
    var cur = Ext.util.Cookies.get('lastXtype');

    while (i < len) {
        if (items[i].region === 'center') {
            center = items[i];
        }
        else if (items[i].region === 'west') {
            option = items[i];
        }
        i++;
    }

    if (cur) {
        if (cur == xtype) {
            newCt = center.items.items[0];
        }
        else {
            center.removeAll(true);
            newCt = center.insert(0, {
                xtype: xtype
            });
        }
    }
    else {
        newCt = center.insert(0, {
            xtype: xtype
        });
    }

    var cmp = option.getStore().getRootNode().findChild('cmp', xtype, true);
    option.getSelectionModel().select(cmp);

    Ext.util.Cookies.set('lastXtype', xtype);

    Ext.resumeLayouts(true);

    return newCt;
}