Ext.define('FamilyDecoration.view.mytask.TaskTable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mytask-tasktable',
    requires: [
        'FamilyDecoration.model.TaskList',
        'FamilyDecoration.view.mytask.AssistantList',
        'FamilyDecoration.view.mytask.AcceptorList'
    ],
    defaults: {

    },
    autoScroll: true,
    title: '任务列表',

    // This is used to get all tasks related to this user: dispatcher, executor, assistant, acceptor
    specificUser: undefined,
    // configurate task list filter
    filterCfg: undefined,
    // indicator: whether autoLoad grid once entering into the page
    // expose load interface of grid
    needLoad: true,
    // whether current user is able to edit assistant. 
    // this feature is for manager and administrator to distribute corresponding assistant for current task
    assistantEditEnabled: Ext.emptyFn,
    acceptorEditEnabled: Ext.emptyFn,
    processEditEnabled: Ext.emptyFn,
    acceptEditEnabled: Ext.emptyFn,
    finishEditEnabled: Ext.emptyFn,

    refresh: function (cfg) {
        var st = this.getStore();
        if (cfg) {
            st.load(cfg);
        }
        else {
            st.load();
        }
    },
    removeAll: function () {
        this.getStore().removeAll();
    },
    initComponent: function () {
        var me = this,
            st = Ext.create('Ext.data.Store', {
                model: 'FamilyDecoration.model.TaskList',
                autoLoad: false
            }),
            proxy = st.getProxy(),
            extraParams = {
                action: 'getTaskList'
            };
        me.filterCfg && Ext.override(extraParams, me.filterCfg);

        Ext.override(proxy, {
            extraParams: extraParams
        });
        me.needLoad && st.load();
        this.store = st;

        var T = function (str) {
            var date = new Date(str.replace(/-/gi, '/'));
            return Ext.Date.format(date, 'Y-m-d');
        };

        var P = function (num) {
            var res = '未知';
            switch (num) {
                case 1:
                    res = '普通';
                    break;
                case 2:
                    res = '一般';
                    break;
                case 3:
                    res = '紧急';
                    break;
                default:
                    break;
            }
            return res;
        };

        this.viewConfig = {
            getRowClass: function (rec, rowIndex, rowParams, st){
                var cls = '';
                switch (rec.get('priority')) {
                    case 3:
                        cls = 'priority-emergency'
                        break;
                    case 2:
                        cls = 'priority-general'
                    default:
                        break;
                }
                return cls;
            }
        };

        this.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    flex: null,
                    xtype: 'actioncolumn',
                    width: 25,
                    items: [
                        {
                            isDisabled: function(view, rowIdx, colIdx, item, rec) {
                                return me.acceptEditEnabled(rec) === false;
                            },
                            icon: 'resources/img/flaticon-checkmark.svg',
                            tooltip: '验收',
                            handler: function(grid, rowIndex, colIndex) {
                                var st = grid.getStore(),
                                    rec = st.getAt(rowIndex);

                                if (rec.get('isAccepted')) {
                                    showMsg('已验收，无需操作!');
                                    return;
                                }
                                Ext.Msg.read('请对当前任务进行评分。当前分数:' + rec.get('score'), function (inputVal) {
                                    inputVal = parseInt(inputVal, 10);
                                    swal.close();
                                    if (isNaN(inputVal)) {
                                        showMsg('请输入数字');
                                        return;
                                    }
                                    if (inputVal < 0 || inputVal > 100) {
                                        showMsg('输入的数字不在0～100之间');
                                        return;
                                    }
                                    var params = {
                                        action: 'editTaskList',
                                        id: rec.getId()
                                    };
                                    params['score'] = inputVal;
                                    params['isAccepted'] = true;
                                    Ext.Ajax.request({
                                        url: './libs/tasklist.php',
                                        method: 'POST',
                                        params: params,
                                        callback: function (opts, success, res) {
                                            if (success) {
                                                var obj = Ext.decode(res.responseText);
                                                if ('successful' == obj.status) {
                                                    showMsg('编辑成功!');
                                                    me.refresh({
                                                        params: me.filterCfg
                                                    });
                                                }
                                            }
                                        }
                                    })
                                });
                            }
                        },
                    ]
                },
                {
                    text: '分配人',
                    dataIndex: 'taskDispatcherRealName'
                },
                {
                    text: '执行人',
                    dataIndex: 'taskExecutorRealName'
                },
                {
                    text: '时间',
                    dataIndex: 'createTime',
                    renderer: T
                },
                {
                    text: '开始',
                    dataIndex: 'startTime',
                    renderer: T
                },
                {
                    text: '结束',
                    dataIndex: 'endTime',
                    renderer: T
                },
                {
                    text: '标题',
                    dataIndex: 'taskName'
                },
                {
                    text: '内容',
                    dataIndex: 'taskContent'
                },
                {
                    text: '优先级',
                    dataIndex: 'priority',
                    renderer: P
                },
                {
                    text: '协助人',
                    dataIndex: 'assistantRealName'
                },
                {
                    text: '文件位置',
                    dataIndex: 'filePath'
                },
                {
                    text: '完成情况',
                    dataIndex: 'taskProcess'
                },
                {
                    text: '评分',
                    dataIndex: 'score'
                },
                {
                    text: '验收人',
                    dataIndex: 'acceptorRealName'
                },
                {
                    text: '已验收',
                    dataIndex: 'isAccepted',
                    renderer: function(val) {
                        return val === true ? '<font color="green"><strong>是</strong></font>' : '否';
                    }
                }
            ]
        };

        if (me.finishEditEnabled()) {
            this.columns.items.unshift({
                flex: null,
                xtype: 'actioncolumn',
                width: 25,
                items: [
                    {
                        icon: 'resources/img/check.png',
                        tooltip: '完成任务',
                        handler: function(grid, rowIndex, colIndex) {
                            var st = grid.getStore(),
                                rec = st.getAt(rowIndex);

                            if (rec.get('isFinished')) {
                                showMsg('任务已完成，无需操作!');
                                return;
                            }
                            Ext.Msg.confirm('确认', '是否将当前任务其置为完成？', function(btnId) {
                                if (btnId === 'no') {
                                    return;
                                }
                                Ext.Ajax.request({
                                    url: './libs/tasklist.php',
                                    method: 'POST',
                                    params: {
                                        action: 'editTaskList',
                                        id: rec.getId(),
                                        isFinished: true
                                    },
                                    callback: function (opts, success, res){
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            debugger
                                            if ('successful' == obj.status) {
                                                showMsg('编辑成功!');
                                                me.refresh({
                                                    params: me.filterCfg
                                                });
                                            }
                                            else {
                                                showMsg(obj.errMsg);
                                            }
                                        }
                                    }
                                });
                            });
                        }
                    },
                ]
            });
        }

        this.on(
            {
                cellclick: function (view, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
                    var grid = me,
                        colMg = grid.getColumnManager(),
                        header = colMg.getHeaderAtIndex(cellIndex),
                        dataIndex = header.dataIndex,
                        func = function (msg, field, rec) {
                            Ext.Msg.read(msg, function (inputVal) {
                                inputVal = parseInt(inputVal, 10);
                                swal.close();
                                if (isNaN(inputVal)) {
                                    showMsg('请输入数字');
                                    return;
                                }
                                if (inputVal < 0 || inputVal > 100) {
                                    showMsg('输入的数字不在0～100之间');
                                    return;
                                }
                                var params = {
                                    action: 'editTaskList',
                                    id: rec.getId()
                                };
                                params[field] = inputVal;
                                Ext.Ajax.request({
                                    url: './libs/tasklist.php',
                                    method: 'POST',
                                    params: params,
                                    callback: function (opts, success, res) {
                                        if (success) {
                                            var obj = Ext.decode(res.responseText);
                                            if ('successful' == obj.status) {
                                                showMsg('进度填写完成！');
                                                grid.refresh({
                                                    params: me.filterCfg
                                                });
                                            }
                                        }
                                    }
                                })
                            });
                        };
                    switch (dataIndex) {
                        case "assistantRealName":
                            if (me.assistantEditEnabled(rec)) {
                                var win = Ext.create('FamilyDecoration.view.mytask.AssistantList', {
                                    task: rec,
                                    assistantList: rec.get('assistant').split(','),
                                    callback: function () {
                                        grid.refresh({
                                            params: me.filterCfg
                                        });
                                    }
                                });
                                win.show();
                            }
                            break;
                        case "taskProcess":
                            if (me.processEditEnabled(rec)) {
                                func('请输入完成百分比，从0到100。当前完成情况:' + rec.get('taskProcess'), 'taskProcess', rec);
                            }
                            break;
                        case 'acceptorRealName':
                            if (me.acceptorEditEnabled(rec)) {
                                var win = Ext.create('FamilyDecoration.view.mytask.AcceptorList', {
                                    title: '编辑任务验收人',
                                    task: rec,
                                    acceptorList: rec.get('acceptor').split(','),
                                    callback: function () {
                                        grid.refresh({
                                            params: me.filterCfg
                                        });
                                    }
                                });
                                win.show();
                            }
                            break;
                        default:
                            break;
                    }
                },
                celldblclick: function(view, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
                    var win = Ext.create('Ext.window.Window', {
                        width: 800,
                        height: 600,
                        resizable: false,
                        title: '任务详情',
                        autoScroll: true,
                        html: [
                            '<strong>分配人:</strong> ' + rec.get('taskDispatcherRealName'),
                            '<br />','<br />',
                            '<strong>协助人:</strong> ' + rec.get('assistantRealName'),
                            '<br />','<br />',
                            '<strong>验收人:</strong> ' + rec.get('acceptorRealName'),
                            '<br />','<br />',
                            '<strong>标题:</strong> ' + rec.get('taskName'),
                            '<br />','<br />',
                            '<strong>内容:</strong> ',
                            '<br />',
                            rec.get('taskContent').replace(/[\t ]/gi, '&nbsp;').replace(/\n/gi, '<br />'),
                            '<br />','<br />',
                            '<strong>时间:</strong> ' + rec.get('createTime'),
                            '<br />','<br />',
                            '<strong>完成情况:</strong> ' + rec.get('taskProcess'),
                            '<br />','<br />',
                            '<strong>文件位置:</strong> ' + rec.get('filePath'),
                            '<br />','<br />',
                            '<strong>验收状态:</strong> ' + (rec.get('isAccepted') ? '<font color="green">已验收</font>' : '未验收'),
                        ].join(''),
                        modal: true,
                        buttons: [
                            {
                                text: '关闭',
                                handler: function() {
                                    win.close();
                                }
                            }
                        ]
                    });
                    win.show();
                }
            }
        );

        this.callParent();
    }
});