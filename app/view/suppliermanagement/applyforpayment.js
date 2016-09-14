Ext.define('FamilyDecoration.view.suppliermanagement.ApplyForPayment', {
    extend: 'Ext.window.Window',
    alias: 'widget.suppliermanagement-applyforpayment',
    requires: [

    ],
    modal: true,
    title: '订购单付款申请',
    width: 500,
    height: 360,
    bodyPadding: 5,
    resizable: false,
    layout: 'vbox',
    defaults: {
        flex: 1,
        width: '100%'
    },
    supplier: undefined,
    orders: undefined,
    changeStatus: Ext.emptyFn,
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.refresh = function () {
            var orders = me.orders,
                supplier = me.supplier,
                tabPanel = me.getComponent('tabpanel-headerInfo'),
                claimAmount = me.down('numberfield[name="claimAmount"]'),
                totalFee = me.down('numberfield[name="totalFee"]'),
                panelConfig = {
                    layout: 'fit',
                    itemId: 'panel-headerInfo',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '信息',
                            autoScroll: true,
                            defaults: {
                                xtype: 'displayfield',
                                margin: '0 4 0 0',
                                labelWidth: 70,
                                width: 224,
                                style: {
                                    'float': 'left'
                                }
                            },
                            items: [
                                {
                                    fieldLabel: '工程名称',
                                    name: 'projectName'
                                },
                                {
                                    fieldLabel: '项目经理',
                                    name: 'creatorRealName'
                                },
                                {
                                    fieldLabel: '订购总金额',
                                    name: 'totalFee'
                                },
                                {
                                    fieldLabel: '订购单',
                                    name: 'id',
                                    style: {
                                        cursor: 'pointer'
                                    },
                                    listeners: {
                                        afterrender: function (cmp, opts) {
                                            var el = cmp.getEl().on('click', function (ev, img) {
                                                if (arguments[0].target.nodeName != 'LABEL') {
                                                    var orderId = img.getAttribute('orderId');
                                                    var win = window.open('./fpdf/statement_bill.php?id=' + orderId, '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                                }
                                            });
                                        }
                                    }
                                },
                                {
                                    fieldLabel: '订购日期',
                                    name: 'createTime'
                                },
                                {
                                    fieldLabel: '是否审核',
                                    name: 'statusName'
                                },
                                {
                                    fieldLabel: '审核人',
                                    name: 'checkerRealName'
                                },
                                {
                                    fieldLabel: '已付金额',
                                    name: 'paidAmount'
                                }
                            ]
                        }
                    ]
                },
                totalFeeCount = 0;
            for (var i = 0; i < orders.length; i++) {
                Ext.apply(panelConfig, {
                    title: '订购单' + (i+1),
                    itemId: 'panel-headerInfo' + i
                });
                tabPanel.add(panelConfig);
                var order = orders[i],
                    fst = tabPanel.items.items[i].down('fieldset'),
                    fields = fst.query('displayfield');
                Ext.each(fields, function (field, index, self) {
                    if (field.name == 'createTime') {
                        field.setValue(order.get(field.name).slice(0, 10));
                    }
                    else if (field.name == 'id') {
                        field.setValue('<img orderId="' + order.get(field.name) + '" src="./resources/img/material_order_sheet.png" />');
                    }
                    else {
                        field.setValue(order.get(field.name));
                    }
                });
                totalFeeCount = accAdd(totalFeeCount, parseFloat(order.get('totalFee')));
            }
            totalFee.setValue(totalFeeCount);
        };

        me.items = [
            {
                xtype: 'tabpanel',
                flex: 4,
                width: '100%',
                itemId: 'tabpanel-headerInfo',
                items: []
            },
            {
                xtype: 'numberfield',
                name: 'claimAmount',
                fieldLabel: '申付金额',
                flex: 0.5,
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                name: 'totalFee',
                fieldLabel: '调整总金额',
                flex: 0.5,
                allowBlank: false
            },
            {
                xtype: 'fieldcontainer',
                flex: 1,
                layout: 'hbox',
                defaults: {
                    flex: 1
                },
                defaultType: 'radiofield',
                items: [
                    {
                        xtype: 'displayfield',
                        value: '是否抹平余额',
                        hideLabel: true
                    },
                    {
                        boxLabel: '是',
                        name: 'smooth',
                        inputValue: 'yes'
                    },
                    {
                        boxLabel: '否',
                        name: 'smooth',
                        inputValue: 'no',
                        checked: true
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var claimAmount = me.down('numberfield[name="claimAmount"]'),
                        totalFee = me.down('numberfield[name="totalFee"]'),
                        radios = me.query('radiofield'),
                        orderIds = [];
                    Ext.each(me.orders, function (order, index, self){
                        orderIds.push(order.getId());
                    });
                    if (claimAmount.isValid() && totalFee.isValid()) {
                        ajaxAdd('SupplierOrder.applyPayment', {
                            claimAmount: claimAmount.getValue(),
                            totalFee: totalFee.getValue(),
                            orderIds: orderIds.join(',')
                        }, function (obj){
                            me.close();
                            me.callback();
                        }, Ext.emptyFn, true);
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

        me.addListener({
            show: function (win, opts) {
                win.refresh();
            }
        });

        this.callParent();
    }
});