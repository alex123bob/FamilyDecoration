Ext.define('FamilyDecoration.view.account.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.account-index',
    title: '账户管理',
    requires: [
        'FamilyDecoration.store.Account',
        'FamilyDecoration.store.AccountLog',
        'FamilyDecoration.view.account.DateRangeFilter',
        'FamilyDecoration.view.account.EditAccount',
        'FamilyDecoration.view.account.Transfer',
        'FamilyDecoration.store.AccountLogInfo'
    ],
    layout: 'hbox',
    defaults: {
        xtype: 'gridpanel',
        height: '100%'
    },

    initComponent: function () {
        var me = this,
            accountLogSt = Ext.create('FamilyDecoration.store.AccountLog', {
                autoLoad: false
            }),
            accountLogInfoSt = Ext.create('FamilyDecoration.store.AccountLogInfo', {
                autoLoad: false
            });

        function _getRes() {
            var accountGrid = me.getComponent('gridpanel-account'),
                mainContainer = me.getComponent('container-main'),
                accountLogGrid = mainContainer.getComponent('gridpanel-accountLog'),
                accountSelModel = accountGrid.getSelectionModel(),
                account = accountSelModel.getSelection()[0],
                accountSt = accountGrid.getStore(),
                accountLogSelModel = accountLogGrid.getSelectionModel(),
                accountLog = accountLogSelModel.getSelection()[0],
                accountLogSt = accountLogGrid.getStore();
            return {
                accountGrid: accountGrid,
                accountSelModel: accountSelModel,
                account: account,
                accountSt: accountSt,

                accountLogGrid: accountLogGrid,
                accountLogSelModel: accountLogSelModel,
                accountLog: accountLog,
                accountLogSt: accountLogSt,
                filter: accountLogGrid.down('account-daterangefilter')
            };
        }

        me.items = [
            {
                title: '账户',
                flex: 1,
                itemId: 'gridpanel-account',
                getBtns: function (){
                    return {
                        add: this.down('[name="add"]'),
                        edit: this.down('[name="edit"]'),
                        del: this.down('[name="del"]'),
                        transfer: this.down('[name="transfer"]')
                    };
                },
                initBtn: function (){
                    var resObj = _getRes(),
                        btns = this.getBtns();
                    btns.edit.setDisabled(!resObj.account);
                    btns.del.setDisabled(!resObj.account);
                    btns.transfer.setDisabled(!resObj.account);
                },
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '账户名称',
                            dataIndex: 'name'
                        },
                        {
                            text: '账户类型',
                            dataIndex: 'accountType'
                        }
                    ]
                },
                tbar: [
                    {
                        xtype: 'button',
                        text: '转账',
                        icon: 'resources/img/account_transfer_money.png',
                        name: 'transfer',
                        disabled: true,
                        handler: function(){
                            var resObj = _getRes();
                            var win = Ext.create('FamilyDecoration.view.account.Transfer', {
                                fromAccount: resObj.account,
                                callback: function (){
                                    resObj.accountSt.reload();
                                }
                            });
                            win.show();
                        }
                    }
                ],
                bbar: [
                    {
                        xtype: 'button',
                        text: '添加',
                        name: 'add',
                        icon: 'resources/img/add_plain.png',
                        handler: function (){
                            var resObj = _getRes();
                            var win = Ext.create('FamilyDecoration.view.account.EditAccount', {
                                callback: function (){
                                    resObj.accountSt.reload();
                                }
                            });
                            win.show();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '修改',
                        disabled: true,
                        name: 'edit',
                        icon: 'resources/img/edit_plain.png',
                        handler: function (){
                            var resObj = _getRes();
                            var win = Ext.create('FamilyDecoration.view.account.EditAccount', {
                                account: resObj.account,
                                callback: function (){
                                    resObj.accountSt.reload({
                                        callback: function (recs, ope, success){
                                            if (success) {
                                                var index = resObj.accountSt.indexOf(resObj.account);
                                                resObj.accountSelModel.deselectAll();
                                                resObj.accountSelModel.select(index);
                                            }
                                        }
                                    });
                                }
                            });
                            win.show();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '删除',
                        name: 'del',
                        disabled: true,
                        icon: 'resources/img/delete_trash_bin.png',
                        handler: function (){
                            var resObj = _getRes();
                            Ext.Msg.warning('确定要删除选中账户吗?', function (btnId){
                                if ('yes' == btnId) {
                                    ajaxDel('Account', {
                                        id: resObj.account.getId()
                                    }, function (obj){
                                        showMsg('删除成功！');
                                        resObj.accountSt.reload();
                                    });
                                }
                            });
                        }
                    }
                ],
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                store: Ext.create('FamilyDecoration.store.Account', {
                    autoLoad: true
                }),
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var resObj = _getRes();
                        resObj.accountGrid.initBtn();
                        resObj.accountLogGrid.refresh();
                    }
                }
            },
            {
                itemId: 'container-main',
                xtype: 'container',
                layout: 'vbox',
                flex: 4,
                defaults: {
                    width: '100%',
                },
                items: [
                    {
                        xtype: 'gridpanel',
                        title: '账户纪录',
                        flex: 3,
                        itemId: 'gridpanel-accountLog',
                        refresh: function () {
                            var resObj = _getRes();
        
                            resObj.filter.clean();
                            if (resObj.account) {
                                resObj.accountLogSt.setProxy({
                                    type: 'rest',
                                    url: './libs/api.php',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    },
                                    extraParams: {
                                        accountId: resObj.account.getId(),
                                        action: 'AccountLog.get',
                                        orderBy: 'createTime DESC'
                                    }
                                });
                                resObj.accountLogSt.loadPage(1);
                            }
                            else {
                                resObj.accountLogSt.removeAll();
                            }
                        },
                        dockedItems: [
                            {
                                xtype: 'account-daterangefilter',
                                dock: 'top',
                                filterFn: function (obj) {
                                    var resObj = _getRes(),
                                        p = {};
                                    if (resObj.account) {
                                        p = { accountId: resObj.account.getId() };
                                        if (obj.startTime && obj.endTime) {
                                            Ext.apply(p, {
                                                createTimeMin: Ext.Date.format(obj.startTime, 'Y-m-d 00:00:00'),
                                                createTimeMax: Ext.Date.format(obj.endTime, 'Y-m-d 23:59:59')
                                            });
                                        }
                                        resObj.accountLogSt.setProxy({
                                            type: 'rest',
                                            url: './libs/api.php',
                                            reader: {
                                                type: 'json',
                                                root: 'data',
                                                totalProperty: 'total'
                                            },
                                            extraParams: Ext.apply(p, {
                                                action: 'AccountLog.get',
                                                orderBy: 'createTime DESC'
                                            })
                                        })
                                        resObj.accountLogSt.loadPage(1);
                                    }
                                    else {
                                        showMsg('请选择具体账户后再进行过滤！');
                                    }
                                },
                                clearFn: function () {
                                    var resObj = _getRes(),
                                        p = {};
                                    if (resObj.account) {
                                        p = { accountId: resObj.account.getId() };
                                        resObj.accountLogSt.setProxy({
                                            type: 'rest',
                                            url: './libs/api.php',
                                            reader: {
                                                type: 'json',
                                                root: 'data',
                                                totalProperty: 'total'
                                            },
                                            extraParams: Ext.apply(p, {
                                                action: 'AccountLog.get',
                                                orderBy: 'createTime DESC'
                                            })
                                        });
                                        resObj.accountLogSt.loadPage(1);
                                    }
                                    else {
                                        showMsg('请选择具体账户后再进行过滤！');
                                    }
                                }
                            },
                            {
                                xtype: 'pagingtoolbar',
                                store: accountLogSt,
                                dock: 'bottom',
                                displayInfo: true
                            }
                        ],
                        columns: {
                            defaults: {
                                flex: 1,
                                align: 'center'
                            },
                            items: [
                                {
                                    text: '日期',
                                    flex: 1.2,
                                    dataIndex: 'createTime'
                                },
                                {
                                    text: '出账',
                                    dataIndex: 'amount',
                                    renderer: function (val, meta, rec) {
                                        return rec.get('type') == 'out' ? '-'+val : '';
                                    }
                                },
                                {
                                    text: '入账',
                                    dataIndex: 'amount',
                                    renderer: function (val, meta, rec) {
                                        return rec.get('type') == 'in' ? '+'+val : '';
                                    }
                                },
                                {
                                    text: '事由',
                                    dataIndex: 'refTypeCn'
                                },
                                {
                                    text: '余额(元)',
                                    dataIndex: 'balance'
                                },
                                {
                                    text: '经办人',
                                    dataIndex: 'operatorRealName'
                                },
                                {
                                    text: '修改记录',
                                    dataIndex: 'desc'
                                }
                            ]
                        },
                        store: accountLogSt,
                        listeners: {
                            selectionchange: function (selModel, sels, opts) {
                                var item = sels[0];
                                item ? accountLogInfoSt.load({
                                    params: {
                                        id: item.getId()
                                    }
                                }) : accountLogInfoSt.removeAll();
                            }
                        }
                    },
                    {
                        xtype: 'gridpanel',
                        title: '详细',
                        store: accountLogInfoSt,
                        cls: 'gridpanel-accountloginfo',
                        flex: 1,
                        columns: {
                            defaults: {
                                flex: 1,
                                align: 'center'
                            },
                            items: [
                                {
                                    dataIndex: 'billName',
                                    text: '名称'
                                },
                                {
                                    dataIndex: 'billTypeName',
                                    text: '类型'
                                },
                                {
                                    dataIndex: 'checkerRealName',
                                    text: '审核人'
                                },
                                {
                                    dataIndex: 'claimAmount',
                                    text: '申请金额'
                                },
                                {
                                    dataIndex: 'creatorRealName',
                                    text: '创建人'
                                },
                                {
                                    dataIndex: 'descpt',
                                    text: '描述'
                                },
                                {
                                    dataIndex: 'paidAmount',
                                    text: '付款金额'
                                },
                                {
                                    dataIndex: 'paidTime',
                                    text: '付款时间'
                                },
                                {
                                    dataIndex: 'payerRealName',
                                    text: '账单类型'
                                },
                                {
                                    dataIndex: 'payeeRealName',
                                    text: '收款人'
                                },
                                {
                                    dataIndex: 'professionType',
                                    text: '工种',
                                    renderer: function(val) {
                                        return FamilyDecoration.store.WorkCategory.renderer(val);
                                    }
                                },
                                {
                                    dataIndex: 'projectName',
                                    text: '工程'
                                },
                                {
                                    dataIndex: 'reimbursementReason',
                                    text: '报销原因'
                                },
                                {
                                    dataIndex: 'projectProgress',
                                    text: '进度'
                                },
                                {
                                    dataIndex: 'statusName',
                                    text: '状态'
                                },
                                {
                                    dataIndex: 'totalFee',
                                    text: '总金额'
                                },
                            ]
                        }
                    }
                ]
            }
        ];

        this.callParent();
    }
});