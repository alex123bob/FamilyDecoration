Ext.define('FamilyDecoration.view.contractmanagement.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.contractmanagement-index',
    requires: [
        'FamilyDecoration.view.progress.ProjectListByCaptain',
        'FamilyDecoration.store.ContractType',
        'FamilyDecoration.view.contractmanagement.ProjectContract',
        'FamilyDecoration.view.contractmanagement.EditContract',
        'FamilyDecoration.view.businessaggregation.BusinessList'
    ],
    layout: 'hbox',
    defaults: {
        height: '100%',
        flex: 1
    },
    initComponent: function () {
        var me = this,
            getRes = function (){
                var contractType = me.getComponent('contractType'),
                    contractTypeSelModel = contractType.getSelectionModel(),
                    contractTypeRec = contractTypeSelModel.getSelection()[0],
                    contractList = me.getComponent('contractList'),
                    contractListSelModel = contractList.getSelectionModel(),
                    contractListRec = contractListSelModel.getSelection()[0],
                    contractDetail = me.getComponent('contractDetail');

                return {
                    type: contractType,
                    typeSelModel: contractTypeSelModel,
                    typeRec: contractTypeRec,
                    list: contractList,
                    listSelModel: contractListSelModel,
                    listRec: contractListRec,
                    detail: contractDetail
                };
            };

        me.items = [
            {
                hideHeaders: true,
                title: '合同种类',
                xtype: 'gridpanel',
                itemId: 'contractType',
                style: {
                    borderRight: '1px solid #cccccc'
                },
                store: Ext.create('FamilyDecoration.store.ContractType', {
                }),
                autoScroll: true,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '合同种类',
                            dataIndex: 'name'
                        }
                    ]
                },
                listeners: {
                    selectionchange: function (cmp, sels, opts){
                        
                    }
                }
            },
            {
                searchFilter: true,
                xtype: 'progress-projectlistbycaptain',
                title: '合同列表',
                itemId: 'contractList',
                flex: 1.3,
                style: {
                    borderRight: '1px solid #cccccc'
                }
            },
            {
                xtype: 'panel',
                title: '合同详情',
                itemId: 'contractDetail',
                flex: 6,
                layout: 'fit',
                items: [
                    // {
                    //     xtype: 'contractmanagement-projectcontract',
                    //     preview: true
                    // }
                ],
                bbar: [
                    {
                        text: '添加',
                        icon: 'resources/img/contract_add.png',
                        handler: function (){
                            var type,
                                project,
                                ready = false,
                                resObj = getRes(),
                                errMsg;
                            if (resObj.typeRec) {
                                if (resObj.typeRec.getId() === '0001') {
                                    type = resObj.typeRec.getId()
                                    ready = true;
                                }
                                else {
                                    if (resObj.listRec && resObj.listRec.get('projectName')) {
                                        project = resObj.listRec;
                                        ready = true;
                                    }
                                    else {
                                        ready = false;
                                        errMsg = '请选择工程';
                                    }
                                }
                            }
                            else {
                                ready = false;
                                errMsg = '缺少合同类型';
                            }

                            if (ready) {
                                // project contract
                                if (type && !project) {
                                    var win = Ext.create('Ext.window.Window', {
                                        width: 500,
                                        height: 400,
                                        layout: 'fit',
                                        title: '选择业务',
                                        maximizable: true,
                                        modal: true,
                                        items: [
                                            {
                                                header: false,
                                                xtype: 'businessaggregation-businesslist',
                                                itemDblClick: Ext.emptyFn
                                            }
                                        ],
                                        buttons: [
                                            {
                                                text: '确定',
                                                handler: function (){
                                                    var businessList = win.down('businessaggregation-businesslist'),
                                                        business = businessList.getSelectionModel().getSelection()[0];
                                                    if (business) {
                                                        win.close();
                                                        var contractWin = Ext.create('FamilyDecoration.view.contractmanagement.EditContract', {
                                                            type: type,
                                                            business: business
                                                        });
                                                        contractWin.show();
                                                    }
                                                    else {
                                                        showMsg('请选择业务');
                                                    }
                                                }
                                            },
                                            {
                                                text: '取消',
                                                handler: function (){
                                                    win.close();
                                                }
                                            }
                                        ]
                                    });
                                    win.show();
                                }
                                else {

                                }
                            }
                            else {
                                showMsg(errMsg);
                            }
                        }
                    },
                    {
                        text: '编辑',
                        icon: 'resources/img/contract_edit.png',
                        handler: function (){
                            
                        }
                    }
                ]
            }
        ];
        
        this.callParent();
    }
});