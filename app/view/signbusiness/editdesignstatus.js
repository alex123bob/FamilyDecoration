Ext.define('FamilyDecoration.view.signbusiness.EditDesignStatus', {
    extend: 'Ext.window.Window',
    alias: 'widget.signbusiness-editdesignstatus',

    resizable: false,
    modal: true,
    width: 400,
    height: 250,
    autoScroll: true,
    bodyPadding: 4,
    title: '设计状态',
    layout: 'vbox',

    business: null,
    waitingList: null,
    detailedAddressGrid: null,

    defaults: {
        flex: 1,
        width: '100%'
    },

    initComponent: function () {
        var me = this,
            statusObj = {
                ds_lp: '平面布局',
                ds_fc: '立面施工',
                ds_bs: '效果图',
                ds_bp: '预算'
            },
            itemArr = [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaults: {
                        height: '100%',
                        flex: 1,
                        margin: '0 2 2 0',
                        xtype: 'displayfield',
                        hideLabel: true
                    },
                    items: [
                        {
                            flex: 0.5,
                            value: ''
                        },
                        {
                            value: '<strong>开始时间</strong>'
                        },
                        {
                            value: '<strong>结束时间</strong>'
                        }
                    ]
                }
            ];

        for (var key in statusObj) {
            if (statusObj.hasOwnProperty(key)) {
                var name = statusObj[key],
                    start, end, period, done = false;
                period = me.business.get(key);
                if (period && period != -1) {
                    if (period.indexOf('done') != -1) {
                        done = true;
                        period = period.slice(0, period.indexOf('done'));
                    }
                    start = Ext.Date.parse(period.split('~')[0], 'Y-m-d');
                    end = Ext.Date.parse(period.split('~')[1], 'Y-m-d');
                }
                else {
                }
                itemArr.push(
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        name: key,
                        defaults: {
                            height: '100%',
                            flex: 1,
                            margin: '0 2 2 0'
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                hideLabel: true,
                                flex: 0.5,
                                value: name
                            },
                            {
                                xtype: 'datefield',
                                name: 'startTime',
                                editable: false,
                                allowBlank: key != 'ds_lp',
                                value: start,
                                disabled: done,
                                listeners: {
                                    change: function (field, newVal, oldVal, opts){
                                        var endFd = field.nextSibling();
                                        endFd.setMinValue(newVal);
                                    }
                                }
                            },
                            {
                                xtype: 'datefield',
                                name: 'endTime',
                                editable: false,
                                allowBlank: key != 'ds_lp',
                                value: end,
                                disabled: done,
                                listeners: {
                                    change: function (field, newVal, oldVal, opts){
                                        var startFd = field.previousSibling();
                                        startFd.setMaxValue(newVal);
                                    }
                                }
                            }
                        ]
                    }
                );
            }
        }

        me.items = itemArr;

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var res = {},
                        isValid = true;
                    for (var pro in statusObj) {
                        if (statusObj.hasOwnProperty(pro)) {
                            var val = statusObj[pro],
                                dct = me.down('[name="' + pro + '"]'),
                                startTime = dct.down('[name="startTime"]'),
                                endTime = dct.down('[name="endTime"]');
                            if (startTime.isValid() && endTime.isValid()) {
                                if (startTime.isDisabled() || endTime.isDisabled()) {

                                }
                                else if (startTime.getValue() && endTime.getValue()){
                                    startTime = Ext.Date.format(startTime.getValue(), 'Y-m-d');
                                    endTime = Ext.Date.format(endTime.getValue(), 'Y-m-d');
                                    res[pro] = startTime + '~' + endTime;
                                }
                            }
                            else {
                                isValid = false;
                                break;
                            }
                        }
                    }
                    if (!isValid) {
                        return false;
                    }
                    Ext.apply(res, {
                        id: me.business.getId()
                    });
                    Ext.Ajax.request({
                        url: './libs/business.php?action=editBusiness',
                        method: 'POST',
                        params: res,
                        callback: function (opts, success, res){
                            if (success) {
                                var obj = Ext.decode(res.responseText);
                                if ('successful' == obj.status) {
                                    if (me.waitingList) {
                                        showMsg('接收成功！');
                                        me.waitingList.refresh();
                                    }
                                    else {
                                        showMsg('修改成功!');
                                    }
                                    me.detailedAddressGrid.refresh();
                                    me.close();
                                }
                                else {
                                    showMsg(obj.errMsg);
                                }
                            }
                        }
                    })
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});