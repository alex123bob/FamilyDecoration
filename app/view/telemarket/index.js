Ext.define('FamilyDecoration.view.telemarket.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.telemarket-index',
    requires: [
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
            needList = User.isAdmin() || User.isBusinessManager();

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
                    selectionchange: function (selModel, sels, opts){
                        var resObj = me.getRes();
                        resObj.businessList.refresh();
                    }
                }
            } : null,
            {
                title: '分配名单',
                flex: 9,
                itemId: 'gridpanel-businessList',
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
                        resObj.businessSt.load({
                            params: {
                                telemarketingStaffName: name
                            }
                        });
                    }
                    else {
                        resObj.businessSt.removeAll();
                    }
                },
                store: Ext.create('FamilyDecoration.store.PotentialBusiness', {
                }),
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
                            flex: 0.5,
                            dataIndex: 'address'
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
                            flex: 0.8
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
                }
            }
        ];

        me.listeners = {
            afterrender: function (cmp, opts){
                var resObj = me.getRes();
                if (!needList) {
                    resObj.businessList.refresh();
                }
            }
        }

        this.callParent();
    }
});