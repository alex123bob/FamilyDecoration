Ext.define('FamilyDecoration.view.billaudit.BillList', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.billaudit-billlist',
	requires: [
		'FamilyDecoration.store.StatementBill',
        'FamilyDecoration.store.WorkCategory'
	],
    hideHeaders: true,
    autoScroll: true,
    
    isPassedBillList: false,
    selectionchangeEvent: Ext.emptyFn,
    
	initComponent: function (){
		var me = this;
        
        var billSt = Ext.create('FamilyDecoration.store.StatementBill', {
            autoLoad: false,
            proxy: {
                type: 'rest',
                url: './libs/api.php',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                extraParams: {
                    action: 'StatementBill.getByStatus',
                    orderBy: 'createTime DESC',
                    status: me.isPassedBillList ? 'chk,paid' : 'rdyck'
                }
            }
        });
        
        me.store = billSt;
		
        me.dockedItems = [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                xtype: 'searchfield',
                flex: 1,
                store: billSt,
                paramName: 'billName'
            }]
        }];
        
        me.columns = {
            items: [
                {
                    text: '单名',
                    dataIndex: 'billName'
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
            selectionchange: function (selModel, sels, opts){
                me.selectionchangeEvent(selModel, sels, opts);
            }
		};

		me.callParent();
	}
});