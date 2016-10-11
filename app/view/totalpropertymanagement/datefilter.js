Ext.define('FamilyDecoration.view.totalpropertymanagement.DateFilter', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.totalpropertymanagement-datefilter',
    requires: [
        
    ],
    layout: 'hbox',
    defaults: {
        height: '100%'
    },
    direction: 'horizontal', // horizontal or vertical

    initComponent: function () {
        var me = this;

        me.layout = (me.direction == 'vertical' ? 'vbox' : (me.direction == 'horizontal' ? 'hbox' : ''));

        me.items = [
            {
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
            }
        ];
        
        this.callParent();
    }
});