Ext.define('FamilyDecoration.view.staffsalary.DetailedSalary', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.staffsalary-detailedsalary',
    requires: [
        'FamilyDecoration.view.staffsalary.Month',
        'FamilyDecoration.store.StaffSalary',
        'Ext.form.field.Number',
        'FamilyDecoration.view.staffsalary.EditCommission'
    ],
    layout: 'fit',
    title: '工资详情',
    defaults: {
    },
    selChange: Ext.emptyFn,
    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'staffsalary-monthfield',
                format: 'm/Y',
                value: new Date(),
                listeners: {
                    change: function (cmp, newVal, oldVal, opts){
                        me.selChange();
                    }
                }
            },
            {
                xtype: 'button',
                text: '同步',
                icon: 'resources/img/sync.png',
                handler: function (){
                    var st = me.getStore();
                    st.reload();
                }
            }
        ];

        function refreshBtn (){
            var btnObj = {
                    add: me.down('[name="createBill"]'),
                    request: me.down('[name="requestCheck"]'),
                    pass: me.down('[name="checkPassed"]'),
                    reject: me.down('[name="returnBill"]')
                },
                st = me.getStore(),
                selModel = me.getSelectionModel(),
                rec = selModel.getSelection()[0],
                status = rec && rec.get('billStatus');
            btnObj.add.setDisabled(!(rec && !status));
            btnObj.request.setDisabled(!(rec && status === 'new'));
            btnObj.pass.setDisabled(!(rec && status === 'rdyck'));
            btnObj.reject.setDisabled(!(rec && status === 'rdyck'));
        }

        function changeBillStatus (cfmMsg, successMsg, status){
            var st = me.getStore(),
                selModel = me.getSelectionModel(),
                rec = selModel.getSelection()[0],
                pickedTime = me.getTime();
            if (rec) {
                function request(validateCode) {
                    var params = {
                        id: rec.get('statementBillId'),
                        status: !status ? '+1' : status,
                        currentStatus: rec.get('billStatus')
                    }, arr = ['id', 'currentStatus'],
                        index = st.indexOf(rec);
                    if (validateCode) {
                        Ext.apply(params, {
                            validateCode: validateCode
                        });
                        arr.push('validateCode');
                    }
                    ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
                        Ext.defer(function () {
                            Ext.Msg.success(successMsg);
                            selModel.deselectAll();
                            st.reload({
                                callback: function (recs, ope, success) {
                                    if (success) {
                                        selModel.select(index);
                                    }
                                }
                            });
                        }, 500);
                    }, true);
                }
                Ext.Msg.warning(cfmMsg, function (btnId) {
                    if ('yes' == btnId) {
                        ajaxGet('StatementBill', 'getLimit', {
                            id: rec.get('statementBillId')
                        }, function (obj) {
                            if (obj.type == 'checked') {
                                showMsg(obj.hint);
                                request();
                            }
                            else {
                                Ext.defer(function () {
                                    Ext.Msg.password(obj.hint, function (val) {
                                        if (obj.type == 'sms') {
                                        }
                                        else if (obj.type == 'securePass') {
                                            val = md5(_PWDPREFIX + val);
                                        }
                                        request(val);
                                    });
                                }, 500);
                            }
                        });
                    }
                });
            }
            else {
                showMsg('请选择账单！');
            }
        }

        me.bbar = [
            {
                xtype: 'button',
                name: 'createBill',
                text: '创建单据',
                icon: 'resources/img/material_request_add.png',
                hidden: !User.isAdmin(),
                handler: function (){
                    var st = me.getStore(),
                        selModel = me.getSelectionModel(),
                        rec = selModel.getSelection()[0],
                        pickedTime = me.getTime(),
                        params;
                    if (rec) {
                        Ext.Msg.warning('确定要创建单据吗？', function (btnId){
                            if ('yes' === btnId) {
                                ajaxGet('StaffSalary', 'plainGet', {
                                    id: rec.getId()
                                }, function (obj){
                                    if (obj.data.length > 0) {
                                        var actualPaid = parseFloat(obj.data[0].actualPaid);
                                        if (Ext.isNumber(actualPaid)) {
                                            params = {
                                                staffSalaryId: rec.getId(),
                                                projectName: rec.get('staffRealName') + pickedTime.year + '年' + pickedTime.month + '月' + '工资',
                                                billType: 'stfs',
                                                claimAmount: actualPaid,
                                                payee: rec.get('staffName')
                                            }
                                            var index = st.indexOf(rec);
                                            ajaxAdd('StatementBill', params, function (obj) {
                                                Ext.Msg.info('创建成功！');
                                                selModel.deselectAll();
                                                st.reload({
                                                    callback: function (recs, ope, success) {
                                                        if (success) {
                                                            selModel.select(index);
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            Ext.defer(function (){
                                                Ext.Msg.error('实付金额非数字，请确认后再创建!');
                                            }, 500);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            },
            {
                xtype: 'button',
                name: 'requestCheck',
                text: '递交审核',
                icon: 'resources/img/material_request_submit.png',
                hidden: !User.isAdmin(),
                handler: function (){
                    changeBillStatus('确定要递交单据吗?', '递交成功!');
                }
            },
            {
                xtype: 'button',
                name: 'checkPassed',
                text: '审核通过',
                icon: 'resources/img/material_request_approve.png',
                hidden: User.isAdminAssistant() || !User.isAdmin(),
                handler: function (){
                    changeBillStatus('确定要将当前递交的单据置为审核通过吗?', '审核通过!');
                }
            },
            {
                xtype: 'button',
                name: 'returnBill',
                text: '退回审核',
                icon: 'resources/img/return_material_order.png',
                hidden: User.isAdminAssistant() || !User.isAdmin(),
                handler: function (){
                    changeBillStatus('确定要将当前请求单据退回到上一状态吗?', '返回成功!', '-1');
                }
            }
        ]

        me.getTime = function (){
            var month = this.down('staffsalary-monthfield'),
                val = month.getValue();
            Ext.isDate(val) && (val = Ext.Date.format(val, 'm/Y'));
            return val ? {
                year: val.split('/')[1],
                month: val.split('/')[0]
            } : -1;
        };
        
        me.plugins = [
            Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToEdit: 2,
                listeners: {
                    beforeedit: function (editor, e){
                        var rec = e.record;
                        if (rec.get('billStatus') === 'chk' || rec.get('billStatus') === 'paid') {
                            Ext.Msg.error('已审核或已付款账单不能进行提成编辑!');
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    edit: function(editor, e) {
                        var field = e.field,
                            rec = e.record,
                            newValues = e.newValues,
                            params = {};
                        Ext.apply(newValues, {
                            id: rec.getId()
                        });
                        for (var pro in newValues) {
                            switch (pro) {
                                case 'staffRealName':
                                case 'staffLevel':
                                case 'commission':
                                case 'actualPaid':
                                case 'billStatus':
                                    continue;
                                    break;
                            
                                default:
                                    params[pro] = newValues[pro];
                                    break;
                            }
                        }
                        ajaxUpdate('StaffSalary', params, ['id'], function (obj){
                            var pickedTime = me.getTime();
                            showMsg(newValues.staffRealName + pickedTime.year + '年' + pickedTime.month + '月工资信息编辑成功！合计与实发信息需点击[同步]按钮获取。');
                        }, false, true);
                        e.record.commit();
                    }
                }
            })
        ];

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    allowDecimals: true,
                    minValue: 0
                },
                xtype: 'numbercolumn',
                format: '¥ 0,000.00'
            },
            items: [
                {
                    xtype: 'actioncolumn',
                    width: 25,
                    flex: null,
                    items: [
                        {
                            icon: 'resources/img/commission.png',
                            tooltip: '编辑提成',
                            handler: function (grid, rowIndex, colIndex){
                                var timeObj = me.getTime(),
                                    rec = grid.getStore().getAt(rowIndex);
                                if (rec.get('billStatus') === 'chk' || rec.get('billStatus') === 'paid') {
                                    Ext.Msg.error('已审核或已付款账单不能进行提成编辑!');
                                    return;
                                }
                                var win = Ext.create('FamilyDecoration.view.staffsalary.EditCommission', {
                                    data: {
                                        staffName: rec.get('staffName'),
                                        staffRealName: rec.get('staffRealName'),
                                        salaryTime: timeObj,
                                        rec: rec
                                    },
                                    callbackAfterEdit: function (){
                                        me.getStore().reload();
                                    }
                                });
                                win.show();
                            }
                        }
                    ],
                    editor: null
                },
                {
                    xtype: 'gridcolumn',
                    text: '状态',
                    dataIndex: 'billStatus',
                    editor: null,
                    flex: null,
                    width: 70,
                    renderer: function (val){
                        var res = '';
                        switch (val) {
                            case 'new':
                                res = '<font color="pink">新创建</font>';
                                break;
                            case 'rdyck':
                                res = '<font color="lightseagreen">待审核</font>';
                                break;
                            case 'chk':
                                res = '<font color="#00ff00">已审核</font>';
                                break;
                            case 'paid':
                                res = '<font color="blue">已付款</font>';
                                break;
                            default:
                                res = '未创建';
                                break;
                        }
                        return res;
                    }
                },
                {
                    text: '姓名',
                    dataIndex: 'staffRealName',
                    xtype: 'gridcolumn',
                    editor: null
                },
                {
                    text: '职务',
                    dataIndex: 'staffLevel',
                    renderer: function (val){
                        return User.renderRole(val);
                    },
                    xtype: 'gridcolumn',
                    editor: null
                },
                {
                    text: '底薪',
                    dataIndex: 'basicSalary'
                },
                {
                    text: '提成',
                    dataIndex: 'commission',
                    editor: null
                },
                {
                    text: '全勤',
                    dataIndex: 'fullAttendanceBonus'
                },
                {
                    text: '奖励',
                    dataIndex: 'bonus'
                },
                {
                    text: '违扣',
                    dataIndex: 'deduction'
                },
                {
                    text: '合计',
                    dataIndex: 'total',
                    editor: null
                },
                {
                    text: '五险',
                    dataIndex: 'insurance'
                },
                {
                    text: '公积金',
                    dataIndex: 'housingFund'
                },
                {
                    text: '个税',
                    dataIndex: 'incomeTax'
                },
                {
                    text: '其他',
                    dataIndex: 'others'
                },
                {
                    text: '实发',
                    dataIndex: 'actualPaid',
                    editor: null
                }
            ]
        }

        me.store = Ext.create('FamilyDecoration.store.StaffSalary', {
            listeners: {
                load: function (){
                    refreshBtn();
                }
            }
        });

        me.listeners = {
            selectionchange: function (selModel, sels, opts){
                refreshBtn();
            }
        }
        
        this.callParent();
    }
});