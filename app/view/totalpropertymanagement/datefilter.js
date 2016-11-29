Ext.define('FamilyDecoration.view.totalpropertymanagement.DateFilter', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.totalpropertymanagement-datefilter',
    requires: [
        'FamilyDecoration.store.Account',
        'Ext.form.field.Month'
    ],
    layout: 'vbox',
    defaults: {
        width: '100%'
    },
    needBankAccount: false,
    filterFunc: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        var _getRes = function (){
            var dateCt = me.getComponent('dateCt');
            return {
                startTime: dateCt.getComponent('startTime'),
                endTime: dateCt.getComponent('endTime')
            };
        }

        var generateAccount = function (cfgFlag){
            var cfg = {
                xtype: 'combobox',
                displayField: 'name',
                valueField: 'id',
                editable: false,
                store: Ext.create('FamilyDecoration.store.Account', {
                    autoLoad: true
                }),
                queryMode: 'local',
                flex: 1
            };
            return cfgFlag ? cfg : Ext.create('Ext.form.FieldContainer', {
                layout: 'hbox',
                width: '100%',
                items: [
                    cfg,
                    {
                        xtype: 'button',
                        width: 50,
                        text: '清空',
                        handler: function (){
                            var fct = this.ownerCt,
                                combo = fct.down('combobox');
                            combo.clearValue();
                        }
                    },
                    {
                        xtype: 'button',
                        width: 50,
                        text: '删除',
                        handler: function (){
                            var fct = this.ownerCt,
                                toolbar = fct.ownerCt;
                            toolbar.remove(fct);
                        }
                    }
                ]
            });
        }

        me.items = [
            {
                xtype: 'fieldcontainer',
                flex: 1,
                layout: 'hbox',
                itemId: 'dateCt',
                items: [
                    {
                        xtype: 'monthfield',
                        flex: 1,
                        editable: false,
                        name: 'startTime',
                        itemId: 'startTime',
                        emptyText: '开始时间',
                        format: 'F, Y',
                        submitFormat: 'Y-m-d',
                        validator: function (val) {
                            var resObj = _getRes();
                            if (val && resObj.endTime.getValue()) {
                                return true;
                            }
                            else if (!val && resObj.endTime.getValue()) {
                                return '开始时间和结束时间不能有一个为空';
                            }
                            else if (val && !resObj.endTime.getValue()) {
                                resObj.endTime.isValid();
                                return true;
                            }
                            else {
                                return true;
                            }
                        },
                        listeners: {
                            change: function (cmp, newVal, oldVal, opts){
                                console.log(newVal, oldVal);
                            }
                        }
                    },
                    {
                        xtype: 'monthfield',
                        flex: 1,
                        editable: false,
                        emptyText: '结束时间',
                        name: 'endTime',
                        itemId: 'endTime',
                        format: 'F, Y',
                        submitFormat: 'Y-m-d',
                        validator: function (val) {
                            var resObj = _getRes();
                            if (val && resObj.startTime.getValue()) {
                                return true;
                            }
                            else if (!val && resObj.startTime.getValue()) {
                                return '开始时间和结束时间不能有一个为空';
                            }
                            else if (val && !resObj.startTime.getValue()) {
                                resObj.startTime.isValid();
                                return true;
                            }
                            else {
                                return true;
                            }
                        },
                        listeners: {
                            change: function (cmp, newVal, oldVal, opts){
                                console.log(newVal, oldVal);
                            }
                        }
                    }
                ]
            },
            me.needBankAccount ? {
                xtype: 'fieldcontainer',
                flex: 1,
                layout: 'hbox',
                items: [
                    generateAccount(true),
                    {
                        xtype: 'button',
                        text: '清空',
                        width: 50,
                        handler: function (){
                            var fct = this.ownerCt,
                                combo = fct.down('combobox');
                            combo.clearValue();
                        }
                    },
                    {
                        xtype: 'button',
                        text: '添加',
                        width: 50,
                        handler: function (){
                            me.add(generateAccount());
                        }
                    }
                ]
            } : undefined,
        ];
        
        this.callParent();
    }
});