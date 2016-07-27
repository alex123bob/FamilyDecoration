Ext.define('FamilyDecoration.view.paymentrequest.EditBelongedItem', {
    extend: 'Ext.window.Window',
    alias: 'widget.paymentrequest-editbelongeditem',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain'
    ],
    width: 600,
    height: 400,
    autoScroll: true,
    layout: 'hbox',
    bodyPadding: 6,
    modal: true,
    title: '归属项目',
    defaults: {
        height: '100%'
    },

    initComponent: function () {
        var me = this;

        function _getRes() {
            var category = me.down('gridpanel'),
                categorySelModel = category.getSelectionModel(),
                bigItem = categorySelModel.getSelection()[0],
                ct = me.down('[name="panel-detailedCt"]'),
                tree = ct.down('progress-projectlistbycaptain'),
                project = tree.getSelectionModel().getSelection()[0],
                detailedGrid = ct.down('[name="gridpanel-detailedGrid"]'),
                detailedSt = detailedGrid.getStore(),
                combobox = ct.down('[name="combobox-internalFeeCategory"]'),
                detailedItem = detailedGrid.getSelectionModel().getSelection()[0];
            return {
                category: category,
                categorySelModel: categorySelModel,
                bigItem: bigItem,
                tree: tree,
                project: project,
                detailedGrid: detailedGrid,
                detailedSt: detailedSt,
                combobox: combobox,
                detailedItem: detailedItem
            }
        }

        me.items = [
            {
                xtype: 'gridpanel',
                flex: 1,
                margin: '0 2 0 0',
                title: '项目大类',
                hideHeaders: true,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '项目大类',
                            dataIndex: 'name'
                        }
                    ]
                },
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    autoLoad: true,
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        },
                        data: [
                            {
                                name: '工程',
                                value: 'project'
                            },
                            {
                                name: '日常采购',
                                value: 'dailyPurchase'
                            },
                            {
                                name: '公司内部管理费用',
                                value: 'internalManagementFee'
                            }
                        ]
                    }
                }),
                listeners: {
                    selectionchange: function (selMode, sels, opts) {
                        var rec = sels[0],
                            resObj = _getRes();
                        resObj.detailedGrid.refresh();
                    }
                }
            },
            {
                xtype: 'panel',
                name: 'panel-detailedCt',
                flex: 3.5,
                layout: 'hbox',
                defaults: {
                    height: '100%'
                },
                items: [
                    {
                        xtype: 'progress-projectlistbycaptain',
                        flex: 2,
                        searchFilter: true,
                        hidden: true,
                        listeners: {
                            selectionchange: function (selModel, sels, opts) {
                                var node = sels[0],
                                    resObj = _getRes();
                                resObj.detailedGrid.refresh();
                            }
                        }
                    },
                    {
                        xtype: 'gridpanel',
                        name: 'gridpanel-detailedGrid',
                        tbar: [
                            {
                                xtype: 'combobox',
                                name: 'combobox-internalFeeCategory',
                                hidden: true,
                                editable: false,
                                displayField: 'name',
                                valueField: 'value',
                                queryMode: 'local',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name', 'value'],
                                    proxy: {
                                        type: 'memory',
                                        reader: {
                                            type: 'json'
                                        }
                                    },
                                    data: [
                                        {
                                            name: '管理费',
                                            value: 'managementFee'
                                        },
                                        {
                                            name: '销售费用',
                                            value: 'salesFee'
                                        },
                                        {
                                            name: '财物费用',
                                            value: 'financialFee'
                                        }
                                    ]
                                }),
                                listeners: {
                                    change: function (combo, newVal, oldVal, opts) {
                                        var resObj = _getRes();
                                        resObj.detailedSt.removeAll();
                                        switch (newVal) {
                                            case 'managementFee':
                                                resObj.detailedSt.add(
                                                    {
                                                        name: '开办费',
                                                        value: 'openFee'
                                                    },
                                                    {
                                                        name: '研究费用',
                                                        value: 'researchFee'
                                                    },
                                                    {
                                                        name: '员工教育津贴',
                                                        value: 'staffEducationAllowance'
                                                    },
                                                    {
                                                        name: '员工福利',
                                                        value: 'staffBonus'
                                                    },
                                                    {
                                                        name: '额外补贴',
                                                        value: 'extraSubsidy'
                                                    }
                                                );
                                                break;
                                            case 'salesFee':
                                                resObj.detailedSt.add(
                                                    {
                                                        name: '差旅费',
                                                        value: 'travelExpense'
                                                    },
                                                    {
                                                        name: '业务费',
                                                        value: 'businessFee'
                                                    },
                                                    {
                                                        name: '广告费用',
                                                        value: 'adFee'
                                                    },
                                                    {
                                                        name: '营销活动经费',
                                                        value: 'marketingActivityFee'
                                                    }
                                                );
                                                break;
                                            case 'financialFee':
                                                resObj.detailedSt.add(
                                                    {
                                                        name: '水电费',
                                                        value: 'waterElectricFee'
                                                    },
                                                    {
                                                        name: '电话费',
                                                        value: 'telephoneFee'
                                                    },
                                                    {
                                                        name: '其他',
                                                        value: 'other'
                                                    }
                                                );
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        ],
                        hideHeaders: true,
                        columns: {
                            defaults: {
                                flex: 1,
                                align: 'center'
                            },
                            items: [
                                {
                                    text: '名称',
                                    dataIndex: 'name'
                                }
                            ]
                        },
                        flex: 3,
                        title: '&nbsp;',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            proxy: {
                                type: 'memory',
                                reader: {
                                    type: 'json'
                                }
                            },
                            autoLoad: false
                        }),
                        refresh: function () {
                            var resObj = _getRes(),
                                st = this.getStore();
                            if (resObj.bigItem) {
                                resObj.detailedGrid.setTitle(resObj.bigItem.get('name'));
                            }
                            else {
                                resObj.detailedGrid.setTitle('&nbsp;');
                            }
                            st.removeAll();
                            if (resObj.bigItem) {
                                switch (resObj.bigItem.get('value')) {
                                    case 'project':
                                        resObj.tree.setVisible(true);
                                        resObj.combobox.setVisible(false);
                                        resObj.combobox.clearValue();
                                        if (resObj.project && resObj.project.get('projectName')) {
                                            st.add(
                                                {
                                                    name: '材料采购',
                                                    value: 'materialOrder'
                                                },
                                                {
                                                    name: '开办费',
                                                    value: 'openFee'
                                                },
                                                {
                                                    name: '税金',
                                                    value: 'taxFee'
                                                },
                                                {
                                                    name: '管理费用',
                                                    value: 'managementFee'
                                                },
                                                {
                                                    name: '业务费',
                                                    value: 'businessFee'
                                                },
                                                {
                                                    name: '其他',
                                                    value: 'other'
                                                }
                                            );
                                        }
                                        else {
                                            st.removeAll();
                                        }
                                        break;
                                    case 'dailyPurchase':
                                        resObj.tree.setVisible(false);
                                        resObj.combobox.setVisible(false);
                                        resObj.combobox.clearValue();
                                        st.add(
                                            {
                                                name: '办公用品',
                                                value: 'officeAppliance'
                                            },
                                            {
                                                name: '日常生活用品',
                                                value: 'dailyArticles'
                                            },
                                            {
                                                name: '办公设备及维护',
                                                value: 'officeDeviceNMaintenance'
                                            },
                                            {
                                                name: '耗材',
                                                value: 'materialConsumption'
                                            },
                                            {
                                                name: '员工就餐费',
                                                value: 'staffDiningFee'
                                            },
                                            {
                                                name: '其他',
                                                value: 'other'
                                            }
                                        );
                                        break;
                                    case 'internalManagementFee':
                                        resObj.tree.setVisible(false);
                                        resObj.combobox.setVisible(true);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else {
                                resObj.tree.setVisible(false);
                                resObj.combobox.setVisible(false);
                                resObj.combobox.clearValue();
                            }
                        }
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {

                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        me.callParent();
    }
});