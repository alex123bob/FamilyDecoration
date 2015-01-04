Ext.define('FamilyDecoration.view.budget.BudgetTable', {
      extend: 'Ext.panel.Panel',
      alias: 'widget.budget-budgettable',
      requires: ['FamilyDecoration.store.BudgetItem'],

      header: false,

      initComponent: function() {
            var me = this;
            // avoid decimal
            var base = 1000;

            var store = Ext.create('FamilyDecoration.store.BudgetItem', {
                  autoLoad: true
            });

            me.items = [{
                  xtype: 'fieldcontainer',
                  layout: 'hbox',
                  items: [{
                        width: 80,
                        height: 60,
                        xtype: 'image',
                        src: './resources/img/logo.jpg'
                  }, {
                        xtype: 'displayfield',
                        margin: '0 0 0 20',
                        value: '<center>佳诚装饰室内装修装饰工程&nbsp;预算单</center>',
                        hideLabel: true,
                        fieldStyle: {
                              fontFamily: '黑体',
                              fontSize: '24px',
                              lineHeight: '60px'
                        },
                        width: '100%',
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
                        flex: 1
                  }, {
                        xtype: 'displayfield',
                        fieldLabel: '工程地址',
                        name: 'displayfield-projectName',
                        flex: 1
                  }],
                  width: '100%'
            }, {
                  xtype: 'gridpanel',
                  store: store,
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
                        flex: 0.5,
                        dataIndex: 'itemAmount',
                        draggable: false,
                        align: 'center',
                        sortable: false,
                        renderer: function (val, meta, rec){
                              return rec.raw.itemAmount;
                        }
                  }, {
                        text: '主材',
                        columns: [{
                              text: '单价',
                              dataIndex: 'mainMaterialPrice',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              renderer: function (val, meta, rec){
                                    return rec.raw.mainMaterialPrice;
                              }
                        }, {
                              text: '总价',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              dataIndex: 'mainMaterialTotalPrice',
                              renderer: function (val, meta, rec){
                                    return rec.raw.mainMaterialTotalPrice;
                              }
                        }],
                        draggable: false,
                        align: 'center'
                  }, {
                        text: '辅材',
                        columns: [{
                              text: '单价',
                              dataIndex: 'auxiliaryMaterialPrice',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              renderer: function (val, meta, rec){
                                    return rec.raw.auxiliaryMaterialPrice;
                              }
                        }, {
                              text: '总价',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              dataIndex: 'auxiliaryMaterialTotalPrice',
                              renderer: function (val, meta, rec){
                                    return rec.raw.auxiliaryMaterialTotalPrice;
                              }
                        }],
                        draggable: false,
                        align: 'center'
                  }, {
                        text: '人工',
                        columns: [{
                              text: '单价',
                              dataIndex: 'manpowerPrice',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              renderer: function (val, meta, rec){
                                    return rec.raw.manpowerPrice;
                              }
                        }, {
                              text: '总价',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              dataIndex: 'manpowerTotalPrice',
                              renderer: function (val, meta, rec){
                                    return rec.raw.manpowerTotalPrice;
                              }
                        }],
                        draggable: false,
                        align: 'center'
                  }, {
                        text: '机械',
                        columns: [{
                              text: '单价',
                              dataIndex: 'machineryPrice',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              renderer: function (val, meta, rec){
                                    return rec.raw.machineryPrice;
                              }
                        }, {
                              text: '总价',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              dataIndex: 'machineryTotalPrice',
                              renderer: function (val, meta, rec){
                                    return rec.raw.machineryTotalPrice;
                              }
                        }],
                        draggable: false,
                        align: 'center'
                  }, {
                        text: '损耗',
                        columns: [{
                              text: '单价',
                              dataIndex: 'lossPercent',
                              flex: 1,
                              draggable: false,
                              align: 'center',
                              sortable: false,
                              renderer: function (val, meta, rec){
                                    return rec.raw.lossPercent;
                              }
                        }],
                        draggable: false,
                        align: 'center'
                  }, {
                        text: '备注',
                        align: 'center',
                        dataIndex: 'remark',
                        flex: 1,
                        draggable: false,
                        sortable: false
                  }],
                  listeners: {
                        afterrender: function(grid, opts) {
                              var view = grid.getView();
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

            me.callParent();
      }
})