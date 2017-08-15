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
            {
                hidden: preview,
                xtype: 'button',
                text: '添加工程款',
                icon: 'resources/img/contract_add_projectfee.png',
                handler: function (){
                    var index = getAppendixIndex(),
                        form = this.up('panel').down('form');
                    if (index !== -1) {
                        form.insert(index, createPaymentArea(countProjectPaymentArea()));
                    }
                }
            },
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

        function getAppendixIndex (){
            var form = me.down('form'),
                index;
            form.items.each(function (item, i, self){
                if (item.name === 'appendix') {
                    index = i;
                    return false;
                }
            });

            return (index ? index : -1);
        }

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
        function createPaymentArea(index) {
            var title = NoToChinese(index + 1) + '期工程款';
            return {
                xtype: 'fieldset',
                title: title,
                layout: 'vbox',
                defaults: {
                    flex: 1,
                    width: '100%'
                },
                name: 'projectPaymentArea',
                defaultType: 'fieldcontainer',
                items: [
                    {
                        layout: 'hbox',
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: preview ? 'displayfield' : 'datefield',
                                fieldLabel: '日期'
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '金额',
                                readOnly: true
                            }
                        ]
                    }
                ]
            };
        }

        function createAppendix(index, content) {
            return {
                layout: 'hbox',
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
                        text: '删除',
                        width: 50,
                        hidden: preview
                    }
                ]
            }
        }

        me.getValues = function (){
            return {
                businessId: me.business.getId(),
                totalPrice: 100,
                sid: '330523199011061810',
                address: 'address ts',
                stages: [
                    {
                        stage: {
                            
                        }
                    }
                ]
            }
        }

        me.items = [
            {
                autoScroll: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    layout: 'hbox'
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
                                value: me.business.get('customer')
                            },
                            {
                                hidden: preview,
                                xtype: 'textfield',
                                fieldLabel: '确认'
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '客户联系',
                                value: me.business.get('custContact')
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '身份证号码'
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '项目经理',
                                readOnly: true,
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            userFilter: /^003-\d{3}$/i,
                                            callback: function (rec){
                                                cmp.setValue(rec.get('realname'));
                                                cmp.nextSibling().setValue(rec.get('phone'));
                                                win.close();
                                            }
                                        });

                                        win.show();
                                    }
                                }
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '联系方式'
                            }
                        ]
                    },
                    {
                        xtype: preview ? 'displayfield' : 'textfield',
                        fieldLabel: '联系地址'
                    },
                    {
                        defaults: {
                            flex: 1,
                            margin: '0 4 0 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: '设计师',
                                value: me.business.get('designer')
                            },
                            {
                                xtype: 'displayfield',
                                fieldLabel: '业务员',
                                value: me.business.get('salesman')
                            },
                            {
                                xtype: preview ? 'displayfield' : 'textfield',
                                fieldLabel: '签约代表',
                                readOnly: true,
                                listeners: {
                                    focus: function (cmp, evt, opts){
                                        var win = Ext.create('FamilyDecoration.view.contractmanagement.PickUser', {
                                            // userFilter: /^003-\d{3}$/i,
                                            callback: function (rec){
                                                cmp.setValue(rec.get('realname'));
                                                win.close();
                                            }
                                        });

                                        win.show();
                                    }
                                }
                            }
                        ]
                    },
                    {
                        defaults: {
                            flex: 1,
                            labelWidth: 30,
                            margin: '0 4 0 0'
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
                                margin: '0 8 0 8',
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
                                labelWidth: 50,
                                fieldLabel: '总工期'
                            }
                        ]
                    },
                    {
                        xtype: preview ? 'displayfield' : 'textfield',
                        fieldLabel: '合同总额',
                        anchor: '40%'
                    },
                    {
                        xtype: 'fieldset',
                        title: '附加条款',
                        layout: 'vbox',
                        name: 'appendix',
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
                                        var config = createAppendix('N', txt),
                                            index = config.items.length - 1;
                                        ct.insert(index, config);
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
                        name: 'discount',
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