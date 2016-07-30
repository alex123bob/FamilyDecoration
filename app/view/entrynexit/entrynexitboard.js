Ext.define('FamilyDecoration.view.entrynexit.EntryNExitBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entrynexit-entrynexitboard',
    title: '&nbsp;',
    requires: [

    ],
    // viewConfig: {
    //     emptyText: '请选择条目进行加载',
    //     deferEmptyText: false
    // },
    columns: [],

    initComponent: function () {
        var me = this;

        me.tbar = [
            {
                xtype: 'button',
                text: '付款',
                itemId: 'button-pay',
                icon: 'resources/img/payment.png',
                hidden: true,
                disabled: true,
                handler: function () {

                }
            },
            {
                xtype: 'button',
                text: '收款',
                itemId: 'button-receive',
                icon: 'resources/img/money_collect.png',
                hidden: true,
                disabled: true,
                handler: function (){

                }
            }
        ];

        function getTbar() {
            var toolbar = me.down('toolbar');
            return {
                pay: toolbar.getComponent('button-pay'),
                receive: toolbar.getComponent('button-receive')
            };
        }

        function initTbar(rec) {
            var tbarObj = getTbar();
            function hideAllbtn() {
                for (var key in tbarObj) {
                    if (tbarObj.hasOwnProperty(key)) {
                        var btn = tbarObj[key];
                        btn.hide();
                    }
                }
            }
            if (rec) {
                switch (rec.get('name')) {
                    case 'workerSalary':
                        tbarObj.pay.show();
                        break;
                    case 'projectFee':
                        tbarObj.receive.show();
                        break;
                    default:
                        hideAllbtn();
                        break;
                }
            }
            else {
                hideAllbtn();
            }
        }

        function setTitle(rec) {
            if (rec) {
                me.setTitle(rec.get('value'));
            }
            else {
                me.setTitle('&nbsp;');
            }
        }

        // dynamically generate columns according to entry and exit type
        function generateCols(rec) {
            var cols = [];
            if (rec) {
                switch (rec.get('name')) {
                    case 'workerSalary':
                        cols = {
                            defaults: {
                                flex: 1,
                                align: 'center'
                            },
                            items: [
                                {
                                    text: '姓名',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '工程名称',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '款项名称',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '核算工资',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '申领工资',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '实付',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '余额',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '凭证',
                                    dataIndex: 'c9'
                                },
                                {
                                    text: '付款时间',
                                    dataIndex: 'c10'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c11'
                                }
                            ]
                        };
                        break;
                    case 'staffSalary':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '部门',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '姓名',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '基本工资',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '岗位工资',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '绩效工资(提成)',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '社保',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '结算工资',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '实付',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '凭证',
                                    dataIndex: 'c9'
                                },
                                {
                                    text: '付款时间',
                                    dataIndex: 'c10'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c11'
                                }
                            ]
                        };
                        break;
                    case 'materialPayment':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '供应商',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '工程名称',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '领款人',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '款项名称',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '核对价',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '申领款',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '实付',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '余款',
                                    dataIndex: 'c9'
                                },
                                {
                                    text: '凭证',
                                    dataIndex: 'c10'
                                },
                                {
                                    text: '付款时间',
                                    dataIndex: 'c11'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c12'
                                }
                            ]
                        };
                        break;
                    case 'reimbursementItems':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '报销人',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '报销项目',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '报销金额',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '实付',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '凭证',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '付款时间',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '报销归属',
                                    dataIndex: 'c9'
                                }
                            ]
                        };
                        break;
                    case 'financialFee':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '序号',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '归属款项',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '贷款银行',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '交办人',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '本期利率',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '本期款项',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '付款',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '日期',
                                    dataIndex: 'c9'
                                }
                            ]
                        };
                        break;
                    case 'companyBonus':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '项目名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '款项归属',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '申请人',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '申请金额',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '付款金额',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '付款日期',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '备注',
                                    dataIndex: 'c9'
                                }
                            ]
                        };
                        break;
                    case 'tax':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '项目名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '款项归属',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '申请人',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '领款人',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '申请金额',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '付款金额',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '付款日期',
                                    dataIndex: 'c9'
                                },
                                {
                                    text: '备注',
                                    dataIndex: 'c10'
                                }
                            ]
                        };
                        break;
                    case 'qualityGuaranteeDeposit':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '工程名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '领款人',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '应付金额',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '实付金额',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '付款日期',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '付款人',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '备注',
                                    dataIndex: 'c8'
                                }
                            ]
                        };
                        break;
                    case 'designDeposit':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '工程名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '业务员',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '设计师',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '客户姓名',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '收款额',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '收款人',
                                    dataIndex: 'c7'
                                }
                            ]
                        };
                        break;
                    case 'projectFee':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '工程名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '项目经理',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '设计师',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '客户姓名',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '应交款',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '已交款',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '款项',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '收款时间',
                                    dataIndex: 'c9'
                                }
                            ]
                        };
                        break;
                    case 'loan':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '项目名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '银行',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '交办人',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '收款金额',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '收款人',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '收款时间',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '当前利率',
                                    dataIndex: 'c8'
                                },
                                {
                                    text: '期限',
                                    dataIndex: 'c9'
                                },
                                {
                                    text: '贷款时间',
                                    dataIndex: 'c10'
                                }
                            ]
                        };
                        break;
                    case 'other':
                        cols = {
                            defaults: {
                                align: 'center',
                                flex: 1
                            },
                            items: [
                                {
                                    text: '项目名称',
                                    dataIndex: 'c1'
                                },
                                {
                                    text: '入账单位',
                                    dataIndex: 'c2'
                                },
                                {
                                    text: '交款人',
                                    dataIndex: 'c3'
                                },
                                {
                                    text: '联系方式',
                                    dataIndex: 'c4'
                                },
                                {
                                    text: '收款金额',
                                    dataIndex: 'c5'
                                },
                                {
                                    text: '收款人',
                                    dataIndex: 'c6'
                                },
                                {
                                    text: '收款时间',
                                    dataIndex: 'c7'
                                },
                                {
                                    text: '款项归属',
                                    dataIndex: 'c8'
                                }
                            ]
                        };
                        break;
                    default:
                        break;
                }
                Ext.Array.each(cols.items, function (item, index, arr) {
                    var defaultConfig = cols.defaults;
                    if (!item.flex) {
                        item.flex = defaultConfig.flex;
                    }
                    if (!item.align) {
                        item.align = defaultConfig.align;
                    }
                });
                cols = cols.items;
            }
            return cols;
        }

        function generateSt(rec) {
            var fields = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13'],
                st;
            if (rec) {
                switch (rec.get('name')) {
                    case 'workerSalary':
                        fields = fields.slice(0, 12);
                        break;
                    case 'staffSalary':
                        fields = fields.slice(0, 12);
                        break;
                    case 'materialPayment':
                        fields = fields.slice(0, 13);
                        break;
                    case 'reimbursementItems':
                        fields = fields.slice(0, 10);
                        break;
                    case 'financialFee':
                        fields = fields.slice(0, 10);
                        break;
                    case 'companyBonus':
                        fields = fields.slice(0, 10);
                        break;
                    case 'tax':
                        fields = fields.slice(0, 11);
                        break;
                    case 'qualityGuaranteeDeposit':
                        fields = fields.slice(0, 9);
                        break;
                    case 'designDeposit':
                        fields = fields.slice(0, 8);
                        break;
                    case 'projectFee':
                        fields = fields.slice(0, 14);
                        break;
                    case 'loan':
                        fields = fields.slice(0, 11);
                        break;
                    case 'other':
                        fields = fields.slice(0, 9);
                        break;
                    default:
                        fields = [];
                        break;
                }
                st = Ext.create('Ext.data.Store', {
                    fields: fields,
                    autoLoad: false,
                    proxy: {
                        url: 'libs/api.php?action=EntryNExit.get',
                        type: 'rest',
                        reader: {
                            type: 'json',
                            root: 'data'
                        }
                    }
                });
                return st;
            }
            else {
                return false;
            }
        }

        me.refresh = function (rec) {
            setTitle(rec);
            initTbar(rec);
            if (rec) {
                var st = generateSt(rec);
                me.reconfigure(st, generateCols(rec));
                st.load({
                    params: {
                        type: rec.get('name')
                    }
                });
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
                    var rec = sels[0];
                    if (rec) {
                        console.log(rec);
                    }
                    else {

                    }
                }
            }
        );

        me.callParent();
    }
});