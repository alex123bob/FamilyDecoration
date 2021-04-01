Ext.define('FamilyDecoration.view.contractmanagement.ProjectContract', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.contractmanagement-projectcontract',
    requires: [
        'FamilyDecoration.view.contractmanagement.PickUser',
        'FamilyDecoration.view.contractmanagement.EditAppendix'
    ],
    defaults: {
    },
    defaultType: 'form',
    layout: 'fit',
    header: false,
    preview: false, // whether current contract is editable or not.
    business: undefined,
    project: undefined,

    contract: undefined, // is edit or not.

    initComponent: function () {
        var me = this,
            preview = me.preview,
            joinSymbol = '/**/';

        me.tbar = [
            '->',
            {
                hidden: preview,
                xtype: 'button',
                text: '已有业务匹配',
                handler: function (){
                    var win = Ext.create('Ext.window.Window', {
                        layout: 'fit',
                        width: 800,
                        height: 600,
                        modal: true,
                        items: [
                            {
                                xtype: 'businessaggregation-businesslist',
                                header: false,
                                itemDblClick: function (view, rec, item, index, evt, opts){
                                    console.log(rec);
                                }
                            }
                        ]
                    });
                    win.show();
                }
            }
        ];


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

        function createExtraPayment (obj){
            var totalPrice = me.contract ? me.contract.totalPrice : me.down('form').getComponent('totalPrice').getValue();
            totalPrice = parseFloat(totalPrice);
            var percent = me.contract ? parseFloat(obj.amount).div(totalPrice).mul(100) : 0;
            return {
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    margin: '0 2 0 0',
                    allowBlank: false
                },
                name: 'extraPaymentArea',
                items: [
                    {
                        xtype: 'displayfield',
                        hideLabel: true,
                        flex: preview ? 1 :null,
                        itemId: 'percentage',
                        width: 26,
                        value: percent + '%'
                    },
                    {
                        flex: null,
                        width: 80,
                        xtype: 'slider',
                        value: percent,
                        hidden: preview,
                        increment: 1,
                        minValue: 0,
                        maxValue: 100,
                        tipText: function(thumb){
                            return Ext.String.format('<b>{0}%</b>', thumb.value);
                        },
                        listeners: {
                            change: function(slider, newVal, thumb) {
                                var ct = slider.ownerCt;
                                var name = ct.getComponent('percentage'),
                                    fee = ct.getComponent('fee');
                                name.setValue(newVal + '%');
                                fee.setValue(totalPrice.mul(newVal.div(100)));
                            }
                        }
                    },
                    {
                        xtype: preview ? 'displayfield' : 'datefield',
                        fieldLabel: '付款日期',
                        submitFormat: 'Y-m-d H:i:s',
                        format: 'Y-m-d',
                        labelWidth: 60,
                        name: 'extraPaymentDate',
                        value: obj ? obj.time : '',
                        listeners: {
                        }
                    },
                    {
                        xtype: preview ? 'displayfield' : 'numberfield',
                        fieldLabel: '金额(元)',
                        labelWidth: 60,
                        name: 'extraPaymentFee',
                        itemId: 'fee',
                        value: obj ? obj.amount : '',
                        readOnly: true,
                    },
                    {
                        xtype: 'button',
                        width: 35,
                        flex: null,
                        hidden: preview,
                        text: '×',
                        handler: function (){
                            var area = this.ownerCt,
                                ct = area.ownerCt;
                            ct.remove(area);
                        }
                    }
                ]
            };
        }

        /**
         * @desc calculate each installment's fee.
         */
        function calculateInstallments (cmp, newVal, oldVal, opts){
            var frm = me.down('form'),
                totalPrice = newVal,
                percentageTitles = [],
                percentageValues = [];
            [10, 20, 30 , 35, 40 , 45, 50].every(function(ele, index) {
                percentageTitles.push(ele+'%');
                percentageValues.push(Math.round((totalPrice * ele) * 0.01));
                return true;
            });
            var tdstart1 = '<tr><td style="min-width: 60px;font-size: 10px;border: #999 1px solid; color: #999; padding: 1px 5px">',
                tdstart2 = '</td><td style="min-width: 60px;font-size: 10px;border: #999 1px solid; color: #999; padding: 1px 5px">',
                str = '<table style="border-collapse: collapse;text-align: right">' 
                        + tdstart1 + percentageTitles.join(tdstart2)+'</td></tr>'
                        + tdstart1 + percentageValues.join(tdstart2)+'</td></tr>'
                    +'</table>';
            frm.down('[name="displayPercentage"]').setValue(str);
        }

        me.getValues = function (){
            var frm = me.down('form'),
                valueObj = frm.getValues(false, false, false, true),
                timeFormat = 'Y-m-d';
            if (frm.isValid()) {
                valueObj.startTime = Ext.Date.format(valueObj.startTime, timeFormat);
                valueObj.endTime = Ext.Date.format(valueObj.endTime, timeFormat);
                var stages = [];
                if (Ext.isArray(valueObj.extraPaymentDate)) {
                    Ext.each(valueObj.extraPaymentDate, function (d, index, self){
                        stages.push(Ext.Date.format(d, timeFormat) + ':' + valueObj.extraPaymentFee[index]);
                    });
                }
                else if (Ext.isDate(valueObj.extraPaymentDate)) {
                    stages.push(Ext.Date.format(d, timeFormat) + ':' + valueObj.extraPaymentDate[index]);
                }

                valueObj.stages = stages.join(joinSymbol);
                if (valueObj.additionals) {
                    valueObj.additionals = (valueObj.additionals.join ? valueObj.additionals.join(joinSymbol) : valueObj.additionals);
                }
                delete valueObj.paymentDate;
                delete valueObj.paymentFee;
                delete valueObj.paymentApproval;
                delete valueObj.extraPaymentDate;
                delete valueObj.extraPaymentFee;
                delete valueObj.displayPercentage;
                
                Ext.apply(valueObj, {
                    businessId: me.business && me.business.getId(),
                    businessName: me.business && me.business.get('regionName') + ' ' + me.business.get('address')
                });

                return valueObj;
            }
            else {
                return false;
            }
        }

        function updateContractField(field, evt) {
            if (me.contract) {
                if (field.isDirty()) {
                    ajaxUpdate('ContractEngineering', Ext.apply({}, {
                        id: me.contract.id,
                        [field.getName()]: field.getValue()
                    }), ['id'], function(obj) {
                        showMsg('更新成功!');
                    });
                }
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
                        value: '佳诚装饰工程合同',
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
                            margin: '0 4 0 0',

                        },
                        items: [
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '甲方名称',
                                name: 'custRemark',
                                itemId: 'custRemark',
                                value: me.contract ? (me.contract.custRemark) : '',
                                listeners: {
                                    blur: updateContractField
                                }
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                name: 'customer',
                                itemId: 'customer',
                                fieldLabel: '甲方负责人',
                                value: me.contract ? (me.contract.customer) : '',
                                listeners: {
                                    blur: updateContractField
                                }
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '联系方式',
                                itemId: 'custContact',
                                name: 'custContact',
                                value: me.contract ? me.contract.custContact : '',
                                listeners: {
                                    blur: updateContractField
                                }
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
                                fieldLabel: '工程地址',
                                itemId: 'address',
                                name: 'address',
                                value: me.contract ? me.contract.address : '',
                                listeners: {
                                    blur: updateContractField
                                }
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '工程名称',
                                itemId: 'projectName',
                                name: 'projectName',
                                value: me.contract ? me.contract.projectName : '',
                                listeners: {
                                    blur: updateContractField
                                }
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        name: 'captainFst',
                        itemId: 'captainFst',
                        items: [
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '项目经理',
                                itemId: 'captain',
                                name: 'captain',
                                readOnly: true,
                                value: me.contract ? me.contract.captain : '',
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        if (!preview) {
                                            var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                                userFilter: /^003-\d{3}$/i,
                                                callback: function (rec){
                                                    var ct = cmp.ownerCt,
                                                        captainName = ct.getComponent('captainName');
                                                    if (me.contract) {
                                                        // captain name has been updated in edit.
                                                        if (rec.get('name') != captainName.getValue()) {
                                                            ajaxUpdate('ContractEngineering', Ext.apply({}, {
                                                                id: me.contract.id,
                                                                captainName: captainName.getValue(),
                                                                captain: cmp.getValue()
                                                            }), ['id'], function(obj) {
                                                                showMsg('更新成功!');
                                                            });
                                                        }
                                                    }
                                                    cmp.setValue(rec.get('realname'));
                                                    captainName.setValue(rec.get('name'));
                                                    win.close();
                                                }
                                            });
    
                                            win.show();
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'hiddenfield',
                                itemId: 'captainName',
                                name: 'captainName',
                                value: me.contract ? me.contract.captainName : ''
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '签约代表',
                                itemId: 'signatoryRep',
                                name: 'signatoryRep',
                                readOnly: true,
                                value: me.contract ? me.contract.signatoryRep : '',
                                listeners: {
                                    focus: function(cmp, evt, opts) {
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            callback: function (rec){
                                                var ct = cmp.ownerCt,
                                                    signatoryRepName = ct.getComponent('signatoryRepName');

                                                if (me.contract) {
                                                    // captain name has been updated in edit.
                                                    if (rec.get('name') != signatoryRepName.getValue()) {
                                                        ajaxUpdate('ContractEngineering', Ext.apply({}, {
                                                            id: me.contract.id,
                                                            signatoryRepName: signatoryRepName.getValue(),
                                                            signatoryRep: cmp.getValue()
                                                        }), ['id'], function(obj) {
                                                            showMsg('更新成功!');
                                                        });
                                                    }
                                                }
                                                cmp.setValue(rec.get('realname'));
                                                signatoryRepName.setValue(rec.get('name'));
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
                                name: 'signatoryRepName',
                                value: me.contract ? me.contract.signatoryRepName : ''
                            },
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0',
                            allowBlank: false
                        },
                        name: 'projectPersonnels',
                        itemId: 'projectPersonnels',
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '设计师',
                                value: me.contract ? (me.contract.designer) : (me.business && me.business.get('designer')),
                                itemId: 'designer',
                                name: 'designer',
                            },
                            {
                                xtype: 'hiddenfield',
                                value: me.business && me.business.get('designerName'),
                                itemId: 'designerName',
                                name: 'designerName'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '业务员',
                                value: me.contract ? (me.contract.salesman) : (me.business && me.business.get('salesman')),
                                itemId: 'salesman',
                                name: 'salesman'
                            },
                            {
                                xtype: 'hiddenfield',
                                value: me.business && me.business.get('salesmanName'),
                                itemId: 'salesmanName',
                                name: 'salesmanName'
                            },
                        ]
                    },
                    {
                        itemId: 'gongqi',
                        name: 'gongqi',
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
                                value: me.contract ? me.contract.startTime : '',
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
                                value: me.contract ? me.contract.endTime : '',
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
                                fieldLabel: '总工期',
                                value: me.contract ? me.contract.totalDays + '天' : ''
                            }
                        ]
                    },
                    {
                        xtype: preview ? 'displayfield' : 'numberfield',
                        fieldLabel: '合同总额(元)',
                        name: 'totalPrice',
                        itemId: 'totalPrice',
                        value: me.contract ? me.contract.totalPrice : '',
                        listeners: {
                            change: calculateInstallments
                        }
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '',
                        name: 'displayPercentage',
                        name: 'displayPercentage',
                        readOnly: true
                    },
                    {
                        xtype: 'fieldset',
                        title: '工程款',
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
                                    extraPaymentCt.add(createExtraPayment());
                                }
                            }
                        ].concat(me.contract ? me.contract.stages.map(function (obj, index){
                            return createExtraPayment(obj);
                        }) : [
                        ])
                    },
                ]
            }
        ];

        me.addListener(
            {
                render: function (cmp, opts){
                    if (!preview) {
                        ajaxGet('StatementBill', undefined, {
                            billType: 'dsdpst',
                            businessId: me.business && me.business.getId()
                        }, function (obj){
                            var extraPaymentCt = me.down('[name="extraPaymentCt"]'),
                                frm = me.down('form'),
                                designDeposit = frm.down('[name="designDeposit"]');
                            if (obj.data.length > 0) {
                                me.designDeposit = obj.data[0];
                                designDeposit.setValue('(设计定金: ' + me.designDeposit['paidAmount'] + '元, 收款时间:' + me.designDeposit['paidTime'] + ')');
                            }
                        });
                    }
                }
            }
        );

        this.callParent();
    }
});