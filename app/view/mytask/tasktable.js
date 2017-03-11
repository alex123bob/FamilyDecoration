Ext.define('FamilyDecoration.view.mytask.TaskTable', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.mytask-tasktable',
    requires: [
        'FamilyDecoration.model.TaskList',
        'FamilyDecoration.view.mytask.AssistantList'
    ],
    defaults: {

    },
    autoScroll: true,
    title: '任务列表',

    // configurate task list filter
    filterCfg: undefined,
    // indicator: whether autoLoad grid once entering into the page
    // expose load interface of grid
    needLoad: true,
    // whether current user is able to edit assistant. 
    // this feature is for manager and administrator to distribute corresponding assistant for current task
    assistantEditEnabled: Ext.emptyFn,
    scoreEditEnabled: Ext.emptyFn,

    processEditEnabled: Ext.emptyFn,

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
                    text: '完成情况',
                    dataIndex: 'taskProcess'
                },
                {
                    text: '评分',
                    dataIndex: 'score'
                }
            ]
        };

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
                            if (me.assistantEditEnabled()) {
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
                            if (me.processEditEnabled()) {
                                func('请输入完成百分比，从0到100。当前完成情况:' + rec.get('taskProcess'), 'taskProcess', rec);
                            }
                            break;
                        case 'score':
                            if (me.scoreEditEnabled()) {
                                func('请对当前任务进行评分。当前分数:' + rec.get('score'), 'score', rec);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        );

        this.callParent();
    }
});