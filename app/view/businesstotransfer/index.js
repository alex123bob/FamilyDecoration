Ext.define('FamilyDecoration.view.businesstotransfer.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.businesstotransfer-index',
    requires: [
        'FamilyDecoration.store.Business', 'FamilyDecoration.view.checklog.MemberList'
    ],
    layout: 'fit',
    defaults: {
        xtype: 'gridpanel'
    },
    initComponent: function () {
        var me = this,
            st = Ext.create('FamilyDecoration.store.Business', {
                autoLoad: false
            }),
            proxy = st.getProxy();
        Ext.override(proxy, {
            extraParams: {
                action: 'getBusiness',
                isTransfered: 'false',
                isDeleted: 'false',
                isWaiting: 'true',
                isFrozen: 'false',
                isDead: 'false',
                needPaging: true
            },
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        });
        st.setProxy(proxy);
        st.load();

        me.items = [
            {
                title: '等待业务列表',
                tbar: [
                    {
                        text: '锁定',
                        icon: 'resources/img/lock1.png',
                        handler: function (){
                            var grid = this.up('gridpanel'),
                                st = grid.getStore(),
                                selModel = grid.getSelectionModel(),
                                rec = selModel.getSelection()[0];
                            if (rec && rec.get('isLocked') == 'false') {
                                Ext.Msg.warning('确定要锁定当前业务吗？锁定后的业务不能被自动分配!', function (btnId){
                                    if (btnId == 'yes') {
                                        Ext.Ajax.request({
                                            url: './libs/business.php',
                                            method: 'POST',
                                            params: {
                                                action: 'editBusiness',
                                                id: rec.getId(),
                                                isLocked: 'true'
                                            },
                                            callback: function (opts, success, res){
                                                if (success) {
                                                    var obj = Ext.decode(res.responseText);
                                                    if ('successful' == obj.status) {
                                                        showMsg('锁定业务成功!');
                                                        st.loadPage(st.currentPage);
                                                        grid.getSelectionModel().deselectAll();
                                                    }
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                            else {
                                showMsg('没有选中的业务或业务被锁定!');
                            }
                        }
                    },
                    {
                        text: '分配',
                        icon: './resources/img/distribute_waiting_business.png',
                        handler: function() {
                            var grid = this.up('gridpanel'),
                                st = grid.getStore(),
                                selModel = grid.getSelectionModel(),
                                busi = selModel.getSelection()[0];
                            if (busi) {
                                var win = Ext.create('Ext.window.Window', {
                                    width: 500,
                                    height: 300,
                                    layout: 'fit',
                                    title: '选择业务员',
                                    modal: true,
                                    items: [{
                                        xtype: 'checklog-memberlist',
                                        name: 'memberlist-salesmanList',
                                        fullList: true
                                    }],
                                    buttons: [{
                                        text: '确定',
                                        handler: function () {
                                            var list = win.down('checklog-memberlist'),
                                                rec = list.getSelectionModel().getSelection()[0];

                                            if (rec && rec.get('name')) {
                                                Ext.Ajax.request({
                                                    url: './libs/business.php',
                                                    method: 'POST',
                                                    params: {
                                                        id: busi.getId(),
                                                        action: 'distributeBusiness',
                                                        salesman: rec.get('realname'),
                                                        salesmanName: rec.get('name')
                                                    },
                                                    callback: function(opts, success, res) {
                                                        if (success) {
                                                            var obj = Ext.decode(res.responseText);
                                                            if (obj.status === 'successful') {
                                                                showMsg('分配成功，分配后的业务不再处于等待业务区，请到对应业务员下进行查验');
                                                                win.close();
                                                                var st = grid.getStore();
                                                                st.loadPage(st.currentPage);
                                                                grid.getSelectionModel().deselectAll();
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                            else {
                                                showMsg('请选择业务员！');
                                            }
                                        }
                                    }, {
                                            text: '取消',
                                            handler: function () {
                                                win.close();
                                            }
                                        }]
                                });
                                win.show();
                            }
                            else {
                                showMsg('请选择要进行人工分配的业务!');
                            }
                        }
                    }
                ],
                autoScroll: true,
                viewConfig: {
                    getRowClass: function (rec, rowIndex, rowParams, st){
                        if (rec.get('isLocked') == 'true') {
                            return 'business-locked';
                        }
                        else {
                            return 'business-unlocked';
                        }
                    }
                },
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: st,   // same store GridPanel is using
                        dock: 'bottom',
                        displayInfo: true
                    }
                ],
                store: st,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '业务评级',
                            dataIndex: 'level'
                        },
                        {
                            text: '签单评级',
                            dataIndex: 'signBusinessLevel'
                        },
                        {
                            text: '小区名称',
                            dataIndex: 'regionName'
                        },
                        {
                            text: '业务员',
                            dataIndex: 'salesman'
                        },
                        {
                            text: '小区地址',
                            dataIndex: 'address'
                        },
                        {
                            text: '客户',
                            dataIndex: 'customer'
                        },
                        {
                            text: '客户联系方式',
                            dataIndex: 'custContact',
                            flex: 1.3
                        },
                        {
                            text: '设计师',
                            dataIndex: 'designer'
                        },
                        {
                            text: '客服',
                            dataIndex: 'csStaff'
                        },
                        {
                            text: '户型',
                            dataIndex: 'houseType'
                        },
                        {
                            text: '建筑面积',
                            dataIndex: 'floorArea'
                        },
                        {
                            text: '业务来源',
                            dataIndex: 'source'
                        }
                    ]
                }
            }
        ];

        this.callParent();
    }
});