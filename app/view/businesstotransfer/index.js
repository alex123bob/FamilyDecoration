Ext.define('FamilyDecoration.view.businesstotransfer.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.businesstotransfer-index',
    requires: [
        'FamilyDecoration.store.Business'
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
                isDead: 'false'
            }
        });
        st.load();

        me.items = [
            {
                title: '等待业务列表',
                tbar: [
                    {
                        text: '锁定',
                        handler: function (){
                            var grid = this.up('gridpanel'),
                                selModel = grid.getSelectionModel(),
                                rec = selModel.getSelection()[0];
                            if (rec) {
                                
                            }
                            else {
                                showMsg('没有选中的业务!');
                            }
                        }
                    }
                ],
                autoScroll: true,
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