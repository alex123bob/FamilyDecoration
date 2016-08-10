Ext.define('FamilyDecoration.view.entrynexit.BusinessList', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-businesslist',
    requires: [
        'FamilyDecoration.store.Business'
    ],
    modal: true,
    layout: 'hbox',
    maximizable: true,

    title: '工程选择',
    width: 520,
    height: 300,
    defaultType: 'gridpanel',
    defaults: {
        height: '100%'
    },
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                title: '业务员',
                hideHeaders: true,
                itemId: 'gridpanel-salesmanList',
                flex: 1,
                style: {

                },
                columns: [
                    {
                        text: '姓名',
                        dataIndex: 'salesman',
                        flex: 1,
                        align: 'center'
                    }
                ],
                store: Ext.create('FamilyDecoration.store.Business', {
                    autoLoad: true,
                    proxy: {
                        type: 'rest',
                        reader: {
                            type: 'json'
                        },
                        url: './libs/business.php?action=getSalesmanlistWidthLevelBAndC'
                    }
                }),
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var rec = sels[0],
                            businessList = me.getComponent('gridpanel-businessList'),
                            businessListSt = businessList.getStore();
                        if (rec) {
                            businessListSt.setProxy({
                                type: 'rest',
                                reader: {
                                    type: 'json'
                                },
                                url: './libs/business.php',
                                extraParams: {
                                    action: 'getBusinessLevelBAndC',
                                    salesmanName: rec.get('salesmanName')
                                }
                            });
                            businessListSt.load();
                        }
                        else {
                            businessListSt.removeAll();
                        }
                    }
                }
            },
            {
                title: '业务名称',
                hideHeaders: true,
                itemId: 'gridpanel-businessList',
                flex: 3,
                columns: [
                    {
                        text: '业务名称',
                        dataIndex: 'address',
                        flex: 1,
                        align: 'center',
                        renderer: function (val, meta, rec) {
                            if (val) {
                                return rec.get('regionName') + ' ' + val;
                            }
                        }
                    }
                ],
                store: Ext.create('FamilyDecoration.store.Business', {
                    autoLoad: false
                })
            }
        ];

        me.buttons = [
            {
                text: '确认',
                handler: function () {
                    var salesmanList = me.getComponent('gridpanel-salesmanList'),
                        businessList = me.getComponent('gridpanel-businessList'),
                        salesman = salesmanList.getSelectionModel().getSelection()[0],
                        business = businessList.getSelectionModel().getSelection()[0];
                    if (salesman && business) {
                        me.callback(business);
                        me.close();
                    }
                    else {
                        showMsg('请选择业务!');
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});