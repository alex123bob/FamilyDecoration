Ext.define('FamilyDecoration.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.layout.container.Border',
        'FamilyDecoration.store.Feature',
        'FamilyDecoration.view.chat.Index',
        'FamilyDecoration.view.user.Index',
        'FamilyDecoration.view.chart.UploadForm'
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
            }, {
                type: 'refresh',
                tooltip: '刷新当前应用',
                callback: function (){
                    location.reload();
                }
            }],
            listeners: {
                // itemclick: function (view, rec){
                //     if (/-parent/i.test(rec.get('cmp'))) {
                //         if (rec.isExpanded()) {
                //             rec.collapse();
                //         }
                //         else {
                //             rec.expand();
                //         }
                //     }
                // },
                // beforeitemdblclick: function (){
                //     return false;
                // },
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
                lastXtype = Ext.util.Cookies.get('lastXtype'),
                bulletin = root.findChild('cmp', 'bulletin-index', true),
                lastPanel = root.findChild('cmp', lastXtype, true) || bulletin,
                chartPanel;

            // Ext.util.Cookies.clear('lastXtype');
            if (User.isGeneral()) {
                chartPanel = root.findChild('cmp', 'chart-index', true);
                tree.getSelectionModel().select(chartPanel);
            }
            else {
                // tree.getSelectionModel().select(bulletin);
                tree.getSelectionModel().select(lastPanel);
            }

            Ext.select('[name="realname"]').elements[0].innerHTML = User.getRealName();
            Ext.select('[name="authority"]').elements[0].innerHTML = User.getStatus();
            Ext.select('[name="account"]').elements[0].innerHTML = User.getName();

            function heartBeat (){
                Ext.Ajax.request({
                    url: './libs/user.php?action=checkUserOnlineUniqueness',
                    method: 'GET',
                    ga: false
                });
            }

            if (User.isAdmin()) {
                Ext.defer(heartBeat, 2000);
                // Heartbeat
                setInterval(heartBeat, 60000);
            }

            if (User.getProfileImage()) {
                // todo
            }
            else {
                var profileImageWin = Ext.create('FamilyDecoration.view.chart.UploadForm', {
                    title: '用户名片图片上传',
                    url: './libs/uploadUserProfileImage.php',
                    supportMult: false,
                    closable: false,
                    afterUpload: function(fp, o) {
                        var p = {},
                            content = '',
                            originalName = '',
                            details = o.result.details;

                        if (details[0]['success']) {
                            content = details[0]['file'];
                            originalName = details[0]['original_file_name'];
                            Ext.apply(p, {
                                profileImage: content,
                                name: User.getName()
                            });

                            Ext.Ajax.request({
                                url: './libs/user.php?action=modifyProfileImage',
                                method: 'POST',
                                params: p,
                                callback: function(opts, success, res) {
                                    if (success) {
                                        var obj = Ext.decode(res.responseText),
                                            index;
                                        if (obj.status == 'successful') {
                                            showMsg('用户名片图片上传成功！');
                                            profileImageWin.close();
                                        }
                                        else {
                                            showMsg(obj.errMsg);
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                profileImageWin.show();
            }

            if (User.getPhoneNumber()) {
                // todo
            }
            else {
                var phoneWin = Ext.create('Ext.window.Window', {
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
                                                phoneWin.close();
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
                            phoneWin.close();
                        }
                    }]
                });
                phoneWin.show();
            }

            if (User.getEmail()) {
                // todo
            }
            else {
                var mailWin = Ext.create('Ext.window.Window', {
                    title: '设置用户邮箱',
                    width: 350,
                    height: 140,
                    resizable: false,
                    modal: true,
                    padding: 10,
                    items: [{
                        xtype: 'textfield',
                        vtype: 'mail',
                        fieldLabel: '邮箱地址',
                        allowBlank: false,
                        id: 'textfield-addUserMailAddress',
                        name: 'textfield-addUserMailAddress'
                    }],
                    buttons: [{
                        text: '确定',
                        handler: function (){
                            var txt = Ext.getCmp('textfield-addUserMailAddress');
                            if (txt.isValid()) {
                                Ext.Ajax.request({
                                    url: './libs/user.php?action=modifyEmail',
                                    method: 'POST',
                                    params: {
                                        name: User.name,
                                        mail: txt.getValue()
                                    },
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                showMsg('邮箱设置成功！');
                                                sendMail(User.getName(), txt.getValue(), 
                                                    '邮箱注册成功[佳诚装饰]', 
                                                    '您已经成功注册邮箱。该邮箱仅用户ERP系统的日常消息推送。谢谢您的支持。[佳诚装饰]');
                                                mailWin.close();
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
                            mailWin.close();
                        }
                    }]
                });
                mailWin.show();
            }

            function refreshEmailAndMsg (period) {
                if (!period) {
                    period = 0;
                }
                setTimeout(function (){
                    var title = Ext.query('[data-recordid="mail-index"] span'),
                        bulletinTitle = Ext.query('[data-recordid="bulletin-index"] span'),
                        oldCount = Ext.query('[data-recordid="mail-index"] span strong'),
                        oldCountForBulletin = Ext.query('[data-recordid="bulletin-index"] span strong'),
                        mailMemberTree = Ext.getCmp('treepanel-memberNameForMail'),
                        dynamicMessageBox = Ext.getCmp('gridpanel-message');
                    // fetch email every period time
                    // close it temporarily because the number of mail is really huge, especially william's mailbox
                    Ext.Ajax.request({
                        url: './libs/mail.php?action=getReceivedMailByUser',
                        params: {
                            mailUser: User.getName()
                        },
                        method: 'GET',
                        callback: function (opts, success, res){
                            if (success) {
                                var obj = Ext.decode(res.responseText),
                                    len = obj.length,
                                    count = 0;
                                for (var i = 0; i < obj.length; i++) {
                                    if (obj[i]['isRead'] == 'false') {
                                        count++;
                                    }
                                }
                                if (title.length > 0) {
                                    if (count > 0) {
                                        title[0].innerHTML = '(<font color="red"><strong>'
                                         + count + '</strong></font>)邮箱平台';
                                        if (oldCount.length > 0) {
                                            oldCount = parseInt(oldCount[0].textContent, 10);
                                            if (Ext.isNumber(oldCount) && count > oldCount) {
                                                showMsg('你有新邮件！');
                                            }
                                        }
                                        else {
                                            showMsg('你有新邮件！');
                                        }
                                        if (mailMemberTree) {
                                            var rec = mailMemberTree.getSelectionModel().getSelection()[0],
                                                inbox = Ext.getCmp('gridpanel-receivedBox'),
                                                sentBox = Ext.getCmp('gridpanel-sentBox');
                                            if (rec && inbox.getStore().getCount() < len) {
                                                inbox.getStore().reload();
                                                sentBox.getStore().reload();
                                            }
                                        }
                                    }
                                    else {
                                        title[0].innerHTML = '邮箱平台';
                                    }
                                }
                                else {
                                    // otherwise do nothing. this is the visitor mode. no bulletin, no emailbox
                                }
                            }
                        },
                        silent: true,
                        automatic: true
                    });
                    // fetch message every period time
                    Ext.Ajax.request({
                        url: './libs/message.php?action=get',
                        params: {
                            isDeleted: false,
                            isRead: false,
                            receiver: User.getName()
                        },
                        method: 'GET',
                        silent: true,
                        automatic: true,
                        callback: function (opts, success, res){
                            if (success) {
                                var obj = Ext.decode(res.responseText),
                                    count = obj.length;
                                if (bulletinTitle.length > 0) {
                                    if (count > 0) {
                                        bulletinTitle[0].innerHTML = '(<font color="red"><strong>'
                                         + count + '</strong></font>)公告栏信息';
                                        if (oldCountForBulletin.length > 0) {
                                            oldCountForBulletin = parseInt(oldCountForBulletin[0].textContent, 10);
                                            if (Ext.isNumber(oldCountForBulletin) && count > oldCountForBulletin) {
                                                showMsg('你有新消息！');
                                            }
                                        }
                                        else {
                                            showMsg('你有新消息！');
                                        }
                                        if (dynamicMessageBox) {
                                            if (dynamicMessageBox.getStore().getCount() < count) {
                                                dynamicMessageBox.refresh();
                                            }
                                        }
                                    }
                                    else {
                                        bulletinTitle[0].innerHTML = '公告栏信息';
                                    }
                                }
                                else {
                                    // otherwise do nothing, because this is the visitor mode
                                }
                            }
                        }
                    })
                }, period); 
            }

            window.refreshEmailAndMsg = refreshEmailAndMsg;
            refreshEmailAndMsg(3000);

            // use sina channel to push message which is more like the long connection websocket
            if (typeof sae != 'undefined' && sae.Channel && privateChannel) {
                privateChannel = new sae.Channel(privateChannel);
                privateChannel.onopen = function(){
                    console.log('privateChannel' + " opened");
                };

                privateChannel.onclose  = function(){
                    console.log('privateChannel' + " closed");
                };

                privateChannel.onerror   = function(){
                    console.log('privateChannel' + " error");
                };

                privateChannel.onmessage = function(obj){
                    console.log(obj);
                    refreshEmailAndMsg(0);
                };
            }

            // for email and message hint blink
            setInterval(function (){
                var unreadMails = Ext.query('[data-recordid="mail-index"] span strong'),
                    unreadMsg = Ext.query('[data-recordid="bulletin-index"] span strong'),
                    el, bulletinEl;
                if (unreadMails.length > 0) {
                    el = unreadMails[0];
                    $(el).fadeToggle({
                        duration: 400,
                        easing: 'linear',
                        complete: function (){
                            $(this).fadeToggle({
                                duration: 400,
                                easing: 'linear'
                            });
                        }
                    });
                }
                if (unreadMsg.length > 0) {
                    bulletinEl = unreadMsg[0];
                    $(bulletinEl).fadeToggle({
                        duration: 400,
                        easing: 'linear',
                        complete: function (){
                            $(this).fadeToggle({
                                duration: 400,
                                easing: 'linear'
                            });
                        }
                    });

                }
            }, 1000);
            // end of blink

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
        center.removeAll(true);
    }
    newCt = center.insert(0, {
        xtype: xtype
    });

    var cmp = option.getStore().getRootNode().findChild('cmp', xtype, true);
    option.getSelectionModel().select(cmp);

    Ext.util.Cookies.set('lastXtype', xtype);

    Ext.resumeLayouts(true);

    return newCt;
}