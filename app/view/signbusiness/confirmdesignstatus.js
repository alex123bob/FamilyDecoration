Ext.define('FamilyDecoration.view.signbusiness.ConfirmDesignStatus', {
    extend: 'Ext.window.Window',
    alias: 'widget.signbusiness-confirmdesignstatus',

    resizable: false,
    modal: true,
    width: 300,
    height: 140,
    autoScroll: true,
    bodyPadding: 4,
    title: '设计状态确认',

    business: null,
    detailedAddressGrid: null,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'combobox',
                fieldLabel: '完成确认',
                displayField: 'value',
                valueField: 'name',
                queryMode: 'local',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: 'ds_lp',
                            value: '平面布局'
                        },
                        {
                            name: 'ds_fc',
                            value: '立面施工'
                        },
                        {
                            name: 'ds_bs',
                            value: '效果图'
                        },
                        {
                            name: 'ds_bp',
                            value: '预算'
                        }
                    ]
                })
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var combobox = me.down('combobox'),
                        name = combobox.getValue(),
                        status, p = {id: me.business.getId()};
                    if (name) {
                        status = me.business.get(name);
                        if (!status) {
                            showMsg('该状态未设定！');
                        }
                        else if (status == -1) {
                            showMsg('该状态未初始化!');
                        }
                        else if (status.indexOf('done') != -1) {
                            showMsg('该状态已经完成，无法再次确认完成！');
                        }
                        else {
                            p[name] = status + 'done';
                            Ext.Ajax.request({
                                url: './libs/business.php?action=editBusiness',
                                method: 'POST',
                                params: p,
                                callback: function (opts, success, res){
                                    if (success) {
                                        var obj = Ext.decode(res.responseText);
                                        if ('successful' == obj.status) {
                                            showMsg('确认成功！');
                                            me.detailedAddressGrid.refresh();
                                            me.close();
                                        }
                                        else {
                                            showMsg(obj.errMsg);
                                        }
                                    }
                                }
                            });
                        }
                    }
                    else {
                        showMsg('请选择需要确认的设计项目!');
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

        this.callParent();
    }
});