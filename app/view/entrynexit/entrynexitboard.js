Ext.define('FamilyDecoration.view.entrynexit.EntryNExitBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entrynexit-entrynexitboard',
    title: '&nbsp;',
    cls: 'gridpanel-entrynexitboard',
    requires: [
        'FamilyDecoration.view.entrynexit.Payment',
        'FamilyDecoration.view.entrynexit.ReceivementDesignDeposit',
        'FamilyDecoration.view.entrynexit.ReceivementProjectFee',
        'FamilyDecoration.view.entrynexit.ReceivementOther',
        'FamilyDecoration.view.entrynexit.ReceivementLoan',
        'FamilyDecoration.view.paymentrequest.AttachmentManagement',
        'FamilyDecoration.view.entrynexit.ReceivementDepositIn'
    ],
    // viewConfig: {
    //     emptyText: '请选择条目进行加载',
    //     deferEmptyText: false
    // },
    rec: null, // which item we choose in entry and exit left column
    columns: [],

    initComponent: function () {
        var me = this;

        function _getRes() {
            var selModel = me.getSelectionModel(),
                st = me.getStore();
            return {
                category: me.rec,
                selModel: selModel,
                st: st,
                item: selModel.getSelection()[0],
                pagingTool: me.down('pagingtoolbar')
            };
        }

        me.tbar = [
            {
                xtype: 'textfield',
                emptyText: '查询单号',
                itemId: 'textfield-id',
                hidden: false,
                enableKeyEvents: true,
                listeners: {
                    keydown: function (txt, ev, opts) {
                        var resObj = _getRes();
                        if (ev.keyCode == 13) {
                            resObj.st.setProxy({
                                type: 'rest',
                                url: './libs/api.php',
                                reader: {
                                    type: 'json',
                                    root: 'data',
                                    totalProperty: 'total'
                                },
                                extraParams: {
                                    action: 'EntryNExit.get',
                                    type: resObj.category.get('name'),
                                    payee: txt.nextSibling().getValue(),
                                    c0: txt.getValue()
                                }
                            });
                            resObj.st.loadPage(1);
                        }
                    },
                    change: function (txt, newVal, oldVal, opts) {
                        var resObj = _getRes(),
                            oldProxy = resObj.st.getProxy();
                        if (newVal == '' && resObj.category) {
                            delete oldProxy.extraParams.c0;
                            resObj.st.setProxy(oldProxy);
                            resObj.st.loadPage(1);
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                emptyText: '查询报销人',
                itemId: 'textfield-payee',
                hidden: false,
                enableKeyEvents: true,
                listeners: {
                    keydown: function (txt, ev, opts) {
                        var resObj = _getRes();
                        if (ev.keyCode == 13) {
                            resObj.st.setProxy({
                                type: 'rest',
                                url: './libs/api.php',
                                reader: {
                                    type: 'json',
                                    root: 'data',
                                    totalProperty: 'total'
                                },
                                extraParams: {
                                    action: 'EntryNExit.get',
                                    type: resObj.category.get('name'),
                                    c1: txt.previousSibling().getValue(),
                                    payee: txt.getValue()
                                }
                            });
                            resObj.st.loadPage(1);
                        }
                    },
                    change: function (txt, newVal, oldVal, opts) {
                        var resObj = _getRes(),
                            oldProxy = resObj.st.getProxy();
                        if (newVal == '' && resObj.category) {
                            delete oldProxy.extraParams.c1;
                            delete oldProxy.extraParams.payee;
                            resObj.st.setProxy(oldProxy);
                            resObj.st.loadPage(1);
                        }
                    }
                }
            },
            {
                xtype: 'button',
                text: '付款',
                itemId: 'button-pay',
                icon: 'resources/img/payment.png',
                hidden: true,
                disabled: true,
                handler: function () {
                    var resObj = _getRes();
                    var win = Ext.create('FamilyDecoration.view.entrynexit.Payment', {
                        category: resObj.category,
                        item: resObj.item,
                        callback: function () {
                            me.refresh(resObj.category, false);
                        }
                    });
                    win.show();
                }
            },
            {
                xtype: 'button',
                text: '收款',
                itemId: 'button-receive',
                icon: 'resources/img/money_collect.png',
                hidden: true,
                handler: function () {
                    var resObj = _getRes();
                    switch (resObj.category.get('name')) {
                        case 'designDeposit':
                            var win = Ext.create('FamilyDecoration.view.entrynexit.ReceivementDesignDeposit', {
                                category: resObj.category,
                                item: resObj.item,
                                callback: function () {
                                    me.refresh(resObj.category, false);
                                }
                            });
                            win.show();
                            break;
                        case 'projectFee':
                            var win = Ext.create('FamilyDecoration.view.entrynexit.ReceivementProjectFee', {
                                category: resObj.category,
                                item: resObj.item,
                                callback: function () {
                                    me.refresh(resObj.category, false);
                                }
                            });
                            win.show();
                            break;
                        case 'depositIn':
                            var win = Ext.create('FamilyDecoration.view.entrynexit.ReceivementDepositIn', {
                                category: resObj.category,
                                item: resObj.item,
                                callback: function () {
                                    me.refresh(resObj.category, false);
                                }
                            });
                            win.show();
                            break;
                        case 'other':
                            var win = Ext.create('FamilyDecoration.view.entrynexit.ReceivementOther', {
                                category: resObj.category,
                                item: resObj.item,
                                callback: function () {
                                    me.refresh(resObj.category, false);
                                }
                            });
                            win.show();
                            break;
                        case 'loan':
                            var win = Ext.create('FamilyDecoration.view.entrynexit.ReceivementLoan', {
                                category: resObj.category,
                                item: resObj.item,
                                callback: function () {
                                    me.refresh(resObj.category, false);
                                }
                            });
                            win.show();
                            break;
                        default:
                            break;
                    }
                }
            },
            {
                xtype: 'button',
                text: '退单',
                itemId: 'button-reject',
                icon: 'resources/img/reject.png',
                disabled: true,
                hidden: true,
                handler: function () {
                    var resObj = _getRes();
                    if (resObj.item) {
                        Ext.Msg.warning('确定要将当前账单退回到上一状态吗？', function (btnId) {
                            if ('yes' == btnId) {
                                function request(validateCode) {
                                    var params = {
                                        id: resObj.item.get('c0'),
                                        status: '-1',
                                        currentStatus: resObj.item.get('status')
                                    },
                                        arr = ['id', 'currentStatus'];
                                    if (validateCode) {
                                        Ext.apply(params, {
                                            validateCode: validateCode
                                        });
                                        arr.push('validateCode');
                                    }
                                    ajaxUpdate('StatementBill.changeStatus', params, arr, function (obj) {
                                        Ext.defer(function () {
                                            Ext.Msg.success('单据已退回至上一状态!');
                                            me.refresh(resObj.category, false);
                                        }, 500);
                                    }, true);
                                }
                                ajaxGet('StatementBill', 'getLimit', {
                                    id: resObj.item.get('c0')
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
                        showMsg('请选择单据!');
                    }
                }
            }
        ];

        me.bbar = [
            {
                xtype: 'pagingtoolbar',
                displayInfo: true
            }
        ];

        me.viewConfig = {
            getRowClass: function (rec, rowIndex, rowParams, st) {
                var category = me.rec,
                    cls = '';
                switch (category.get('name')) {
                    case 'workerSalary':
                    case 'staffSalary':
                    case 'materialPayment':
                    case 'reimbursementItems':
                    case 'financialFee':
                    case 'companyBonus':
                    case 'tax':
                    case 'qualityGuaranteeDeposit':
                        cls = rec.get('status') == 'paid' ? 'bill-paid' : 'bill-unpaid';
                        break;
                    default:
                        break;
                }
                return cls;
            }
        };

        function getTbar() {
            var toolbar = me.down('toolbar');
            return {
                idSearch: toolbar.getComponent('textfield-id'),
                nameSearch: toolbar.getComponent('textfield-payee'),
                pay: toolbar.getComponent('button-pay'),
                receive: toolbar.getComponent('button-receive'),
                reject: toolbar.getComponent('button-reject')
            };
        }

        function initTbar(rec, isClear) {
            var tbarObj = getTbar();
            if (isClear !== false) {
                tbarObj.idSearch.setValue('');
                tbarObj.nameSearch.setValue('');
            }
            tbarObj.idSearch.show();
            tbarObj.nameSearch.show();
            User.isAdmin() && tbarObj.reject.show();
            tbarObj.pay.hide();
            tbarObj.receive.hide();
            if (!rec) {
                return;
            }
            switch (rec.get('name')) {
                case 'designDeposit':
                case 'depositIn':
                case 'projectFee':
                case 'other':
                case 'loan':
                    tbarObj.receive.show();
                    break;
                default:
                    tbarObj.pay.show();
                    break;
            }
        }

        function refreshTbar(rec, item, isClear) {
            var tbarObj = getTbar();
            if (isClear !== false) {
                tbarObj.idSearch.setValue('');
                tbarObj.nameSearch.setValue('');
            }
            tbarObj.idSearch.show();
            tbarObj.nameSearch.show();
            // tbarObj.receive.setDisabled(true);
            tbarObj.pay.setDisabled(true);
            tbarObj.reject.setDisabled(true);
            if (!rec) {
                return;
            }
            if (User.isAdmin() && rec.get('name')) {
                tbarObj.reject.setDisabled(!item);
            }
            switch (rec.get('name')) {
                case 'designDeposit':
                case 'depositIn':
                case 'projectFee':
                case 'other':
                case 'loan':
                    // tbarObj.receive.show().setDisabled(!item || item.get('status') == 'paid');
                    break;
                default:
                    tbarObj.pay.show().setDisabled(!item || item.get('status') != 'chk');
                    break;
            }
        }

        me.columnMapping = {
            'workerSalary': ['单号:1', '姓名', '联系方式:0.8', '工程名称:0.8', '款项名称', '核算工资:0.8', '申领工资:0.8', '实付', '余额', '凭证:0.5:center:true', '付款时间:0.8', '付款人:0.8'],
            'staffSalary': ['单号:1', '部门', '姓名', '基本工资:0.7', '岗位工资:0.7', '绩效工资(提成):0.8', '社保', '结算工资:0.8', '实付', '凭证:0.5:center:true', '付款时间:0.7', '付款人:0.6'],
            'materialPayment': ['单号:0.7', '供应商:0.6', '工程名称:0.7', '联系方式:0.7', '领款人:0.6', '款项名称:0.7', '核对价:0.6', '申领款:0.6', '实付', '余款', '凭证:0.5:center:true', '付款时间:0.8', '付款人:0.6'],
            'reimbursementItems': ['单号:1', '报销人:0.6', '报销项目:0.7', '联系方式:0.7', '报销金额:0.7', '实付', '凭证:0.5:center:true', '付款时间:0.7', '付款人:0.6', '报销归属:0.8'],
            'financialFee': ['单号:1', '归属款项:0.8', '贷款银行:0.8', '交办人:0.7', '本期利率:0.8', '本期款项:0.8', '付款', '付款人:0.7', '日期'],
            'companyBonus': ['单号:1', '项目名称:0.8', '款项归属:0.8', '申请人:0.7', '联系方式:0.8', '申请金额:0.8', '付款金额:0.8', '付款人:0.7', '付款日期:0.8', '备注'],
            'tax': ['单号:1', '项目名称:0.8', '款项归属:0.8', '申请人:0.7', '领款人:0.7', '联系方式:0.8', '申请金额:0.8', '付款金额:0.8', '付款人:0.7', '付款日期:0.8', '备注'],
            'qualityGuaranteeDeposit': ['单号:1', '工程名称:0.8', '领款人:0.7', '联系方式:0.8', '应付金额:0.8', '实付金额:0.8', '付款日期:0.8', '付款人:0.7', '备注'],
            'depositOut': ['单号:1','工程名称:1','保证金金额:1', '领款人:1', '申请人:1', '付款时间:1', '联系人:1', '联系方式:1'],
            'depositIn': ['单号:1', '项目名称:0.8', '入账单位:0.8', '交款人:0.7', '联系方式:0.8', '收款金额:0.8', '收款人:0.7', '收款时间:0.8', '款项归属:0.8'],
            'designDeposit': ['单号:1', '业务名称:0.8', '工程名称:0.8', '业务员:0.7', '设计师:0.7', '客户姓名:0.8', '联系方式:0.8', '收款额:0.7', '收款人:0.7'],
            'projectFee': ['单号:1', '工程名称:0.8', '项目经理:0.8', '设计师:0.7', '客户姓名:0.8', '联系方式:0.8', '预算总额:0.8', '应交款:0.7', '已交款:0.7', '款项', '收款时间:0.8'],
            'loan': ['单号:1', '项目名称:0.8', '银行', '交办人:0.7', '联系方式:0.8', '收款金额:0.8', '收款人:0.7', '收款时间:0.8', '当前利率:0.8', '期限', '贷款时间:0.8'],
            'other': ['单号:1', '项目名称:0.8', '入账单位:0.8', '交款人:0.7', '联系方式:0.8', '收款金额:0.8', '收款人:0.7', '收款时间:0.8', '款项归属:0.8']
        }
        // dynamically generate columns according to entry and exit type
        function generateCols(rec) {
            if (rec) {
                var typeName = rec.get('name');
                var items = me.columnMapping[typeName];
                var newItem = [];
                for (var i = 0; i < items.length; i++) {
                    var cfgs = items[i].split(':');
                    newItem.push({
                        text: cfgs[0],
                        dataIndex: 'c' + i,
                        flex: parseFloat(cfgs[1] || 0.5),
                        align: cfgs[2] || 'left',
                        hidden: cfgs[3] == 'true' ? true : false,
                        renderer: (function (i) {
                            return function (val, meta, rec) {
                                var index = i;
                                if (typeName == 'materialPayment') {
                                    if (2 == index || 3 == index) {
                                        return val && val.replace(/,/gi, '<br />');
                                    }
                                    else {
                                        return val;
                                    }
                                }
                                else {
                                    return val;
                                }
                            }
                        })(i)
                    });
                }
                newItem.push(
                    {
                        width: 60,
                        xtype: 'actioncolumn',
                        text: '凭证',
                        items: [
                            {
                                icon: 'resources/img/attachment.png',
                                tooltip: '点击查看凭证',
                                handler: function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    win = Ext.create('FamilyDecoration.view.paymentrequest.AttachmentManagement', {
                                        infoObj: {
                                            refType: 'statement_bill',
                                            refId: rec.get('c0')
                                        }
                                    });
                                    win.show();
                                }
                            },
                            {
                                icon: 'resources/img/previewbill.png',
                                tooltip: '点击预览单据',
                                handler: function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    if (rec) {
                                        var win = window.open('./fpdf/statement_bill.php?id=' + rec.get('c0'), '预览', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                    }
                                    else {
                                        showMsg('没有账单！');
                                    }
                                }
                            },
                            {
                                icon: 'resources/img/printbill.png',
                                tooltip: '点击打印单据',
                                handler: function (grid, rowIndex, colIndex) {
                                    var rec = grid.getStore().getAt(rowIndex);
                                    if (rec) {
                                        var win = window.open('./fpdf/statement_bill.php?id=' + rec.get('c0'), '打印', 'height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
                                        win.print();
                                    }
                                    else {
                                        showMsg('没有账单！');
                                    }
                                }
                            }
                        ]
                    }
                )
                return newItem;
            } else {
                return [];
            }
        }

        function generateSt(rec) {
            var fields = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13'],
                st;
            if (!rec) {
                return false;
            }
            var legth = me.columnMapping[rec.get('name')].length;
            fields = fields.slice(0, legth);
            fields.push('status');
            st = Ext.create('Ext.data.Store', {
                fields: fields,
                autoLoad: false,
                remoteSort: true,
                proxy: {
                    url: 'libs/api.php',
                    type: 'rest',
                    reader: {
                        type: 'json',
                        root: 'data',
                        totalProperty: 'total'
                    },
                    extraParams: {
                        action: 'EntryNExit.get'
                    }
                }
            });
            return st;
        }

        me.refresh = function (rec, isClear) {
            var resObj = _getRes();
            me.rec = rec;
            me.setTitle(rec ? rec.get('value') : '&nbsp;');
            initTbar(rec, isClear);
            if (rec) {
                var id = me.down('toolbar').getComponent('textfield-id').getValue();
                var name = me.down('toolbar').getComponent('textfield-payee').getValue();
                var st = generateSt(rec);
                // bind current store to paging tool bar
                resObj.pagingTool.bindStore(st);
                me.reconfigure(st, generateCols(rec));
                var extraParams = {
                    action: 'EntryNExit.get',
                    type: rec.get('name')
                }
                if (id && id != "")
                    extraParams.c0 = id;
                if (name && name != "")
                    extraParams.payee = name;

                st.setProxy({
                    type: 'rest',
                    url: './libs/api.php',
                    reader: { type: 'json', root: 'data', totalProperty: 'total' },
                    extraParams: extraParams
                });


                st.loadPage(1);
            }
            else {
                me.reconfigure(false, []);
            }
        }

        me.items = [

        ];

        me.addListener(
            {
                selectionchange: function (selModel, sels, opts) {
                    var item = sels[0];
                    refreshTbar(me.rec, item, false);
                }
            }
        );

        me.callParent();
    }
});