Ext.define('FamilyDecoration.view.billaudit.DateFilter', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.billaudit-datefilter',
    requires: [],
    layout: 'vbox',

    needTime: true, // do we need start and end time component. default true
    needBillNumber: true, // do we need billnumber. default true. this is only used for billaudit panel
    needCustomTxt: true, // do we need custom field. default true
    txtEmptyText: undefined,
    txtParam: undefined,

    filterFn: Ext.emptyFn,
    clearFn: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        function getRes() {
            var startTime = me.getComponent('startTime'),
                endTime = me.getComponent('endTime'),
                projectName = me.getComponent('projectName'),
                billId = me.getComponent('billId'),
                customTxt = me.down('fieldcontainer').getComponent('customTxt');
            return {
                startTime: startTime,
                projectName: projectName,
                billId: billId,
                endTime: endTime,
                customTxt: customTxt
            };
        }

        me.items = [
            {
                hidden: !me.needTime,
                xtype: 'datefield',
                flex: 1,
                editable: false,
                width: '100%',
                name: 'startTime',
                itemId: 'startTime',
                emptyText: '开始时间',
                cleanBtn: true,
                cleanHandler: function () {
                    var resObj = getRes();
                    resObj.endTime.isValid();
                },
                validator: function (val) {
                    var resObj = getRes();
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
                }
            },
            {
                hidden: !me.needTime,
                xtype: 'datefield',
                flex: 1,
                editable: false,
                width: '100%',
                emptyText: '结束时间',
                name: 'endTime',
                itemId: 'endTime',
                cleanBtn: true,
                cleanHandler: function () {
                    var resObj = getRes();
                    resObj.startTime.isValid();
                },
                validator: function (val) {
                    var resObj = getRes();
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
                }
            },
            {
                xtype: 'textfield',
                flex: 1,
                editable: false,
                width: '100%',
                emptyText: '项目名称',
                name: 'projectName',
                itemId: 'projectName',
                enableKeyEvents: true,
                listeners: {
                    keydown: function (field, e) {
                        if (e.keyCode == 13) {
                            var fct = field.nextSibling().nextSibling();
                            fct.getComponent('button-filter').handler();
                        }
                    },
                    change: function (field, newVal, oldVal, opts){
                        if (newVal == '') {
                            var fct = field.nextSibling().nextSibling();
                            fct.getComponent('button-clean').handler();
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                flex: 1,
                hidden: !me.needBillNumber,
                editable: false,
                width: '100%',
                emptyText: '账单号',
                name: 'billId',
                itemId: 'billId',
                enableKeyEvents: true,
                listeners: {
                    keydown: function (field, e) {
                        if (e.keyCode == 13) {
                            var fct = field.nextSibling();
                            fct.getComponent('button-filter').handler();
                        }
                    },
                    change: function (field, newVal, oldVal, opts){
                        if (newVal == '') {
                            var fct = field.nextSibling();
                            fct.getComponent('button-clean').handler();
                        }
                    }
                }
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                width: '100%',
                hidden: !me.needCustomTxt,
                items: [
                    {
                        xtype: 'textfield',
                        flex: 1,
                        itemId: 'customTxt',
                        name: me.txtParam,
                        emptyText: me.txtEmptyText
                    },
                    {
                        xtype: 'button',
                        text: '过滤',
                        itemId: 'button-filter',
                        handler: function () {
                            var resObj = getRes();
                            var obj = {};
                            if (resObj.startTime.isValid() && resObj.endTime.isValid()) {
                                obj.startTime = resObj.startTime.getValue(),
                                    obj.endTime = resObj.endTime.getValue()
                            }
                            obj[me.txtParam] = resObj.customTxt.getValue();
                            obj.projectName = resObj.projectName.getValue();
                            obj.billId = resObj.billId.getValue();
                            me.filterFn(obj);
                        }
                    },
                    {
                        xtype: 'button',
                        text: '清空',
                        itemId: 'button-clean',
                        handler: function () {
                            var resObj = getRes();
                            resObj.startTime.setValue('').clearInvalid();
                            resObj.endTime.setValue('').clearInvalid();
                            resObj.projectName.setValue('');
                            resObj.billId.setValue('');
                            resObj.customTxt.setValue('');
                            me.clearFn();
                        }
                    }
                ]
            }
        ];

        me.callParent();
    }
});