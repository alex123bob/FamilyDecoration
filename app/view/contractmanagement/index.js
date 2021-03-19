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
            },
            contractSelected;
        
        // load contract according to selected project and contract type.
        function loadContract (){
            var resObj = getRes();
            if (resObj.listRec && resObj.typeRec && resObj.listRec.get('projectName')) {
                // project contract
                if ('0001' === resObj.typeRec.getId()) {
                    ajaxGet('ContractEngineering', false, {
                        projectId: resObj.listRec.getId()
                    }, function (obj){
                        resObj.detail.removeAll();
                        if (obj.data.length > 0) {
                            contractSelected = obj.data[0];
                            resObj.detail.add({
                                xtype: 'contractmanagement-projectcontract',
                                preview: true,
                                contract: obj.data[0]
                            });
                        }
                        else {
                            contractSelected = undefined;
                        }
                    });
                }
            }
            else {
                // do nothing.
            }
        }

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
                    selectionchange: function (selModel, sels, opts){
                        loadContract();
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
                },
                tools: [
                    {
                        type: 'refresh',
                        tooltip: '刷新工程列表',
                        callback: function (){
                            var resObj = getRes(),
                                treeSt = resObj.list.getStore();
                            delete treeSt.proxy.extraParams.captainName;
                            treeSt.proxy.extraParams.action = 'getProjectCaptains';
                            treeSt.reload({
                                node: resObj.list.getRootNode(),
                                callback: function (recs, ope, success){
                                    if (success) {
                                        resObj.listSelModel.deselectAll();
                                    }
                                }
                            });
                        }
                    }
                ],
                listeners: {
                    selectionchange: function (selModel, sels, opts){
                        loadContract();
                    }
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
                                    var contractWin = Ext.create('FamilyDecoration.view.contractmanagement.EditContract', {
                                        type: type,
                                        business: null,
                                        project: resObj.listRec,
                                        callback: function (obj){
                                            if ('successful' === obj.status) {
                                                var treeSt = resObj.list.getStore(),
                                                    contract = obj.data;
                                                delete treeSt.proxy.extraParams.captainName;
                                                treeSt.proxy.extraParams.action = 'getProjectCaptains';
                                                treeSt.reload({
                                                    node: resObj.list.getRootNode(),
                                                    callback: function (recs, ope, success){
                                                        if (success) {
                                                            Ext.each(recs, function (rec, index, self) {
                                                                if (contract.captainName === rec.get('captainName')) {
                                                                    rec.expand(false, function (nodes) {
                                                                        Ext.each(nodes, function (node, i, self){
                                                                            if (node.getId() === contract.projectId) {
                                                                                resObj.listSelModel.select(node);
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                showMsg(obj.errMsg);
                                            }
                                        }
                                    });
                                    contractWin.show();
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
                            var resObj = getRes();
                            if (contractSelected) {
                                var contractWin = Ext.create('FamilyDecoration.view.contractmanagement.EditContract', {
                                    type: resObj.typeRec.getId(),
                                    project: resObj.listRec,
                                    contract: contractSelected,
                                    callback: function (){
                                        resObj.listSelModel.deselectAll();
                                        resObj.listSelModel.select(resObj.listRec);
                                    }
                                });
                                contractWin.show();
                            }
                            else {
                                showMsg('请选择要编辑的合同');
                            }
                        }
                    }
                ]
            }
        ];
        
        this.callParent();
    }
});