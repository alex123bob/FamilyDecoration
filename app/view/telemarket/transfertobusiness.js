Ext.define('FamilyDecoration.view.telemarket.TransferToBusiness', {
    extend: 'Ext.window.Window',
    alias: 'widget.telemarket-transfertobusiness',
    requires: [

    ],
    title: '转为业务',
    width: 500,
    height: 320,
    bodyPadding: 10,
    modal: true,
    layout: 'form',
    grid: undefined,
    potentialBusiness: undefined,
    defaultType: 'textfield',

    initComponent: function () {
        var me = this;

        me.items = [
            {
                fieldLabel: '客户姓名',
                name: 'proprietor',
                readOnly: true,
                value: me.potentialBusiness.get('proprietor')
            },
            {
                fieldLabel: '联系方式',
                name: 'phone',
                readOnly: true,
                value: me.potentialBusiness.get('phone')
            },
            {
                fieldLabel: '工程地址',
                name: 'address',
                readOnly: true,
                value: me.potentialBusiness.get('address')
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '业务代表',
                        name: 'telemarketingStaff',
                        itemId: 'textfield-telemarketingStaff',
                        readOnly: true,
                        flex: 1,
                        value: me.potentialBusiness.get('telemarketingStaff')
                    },
                    {
                        xtype: 'button',
                        text: '更改',
                        width: 40,
                        handler: function () {
                            var self = this;
                            var win = Ext.create('Ext.window.Window', {
                                width: 500,
                                height: 300,
                                layout: 'fit',
                                title: '选择业务代表',
                                modal: true,
                                items: [{
                                    xtype: 'checklog-memberlist',
                                    fullList: true
                                }],
                                buttons: [
                                    {
                                        text: '确定',
                                        handler: function () {
                                            var list = win.down('checklog-memberlist'),
                                                rec = list.getSelectionModel().getSelection()[0],
                                                staffField = self.ownerCt.getComponent('textfield-telemarketingStaff'),
                                                staffNameField = self.ownerCt.getComponent('textfield-telemarketingStaffName');

                                            if (rec && rec.get('name')) {
                                                staffField.setValue(rec.get('realname'));
                                                staffNameField.setValue(rec.get('name'));
                                                win.close();
                                            }
                                            else {
                                                showMsg('请选择电销人员！');
                                            }
                                        }
                                    },
                                    {
                                        text: '取消',
                                        handler: function () {
                                            win.close();
                                        }
                                    }
                                ]
                            });
                            win.show();
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        hideLabel: true,
                        name: 'telemarketingStaffName',
                        itemId: 'textfield-telemarketingStaffName',
                        value: me.potentialBusiness.get('telemarketingStaffName')
                    }
                ]
            },
            {
                fieldLabel: '业务来源',
                name: 'source',
                xtype: 'combobox',
                displayField: 'value',
                valueField: 'name',
                editable: false,
                value: 'telemarketing',
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: 'telemarketing',
                            value: '电销'
                        },
                        {
                            name: 'friend',
                            value: '朋友介绍'
                        },
                        {
                            name: 'transferIntroduction',
                            value: '转介绍'
                        },
                        {
                            name: 'constructionSite',
                            value: '工地业务'
                        },
                        {
                            name: 'activityCustomer',
                            value: '活动客户'
                        },
                        {
                            name: 'other',
                            value: '其它'
                        }
                    ]
                })
            },
            {
                fieldLabel: '面积(平方米)',
                name: 'floorArea',
                value: me.potentialBusiness.get('floorArea'),
                maxValue: 999999,
                xtype: 'numberfield',
                minValue: 0
            },
            {
                fieldLabel: '户型',
                name: 'houseType',
                xtype: 'combobox',
                displayField: 'value',
                valueField: 'name',
                editable: false,
                value: '',
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: '1室1厅1卫',value: '1室1厅1卫'},
                        {name: '2室1厅1卫',value: '2室1厅1卫'},
                        {name: '3室1厅1卫',value: '3室1厅1卫'},
                        {name: '3室1厅2卫',value: '3室1厅2卫'},
                        {name: '4室1厅1卫',value: '4室1厅1卫'},
                        {name: '4室1厅2卫',value: '4室1厅2卫'},
                        {name: '4室2厅2卫',value: '4室2厅2卫'},
                        {name: '联排别墅',value: '联排别墅'},
                        {name: '其他',value: '其他'}                       
                    ]
                })
            },
            {
                xtype: 'displayfield',
                fieldLabel: '状态',
                value: '所有状态将转换到业务详细中显示'
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var obj = {},
                        telemarketingStaffName = me.down('[name="telemarketingStaffName"]'),
                        source = me.down('[name="source"]'),
                        houseType = me.down('[name="houseType"]'),
                        floorArea = me.down('[name="floorArea"]');
                    obj['salesmanName'] = telemarketingStaffName.getValue();
                    obj['source'] = source.getRawValue();
                    obj['houseType'] = houseType.getRawValue();
                    obj['floorArea'] = floorArea.getRawValue();
                    Ext.apply(obj, {
                        id: me.potentialBusiness.getId()
                    });
                    Ext.Ajax.request({
                        url: './libs/business.php?action=transferToBusiness',
                        method: 'POST',
                        params: obj,
                        callback: function (opts, success, res){
                            var obj = Ext.decode(res.responseText);
                            if (obj.status == 'successful') {
                                showMsg('转为业务成功！');
                                me.close();
                                me.grid.getStore().reload({
                                    callback: function (recs, ope, success){
                                        if (success) {
                                            var selModel = me.grid.getSelectionModel();
                                            selModel.deselectAll();
                                            selModel.select(me.grid.getStore().indexOf(me.potentialBusiness));
                                        }
                                    }
                                })
                            }
                        }
                    });
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ]

        me.callParent();
    }
})