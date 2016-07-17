Ext.define('FamilyDecoration.view.billaudit.BillList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.billaudit-billlist',
    requires: [
        'FamilyDecoration.store.StatementBill',
        'FamilyDecoration.store.WorkCategory',
        'FamilyDecoration.view.billaudit.DateFilter'
    ],
    hideHeaders: false,
    autoScroll: true,

    billStatus: undefined,
    selectionchangeEvent: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        var billSt = Ext.create('FamilyDecoration.store.StatementBill', {
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: './libs/api.php',
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                },
                extraParams: {
                    action: 'StatementBill.getByStatus',
                    orderBy: 'createTime DESC',
                    status: me.billStatus ? me.billStatus : 'rdyck'
                }
            }
        });

        me.store = billSt;

        me.dockedItems = [
            {
                dock: 'top',
                xtype: 'billaudit-datefilter',
                txtEmptyText: '项目经理',
                txtParam: 'captain',
                filterFn: function (obj){
                    var p = {};
                    if (obj.startTime && obj.endTime) {
                        Ext.apply(p, {
                            createTime: "between '" + Ext.Date.format(obj.startTime, 'Y-m-d 00:00:00') + "' and '" + Ext.Date.format(obj.endTime, 'Y-m-d 23:59:59') + "'"
                        });
                    }
                    if (obj.captain) {
                        Ext.apply(p, {
                            captain: obj.captain
                        });
                    }
                    if (obj.projectName) {
                        Ext.apply(p, {
                            projectName: obj.projectName
                        });
                    }
                    billSt.setProxy({
                        type: 'rest',
                        url: './libs/api.php',
                        reader: {
                            type: 'json',
                            root: 'data',
                            totalProperty: 'total'
                        },
                        extraParams: Ext.apply(p, {
                            action: 'StatementBill.getByStatus',
                            orderBy: 'createTime DESC',
                            status: me.billStatus ? me.billStatus : 'rdyck'
                        })
                    })
                    billSt.loadPage(1);
                },
                clearFn: function (){
                    billSt.setProxy({
                        type: 'rest',
                        url: './libs/api.php',
                        reader: {
                            type: 'json',
                            root: 'data',
                            totalProperty: 'total',
                        },
                        extraParams: {
                            action: 'StatementBill.getByStatus',
                            orderBy: 'createTime DESC',
                            status: me.billStatus ? me.billStatus : 'rdyck'
                        }
                    });
                    billSt.loadPage(1);
                }
            },
            {
                xtype: 'pagingtoolbar',
                store: billSt,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.columns = {
            items: [
                {
                    text: '项目名称',
                    dataIndex: 'projectName'  
                },
                {
                    text: '单名',
                    dataIndex: 'billName'
                },
                {
                    text: '项目经理',
                    dataIndex: 'captain'
                }
            ],
            defaults: {
                flex: 1,
                align: 'center'
            }
        };

        me.listeners = {
            afterrender: function (grid, opts) {
                var view = grid.getView();
                var tip = Ext.create('Ext.tip.ToolTip', {
                    // The overall target element.
                    target: view.el,
                    // Each grid row causes its own separate show and hide.
                    delegate: view.cellSelector,
                    // Moving within the row should not hide the tip.
                    trackMouse: true,
                    // Render immediately so that tip.body can be referenced prior to the first show.
                    renderTo: Ext.getBody(),
                    listeners: {
                        // Change content dynamically depending on which element triggered the show.
                        beforeshow: function updateTipBody(tip) {
                            var gridColumns = view.getGridColumns();
                            var column = gridColumns[tip.triggerElement.cellIndex];
                            var rec = view.getRecord(tip.triggerElement.parentNode);
                            // var val = rec.get(column.dataIndex);
                            val = '<strong>项目名称：</strong> ' + rec.get('projectName') + '<br />';
                            val += '<strong>工种：</strong> ' + FamilyDecoration.store.WorkCategory.renderer(rec.get('professionType')) + '<br />';
                            val += '<strong>总金额：</strong> ' + rec.get('totalFee') + '<br />';
                            val += '<strong>领款人：</strong> ' + rec.get('payee') + '<br />';
                            val += '<strong>审核人：</strong> ' + rec.get('checkerRealName') + '<br />';
                            val += '<strong>申领金额：</strong> ' + rec.get('claimAmount') + '<br />';
                            val += '<strong>完成情况：</strong> ' + rec.get('projectProgress') + '<br />';
                            val += '<strong>预算总价：</strong> ' + rec.get('totalFee') + '<br />';
                            val += '<strong>创建时间：</strong> ' + rec.get('createTime') + '<br />';
                            val += '<strong>是否付款：</strong> ' + (rec.get('status') == 'paid' ? '已付款' : '未付款') + '<br />';
                            tip.update(val);
                        }
                    }
                });
            },
            selectionchange: function (selModel, sels, opts) {
                me.selectionchangeEvent(selModel, sels, opts);
            }
        };

        me.callParent();
    }
});