Ext.define('FamilyDecoration.view.budget.EditBudget', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.budget-editbudget',
    requires: ['FamilyDecoration.store.BudgetItem'],

    width: 800,
    height: 500,
    autoScroll: true,
    budget: undefined,
    html: '<iframe id="exportFrameInProject"  src="javascript:void(0);" style="display:none"></iframe>',
    header: false,

    initComponent: function() {
        var me = this;

        var store = Ext.create('FamilyDecoration.store.BudgetItem', {

        });

        me.items = [{
            xtype: 'fieldcontainer',
            layout: 'hbox',
            items: [{
                width: 80,
                height: 60,
                xtype: 'image',
                margin: '0 0 0 250',
                src: './resources/img/logo.jpg'
            }, {
                xtype: 'displayfield',
                margin: '0 0 0 20',
                value: '佳诚装饰室内装修装饰工程&nbsp;预算单',
                fieldStyle: {
                    fontFamily: '黑体',
                    fontSize: '24px',
                    lineHeight: '60px'
                },
                width: 700,
                height: '100%'
            }],
            width: '100%',
            height: 60
        }, {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: '客户名称',
                name: 'displayfield-custName',
                flex: 1,
                value: me.budget ? me.budget.custName : ''
            }, {
                xtype: 'displayfield',
                fieldLabel: '工程地址',
                name: 'displayfield-projectName',
                flex: 1,
                value: me.budget ? me.budget.projectName : ''
            }],
            width: '100%',
            height: 30
        }, {
            xtype: 'gridpanel',
            store: store,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1,
                    listeners: {
                        beforeedit: function(editor, e) {
                            var rec = e.record;
                            // 小计|空行
                            if (rec.get('itemUnit') == '') {
                                return false;
                            }
                            // 效果图编辑数量|设计费百分比|税金百分比
                            if ('POR'.indexOf(rec.get('itemCode')) != -1) {
                                return true;
                            }
                            // 工程直接费|管理费|工程总造价
                            else if ('NQS'.indexOf(rec.get('itemCode')) != -1) {
                                return false;
                            } else if (rec.get('itemCode') && rec.get('itemUnit') && rec.get('itemName')) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        edit: function(editor, e) {
                            Ext.suspendLayouts();
                            var p = {};
                            if (e.field == 'itemAmount') {
                                p = {
                                    itemAmount: e.value
                                }
                            } else if (e.field == 'remark') {
                                p = {
                                    remark: e.value
                                };
                            }
                            if (e.value != e.originalValue) {
                                Ext.apply(p, {
                                    budgetItemId: e.record.getId()
                                });
                                Ext.Ajax.request({
                                    url: './libs/budget.php?action=editItem',
                                    params: p,
                                    method: 'POST',
                                    callback: function(opts, success, res) {
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if (obj.status == 'successful') {
                                                me.down('grid').getStore().reload();
                                            }
                                        }
                                    }
                                });
                            }

                            e.record.commit();
                            editor.completeEdit();
                            Ext.resumeLayouts();
                        }
                    }
                })
            ],
            columns: [{
                text: '编号',
                dataIndex: 'itemCode',
                flex: 0.5,
                draggable: false,
                align: 'center',
                sortable: false
            }, {
                text: '项目名称',
                dataIndex: 'itemName',
                flex: 1,
                draggable: false,
                align: 'center',
                sortable: false
            }, {
                text: '单位',
                dataIndex: 'itemUnit',
                flex: 0.5,
                draggable: false,
                align: 'center',
                sortable: false
            }, {
                text: '数量',
                dataIndex: 'itemAmount',
                flex: 0.5,
                draggable: false,
                align: 'center',
                sortable: false,
                editor: User.isAdmin() || User.isDesignStaff() || User.isDesignManager() ? {
                    xtype: 'textfield',
                    allowBlank: false
                } : null,
                renderer: function(val, meta, rec) {
                    return rec.raw.itemAmount;
                }
            }, {
                text: '主材',
                draggable: false,
                align: 'center',
                columns: [{
                    text: '单价',
                    dataIndex: 'mainMaterialPrice',
                    draggable: false,
                    flex: 1,
                    sortable: false,
                    align: 'center',
                    renderer: function(val, meta, rec) {
                        return rec.raw.mainMaterialPrice;
                    }
                }, {
                    text: '总价',
                    flex: 1,
                    draggable: false,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'mainMaterialTotalPrice',
                    renderer: function(val, meta, rec) {
                        return rec.raw.mainMaterialTotalPrice;
                    }
                }]
            }, {
                text: '辅材',
                draggable: false,
                align: 'center',
                columns: [{
                    text: '单价',
                    dataIndex: 'auxiliaryMaterialPrice',
                    draggable: false,
                    flex: 1,
                    sortable: false,
                    align: 'center',
                    renderer: function(val, meta, rec) {
                        return rec.raw.auxiliaryMaterialPrice;
                    }
                }, {
                    text: '总价',
                    flex: 1,
                    draggable: false,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'auxiliaryMaterialTotalPrice',
                    renderer: function(val, meta, rec) {
                        return rec.raw.auxiliaryMaterialTotalPrice;
                    }
                }]
            }, {
                text: '人工',
                draggable: false,
                align: 'center',
                columns: [{
                    text: '单价',
                    dataIndex: 'manpowerPrice',
                    draggable: false,
                    flex: 1,
                    sortable: false,
                    align: 'center',
                    renderer: function(val, meta, rec) {
                        return rec.raw.manpowerPrice;
                    }
                }, {
                    text: '总价',
                    flex: 1,
                    draggable: false,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'manpowerTotalPrice',
                    renderer: function(val, meta, rec) {
                        return rec.raw.manpowerTotalPrice;
                    }
                }]
            }, {
                text: '机械',
                draggable: false,
                align: 'center',
                columns: [{
                    text: '单价',
                    dataIndex: 'machineryPrice',
                    draggable: false,
                    flex: 1,
                    sortable: false,
                    align: 'center',
                    renderer: function(val, meta, rec) {
                        return rec.raw.machineryPrice;
                    }
                }, {
                    text: '总价',
                    flex: 1,
                    draggable: false,
                    align: 'center',
                    sortable: false,
                    dataIndex: 'machineryTotalPrice',
                    renderer: function(val, meta, rec) {
                        return rec.raw.machineryTotalPrice;
                    }
                }]
            }, {
                text: '损耗',
                draggable: false,
                align: 'center',
                columns: [{
                    text: '单价',
                    dataIndex: 'lossPercent',
                    draggable: false,
                    flex: 1,
                    sortable: false,
                    align: 'center',
                    renderer: function(val, meta, rec) {
                        return rec.raw.lossPercent;
                    }
                }]
            }, {
                text: '备注',
                align: 'center',
                dataIndex: 'remark',
                flex: 1,
                draggable: false,
                sortable: false,
                editor: User.isAdmin() || User.isDesignStaff() || User.isDesignManager() ? {
                    xtype: 'textarea',
                    allowBlank: false
                } : null
            }],
            listeners: {
                beforeitemcontextmenu: User.isAdmin() || User.isDesignStaff() || User.isDesignManager() ? function(view, rec, item, index, e) {
                    var menu;
                    e.preventDefault();
                    // 小计|空白行
                    if (rec.get('itemCode') == '' && rec.get('itemUnit') == '') {
                        // 空白行
                        if (rec.get('itemName') == '') {
                            menu = Ext.create('Ext.menu.Menu', {
                                width: 100,
                                floating: true,
                                items: [{
                                    text: '添加新项',
                                    handler: function (){
                                        var grid = me.down('gridpanel'),
                                            st = grid.getStore(),
                                            arr;
                                        arr = Ext.Array.filter(st.data.items, function (item, index, arrSelf){
                                            return !(item.get('basicItemId') && item.get('basicSubItemId') == 'NULL');
                                        });
                                        var win = Ext.create('Ext.window.Window', {
                                            title: '添加基础项目',
                                            width: 500,
                                            height: 350,
                                            layout: 'hbox',
                                            modal: true,
                                            items: [
                                                {
                                                    xtype: 'gridpanel',
                                                    title: '大类名称',
                                                    header: false,
                                                    height: 250,
                                                    columns: [{
                                                        text: '大类',
                                                        dataIndex: 'itemName',
                                                        flex: 1
                                                    }],
                                                    store: Ext.create('FamilyDecoration.store.BasicItem', {
                                                        autoLoad: true,
                                                        filters: [
                                                            function (rec) {
                                                                var flag = false;
                                                                for (var i = 0; i < arr.length; i++) {
                                                                    if (arr[i].get('basicItemId') == rec.get('itemId')) {
                                                                        flag = true;
                                                                        break;
                                                                    }
                                                                }
                                                                return !flag;
                                                            }
                                                        ]
                                                    }),
                                                    flex: 1,
                                                    autoScroll: true,
                                                    listeners: {
                                                        selectionchange: function (selModel, recs, opts){
                                                            var mainGrid = this,
                                                                mainSt = mainGrid.getStore(),
                                                                subGrid = mainGrid.nextSibling(),
                                                                subSt = subGrid.getStore(),
                                                                rec = recs[0],
                                                                mainId;
                                                            if (rec) {
                                                                mainId = rec.getId();
                                                                subSt.getProxy().extraParams = {
                                                                    parentId: mainId
                                                                };
                                                                subSt.load();
                                                            }
                                                            else {
                                                                subSt.removeAll();
                                                            }
                                                        }
                                                    }
                                                }, 
                                                {
                                                    xtype: 'gridpanel',
                                                    title: '小类名称',
                                                    header: false,
                                                    autoScroll: true,
                                                    height: 250,
                                                    selType: 'checkboxmodel',
                                                    columns: [{
                                                        text: '项目',
                                                        dataIndex: 'subItemName',
                                                        flex: 1
                                                    }],
                                                    selModel: {
                                                        mode: 'SIMPLE',
                                                        allowDeselect: true
                                                    },
                                                    store: Ext.create('FamilyDecoration.store.BasicSubItem', {

                                                    }),
                                                    flex: 2
                                                }
                                            ],
                                            buttons: [{
                                                text: '添加',
                                                handler: function (){
                                                    var mainGrid = win.items.items[0],
                                                        subGrid = win.items.items[1],
                                                        mainSt = mainGrid.getStore(),
                                                        subSt = subGrid.getStore(),
                                                        mainRec = mainGrid.getSelectionModel().getSelection()[0],
                                                        subRecs = subGrid.getSelectionModel().getSelection();
                                                    if (!mainRec) {
                                                        showMsg('请选择大项目！');
                                                        return false;
                                                    }
                                                    else if (subRecs.length <= 0) {
                                                        showMsg('请选择小项！');
                                                        return false;
                                                    }
                                                    Ext.Ajax.request({
                                                        url: './libs/budget.php?action=getNextItemCode',
                                                        params: {
                                                            budgetId: rec.get('budgetId')
                                                        },
                                                        method: 'GET',
                                                        callback: function (opts, success, res){
                                                            if (success) {
                                                                var obj = Ext.decode(res.responseText);
                                                                if (obj.status == 'successful') {
                                                                    var code = obj.itemCode,
                                                                        p = {
                                                                            itemName: [mainRec.get('itemName')],
                                                                            budgetId: [rec.get('budgetId')],
                                                                            itemCode: [code],
                                                                            itemUnit: ['NULL'],
                                                                            itemAmount: [0],
                                                                            mainMaterialPrice: [0],
                                                                            auxiliaryMaterialPrice: [0],
                                                                            manpowerPrice: [0],
                                                                            machineryPrice: [0],
                                                                            lossPercent: [0],
                                                                            remark: ['NULL'],
                                                                            basicItemId: [mainRec.getId()],
                                                                            basicSubItemId: ['NULL']
                                                                        };
                                                                    Ext.each(subRecs, function (item, index){
                                                                        p.itemName.push(item.get('subItemName'));
                                                                        p.budgetId.push(rec.get('budgetId'));
                                                                        p.itemCode.push(code + '-' + '999' + index);
                                                                        p.itemUnit.push(item.get('subItemUnit'));
                                                                        p.itemAmount.push(0);
                                                                        p.mainMaterialPrice.push(item.get('mainMaterialPrice'));
                                                                        p.auxiliaryMaterialPrice.push(item.get('auxiliaryMaterialPrice'));
                                                                        p.manpowerPrice.push(item.get('manpowerPrice'));
                                                                        p.machineryPrice.push(item.get('machineryPrice'));
                                                                        p.lossPercent.push(item.get('mainMaterialPrice').add(item.get('auxiliaryMaterialPrice')).mul(item.get('lossPercent')));
                                                                        p.remark.push('NULL');
                                                                        p.basicItemId.push(item.get('parentId'));
                                                                        p.basicSubItemId.push(item.get('subItemId'));
                                                                    });
                                                                    for(var pro in p) {
                                                                        p[pro] = p[pro].join('>>><<<');
                                                                    }
                                                                    Ext.Ajax.request({
                                                                        url: './libs/budget.php?action=addItem',
                                                                        method: 'POST',
                                                                        params: p,
                                                                        callback: function (opts, success, res){
                                                                            if (success) {
                                                                                var obj = Ext.decode(res.responseText);
                                                                                if (obj.status == 'successful') {
                                                                                    showMsg('添加成功！');
                                                                                    win.close();
                                                                                    me.down('grid').getStore().reload();
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }, {
                                                text: '取消',
                                                handler: function (){
                                                    win.close();
                                                }
                                            }]
                                        });

                                        win.show();
                                    }
                                }]
                            })
                        }
                        else {
                            return false;
                        }
                    }
                    // 大项
                    else if (rec.get('itemCode') != '' && rec.get('itemUnit') == '') {
                        menu = Ext.create('Ext.menu.Menu', {
                            width: 100,
                            floating: true,
                            items: [{
                                text: '删除大项',
                                handler: function (){
                                    Ext.Ajax.request({
                                        url: './libs/budget.php?action=delBigItem',
                                        method: 'POST',
                                        params: {
                                            ItemId: rec.get('budgetId'),
                                            ItemCode: rec.get('itemCode')
                                        },
                                        callback: function (opts, success, res){
                                            if (success) {
                                                var obj = Ext.decode(res.responseText);
                                                if (obj.status == 'successful') {
                                                    me.down('grid').getStore().reload();
                                                    showMsg('删除大项成功！');
                                                }
                                            }
                                        }
                                    });
                                }
                            }, {
                                text: '添加子项',
                                handler: function (){
                                    var basicItemId = rec.get('basicItemId');
                                    Ext.Ajax.request({
                                        url: 'libs/subitem.php?action=get',
                                        params: {
                                            parentId: basicItemId
                                        },
                                        method: 'GET',
                                        callback: function (opts, success, res){
                                            if (success) {
                                                var arr = Ext.decode(res.responseText);
                                                var win = Ext.create('Ext.window.Window', {
                                                    width: 500,
                                                    height: 250,
                                                    autoScroll: true,
                                                    title: rec.get('itemName'),
                                                    layout: 'fit',
                                                    modal: true,
                                                    items: [{
                                                        xtype: 'gridpanel',
                                                        hideHeaders: true,
                                                        columns: [
                                                            {
                                                                text: '名称',
                                                                dataIndex: 'subItemName',
                                                                flex: 1
                                                            }
                                                        ],
                                                        selType: 'checkboxmodel',
                                                        selModel: {
                                                            mode: 'SIMPLE',
                                                            allowDeselect: true
                                                        },
                                                        store: Ext.create('FamilyDecoration.store.BasicSubItem', {
                                                            autoLoad: false,
                                                            data: arr
                                                        })
                                                    }],
                                                    buttons: [{
                                                        text: '添加',
                                                        handler: function (){
                                                            var grid = win.down('gridpanel'),
                                                                arr = grid.getSelectionModel().getSelection(),
                                                                p = {
                                                                    itemName: [],
                                                                    budgetId: [],
                                                                    itemCode: [],
                                                                    itemUnit: [],
                                                                    itemAmount: [],
                                                                    mainMaterialPrice: [],
                                                                    auxiliaryMaterialPrice: [],
                                                                    manpowerPrice: [],
                                                                    machineryPrice: [],
                                                                    lossPercent: [],
                                                                    remark: [],
                                                                    basicItemId: [],
                                                                    basicSubItemId: []
                                                                };
                                                            if (arr.length <= 0) {
                                                                showMsg('请选择项目！');
                                                                return false;
                                                            }
                                                            Ext.each(arr, function (item, index){
                                                                p.itemName.push(arr[index].get('subItemName'));
                                                                p.budgetId.push(rec.get('budgetId'));
                                                                p.itemCode.push(rec.get('itemCode') + '-' + '10' + index);
                                                                p.itemUnit.push(arr[index].get('subItemUnit'));
                                                                p.itemAmount.push(0);
                                                                p.mainMaterialPrice.push(arr[index].get('mainMaterialPrice'));
                                                                p.auxiliaryMaterialPrice.push(arr[index].get('auxiliaryMaterialPrice'));
                                                                p.manpowerPrice.push(arr[index].get('manpowerPrice'));
                                                                p.machineryPrice.push(arr[index].get('machineryPrice'));
                                                                p.lossPercent.push(arr[index].get('mainMaterialPrice').add(arr[index].get('auxiliaryMaterialPrice')).mul(arr[index].get('lossPercent')));
                                                                p.remark.push('NULL');
                                                                p.basicItemId.push(arr[index].get('parentId'));
                                                                p.basicSubItemId.push(arr[index].get('subItemId'));
                                                            });
                                                            for(var pro in p) {
                                                                p[pro] = p[pro].join('>>><<<');
                                                            }
                                                            Ext.Ajax.request({
                                                                url: './libs/budget.php?action=addItem',
                                                                method: 'POST',
                                                                params: p,
                                                                callback: function (opts, success, res){
                                                                    if (success) {
                                                                        var obj = Ext.decode(res.responseText);
                                                                        if (obj.status == 'successful') {
                                                                            showMsg('添加成功！');
                                                                            win.close();
                                                                            me.down('grid').getStore().reload();
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }, {
                                                        text: '取消',
                                                        handler: function (){
                                                            win.close();
                                                        }
                                                    }]
                                                });

                                                win.show();
                                            }
                                        }
                                    });
                                }
                            }]
                        });
                    }
                    // NOPQRS五项
                    else if ('NOPQRS'.indexOf(rec.get('itemCode')) != -1) {
                        return false;
                    }
                    // 小项
                    else {
                        menu = Ext.create('Ext.menu.Menu', {
                            width: 100,
                            floating: true,
                            items: [{
                                text: '删除子项',
                                handler: function (){
                                    Ext.Ajax.request({
                                        url: './libs/budget.php?action=deleItem',
                                        method: 'POST',
                                        params: {
                                            budgetId: rec.get('budgetId'),
                                            ItemId: rec.getId(),
                                            itemCode: rec.get('itemCode')
                                        },
                                        callback: function (opts, success, res){
                                            if (success) {
                                                var obj = Ext.decode(res.responseText);
                                                if (obj.status == 'successful') {
                                                    me.down('grid').getStore().reload();
                                                    showMsg('删除子项成功！');
                                                }
                                            }
                                        }
                                    });
                                }
                            }]
                        })
                    }

                    menu.showAt(e.getPoint());
                } : Ext.emptyFn,
                afterrender: function(grid, opts) {
                    var st = grid.getStore(),
                        view = grid.getView();
                    Ext.apply(st.getProxy().extraParams, {
                        budgetId: me.budget.budgetId
                    });
                    st.load();
                    var tip = Ext.create('Ext.tip.ToolTip', {
                        target: view.el,
                        delegate: view.cellSelector,
                        trackMouse: true,
                        renderTo: Ext.getBody(),
                        listeners: {
                            beforeshow: function(tip) {
                                var gridColumns = view.getGridColumns();
                                var column = gridColumns[tip.triggerElement.cellIndex];
                                var val = view.getRecord(tip.triggerElement.parentNode).get(column.dataIndex);
                                val.replace && val.replace(/\n/gi, '<br />');
                                tip.update(val);
                            }
                        }
                    });
                }
            }
        }];

        me.buttons = [{
            text: '导出预算',
            handler: function (){
                var exportFrame = document.getElementById('exportFrameInProject');
                exportFrame.src = './fpdf/index2.php?budgetId=' + me.budget.budgetId;
            }
        }, {
            text: '打印预算',
            handler: function (){
                var win = window.open('./fpdf/index2.php?action=view&budgetId=' + me.budget.budgetId,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                win.print();
            }
        }]

        me.callParent();
    }
})