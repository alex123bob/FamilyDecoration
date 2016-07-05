Ext.define('FamilyDecoration.view.telemarket.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.telemarket-index',
    requires: [
        'FamilyDecoration.view.telemarket.TransferToBusiness',
        'FamilyDecoration.view.telemarket.EditStatus'
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
                getBtns: function () {
                    var transferBtn = this.down('[name="button-transferToBusiness"]'),
                        reminderBtn = this.down('[name="button-reminder"]'),
                        editStatusBtn = this.down('[name="button-editStatus"]');
                    return {
                        transferBtn: transferBtn,
                        reminderBtn: reminderBtn,
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
                        resObj.businessSt.loadPage(1);
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
                            dataIndex: 'proprietor'
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
                                    return '<div style="text-align:left;">'+result+'</div>';
                                }
                                else {
                                    return '';
                                }
                            }
                        },
                        {
                            text: '提醒',
                            flex: 0.8
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
                        }
                    ]
                },
                listeners: {
                    selectionchange: function () {
                        var resObj = me.getRes();
                        resObj.businessList.initBtn();
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