Ext.define('FamilyDecoration.view.mylog.LogContent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mylog-logcontent',
    layout: 'vbox',
    title: '日志内容',
    defaults: {
        width: '100%'
    },
    requires: [
        'FamilyDecoration.store.LogContent', 'FamilyDecoration.view.mylog.SelfPlan',
        'FamilyDecoration.view.mylog.SummarizedLog', 'FamilyDecoration.view.mylog.EditComments'
    ],

    renderMode: undefined, // market, design, undefined
    checkMode: undefined,
    staff: undefined, // staff record, only needed when in checking mode.

    initComponent: function () {
        var me = this;

        function _rerenderIndicatorCt(mode) {
            var indicatorCt = null,
                items = me.items.items;
            if (mode == 'market') {
                indicatorCt = {
                    xtype: 'container',
                    height: 24,
                    layout: 'hbox',
                    defaults: {
                        xtype: 'fieldcontainer',
                        height: '100%',
                        flex: 1,
                        margin: '0 2 0 0'
                    },
                    items: [
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-marketPlan',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 32,
                                width: 80,
                                margin: '0 2 0 0',
                                readOnly: true
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>计划:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '电销',
                                    name: 'telemarketing'
                                },
                                {
                                    fieldLabel: '到店',
                                    name: 'companyVisit'
                                },
                                {
                                    fieldLabel: '定金',
                                    name: 'deposit'
                                },
                                {
                                    fieldLabel: '扫楼',
                                    name: 'buildingSwiping'
                                }
                            ]
                        },
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-marketAccomplishment',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 32,
                                width: 80,
                                margin: '0 4 0 0',
                                readOnly: true
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>完成:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '电销',
                                    name: 'telemarketing'
                                },
                                {
                                    fieldLabel: '到店',
                                    name: 'companyVisit'
                                },
                                {
                                    fieldLabel: '定金',
                                    name: 'deposit'
                                },
                                {
                                    fieldLabel: '扫楼',
                                    name: 'buildingSwiping'
                                }
                            ]
                        }
                    ]
                };
            }
            else if (mode == 'design') {
                indicatorCt = {
                    xtype: 'container',
                    height: 24,
                    layout: 'hbox',
                    defaults: {
                        xtype: 'fieldcontainer',
                        height: '100%',
                        flex: 1,
                        margin: '0 2 0 0'
                    },
                    items: [
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-designPlan',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 45,
                                width: 90,
                                margin: '0 2 0 0',
                                readOnly: true
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>计划:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '签单额',
                                    name: 'signedBusinessNumber'
                                },
                                {
                                    fieldLabel: '定金率',
                                    name: 'depositRate'
                                }
                            ]
                        },
                        {
                            layout: 'hbox',
                            name: 'fieldcontainer-designAccomplishment',
                            defaults: {
                                xtype: 'textfield',
                                labelWidth: 45,
                                width: 90,
                                margin: '0 2 0 0',
                                readOnly: true
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    hideLabel: true,
                                    value: '<strong>完成:</strong>',
                                    width: 40
                                },
                                {
                                    fieldLabel: '签单额',
                                    name: 'signedBusinessNumber'
                                },
                                {
                                    fieldLabel: '定金率',
                                    name: 'depositRate'
                                }
                            ]
                        }
                    ]
                }
            }

            Ext.suspendLayouts();
            if (indicatorCt) {
                if (items[0].xtype == 'container') {
                    me.remove(items[0]);
                }
                me.insert(0, indicatorCt);
            }
            else {
                if (items[0].xtype == 'container') {
                    me.remove(items[0]);
                }
            }
            Ext.resumeLayouts(true);
        }

        function _rerenderGrid(mode) {
            var items = me.items.items,
                grid, cols,
                st = Ext.create('FamilyDecoration.store.LogContent', {
                    autoLoad: false
                });
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.xtype == 'gridpanel') {
                    grid = item;
                    break;
                }
            }
            if (mode == 'market') {
                cols = [
                    {
                        text: '日期',
                        dataIndex: 'day',
                        flex: 0.5,
                        align: 'left'
                    },
                    {
                        text: '规范计划',
                        flex: 1,
                        dataIndex: 'standardPlan',
                        align: 'left'
                    },
                    {
                        text: '完成情况',
                        flex: 1,
                        dataIndex: 'practicalAccomplishment',
                        align: 'left'
                    },
                    {
                        text: '相差',
                        flex: 1,
                        dataIndex: 'difference',
                        align: 'left'
                    }
                ];
            }
            else {
                cols = [
                    {
                        text: '日期',
                        dataIndex: 'day',
                        flex: 0.5,
                        align: 'left'
                    }
                ];
            }
            cols.push(
                {
                    text: '个人计划',
                    flex: 1,
                    dataIndex: 'selfPlan',
                    align: 'left',
                    renderer: function (val, meta, rec) {
                        var res = '';
                        if (val.length > 0) {
                            Ext.each(val, function (item, index, self) {
                                res += '<strong>' + (index + 1) + '.</strong>'
                                    + ' ' + (item['content'] ? item['content'].replace(/\n/gi, '<br />') : '')
                                    + item['isFinished'] + ' <br />'
                                    + '<span class="footnote">(' + item['day'] + ') '
                                    + '</span>'
                                    + '<br />';
                            });
                        }
                        return res;
                    }
                },
                {
                    text: '总结日志',
                    flex: 1,
                    dataIndex: 'summarizedLog',
                    align: 'left',
                    renderer: function (val, meta, rec) {
                        if (val) {
                            return val.replace(/\n/gi, '<br />');
                        }
                        else {
                            return val;
                        }
                    }
                },
                {
                    text: '评价',
                    flex: 1,
                    dataIndex: 'comments',
                    align: 'left',
                    renderer: function (val, meta, rec) {
                        if (val) {
                            return val.replace(/\n/gi, '<br />');
                        }
                        else {
                            return val;
                        }
                    }
                }
            );
            Ext.suspendLayouts();
            grid.reconfigure(st, cols);
            Ext.resumeLayouts(true);
        }

        function _refreshIndicator(rec) {
            var planCt, accomplishmentCt;

            if (me.renderMode == 'market') {
                planCt = me.down('[name="fieldcontainer-marketPlan"]');
                accomplishmentCt = me.down('[name="fieldcontainer-marketAccomplishment"]');
            }
            else if (me.renderMode == 'design') {
                planCt = me.down('[name="fieldcontainer-designPlan"]');
                accomplishmentCt = me.down('[name="fieldcontainer-designAccomplishment"]');
            }

            function goThroughData(obj) {
                Ext.each(planCt.items.items, function (item, index, self) {
                    if (item.xtype == 'textfield') {
                        item.setValue(obj ? obj['plan'][item.name] : '');
                    }
                });
                Ext.each(accomplishmentCt.items.items, function (item, index, self) {
                    if (item.xtype == 'textfield') {
                        item.setValue(obj ? obj['accomplishment'][item.name] : '');
                    }
                });
            }

            if (rec) {
                ajaxGet('LogList', 'getIndicator', {
                    name: me.checkMode ? me.staff.get('name') : User.getName(),
                    year: rec.get('year'),
                    month: rec.get('month'),
                    mode: me.renderMode
                }, function (obj) {
                    goThroughData(obj);
                })
            }
            else {
                goThroughData();
            }
        }

        function _refreshGrid(rec) {
            var grid = me.getComponent('gridpanel-logContent'),
                st = grid.getStore();
            if (rec) {
                st.setProxy({
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'data',
                        totalProperty: 'total'
                    },
                    extraParams: {
                        action: 'LogList.getDetail',
                        name: me.checkMode ? me.staff.get('name') : User.getName(),
                        year: rec.get('year'),
                        month: rec.get('month'),
                        mode: me.renderMode,
                        byDay: true
                    }
                });
                st.reload();
            }
            else {
                st.removeAll();
            }
        }

        function _initBtn(rec) {
            var btnObj = {
                selfPlan: me.down('[name="button-selfPlan"]'),
                summarizedLog: me.down('[name="button-summarizedLog"]'),
                comment: me.down('[name="button-comment"]')
            };

            for (var key in btnObj) {
                if (btnObj.hasOwnProperty(key)) {
                    var btn = btnObj[key];
                    btn.setDisabled(!rec);
                }
            }
        }

        me.rerender = function () {
            _rerenderGrid(me.renderMode);
            _rerenderIndicatorCt(me.renderMode);
        }

        me.refresh = function (rec) {
            if (me.renderMode == 'market' || me.renderMode == 'design') {
                _refreshIndicator(rec);
            }
            _refreshGrid(rec);
        }

        me.items = [
            {
                xtype: 'gridpanel',
                flex: 9,
                cls: 'gridpanel-logContent',
                name: 'gridpanel-logContent',
                itemId: 'gridpanel-logContent',
                getRec: function () {
                    return this.getSelectionModel().getSelection()[0];
                },
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'left'
                    },
                    items: [
                        {
                            text: '日期',
                            dataIndex: 'day',
                            flex: 0.5
                        },
                        {
                            text: '个人计划',
                            dataIndex: 'selfPlan'
                        },
                        {
                            text: '总结日志',
                            dataIndex: 'summarizedLog',
                            renderer: function (val, meta, rec) {
                                if (val) {
                                    return val.replace(/\n/gi, '<br />');
                                }
                                else {
                                    return val;
                                }
                            }
                        },
                        {
                            text: '评价',
                            dataIndex: 'comments',
                            renderer: function (val, meta, rec) {
                                if (val) {
                                    return val.replace(/\n/gi, '<br />');
                                }
                                else {
                                    return val;
                                }
                            }
                        }
                    ]
                },
                bbar: [
                    {
                        text: '个人计划',
                        name: 'button-selfPlan',
                        disabled: true,
                        icon: 'resources/img/sheet.png',
                        handler: function () {
                            var grid = me.down('gridpanel'),
                                rec = grid.getRec();

                            var win = Ext.create('FamilyDecoration.view.mylog.SelfPlan', {
                                initInfo: {
                                    staffName: me.checkMode ? me.staff.get('name') : User.getName(),
                                    rec: rec
                                },
                                afterClose: function () {
                                    grid.getStore().reload();
                                }
                            });

                            win.show();
                        }
                    },
                    {
                        text: '总结日志',
                        name: 'button-summarizedLog',
                        disabled: true,
                        icon: 'resources/img/summary.png',
                        handler: function () {
                            var grid = me.down('gridpanel'),
                                rec = grid.getRec();
                            var win = Ext.create('FamilyDecoration.view.mylog.SummarizedLog', {
                                rec: rec,
                                staffName: me.checkMode ? me.staff.get('name') : User.getName(),
                                afterEvent: function () {
                                    grid.getStore().reload();
                                }
                            });
                            win.show();
                        }
                    },
                    {
                        text: '评价',
                        hidden: !me.checkMode,
                        name: 'button-comment',
                        disabled: true,
                        icon: 'resources/img/comment-new.png',
                        handler: function () {
                            var grid = me.down('gridpanel'),
                                rec = grid.getRec();
                            var win = Ext.create('FamilyDecoration.view.mylog.EditComments', {
                                rec: rec,
                                staffName: me.checkMode ? me.staff.get('name') : User.getName(),
                                afterEvent: function () {
                                    grid.getStore().reload();
                                }
                            });
                            win.show();
                        }
                    }
                ],
                listeners: {
                    selectionchange: function (selModel, sels, opts) {
                        var rec = sels[0];
                        _initBtn(rec);
                    }
                }
            }
        ];

        me.addListener('afterrender', function (cmp, opts) {
            me.rerender(me.renderMode);
        })

        me.callParent();
    }
});