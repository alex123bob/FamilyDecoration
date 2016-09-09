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
    order: undefined,

    initComponent: function () {
        var me = this;

        me.refresh = function (){
            var order = me.order,
                supplier = me.supplier,
                fst = me.down('fieldset'),
                fields = fst.query('displayfield'),
                claimAmount = me.down('numberfield[name="claimAmount"]'),
                totalFee = me.down('numberfield[name="totalFee"]');
            Ext.each(fields, function (field, index, self){
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
            totalFee.setValue(order.get('totalFee'));
        };

        me.items = [
            {
                xtype: 'fieldset',
                title: '信息',
                itemId: 'fieldset-headerInfo',
                width: '100%',
                flex: 4,
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
                            afterrender: function (cmp, opts){
                                var el = cmp.getEl().on('click', function (ev, img){
                                    if(arguments[0].target.nodeName!='LABEL') {
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
                        radios = me.query('radiofield');
                    if (claimAmount.isValid() && totalFee.isValid()) {
                        
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
            show: function (win, opts){
                win.refresh();
            }
        });

        this.callParent();
    }
});