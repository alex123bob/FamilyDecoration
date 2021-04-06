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

    contract: undefined, // is edit or not.

    initComponent: function () {
        var me = this,
            preview = me.preview,
            joinSymbol = '/**/';

        me.tbar = preview || me.contract ? null : [
            '->',
            {
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
                                    var personnels = me.down('form').getComponent('projectPersonnels');
                                    Ext.Array.each(personnels.items.items, function(item) {
                                        if (item.name === 'businessName') {
                                            item.setValue(rec.get('regionName') + ' ' + rec.get('address'));
                                        }
                                        else if (item.name === 'businessId') {
                                            item.setValue(rec.getId());
                                        }
                                        else {
                                            item.setValue(rec.get(item.name));
                                        }
                                    });
                                    win.close();
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


        function updateStages() {
            var extraPaymentCt = me.down('form').down('[name="extraPaymentCt"]'),
                extraPaymentAreas = Ext.ComponentQuery.query('[name="extraPaymentArea"]', extraPaymentCt),
                params = {
                    stages: []
                };
            Ext.Array.each(extraPaymentAreas, function(area, index) {
                var datefield = area.down('[name="extraPaymentDate"]'),
                    fee = area.down('[name="extraPaymentFee"]');
                params.stages.push([Ext.Date.format(datefield.getValue(), 'Y-m-d'), fee.getValue()].join(':'));
            });
            params.stages = params.stages.join(joinSymbol);
            ajaxUpdate('ContractEngineering', Ext.apply({
                id: me.contract.id
            }, params), ['id'], function(obj) {
                showMsg('更新成功!');
            });
        }

        function createExtraPayment (obj){
            var totalPrice = me.contract ? me.contract.totalPrice : me.down('form').getComponent('totalPrice').getValue();
            totalPrice = parseFloat(totalPrice);
            var percent = me.contract ? parseFloat(obj && obj.amount || 0).div(totalPrice).mul(100) : 0;
            percent = percent.toFixed(2);

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
                        width: 50,
                        value: percent + '%'
                    },
                    {
                        name: 'sliderPercentage',
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
                            change: _.debounce(function(slider, newVal, thumb) {
                                if (newVal) {
                                    var ct = slider.ownerCt;
                                    var name = ct.getComponent('percentage'),
                                        fee = ct.getComponent('fee');
                                    var totalPrice = me.down('form').getComponent('totalPrice').getValue();
                                    name.setValue(newVal + '%');
                                    if (totalPrice) {
                                        fee.setValue(totalPrice.mul(newVal.div(100)));
                                    }

                                    // update stages to change log and related dbs.
                                    if (me.contract) {
                                        updateStages();
                                    }
                                }
                            }, 500)
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
                            change: function() {
                                if (me.contract) {
                                    updateStages();
                                }
                            }
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

                            if (me.contract) {
                                updateStages();
                            }

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
                valueObj.additionals = frm.down('[name="additionals"]').getValue();
                delete valueObj.paymentDate;
                delete valueObj.paymentFee;
                delete valueObj.paymentApproval;
                delete valueObj.extraPaymentDate;
                delete valueObj.extraPaymentFee;
                delete valueObj.displayPercentage;

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
                                xtype: 'hiddenfield',
                                name: 'businessId',
                                itemId: 'businessId',
                                value: me.contract ? me.contract.businessId : '',
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'businessName',
                                itemId: 'businessName',
                                value: me.contract ? me.contract.businessName : '',
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '设计师',
                                value: me.contract ? me.contract.designer : '',
                                itemId: 'designer',
                                name: 'designer',
                            },
                            {
                                xtype: 'hiddenfield',
                                value: me.contract ? me.contract.designerName : '',
                                itemId: 'designerName',
                                name: 'designerName'
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '业务员',
                                value: me.contract ? me.contract.salesman : '',
                                itemId: 'salesman',
                                name: 'salesman'
                            },
                            {
                                xtype: 'hiddenfield',
                                value: me.contract ? me.contract.salesmanName : '',
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
                                        return true;
                                    }
                                },
                                listeners: {
                                    change: function (cmp, newVal, oldVal, opts){
                                        var ownerCt = cmp.ownerCt,
                                            startTime = this,
                                            endTime = ownerCt.getComponent('endTime'),
                                            totalProjectTime = ownerCt.getComponent('totalProjectTime'),
                                            total = endTime.getValue() - startTime.getValue();

                                        if (total < 0) {
                                            totalProjectTime.setValue('');
                                        }
                                        else {
                                            if (me.contract) {
                                                // start time updated.
                                                ajaxUpdate('ContractEngineering', Ext.apply({}, {
                                                    id: me.contract.id,
                                                    startTime: Ext.Date.format(newVal, 'Y-m-d'),
                                                }), ['id'], function(obj) {
                                                    showMsg('更新成功!');
                                                });
                                            }
                                            totalProjectTime.setValue(total / 1000 / 60 / 60 / 24 + '天');
                                            endTime.clearInvalid();
                                        }
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
                                        return true;
                                    }
                                },
                                listeners: {
                                    change: function (cmp, newVal, oldVal, opts){
                                        var ownerCt = cmp.ownerCt,
                                            endTime = this,
                                            startTime = ownerCt.getComponent('startTime'),
                                            totalProjectTime = ownerCt.getComponent('totalProjectTime'),
                                            total = endTime.getValue() - startTime.getValue();

                                        if (total < 0) {
                                            totalProjectTime.setValue('');
                                        }
                                        else {
                                            if (me.contract) {
                                                // start time updated.
                                                ajaxUpdate('ContractEngineering', Ext.apply({}, {
                                                    id: me.contract.id,
                                                    endTime: Ext.Date.format(newVal, 'Y-m-d'),
                                                }), ['id'], function(obj) {
                                                    showMsg('更新成功!');
                                                });
                                            }
                                            totalProjectTime.setValue(total / 1000 / 60 / 60 / 24 + '天');
                                            startTime.clearInvalid();
                                        }
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
                            change: _.debounce(function (cmp, newVal, oldVal, opts){
                                if (newVal) {
                                    calculateInstallments(cmp, newVal);
                                    var ct = cmp.ownerCt,
                                        extraPaymentCt = ct.getComponent('extraPaymentCt'),
                                        extraPaymentAreas = Ext.ComponentQuery.query('[name="extraPaymentArea"]', extraPaymentCt),
                                        params = {
                                            totalPrice: newVal,
                                            stages: []
                                        };
                                    Ext.Array.each(extraPaymentAreas, function(area, index) {
                                        var slider = area.down('[name="sliderPercentage"]'),
                                            datefield = area.down('[name="extraPaymentDate"]'),
                                            fee = area.down('[name="extraPaymentFee"]');
                                        fee.setValue( newVal.mul( slider.getValue()).div(100) );
                                        params.stages.push([Ext.Date.format(datefield.getValue(), 'Y-m-d'), fee.getValue()].join(':'));
                                    });
                                    params.stages = params.stages.join(joinSymbol);
                                    if (me.contract) {
                                        ajaxUpdate('ContractEngineering', Ext.apply({
                                            id: me.contract.id
                                        }, params), ['id'], function(obj) {
                                            showMsg('更新成功!');
                                        });
                                    }
                                }
                            }, 500)
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
                    {
                        xtype: 'fieldset',
                        title: '附加条款',
                        layout: 'vbox',
                        defaults: {
                            flex: 1,
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                hidden: preview,
                                enableKeyEvents: true,
                                listeners: {
                                    keydown: function(txt, evt, opts) {
                                        if (evt.keyCode == 13) {
                                            var additionalsWdiget = txt.nextSibling('[name="additionals"]'),
                                                additionals = additionalsWdiget.getAdditionals();
                                            additionals.push(txt.getValue());
                                            additionalsWdiget.renderItems(additionals);
                                            txt.setValue('');
                                            if (me.contract) {
                                                ajaxUpdate('ContractEngineering', Ext.apply({
                                                    id: me.contract.id
                                                }, {
                                                    additionals: additionalsWdiget.getValue()
                                                }), ['id'], function(obj) {
                                                    showMsg('更新成功!');
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'fieldcontainer',
                                name: 'additionals',
                                itemId: 'additionals',
                                layout: 'vbox',
                                defaults: {
                                    flex: 1,
                                    width: '100%',
                                },
                                renderItems: function(arr){
                                    this.removeAll();
                                    this.add(arr.map(function(val, idx) {
                                        var container = {
                                            xtype: 'fieldcontainer',
                                            index: idx,
                                            layout: 'hbox',
                                            defaults: {
                                                flex: 1,
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    flex: null,
                                                    width: 35,
                                                    hidden: preview,
                                                    text: '×',
                                                    handler: function() {
                                                        var ct = this.ownerCt,
                                                            additionalsWdiget = ct.ownerCt,
                                                            idx = ct.index,
                                                            additionals = additionalsWdiget.getAdditionals();
                                                        additionals.splice(idx, 1);
                                                        additionalsWdiget.renderItems(additionals);
                                                        if (me.contract) {
                                                            ajaxUpdate('ContractEngineering', Ext.apply({
                                                                id: me.contract.id
                                                            }, {
                                                                additionals: additionalsWdiget.getValue()
                                                            }), ['id'], function(obj) {
                                                                showMsg('更新成功!');
                                                            });
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    value: val
                                                }
                                            ]
                                        };
                                        return container;
                                    }));
                                },
                                getAdditionals: function() {
                                    var items = this.items && this.items.items ? this.items.items : [];
                                    return items.map(function(item) {
                                        return item.down('displayfield').getValue()
                                    });
                                },
                                getValue: function() {
                                    return this.getAdditionals().join(joinSymbol);
                                },
                                items: []
                            }
                        ]
                    }
                ]
            }
        ];

        me.addListener(
            {
                afterrender: function(cmp, opts){
                    if (this.contract) {
                        this.down('form').down('[name="additionals"]').renderItems(me.contract.additionals.map(function(item){
                            return item.content;
                        }));
                    }
                }
            }
        );

        this.callParent();
    }
});