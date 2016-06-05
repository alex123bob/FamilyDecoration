Ext.define('FamilyDecoration.view.billaudit.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.billaudit-index',
    requires: [
        'FamilyDecoration.store.WorkCategory',
        'FamilyDecoration.view.manuallycheckbill.BillTable',
        'FamilyDecoration.store.StatementBill',
        'Ext.ux.form.SearchField'
    ],
    layout: 'hbox',

    initComponent: function () {
        var me = this;
        // get all resources which used to be retrieved a lot of times. quite redundant before.
        // now we just encapsulate it.
        me.getRes = function () {
            var billList = Ext.getCmp('gridpanel-billListForAudit'),
                bill = billList.getSelectionModel().getSelection()[0],
                billDetailCt = Ext.getCmp('billtable-billDetailForAudit');
                
            return {
                billList: billList,
                bill: bill,
                billDetailCt: billDetailCt
            }
        };

        var billSt = Ext.create('FamilyDecoration.store.StatementBill', {
            autoLoad: false
        });
        
        billSt.load({
            params: {
                action: 'StatementBill.get',
                orderby: 'createTime DESC',
                status: 'rdyck'
            }
        });

        me.items = [
            {
                xtype: 'gridpanel',
                id: 'gridpanel-billListForAudit',
                name: 'gridpanel-billListForAudit',
                title: '账单列表',
                flex: 1,
                height: '100%',
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                hideHeaders: true,
                dockedItems: [{
					dock: 'top',
					xtype: 'toolbar',
					items: [{
						xtype: 'searchfield',
						flex: 1,
						store: billSt,
						paramName: 'billName'
					}]
				}],
                autoScroll: true,
                columns: {
                    items: [
                        {
                            text: '单名',
                            dataIndex: 'billName'
                        }
                        // {
                        //     text: '项目',
                        //     dataIndex: 'projectName'
                        // },
                        // {
                        //     text: '工种',
                        //     dataIndex: 'professionType',
                        //     renderer: function (val, meta, rec) {
                        //         return FamilyDecoration.store.WorkCategory.renderer(val);
                        //     }
                        // }
                    ],
                    defaults: {
                        flex: 1,
                        align: 'center'
                    }
                },
                store: billSt,
                listeners: {
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
                                    val += '<strong>申领金额：</strong> ' + rec.get('claimAmount') + '<br />';
                                    val += '<strong>完成情况：</strong> ' + rec.get('projectProgress') + '<br />';
                                    val += '<strong>预算总价：</strong> ' + rec.get('totalFee') + '<br />';
                                    val += '<strong>创建时间：</strong> ' + rec.get('createTime') + '<br />';
                                    tip.update(val);
                                }
                            }
                        });
                    },
                    selectionchange: function (selModel, sels, opts){
                        var rec = sels[0],
                            resourceObj = me.getRes();
                        resourceObj.billDetailCt.bill = rec;
                        resourceObj.billDetailCt.refresh(rec);
                    }
                }
            },
            {
                xtype: 'manuallycheckbill-billtable',
                id: 'billtable-billDetailForAudit',
                name: 'billtable-billDetailForAudit',
                flex: 5,
                title: '单据细目',
                header: true,
                height: '100%',
                isPreview: true,
                isAudit: true
            }
        ];

        this.callParent();
    }
});