Ext.define('FamilyDecoration.view.contractmanagement.ProjectContract', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contractmanagement-projectcontract',
    requires: [
        'FamilyDecoration.view.contractmanagement.PickUser'
    ],
    defaults: {
    },
    defaultType: 'form',
    layout: 'fit',
    header: false,
    preview: false, // whether current contract is editable or not.
    business: undefined,
    type: undefined,

    initComponent: function () {
        var me = this,
            preview = me.preview;

        me.tbar = [
            '->',
            {
                hidden: preview,
                xtype: 'button',
                text: '折扣',
                icon: 'resources/img/contract_discount.png',
                handler: function (){

                }
            }
        ];

        function countProjectPaymentArea (){
            var form = me.down('form'),
                count = 0;
            form.items.each(function (item, i, self){
                if (item.name === 'projectPaymentArea') {
                    count++;
                }
            });
            return count;
        }

        /**
         * create payment area for four installments respectively. 
         * @param {*installment} index the ?st installment
         */
        function createProjectPaymentArea(index) {
            var title = '',
                percentages = ['35%', '30%', '30%', '5%'];
            if (index === 0) {
                title = '首期工程款';
            }
            else if (index === 3) {
                title = '尾款';
            }
            else {
                title = NoToChinese(index + 1) + '期工程款';
            }
            return {
                xtype: 'fieldset',
                title: title,
                layout: 'vbox',
                defaults: {
                    flex: 1,
                    width: '100%'
                },
                name: 'projectPaymentArea',
                itemId: 'projectPaymentArea' + (index + 1),
                defaultType: 'fieldcontainer',
                items: [
                    {
                        layout: 'hbox',
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        items: [
                            {
                                xtype: preview ? 'displayfield' : 'datefield',
                                fieldLabel: '付款日期',
                                submitFormat: 'Y-m-d H:i:s',
                                name: 'paymentDate'
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '金额(元)' + percentages[index],
                                name: 'paymentFee',
                                readOnly: true
                            },
                            {
                                xtype: preview ? 'displayfield' : 'numberfield',
                                fieldLabel: '确认',
                                name: 'paymentApproval',
                                allowBlank: true
                            }
                        ]
                    }
                ]
            };
        }

        function countAppendix (){
            return Ext.ComponentQuery.query('[name="appendix"]').length;
        }

        function createAppendix(index, content) {
            return {
                layout: 'hbox',
                name: 'appendix',
                itemId: 'appendix',
                updateIndex: function (index){
                    this.down('displayfield').setFieldLabel((index + 1).toString());
                },
                defaults: {
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: index.toString(),
                        value: content,
                        flex: 1
                    },
                    {
                        xtype: 'button',
                        text: '编辑',
                        width: 50,
                        hidden: preview
                    },
                    {
                        xtype: 'button',
                        text: 'X',
                        width: 30,
                        hidden: preview,
                        handler: function (){
                            var hbox = this.ownerCt,
                                fieldset = hbox.ownerCt;
                            fieldset.remove(hbox);
                            updateAppendix();
                        }
                    }
                ]
            }
        }

        function getAppendixIndex (){
            var form = me.down('form'),
                index;
            form.items.each(function (item, i, self){
                if (item.name === 'appendixCt') {
                    index = i;
                    return false;
                }
            });

            return (index ? index : -1);
        }
        
        function updateAppendix (){
            var ct = me.down('[name="appendixCt"]'),
                group = ct.items.items.slice(1);
            Ext.each(group, function (fc, index){
                fc.updateIndex(index);
            });
        }

        function countExtraPaymentArea (){
            var form = me.down('form'),
                ct = form.down('[name="extraPaymentCt"]'),
                count = 0;
            ct.items.each(function (item, i, self){
                if (item.name === 'extraPaymentArea') {
                    count++;
                }
            });
            return count;
        }

        function updateExtraPaymentArea (){
            var form = me.down('form'),
                ct = form.down('[name="extraPaymentCt"]');
            ct.items.each(function (item, i, self){
                if (item.name === 'extraPaymentArea') {
                    item.itemIndex =  i - 1;
                }
            });
        }

        function createExtraPayment (index){
            return {
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    margin: '0 4 0 0',
                    allowBlank: false
                },
                name: 'extraPaymentArea',
                itemIndex: index,
                items: [
                    {
                        xtype: preview ? 'displayfield' : 'datefield',
                        fieldLabel: '付款日期',
                        submitFormat: 'Y-m-d H:i:s',
                        name: 'extraPaymentDate'
                    },
                    {
                        xtype: preview ? 'displayfield' : 'numberfield',
                        fieldLabel: '金额(元)',
                        name: 'extraPaymentFee'
                    },
                    {
                        xtype: 'button',
                        width: 35,
                        flex: null,
                        text: 'X',
                        handler: function (){
                            var area = this.ownerCt,
                                ct = area.ownerCt;
                            ct.remove(area);
                            updateExtraPaymentArea();
                        }
                    }
                ]
            };
        }

        /**
         * @desc calculate each installment's fee.
         */
        function calculateInstallments (){
            var frm = me.down('form'),
                totalPriceCmp = frm.getComponent('totalPrice'),
                percentages = [0.35, 0.30, 0.30, 0.05],
                totalPrice = totalPriceCmp.getValue(),
                form = totalPriceCmp.ownerCt,
                payments = [];
            if (Ext.isNumber(totalPrice)) {
                for (var i = 1; i <= 4; i++) {
                    payments.push(totalPriceCmp.ownerCt.getComponent('projectPaymentArea' + i));
                }
                Ext.each(payments, function (payment, index, self){
                    payment.down('[name="paymentFee"]').setValue(totalPrice.mul(percentages[index]));
                });
            }
        }



        me.getValues = function (){
            var frm = me.down('form'),
                valueObj = frm.getValues(false, false, false, true),
                timeFormat = 'Y-m-d';
            if (frm.isValid()) {
                valueObj.startTime = Ext.Date.format(valueObj.startTime, timeFormat);
                valueObj.endTime = Ext.Date.format(valueObj.endTime, timeFormat);
                Ext.each(valueObj.paymentDate, function (d, index, self){
                    self[index] = Ext.Date.format(d, timeFormat);
                });
                if (Ext.isArray(valueObj.extraPaymentDate)) {
                    Ext.each(valueObj.extraPaymentDate, function (d, index, self){
                        self[index] = Ext.Date.format(d, timeFormat);
                    });
                }
                else if (Ext.isDate(valueObj.extraPaymentDate)) {
                    valueObj.extraPaymentDate = Ext.Date.format(valueObj.extraPaymentDate, timeFormat);
                }

                Ext.apply(valueObj, {
                    businessId: me.business.getId()
                });

                return valueObj;
            }
            else {
                return false;
            }
        }

        me.items = [
            {
                autoScroll: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    layout: 'hbox',
                    allowBlank: false
                },
                padding: '10px',
                defaultType: 'fieldcontainer',
                items: [
                    {
                        xtype: 'displayfield',
                        layout: 'auto',
                        value: '佳诚装饰装修合同',
                        hideLabel: true,
                        style: {
                            textAlign: 'center'
                        },
                        fieldStyle: {
                            fontSize: '26px'
                        }
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '客户姓名',
                                name: 'customer',
                                itemId: 'customer',
                                value: me.business.get('customer')
                            },
                            {
                                hidden: preview,
                                xtype: 'textfield',
                                name: 'customerConfirm',
                                itemId: 'customerConfirm',
                                fieldLabel: '确认'
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '客户联系',
                                name: 'custContact',
                                itemId: 'custContact',
                                value: me.business.get('custContact')
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '身份证号码',
                                vtype: 'idcard',
                                name: 'sid',
                                itemId: 'sid',
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        items: [
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '项目经理',
                                itemId: 'captain',
                                name: 'captain',
                                readOnly: true,
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            userFilter: /^003-\d{3}$/i,
                                            callback: function (rec){
                                                var ct = cmp.ownerCt,
                                                    captainName = ct.getComponent('captainName'),
                                                    phone = ct.getComponent('phone');
                                                cmp.setValue(rec.get('realname'));
                                                captainName.setValue(rec.get('name'));
                                                phone.setValue(rec.get('phone'));
                                                win.close();
                                            }
                                        });

                                        win.show();
                                    }
                                }
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'captainName',
                                name: 'captainName'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '联系方式',
                                itemId: 'phone',
                                name: 'phone'
                            }
                        ]
                    },
                    {
                        xtype: preview ? 'displayfield' : 'textfield',
                        fieldLabel: '联系地址(客户)',
                        name: 'address',
                        itemId: 'address'
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '设计师',
                                value: me.business.get('designer'),
                                itemId: 'designer',
                                name: 'designer'
                            },
                            {
                                xtype: 'hiddenfield',
                                value: me.business.get('designerName'),
                                itemId: 'designerName',
                                name: 'designerName'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '业务员',
                                value: me.business.get('salesman'),
                                itemId: 'salesman',
                                name: 'salesman'
                            },
                            {
                                xtype: 'hiddenfield',
                                value: me.business.get('salesmanName'),
                                itemId: 'salesmanName',
                                name: 'salesmanName'
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '签约代表',
                                readOnly: true,
                                name: 'signatoryRep',
                                itemId: 'signatoryRep',
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            // userFilter: /^003-\d{3}$/i,
                                            callback: function (rec){
                                                var ct = cmp.ownerCt,
                                                    repName = ct.getComponent('signatoryRepName');
                                                cmp.setValue(rec.get('realname'));
                                                repName.setValue(rec.get('name'));
                                                win.close();
                                            }
                                        });

                                        win.show();
                                    }
                                }
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'signatoryRepName',
                                name: 'signatoryRepName'
                            },
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            labelWidth: 30,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                flex: 0.1,
                                hideLabel: true,
                                value: '工期:'
                            },
                            {
                                xtype: preview ? 'displayfield' : 'datefield',
                                fieldLabel: '开始',
                                itemId: 'startTime',
                                name: 'startTime',
                                submitFormat: 'Y-m-d H:i:s',
                                validator: function (val){
                                    var ownerCt = this.ownerCt,
                                        startTime = this,
                                        endTime = ownerCt.getComponent('endTime'),
                                        totalProjectTime = ownerCt.getComponent('totalProjectTime'),
                                        total = endTime.getValue() - startTime.getValue();

                                    if (total < 0) {
                                        totalProjectTime.setValue('');
                                        return '开始时间不能大于结束时间';
                                    }
                                    else {
                                        totalProjectTime.setValue(total / 1000 / 60 / 60 / 24 + '天');
                                        endTime.clearInvalid();
                                        return true;
                                    }
                                },
                                listeners: {
                                    change: function (cmp, newVal, oldVal, opts){
                                        var ownerCt = cmp.ownerCt,
                                            startTime = this,
                                            endTime = ownerCt.getComponent('endTime');   
                                    }
                                }
                            },
                            {
                                xtype: preview ? 'displayfield' : 'datefield',
                                fieldLabel: '结束',
                                itemId: 'endTime',
                                name: 'endTime',
                                margin: '0 8 0 8',
                                submitFormat: 'Y-m-d H:i:s',
                                validator: function (val){
                                    var ownerCt = this.ownerCt,
                                        endTime = this,
                                        startTime = ownerCt.getComponent('startTime'),
                                        totalProjectTime = ownerCt.getComponent('totalProjectTime'),
                                        total = endTime.getValue() - startTime.getValue();

                                    if (total < 0) {
                                        totalProjectTime.setValue('');
                                        return '开始时间不能大于结束时间';
                                    }
                                    else {
                                        totalProjectTime.setValue(total / 1000 / 60 / 60 / 24 + '天');
                                        startTime.clearInvalid();
                                        return true;
                                    }
                                },
                                listeners: {
                                    change: function (cmp, newVal, oldVal, opts){
                                        var ownerCt = cmp.ownerCt,
                                            endTime = this,
                                            startTime = ownerCt.getComponent('startTime');
                                    }
                                }
                            },
                            {
                                xtype: 'displayfield',
                                flex: 0.5,
                                itemId: 'totalProjectTime',
                                name: 'totalProjectTime',
                                labelWidth: 50,
                                fieldLabel: '总工期'
                            }
                        ]
                    },
                    {
                        xtype: preview ? 'displayfield' : 'numberfield',
                        fieldLabel: '合同总额(元)',
                        anchor: '40%',
                        name: 'totalPrice',
                        itemId: 'totalPrice',
                        listeners: {
                            blur: function (cmp, evt, opts){
                                calculateInstallments();
                            }
                        }
                    },
                    createProjectPaymentArea(0),
                    createProjectPaymentArea(1),
                    createProjectPaymentArea(2),
                    createProjectPaymentArea(3),
                    {
                        xtype: 'fieldset',
                        title: '额外付款',
                        layout: 'vbox',
                        name: 'extraPaymentCt',
                        itemId: 'extraPaymentCt',
                        defaultType: 'fieldcontainer',
                        defaults: {
                            flex: 1,
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: '添加',
                                width: 50,
                                hidden: preview,
                                handler: function (){
                                    var index = countExtraPaymentArea(),
                                        extraPaymentCt = this.up('[name="extraPaymentCt"]');
                                    // extraPaymentCt.insert(index, createExtraPayment(index));
                                    extraPaymentCt.add(createExtraPayment(index));
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: '附加条款',
                        layout: 'vbox',
                        name: 'appendixCt',
                        itemId: 'appendixCt',
                        defaultType: 'fieldcontainer',
                        defaults: {
                            flex: 1,
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: '添加',
                                width: 50,
                                hidden: preview,
                                handler: function (){
                                    var btn = this,
                                        ct = btn.ownerCt;
                                    Ext.Msg.read('请输入附加条款内容', function (txt){
                                        var config = createAppendix(countAppendix() + 1, txt),
                                            index = config.items.length;
                                        // ct.insert(index, config);
                                        ct.add(config);
                                        swal.close();
                                    });
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'button',
                        text: '添加附件',
                        anchor: '12%',
                        hidden: preview
                    },
                    {
                        xtype: 'fieldset',
                        title: '折扣信息',
                        layout: 'vbox',
                        name: 'discountCt',
                        itemId: 'discountCt',
                        defaultType: 'textfield',
                        defaults: {
                            flex: 1,
                            width: '100%'
                        }
                    }
                ]
            }
        ];

        this.callParent();
    }
});