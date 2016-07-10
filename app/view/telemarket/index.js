Ext.define('FamilyDecoration.view.telemarket.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.telemarket-index',
    requires: [
        'FamilyDecoration.view.telemarket.TransferToBusiness',
        'FamilyDecoration.view.telemarket.EditStatus',
        'FamilyDecoration.view.mybusiness.IndividualReminder'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        xtype: 'gridpanel',
        height: '100%'
    },

    initComponent: function () {
        var me = this,
            needList = User.isAdmin() || User.isBusinessManager(),
            potentialBusinessSt = Ext.create('FamilyDecoration.store.PotentialBusiness', {
            });

        me.getRes = function () {
            var telemarketingStaffList = me.getComponent('gridpanel-telemarketingStaffList'),
                telemarketingStaff = telemarketingStaffList ? telemarketingStaffList.getSelectionModel().getSelection()[0] : undefined,
                businessList = me.getComponent('gridpanel-businessList'),
                businessSt = businessList.getStore(),
                business = businessList.getSelectionModel().getSelection()[0];

            return {
                telemarketingStaffList: telemarketingStaffList,
                telemarketingStaff: telemarketingStaff,
                businessList: businessList,
                businessSt: businessSt,
                business: business
            };
        }

        me.items = [
            needList ? {
                title: '业务代表',
                flex: 1,
                hideHeaders: true,
                itemId: 'gridpanel-telemarketingStaffList',
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                columns: [
                    {
                        text: '姓名',
                        dataIndex: 'telemarketingStaff',
                        flex: 1
                    }
                ],
                store: Ext.create('Ext.data.Store', {
                    fields: ['telemarketingStaff', 'telemarketingStaffName'],
                    proxy: {
                        type: 'rest',
                        url: './libs/business.php?action=getTeleMarketingStaffList',
                        reader: {
                            type: 'json'
                        }
                    },
                    autoLoad: true
                }),
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var resObj = me.getRes();
                        resObj.businessList.refresh();
                    }
                }
            } : null,
            {
                title: '分配名单',
                flex: 9,
                itemId: 'gridpanel-businessList',
                cls: 'gridpanel-potentialBusinessList',
                getBtns: function () {
                    var transferBtn = this.down('[name="button-transferToBusiness"]'),
                        reminderBtn = this.down('[name="button-reminder"]'),
                        returnBackBtn = this.down('[name="button-returnBack"]'),
                        cancelImportantCustBtn = this.down('[name="button-cancelImportantCust"]'),
                        importantCustBtn  = this.down('[name="button-importantCust"]'),
                        editStatusBtn = this.down('[name="button-editStatus"]');
                    return {
                        transferBtn: transferBtn,
                        reminderBtn: reminderBtn,
                        returnBackBtn: returnBackBtn,
                        importantCustBtn: importantCustBtn,
                        cancelImportantCustBtn: cancelImportantCustBtn,
                        editStatusBtn: editStatusBtn
                    };
                },
                initBtn: function () {
                    var btns = this.getBtns(),
                        resObj = me.getRes();
                    for (var name in btns) {
                        if (btns.hasOwnProperty(name)) {
                            var btn = btns[name];
                            btn.setDisabled(!resObj.business);
                        }
                    }
                    if(resObj.business && resObj.business.data && resObj.business.data.isImportant == "true"){
                        btns.importantCustBtn.hide();
                        btns.cancelImportantCustBtn.show();
                    }else{
                        btns.importantCustBtn.show();
                        btns.cancelImportantCustBtn.hide();
                    }
                },
                appendRemindingInfo: function (rec) {
                    var title = '信息情况',
                        marquee = '<marquee scrollamount="6" onMouseOver="this.stop()" onMouseOut="this.start()"><font color="#cccccc;"><strong>信息中心:   ',
                        grid = this;
                    if (rec) {
                        Ext.Ajax.request({
                            url: './libs/message.php?action=get',
                            method: 'GET',
                            params: {
                                isReminding: true,
                                receiver: rec.get('telemarketingStaffName'),
                                isRead: false,
                                type: 'telemarket_individual_remind',
                                extraId: rec.getId()
                            },
                            callback: function (opts, success, res) {
                                if (success) {
                                    var obj = Ext.decode(res.responseText);
                                    if (obj.length > 0) {
                                        Ext.Array.each(obj, function (item, index) {
                                            marquee += (index + 1) + '. ' + item.content + '  ';
                                        });
                                        marquee += '</strong></font></marquee>';
                                        grid.setTitle(title + marquee);
                                    }
                                    else {
                                        grid.setTitle(title);
                                    }
                                }
                            }
                        });
                    }
                    else {
                        grid.setTitle(title);
                    }
                },
                tbar: [
                    {
                        text: '转为业务',
                        name: 'button-transferToBusiness',
                        icon: 'resources/img/transfer1.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            if (resObj.business) {
                                var win = Ext.create('FamilyDecoration.view.telemarket.TransferToBusiness', {
                                    grid: resObj.businessList,
                                    potentialBusiness: resObj.business
                                });
                                win.show();
                            }
                            else {
                                showMsg('请选择条目！');
                            }
                        }
                    },
                    {
                        text: '提醒功能',
                        name: 'button-reminder',
                        icon: 'resources/img/alarm.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            if (resObj.business) {
                                var win = Ext.create('FamilyDecoration.view.mybusiness.IndividualReminder', {
                                    recipient: resObj.telemarketingStaff.get('telemarketingStaffName'),
                                    type: 'telemarket_individual_remind',
                                    extraId: resObj.business.getId(),
                                    afterClose: function (){
                                        resObj.businessList.getStore().reload();
                                    }
                                });
                                win.show();
                            }
                            else {
                                showMsg('请选择条目！');
                            }
                        }
                    },
                    {
                        text: '编辑状态',
                        name: 'button-editStatus',
                        icon: 'resources/img/edit_ink.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            if (resObj.business) {
                                var win = Ext.create('FamilyDecoration.view.telemarket.EditStatus', {
                                    business: resObj.business,
                                    grid: resObj.businessList
                                });
                                win.show();
                            }
                            else {
                                showMsg('请选择条目！');
                            }
                        }
                    },
                    {
                        text: '标记为重点客户',
                        name: 'button-importantCust',
                        icon: 'resources/img/group.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            var btns = resObj.businessList.getBtns();
                            Ext.Ajax.request({
                                url: './libs/business.php?action=editPotentialBusiness',
                                method: 'GET',
                                params: {
                                    id:resObj.business.data.id,
                                    isImportant:'true'
                                },
                                callback: function (opts, success, res) {
                                    if (success) {
                                        resObj.businessList.getStore().reload();
                                    }
                                }
                            });
                        }
                    },
                    {
                        text: '取消重点客户标记',
                        name: 'button-cancelImportantCust',
                        icon: 'resources/img/group.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            var btns = resObj.businessList.getBtns();
                            Ext.Ajax.request({
                                url: './libs/business.php?action=editPotentialBusiness',
                                method: 'GET',
                                params: {
                                    id:resObj.business.data.id,
                                    isImportant:'false'
                                },
                                callback: function (opts, success, res) {
                                    if (success) {
                                        resObj.businessList.getStore().reload();
                                    }
                                }
                            });
                        }
                    },
                    {
                        text: '转回',
                        name: 'button-returnBack',
                        icon: 'resources/img/bill-history.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            var btns = resObj.businessList.getBtns();
                            Ext.Msg.warning('确定要转回此电销业务么?', function (btnId) {
                                if(btnId != 'yes')
                                    return;
                                Ext.Ajax.request({
                                    url: './libs/business.php?action=editPotentialBusiness',
                                    method: 'GET',
                                    params: {
                                        id:resObj.business.data.id,
                                        telemarketingStaff:'',
                                        telemarketingStaffName:'',
                                        distributeTime:''
                                    },
                                    callback: function (opts, success, res) {
                                        if (success) {
                                            resObj.businessList.getStore().reload();
                                        }
                                    }
                                });
                            });
                        }
                    }
                ],
                refresh: function () {
                    var resObj = me.getRes(),
                        name;
                    if (needList) {
                        name = resObj.telemarketingStaff.get('telemarketingStaffName');
                    }
                    else {
                        name = User.getName();
                    }
                    if (name) {
                        resObj.businessSt.setProxy({
                            url: './libs/business.php?action=getAllPotentialBusiness',
                            type: 'rest',
                            extraParams: {
                                telemarketingStaffName: name
                            },
                            reader: {
                                type: 'json',
                                root: 'data'
                            }
                        });
                        resObj.businessSt.loadPage(1, {
                            callback: function (recs, ope, success){
                                var business = resObj.business,
                                    selModel = resObj.businessList.getSelectionModel();
                                selModel.deselectAll();
                                selModel.select(resObj.businessSt.indexOf(business));
                            }
                        });
                    }
                    else {
                        resObj.businessSt.removeAll();
                    }
                },
                dockedItems: [{
                    xtype: 'pagingtoolbar',
                    store: potentialBusinessSt,   // same store GridPanel is using
                    dock: 'bottom',
                    displayInfo: true
                }],
                store: potentialBusinessSt,
                columns: {
                    defaults: {
                        align: 'center'
                    },
                    items: [
                        {
                            xtype: 'rownumberer',
                            width: 30
                        },
                        {
                            text: '地址',
                            flex: 0.6,
                            dataIndex: 'address',
                            renderer: function (val, meta, rec) {
                                if (val) {
                                    return rec.get('regionName') + ' ' + val;
                                }
                                else {
                                    return '';
                                }
                            }
                        },
                        {
                            text: '业主',
                            flex: 0.5,
                            dataIndex: 'proprietor',
                            renderer: function (val, meta, rec) {
                                return rec.data.isImportant == 'true' ? val+"<font color='red'>★</font>":val;
                            }
                        },
                        {
                            text: '电话',
                            flex: 0.8,
                            dataIndex: 'phone'
                        },
                        {
                            text: '状态',
                            flex: 0.8,
                            dataIndex: 'businessStatusDetail',
                            renderer: function (val, meta, rec) {
                                var result = '';
                                if (val.length > 0) {
                                    Ext.each(val, function (obj, index) {
                                        result += '<strong>' + (index + 1) + '.</strong>'
                                            + ' ' + obj['comments'].replace(/\n/gi, '<br />')
                                            + '<div class="footnote">' + obj['committerRealName'] + '('
                                            + obj['createTime'] + ')</div>';
                                    });
                                    return '<div style="text-align:left;">' + result + '</div>';
                                }
                                else {
                                    return '';
                                }
                            }
                        },
                        {
                            text: '提醒',
                            flex: 0.8,
                            dataIndex: 'reminders',
                            renderer: function (val, meta, rec){
                                var result = '';
                                if (val) {
                                    Ext.each(val, function (obj, index) {
                                        result += '<strong>' + (index + 1) + '.</strong>'
                                            + ' ' + obj['content'].replace(/\n/gi, '<br />')
                                            + '<div class="footnote">' + obj['showTime'].slice(0, 10) + '</div>';
                                    });
                                    return '<div style="text-align:left;">' + result + '</div>';
                                }
                                else {
                                    return '';
                                }
                            }
                        },
                        {
                            text: '分配时间',
                            flex: 0.8,
                            dataIndex: 'distributeTime',
                            renderer: function (val, meta, rec) {
                                if (val) {
                                    return val.slice(0, val.indexOf(' '));
                                }
                                else {
                                    return '';
                                }
                            }
                        },
                        {
                            text: '截止日期',
                            flex: 0.8,
                            dataIndex: 'telemarketingDeadline'
                        }
                    ]
                },
                listeners: {
                    selectionchange: function () {
                        var resObj = me.getRes();
                        resObj.businessList.initBtn();
                        resObj.businessList.appendRemindingInfo(resObj.business);
                    }
                }
            }
        ];

        me.listeners = {
            afterrender: function (cmp, opts) {
                var resObj = me.getRes();
                if (!needList) {
                    resObj.businessList.refresh();
                }
            }
        }

        this.callParent();
    }
});