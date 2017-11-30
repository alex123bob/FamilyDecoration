Ext.define('FamilyDecoration.view.suppliermanagement.SupplierList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.suppliermanagement-supplierlist',
    title: '供应商列表',
    requires: [
        'FamilyDecoration.store.Supplier'
    ],
    autoScroll: true,
    hideHeaders: true,
    afterSupplierLoad: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        var st = Ext.create('FamilyDecoration.store.Supplier', {
            autoLoad: true,
            listeners: {
                load: me.afterSupplierLoad
            }
        });

        me.store = st;

        me.columns = [
            {
                text: '姓名',
                flex: 1,
                align: 'center',
                dataIndex: 'name'
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: st,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.addListener({
            afterrender: function (grid, opts) {
                var view = grid.getView();
                var tip = Ext.create('Ext.tip.ToolTip', {
                    target: view.el,
                    delegate: view.itemSelector,
                    trackMouse: true,
                    renderTo: Ext.getBody(),
                    style: {
                        backgroundColor: 'rgba(222, 222, 222, 0.8)',
                        borderRadius: '6px',
                        lineHeight: '26px',
                        fontSize: '26px'
                    },
                    listeners: {
                        beforeshow: function (tip) {
                            var rec = view.getRecord(tip.triggerElement),
                                phone = rec.get('phone'),
                                contactInfo = [],
                                contact = '';
                            phone = phone.split(',');
                            if (phone.length > 0) {
                                Ext.each(phone, function (p, i, arr) {
                                    p = p.split(':');
                                    if (p.length >= 2) {
                                        contactInfo.push({
                                            desc: p[0],
                                            phone: p[1]
                                        });
                                    }
                                });
                            }
                            if (contactInfo.length > 0) {
                                Ext.each(contactInfo, function (c, i) {
                                    contact += c.desc + ': ' + c.phone + '<br />';
                                });
                            }
                            tip.update(
                                '<strong>供应商:</strong> ' + rec.get('name') + '<br />'
                                + '<strong>联系人:</strong> ' + rec.get('boss') + '<br />'
                                + '<strong>地址:</strong> ' + rec.get('address') + '<br />'
                                + '<strong>邮箱:</strong> ' + rec.get('email') + '<br />'
                                + '<strong>联系方式:</strong> ' + '<br />'
                                + contact
                            );
                        }
                    }
                });
            }
        });

        this.callParent();
    }
});