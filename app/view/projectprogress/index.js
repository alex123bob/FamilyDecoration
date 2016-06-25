Ext.define('FamilyDecoration.view.projectprogress.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.projectprogress-index',
    requires: [
        'FamilyDecoration.store.Project', 'FamilyDecoration.view.progress.EditProject',
        'FamilyDecoration.view.progress.ProjectList', 'FamilyDecoration.view.projectprogress.EditProgress',
        'FamilyDecoration.view.budget.BudgetPanel', 'FamilyDecoration.model.Progress',
        'FamilyDecoration.store.BusinessDetail', 'FamilyDecoration.view.progress.ProjectListByCaptain',
        'FamilyDecoration.view.projectprogress.ProgressTable'
    ],
    // autoScroll: true,
    layout: 'border',
    projectId: undefined,

    initComponent: function () {
        var me = this;

        me.getRes = function () {
            var proPanel = Ext.getCmp('treepanel-projectNameForProjectProgress'),
                pro = proPanel.getSelectionModel().getSelection()[0],
                proSt = proPanel.getStore(),
                proSelModel = proPanel.getSelectionModel(),
                freezeProBtn = Ext.getCmp('tool-frozeProjectForProjectProgress'),
                frozenPanel = Ext.getCmp('treepanel-frozenProjectForProjectProgress'),
                frozenPro = frozenPanel.getSelectionModel().getSelection()[0],
                frozenSt = frozenPanel.getStore(),
                frozenProSelModel = frozenPanel.getSelectionModel(),
                unfreezeProBtn = Ext.getCmp('tool-unfreezeProjectForProjectProgress'),
                progressGrid = Ext.getCmp('gridpanel-projectProgressForProjectProgress'),
                progressSelModel = progressGrid.getSelectionModel(),
                progress = progressSelModel.getSelection()[0],
                progressSt = progressGrid.getStore();

            return {
                proPanel: proPanel,
                pro: pro,
                proSt: proSt,
                proSelModel: proSelModel,
                freezeProBtn: freezeProBtn,
                frozenPanel: frozenPanel,
                frozenPro: frozenPro,
                frozenSt: frozenSt,
                frozenProSelModel: frozenProSelModel,
                unfreezeProBtn: unfreezeProBtn,
                progressGrid: progressGrid,
                progressSelModel: progressSelModel,
                progress: progress,
                progressSt: progressSt
            };
        };

        me.items = [
            {
                hidden: me.projectId ? true : false,
                xtype: 'container',
                region: 'west',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                width: 220,
                margin: '0 1 0 0',
                items: [
                    {
                        xtype: 'progress-projectlistbycaptain',
                        projectId: me.projectId,
                        searchFilter: true,
                        title: '工程项目',
                        id: 'treepanel-projectNameForProjectProgress',
                        name: 'treepanel-projectNameForProjectProgress',
                        getBtns: function () {
                            return {
                                addBtn: Ext.getCmp('button-addProjectForProjectProgress'),
                                editBtn: Ext.getCmp('button-editProjectForProjectProgress'),
                                delBtn: Ext.getCmp('button-deleteProjectForProjectProgress')
                            };
                        },
                        refreshBtns: function () {
                            var resObj = me.getRes(),
                                btnObj = this.getBtns();
                            btnObj.editBtn.setDisabled(!resObj.pro || !resObj.pro.get('projectName'));
                            btnObj.delBtn.setDisabled(!resObj.pro || !resObj.pro.get('projectName'));
                            resObj.freezeProBtn.setDisabled(!resObj.pro || !resObj.pro.get('projectName'));
                            resObj.unfreezeProBtn.setDisabled(!resObj.frozenPro || !resObj.frozenPro.get('projectName'));
                        },
                        tools: [
                            {
                                type: 'gear',
                                disabled: true,
                                hidden: User.isGeneral() || me.projectId ? true : false,
                                id: 'tool-frozeProjectForProjectProgress',
                                name: 'tool-frozeProjectForProjectProgress',
                                tooltip: '工程完工',
                                callback: function () {
                                    var resObj = me.getRes();

                                    Ext.Msg.warning('确定要封存项目"' + resObj.pro.get('projectName') + '"吗？', function (id) {
                                        if (id == 'yes') {
                                            Ext.Ajax.request({
                                                url: './libs/project.php?action=editProject',
                                                method: 'POST',
                                                params: {
                                                    projectId: resObj.pro.get('projectId'),
                                                    isFrozen: 1
                                                },
                                                callback: function (opts, success, res) {
                                                    if (success) {
                                                        var obj = Ext.JSON.decode(res.responseText);
                                                        if (obj.status == 'successful') {
                                                            showMsg('封存成功！');
                                                            resObj.proSt.load({
                                                                node: resObj.pro.parentNode
                                                            });
                                                            resObj.proSelModel.deselectAll();
                                                            resObj.frozenSt.proxy.url = './libs/project.php';
                                                            resObj.frozenSt.proxy.extraParams = {
                                                                action: 'getProjectYears'
                                                            };
                                                            resObj.frozenSt.load({
                                                                node: resObj.frozenPanel.getRootNode(),
                                                                callback: function () {
                                                                    resObj.frozenProSelModel.deselectAll();
                                                                    resObj.progressGrid.initBtn();
                                                                    resObj.progressGrid.refresh();
                                                                    resObj.freezeProBtn.disable();
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        ],
                        bbar: [
                            {
                                hidden: User.isGeneral() || me.projectId ? true : false,
                                text: '添加',
                                id: 'button-addProjectForProjectProgress',
                                name: 'button-addProjectForProjectProgress',
                                icon: './resources/img/add5.png',
                                handler: function () {
                                    var resObj = me.getRes();
                                    var win = Ext.create('FamilyDecoration.view.progress.EditProject', {
                                        proPanel: resObj.proPanel
                                    });
                                    win.show();
                                }
                            },
                            {
                                hidden: User.isGeneral() ? true : false,
                                text: '修改',
                                disabled: true,
                                id: 'button-editProjectForProjectProgress',
                                name: 'button-editProjectForProjectProgress',
                                icon: './resources/img/edit2.png',
                                handler: function () {
                                    var resObj = me.getRes();
                                    var win = Ext.create('FamilyDecoration.view.progress.EditProject', {
                                        project: resObj.pro,
                                        proPanel: resObj.proPanel
                                    });
                                    win.show();
                                }
                            },
                            {
                                hidden: User.isGeneral() ? true : false,
                                text: '删除',
                                disabled: true,
                                icon: './resources/img/delete3.png',
                                id: 'button-deleteProjectForProjectProgress',
                                name: 'button-deleteProjectForProjectProgress',
                                handler: function () {
                                    var resObj = me.getRes();

                                    Ext.Msg.warning('【注意】删除项目会删除项目下所有的进度内容。<br />确定要删除项目"' + resObj.pro.get('projectName') + '"吗？', function (id) {
                                        if (id == 'yes') {
                                            Ext.Ajax.request({
                                                url: './libs/project.php?action=delProject',
                                                method: 'POST',
                                                params: {
                                                    projectId: resObj.pro.get('projectId')
                                                },
                                                callback: function (opts, success, res) {
                                                    if (success) {
                                                        var obj = Ext.JSON.decode(res.responseText);
                                                        if (obj.status == 'successful') {
                                                            panel.getStore().load({
                                                                node: resObj.pro.parentNode.parentNode
                                                            });
                                                            resObj.proSelModel.deselectAll();
                                                            Ext.Ajax.request({
                                                                url: './libs/progress.php?action=deleteProgressByProjectId',
                                                                method: 'POST',
                                                                params: {
                                                                    projectId: resObj.pro.getId()
                                                                },
                                                                callback: function (opts, success, res) {
                                                                    if (success) {
                                                                        var obj = Ext.decode(res.responseText);
                                                                        if (obj.status == 'successful') {
                                                                            showMsg('删除成功！');
                                                                            resObj.progressGrid.refresh();
                                                                            resObj.progressGrid.initBtn();
                                                                        }
                                                                        else {
                                                                            showMsg(obj.errMsg);
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            showMsg(obj.errMsg);
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        ],
                        flex: 4,
                        width: '100%',
                        autoScroll: true,
                        listeners: {
                            itemclick: function (view, rec) {
                                return rec.get('projectName') ? true : false;
                            },
                            selectionchange: function (selModel, sels, opts) {
                                var resObj = me.getRes();
                                resObj.proPanel.refreshBtns();
                                resObj.progressGrid.initBtn();
                                resObj.progressGrid.refresh(resObj.pro);
                            }
                        }
                    },
                    {
                        xtype: 'progress-projectlist',
                        title: '完工工地',
                        id: 'treepanel-frozenProjectForProjectProgress',
                        name: 'treepanel-frozenProjectForProjectProgress',
                        loadAll: false,
                        hidden: me.projectId || User.isGeneral() ? true : false,
                        tools: [
                            {
                                type: 'gear',
                                disabled: true,
                                id: 'tool-unfreezeProjectForProjectProgress',
                                name: 'tool-unfreezeProjectForProjectProgress',
                                tooltip: '解封当前项目',
                                callback: function () {
                                    var resObj = me.getRes();

                                    Ext.Msg.warning('确定要解封项目"' + resObj.frozenPro.get('projectName') + '"吗？', function (id) {
                                        if (id == 'yes') {
                                            Ext.Ajax.request({
                                                url: './libs/project.php?action=editProject',
                                                method: 'POST',
                                                params: {
                                                    projectId: resObj.frozenPro.get('projectId'),
                                                    isFrozen: 0
                                                },
                                                callback: function (opts, success, res) {
                                                    if (success) {
                                                        var obj = Ext.JSON.decode(res.responseText),
                                                            extraParams = {};
                                                        if (obj.status == 'successful') {
                                                            showMsg('解封成功！');
                                                            resObj.proSt.proxy.url = './libs/project.php';
                                                            extraParams = {
                                                                action: 'getProjectCaptains'
                                                            };
                                                            if (User.isProjectStaff()) {
                                                                Ext.apply(extraParams, {
                                                                    captainName: User.getName()
                                                                });
                                                            }
                                                            resObj.proSt.proxy.extraParams = extraParams;
                                                            resObj.proSt.load({
                                                                node: resObj.proPanel.getRootNode(),
                                                                callback: function () {
                                                                    resObj.proPanel.getSelectionModel().deselectAll();
                                                                    resObj.progressGrid.initBtn();
                                                                    resObj.progressGrid.refresh();
                                                                    resObj.unfreezeProBtn.disable();
                                                                }
                                                            });
                                                            resObj.frozenSt.proxy.url = './libs/project.php';
                                                            resObj.frozenSt.proxy.extraParams = {
                                                                action: 'getProjectYears'
                                                            };
                                                            resObj.frozenSt.load({
                                                                node: resObj.frozenPro.parentNode.parentNode,
                                                                callback: function () {

                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    });
                                }
                            }
                        ],
                        isForFrozen: true,
                        flex: 2,
                        width: '100%',
                        autoScroll: true,
                        listeners: {
                            selectionchange: function (selModel, sels, opts) {
                                var rec = sels[0],
                                    unfreezeProjectBtn = Ext.getCmp('tool-unfreezeProjectForProjectProgress');
                                if (!rec) {
                                    unfreezeProjectBtn.disable();
                                }
                                else {
                                    unfreezeProjectBtn.setDisabled(!rec.get('projectName'));
                                }
                            }
                        }
                    }
                ]
            },
            {
                region: 'center',
                xtype: 'projectprogress-progresstable',
                id: 'gridpanel-projectProgressForProjectProgress',
                name: 'gridpanel-projectProgressForProjectProgress',
                title: '工程进度查看',
                refresh: function () {
                    var resObj = me.getRes(),
                        fieldObj = this.getFields(),
                        endTime;
                    if (resObj.pro && resObj.pro.get('projectName')) {
                        endTime = resObj.pro.get('period').split(':')[1]
                        resObj.progressSt.load({
                            params: {
                                action: 'ProjectProgress.getItems',
                                projectId: resObj.pro.getId()
                            }
                        });
                        for (var key in fieldObj) {
                            if (fieldObj.hasOwnProperty(key)) {
                                var field = fieldObj[key];
                                field.setValue(resObj.pro.get(key));
                            }
                        }
                        if (endTime && (new Date(endTime.replace(/-/g, '/')) < new Date())) {
                            fieldObj.period.markInvalid('项目到期');
                        }
                        else {
                            fieldObj.period.clearInvalid();
                        }
                    }
                    else {
                        resObj.progressSt.loadData([]);
                        for (var key in fieldObj) {
                            if (fieldObj.hasOwnProperty(key)) {
                                var field = fieldObj[key];
                                field.setValue('');
                                if (key === 'period') {
                                    field.clearInvalid();
                                }
                            }
                        }
                    }
                },
                getFields: function () {
                    return {
                        captain: Ext.getCmp('textfield-captainForProjectProgress'),
                        supervisor: Ext.getCmp('textfield-supervisorForProjectProgress'),
                        salesman: Ext.getCmp('textfield-salesmanForProjectProgress'),
                        designer: Ext.getCmp('textfield-designerForProjectProgress'),
                        period: Ext.getCmp('textfield-periodForProjectProgress')
                    };
                },
                getBtns: function () {
                    return {
                        editBtn: Ext.getCmp('button-editProgressForProjectProgress'),
                        delBtn: Ext.getCmp('button-deleteProgressForProjectProgress'),
                        chartBtn: Ext.getCmp('button-showProjectChartForProjectProgress'),
                        budgetBtn: Ext.getCmp('button-showBudgetForProjectProgress'),
                        planBtn: Ext.getCmp('button-showProjectPlanForProjectProgress'),
                        editHeadInfoBtn: Ext.getCmp('button-editTopInfoForProjectProgress'),
                        checkBusinessBtn: Ext.getCmp('tool-originalBusinessForProjectProgress')
                    }
                },
                initBtn: function () {
                    var resObj = me.getRes(),
                        btnObj = this.getBtns();
                    if (resObj.pro && resObj.pro.get('projectName')) {
                        btnObj.chartBtn.enable();
                        btnObj.budgetBtn.enable();
                        btnObj.editHeadInfoBtn.enable();
                        btnObj.checkBusinessBtn.enable();
                        btnObj.planBtn.enable();
                        btnObj.editBtn.setDisabled(!resObj.progress || !resObj.progress.get('isEditable'));
                        btnObj.delBtn.setDisabled(!resObj.progress || !resObj.progress.get('isEditable'));
                    }
                    else {
                        for (var key in btnObj) {
                            if (btnObj.hasOwnProperty(key)) {
                                var btn = btnObj[key];
                                btn.disable();
                            }
                        }
                    }
                },
                getHeadFields: function () {
                    return {
                        captain: Ext.getCmp('textfield-captainForProjectProgress'),
                        supervisor: Ext.getCmp('textfield-supervisorForProjectProgress'),
                        salesman: Ext.getCmp('textfield-salesmanForProjectProgress'),
                        designer: Ext.getCmp('textfield-designerForProjectProgress'),
                        period: Ext.getCmp('textfield-periodForProjectProgress')
                    }
                },
                tbar: Ext.create('Ext.toolbar.Toolbar', {
                    enableOverflow: true,
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'textfield-captainForProjectProgress',
                            id: 'textfield-captainForProjectProgress',
                            labelWidth: 70,
                            width: 140,
                            readOnly: true,
                            fieldLabel: '项目经理'
                        },
                        {
                            xtype: 'textfield',
                            name: 'textfield-supervisorForProjectProgress',
                            id: 'textfield-supervisorForProjectProgress',
                            labelWidth: 60,
                            width: 140,
                            readOnly: true,
                            fieldLabel: '项目监理'
                        },
                        {
                            xtype: 'textfield',
                            name: 'textfield-salesmanForProjectProgress',
                            id: 'textfield-salesmanForProjectProgress',
                            labelWidth: 44,
                            width: 120,
                            readOnly: true,
                            fieldLabel: '业务员'
                        },
                        {
                            xtype: 'textfield',
                            name: 'textfield-designerForProjectProgress',
                            id: 'textfield-designerForProjectProgress',
                            labelWidth: 44,
                            width: 120,
                            readOnly: true,
                            fieldLabel: '设计师'
                        },
                        {
                            xtype: 'textfield',
                            name: 'textfield-periodForProjectProgress',
                            id: 'textfield-periodForProjectProgress',
                            labelWidth: 60,
                            width: 220,
                            readOnly: true,
                            fieldLabel: '项目工期'
                        }
                    ]
                }),
                tools: [
                    {
                        id: 'tool-originalBusinessForProjectProgress',
                        name: 'tool-originalBusinessForProjectProgress',
                        type: 'down',
                        tooltip: '查看原始业务',
                        disabled: true,
                        callback: function () {
                            var resObj = me.getRes();

                            if (resObj.pro.get('businessId')) {
                                var win = Ext.create('Ext.window.Window', {
                                    title: '原始业务数据',
                                    layout: 'fit',
                                    modal: true,
                                    width: 500,
                                    height: 400,
                                    tbar: [
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '客户姓名',
                                            name: 'displayfield-customerForProjectProgress',
                                            id: 'displayfield-customerForProjectProgress'
                                        },
                                        '->',
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '业务来源',
                                            name: 'displayfield-sourceForProjectProgress',
                                            id: 'displayfield-sourceForProjectProgress'
                                        }
                                    ],
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            id: 'gridpanel-historyBusinessDetailForProjectProgress',
                                            name: 'gridpanel-historyBusinessDetailForProjectProgress',
                                            autoScroll: true,
                                            hideHeaders: true,
                                            columns: [
                                                {
                                                    text: '信息',
                                                    flex: 1,
                                                    dataIndex: 'content',
                                                    renderer: function (val, meta, rec) {
                                                        return val.replace(/\n/ig, '<br />');
                                                    }
                                                }
                                            ],
                                            store: Ext.create('FamilyDecoration.store.BusinessDetail', {
                                                autoLoad: true,
                                                proxy: {
                                                    type: 'rest',
                                                    url: './libs/business.php?action=getBusinessDetails',
                                                    reader: {
                                                        type: 'json'
                                                    },
                                                    extraParams: {
                                                        businessId: resObj.pro.get('businessId')
                                                    }
                                                }
                                            })
                                        }
                                    ],
                                    listeners: {
                                        show: function (win) {
                                            Ext.Ajax.request({
                                                url: './libs/business.php?action=getBusinessById',
                                                method: 'GET',
                                                params: {
                                                    businessId: resObj.pro.get('businessId')
                                                },
                                                callback: function (opts, success, res) {
                                                    if (success) {
                                                        var obj = Ext.decode(res.responseText),
                                                            customer = Ext.getCmp('displayfield-customerForProjectProgress'),
                                                            source = Ext.getCmp('displayfield-sourceForProjectProgress');
                                                        if (obj.length > 0) {
                                                            customer.setValue(obj[0]['customer']);
                                                            source.setValue(obj[0]['source']);
                                                        }
                                                        else {
                                                            showMsg(obj.errMsg);
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    }
                                });

                                win.show();
                            }
                            else {
                                showMsg('没有原始业务！');
                            }
                        }
                    }
                ],
                bbar: [
                    {
                        hidden: User.isGeneral() ? true : false,
                        text: '修改',
                        id: 'button-editProgressForProjectProgress',
                        name: 'button-editProgressForProjectProgress',
                        icon: './resources/img/edit.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            var win = Ext.create('FamilyDecoration.view.projectprogress.EditProgress', {
                                project: resObj.pro,
                                progress: resObj.progress,
                                progressGrid: resObj.progressGrid
                            });
                            win.show();
                        }
                    },
                    {
                        hidden: User.isGeneral() ? true : false,
                        text: '删除',
                        id: 'button-deleteProgressForProjectProgress',
                        name: 'button-deleteProgressForProjectProgress',
                        icon: './resources/img/delete.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                        }
                    },
                    {
                        text: '查看图库',
                        id: 'button-showProjectChartForProjectProgress',
                        name: 'button-showProjectChartForProjectProgress',
                        icon: './resources/img/gallery.png',
                        hidden: me.projectId ? true : false,
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes();
                            if (resObj.pro.get('hasChart') == '1') {
                                window.pro = {
                                    captainName: resObj.pro.get('captainName'),
                                    pid: resObj.pro.getId()
                                };

                                changeMainCt('chart-index');
                            }
                            else {
                                showMsg('该工程没有图库！');
                            }
                        }
                    },
                    {
                        hidden: User.isGeneral() ? true : false,
                        text: '查看预算',
                        icon: './resources/img/preview2.png',
                        id: 'button-showBudgetForProjectProgress',
                        name: 'button-showBudgetForProjectProgress',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes(),
                                budgets = resObj.pro.get('budgets');

                            if (budgets && budgets.length > 0) {
                                Ext.each(budgets, function (budget, index, obj) {
                                    Ext.apply(budget, {
                                        projectName: resObj.pro.get('projectName')
                                    });
                                });
                                var listWin = Ext.create('Ext.window.Window', {
                                    title: resObj.pro.get('projectName') + '-预算列表',
                                    width: 600,
                                    modal: true,
                                    height: 400,
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'gridpanel',
                                            autoScroll: true,
                                            columns: [
                                                {
                                                    text: '项目名称',
                                                    dataIndex: 'projectName',
                                                    flex: 1
                                                },
                                                {
                                                    text: '客户名称',
                                                    dataIndex: 'custName',
                                                    flex: 1
                                                },
                                                {
                                                    text: '预算名称',
                                                    dataIndex: 'budgetName',
                                                    flex: 2
                                                },
                                                {
                                                    text: '户型大小',
                                                    dataIndex: 'areaSize',
                                                    flex: 1
                                                }
                                            ],
                                            store: Ext.create('FamilyDecoration.store.Budget', {
                                                data: budgets,
                                                autoLoad: false
                                            })
                                        }
                                    ],
                                    buttons: [
                                        {
                                            text: '查看预算',
                                            handler: function () {
                                                var grid = listWin.down('gridpanel'),
                                                    st = grid.getStore(),
                                                    rec = grid.getSelectionModel().getSelection()[0];
                                                if (rec) {
                                                    var win = window.open('./fpdf/index2.php?action=view&budgetId=' + rec.getId(), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                                }
                                                else {
                                                    showMsg('请选择预算！');
                                                }
                                            }
                                        },
                                        {
                                            text: '取消',
                                            handler: function () {
                                                listWin.close();
                                            }
                                        }
                                    ]
                                });
                                listWin.show();
                            }
                            else {
                                showMsg('没有预算！');
                            }
                        }
                    },
                    {
                        hidden: User.isGeneral() || me.projectId ? true : false,
                        text: '查看计划',
                        id: 'button-showProjectPlanForProjectProgress',
                        name: 'button-showProjectPlanForProjectProgress',
                        icon: './resources/img/plan.png',
                        disabled: true,
                        handler: function () {
                            var resObj = me.getRes(),
                                year, month, pid, captainName;
                            if (resObj.pro && resObj.pro.get('projectName')) {
                                Ext.Ajax.request({
                                    url: './libs/plan.php?action=getPlanByProjectId&projectId=' + resObj.pro.getId(),
                                    method: 'GET',
                                    callback: function (opts, success, res) {
                                        if (success) {
                                            var arr = Ext.decode(res.responseText);
                                            if (arr.length > 0) {

                                                window.pro = {
                                                    captainName: resObj.pro.get('captainName'),
                                                    pid: resObj.pro.getId()
                                                };

                                                changeMainCt('planmaking-index');
                                            }
                                            else {
                                                showMsg('没有对应计划!');
                                            }
                                        }
                                    }
                                });
                            }
                            else {
                                showMsg('请选择工程！');
                            }
                        }
                    },
                    {
                        hidden: !(User.isAdmin() || User.isProjectManager() || User.isProjectStaff()),
                        text: '编辑置顶信息',
                        icon: './resources/img/edit4.png',
                        disabled: true,
                        id: 'button-editTopInfoForProjectProgress',
                        name: 'button-editTopInfoForProjectProgress',
                        handler: function () {
                            var resObj = me.getRes(),
                                treePanel = resObj.proPanel,
                                st = resObj.proSt,
                                pro = resObj.pro;
                            var win = Ext.create('Ext.window.Window', {
                                title: '编辑置顶信息',
                                width: 500,
                                height: 300,
                                layout: 'form',
                                modal: true,
                                defaultType: 'textfield',
                                items: [
                                    {
                                        xtype: 'fieldset',
                                        collasible: false,
                                        layout: 'anchor',
                                        title: '工期',
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                xtype: 'datefield',
                                                fieldLabel: '开始',
                                                editable: false,
                                                flex: 1,
                                                labelWidth: 40,
                                                name: 'projectStartTime',
                                                allowBlank: false,
                                                value: pro ? pro.get('period').split(':')[0] : ''
                                            },
                                            {
                                                margin: '0 0 0 2px',
                                                xtype: 'datefield',
                                                fieldLabel: '结束',
                                                editable: false,
                                                flex: 1,
                                                labelWidth: 40,
                                                name: 'projectEndTime',
                                                allowBlank: false,
                                                value: pro ? pro.get('period').split(':')[1] : 0
                                            }
                                        ]
                                    },
                                    {
                                        fieldLabel: '项目经理',
                                        name: 'projectCaptain',
                                        allowBlank: false,
                                        value: pro ? pro.get('captain') : ''
                                    },
                                    {
                                        fieldLabel: '监理',
                                        name: 'projectSupervisor',
                                        allowBlank: false,
                                        value: pro ? pro.get('supervisor') : ''
                                    },
                                    {
                                        fieldLabel: '业务员',
                                        name: 'projectSalesman',
                                        allowBlank: false,
                                        value: pro ? pro.get('salesman') : ''
                                    },
                                    {
                                        fieldLabel: '设计师',
                                        name: 'projectDesigner',
                                        allowBlank: false,
                                        value: pro ? pro.get('designer') : ''
                                    }
                                ],
                                buttons: [
                                    {
                                        text: '确定',
                                        handler: function () {
                                            var start = win.down('[name="projectStartTime"]'),
                                                end = win.down('[name="projectEndTime"]'),
                                                captain = win.down('[name="projectCaptain"]'),
                                                supervisor = win.down('[name="projectSupervisor"]'),
                                                salesman = win.down('[name="projectSalesman"]'),
                                                designer = win.down('[name="projectDesigner"]'),
                                                gridPanel = Ext.getCmp('gridpanel-projectProgressForProjectProgress');
                                            Ext.Ajax.request({
                                                url: './libs/project.php?action=editProjectHeadInfo',
                                                method: 'POST',
                                                params: {
                                                    projectId: pro.getId(),
                                                    period: Ext.Date.format(start.getValue(), 'Y-m-d') + ':' + Ext.Date.format(end.getValue(), 'Y-m-d'),
                                                    captain: captain.getValue(),
                                                    supervisor: supervisor.getValue(),
                                                    salesman: salesman.getValue(),
                                                    designer: designer.getValue()
                                                },
                                                callback: function (opts, success, res) {
                                                    if (success) {
                                                        var obj = Ext.decode(res.responseText);
                                                        if (obj.status == 'successful') {
                                                            st.proxy.url = './libs/project.php';
                                                            st.proxy.extraParams = {
                                                                action: 'getProjectsByCaptainName',
                                                                captainName: pro.get('captainName')
                                                            };
                                                            st.load({
                                                                node: pro.parentNode,
                                                                callback: function (recs, ope, success) {
                                                                    if (success) {
                                                                        var newPro;
                                                                        for (var i = 0; i < recs.length; i++) {
                                                                            if (recs[i].getId() == pro.getId()) {
                                                                                newPro = recs[i];
                                                                                break;
                                                                            }
                                                                        }
                                                                        treePanel.getSelectionModel().deselectAll()
                                                                        treePanel.getSelectionModel().select(newPro);
                                                                        win.close();
                                                                        showMsg('编辑成功！');
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            Ext.Msg.error(obj.errMsg);
                                                        }
                                                    }
                                                }
                                            })
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
                    }
                ],
                listeners: {
                    selectionchange: function (view, sels) {
                        var resObj = me.getRes();
                        resObj.progressGrid.initBtn();
                    },
                    cellclick: function (table, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
                        // if (User.isAdmin() || User.isSupervisor()) {
                        // if (4 == cellIndex) {
                        //     var win = Ext.create('Ext.window.Window', {
                        //         title: '添加监理意见',
                        //         width: 500,
                        //         height: 200,
                        //         modal: true,
                        //         layout: 'fit',
                        //         items: [
                        //             {
                        //                 id: 'textarea-progresscommentForProjectProgress',
                        //                 name: 'textarea-progresscommentForProjectProgress',
                        //                 xtype: 'textarea',
                        //                 value: rec.get('comments')
                        //             }
                        //         ],
                        //         buttons: [{
                        //             text: '添加',
                        //             handler: function () {
                        //                 var resObj = me.getRes(),
                        //                     pro = resObj.pro,
                        //                     textarea = Ext.getCmp('textarea-progresscommentForProjectProgress');
                        //                 Ext.Ajax.request({
                        //                     url: './libs/progress.php?action=editProgress',
                        //                     method: 'POST',
                        //                     params: {
                        //                         id: rec.getId(),
                        //                         comments: textarea.getValue()
                        //                     },
                        //                     callback: function (opts, success, res) {
                        //                         if (success) {
                        //                             var obj = Ext.decode(res.responseText),
                        //                                 progressPanel = resObj.progressGrid;
                        //                             if (obj.status == 'successful') {
                        //                                 win.close();
                        //                                 showMsg('监理意见添加成功！');
                        //                                 progressPanel.refresh(pro);
                        //                                 var title = '监理意见添加提醒',
                        //                                     content = User.getRealName() + '为项目"' + pro.get('projectName') + '"添加监理意见，内容为:' + textarea.getValue();
                        //                                 // send SMS
                        //                                 Ext.Ajax.request({
                        //                                     url: './libs/user.php?action=getuserphone',
                        //                                     method: 'GET',
                        //                                     params: {
                        //                                         name: pro.get('captainName')
                        //                                     },
                        //                                     callback: function (opts, success, res) {
                        //                                         if (success) {
                        //                                             var obj = Ext.decode(res.responseText);
                        //                                             if ('successful' == obj.status) {
                        //                                                 sendSMS(User.getName(), pro.get('captainName'), obj['phone'], content);
                        //                                             }
                        //                                         }
                        //                                     }
                        //                                 });
                        //                                 // send Email
                        //                                 Ext.Ajax.request({
                        //                                     url: './libs/user.php?action=view',
                        //                                     method: 'GET',
                        //                                     callback: function (opts, success, res) {
                        //                                         if (success) {
                        //                                             var arr = Ext.decode(res.responseText);
                        //                                             for (var i = arr.length - 1; i >= 0; i--) {
                        //                                                 var el = arr[i];
                        //                                                 if (el.level == '001-001' || el.level == '001-002'
                        //                                                     || el.level == '003-001' || el.name == pro.get('captainName')) {
                        //                                                     sendMail(el.name, el.mail, title, content);
                        //                                                 }
                        //                                             }
                        //                                         }
                        //                                     }
                        //                                 });
                        //                             }
                        //                         }
                        //                     }
                        //                 })
                        //             }
                        //         }, {
                        //                 text: '取消',
                        //                 handler: function () {
                        //                     win.close();
                        //                 }
                        //             }]
                        //     });
                        //     win.show();
                        // }
                        // }
                    },
                    afterrender: function (grid, opts) {
                        var view = grid.getView();
                        var tip = Ext.create('Ext.tip.ToolTip', {
                            target: view.el,
                            delegate: view.cellSelector,
                            trackMouse: true,
                            renderTo: Ext.getBody(),
                            listeners: {
                                beforeshow: function (tip) {
                                    var gridColumns = view.getGridColumns();
                                    if (tip.triggerElement.cellIndex == 4 && (User.isAdmin() || User.isSupervisor())) {
                                        tip.update('请点击栏目，编辑监理意见');
                                    }
                                    else {
                                        return false;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        ];

        this.callParent();
    }
});