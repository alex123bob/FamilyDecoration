Ext.define('FamilyDecoration.view.account.DateRangeFilter', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.account-daterangefilter',
    requires: [],
    direction: 'horizontal', // horizontal or vertical

    filterFn: Ext.emptyFn,
    clearFn: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.clean = function (){
            var resObj = getRes();
            resObj.startTime.setValue('');
            resObj.endTime.setValue('');
        }

        if (me.direction == 'horizontal') {
            me.layout = 'hbox';
        }
        else if (me.direction == 'vertical') {
            me.layout = 'vbox';
        }
        me.defaults = {
            flex: 1
        };

        function getRes() {
            var startTime = me.getComponent('startTime'),
                endTime = me.getComponent('endTime');
            return {
                startTime: startTime,
                endTime: endTime
            };
        }

        me.items = [
            {
                xtype: 'datefield',
                editable: false,
                name: 'startTime',
                itemId: 'startTime',
                emptyText: '开始时间',
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
                },
                listeners: {
                    change: function (cmp, newVal, oldVal, opts) {
                        var resObj = getRes();
                        if (resObj.startTime.isValid() && resObj.endTime.isValid()) {
                            if (newVal) {
                                me.filterFn({
                                    startTime: resObj.startTime.getValue(),
                                    endTime: resObj.endTime.getValue()
                                });
                            }
                            else {
                                me.clearFn();
                            }
                        }
                    }
                }
            },
            {
                xtype: 'datefield',
                editable: false,
                emptyText: '结束时间',
                name: 'endTime',
                itemId: 'endTime',
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
                },
                listeners: {
                    change: function (cmp, newVal, oldVal, opts) {
                        var resObj = getRes();
                        if (resObj.startTime.isValid() && resObj.endTime.isValid()) {
                            if (newVal) {
                                me.filterFn({
                                    startTime: resObj.startTime.getValue(),
                                    endTime: resObj.endTime.getValue()
                                });
                            }
                            else {
                                me.clearFn();
                            }
                        }
                    }
                }
            }
        ];

        me.callParent();
    }
});