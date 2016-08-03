Ext.define('FamilyDecoration.view.entrynexit.EntryNExitBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entrynexit-entrynexitboard',
    title: '&nbsp;',
    cls: 'gridpanel-entrynexitboard',
    requires: [
        'FamilyDecoration.view.entrynexit.Payment'
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
                                    totalProperty: 'total'},
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
                    change: function (txt, newVal, oldVal, opts){
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
                                    totalProperty: 'total'},
                                extraParams: {
                                    action: 'EntryNExit.get',
                                    type: resObj.category.get('name'),
                                    c0: txt.previousSibling().getValue(),
                                    payee: txt.getValue()
                                }
                            });
                            resObj.st.loadPage(1);
                        }
                    },
                    change: function (txt, newVal, oldVal, opts){
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
                            me.refresh(resObj.category);
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
                disabled: true,
                handler: function () {

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
        }

        function getTbar() {
            var toolbar = me.down('toolbar');
            return {
                idSearch: toolbar.getComponent('textfield-id'),
                nameSearch: toolbar.getComponent('textfield-payee'),
                pay: toolbar.getComponent('button-pay'),
                receive: toolbar.getComponent('button-receive')
            };
        }

        function initTbar(rec) {
            var tbarObj = getTbar();
            tbarObj.idSearch.setValue('').show();
            tbarObj.nameSearch.setValue('').show();
            tbarObj.pay.hide();
            tbarObj.receive.hide();
            if (!rec ) {
                return;
            }
            switch (rec.get('name')){
                case 'designDeposit':
                case 'projectFee':
                case 'other':
                case 'loan':
                    tbarObj.receive.hide();
                    break;
                default: 
                    tbarObj.pay.show();
                    break;
            }
        }

        function refreshTbar(rec, item) {
            var tbarObj = getTbar();
            tbarObj.idSearch.setValue('').show();
            tbarObj.nameSearch.setValue('').show();
            if (!rec || !item) {
                return;
            }
            switch (rec.get('name')) {
                case 'designDeposit':
                case 'projectFee':
                case 'other':
                case 'loan':
                    tbarObj.receive.show().setDisabled(item.get('status') == 'paid');
                    break;
                default:
                    tbarObj.pay.show().setDisabled(item.get('status') == 'paid');
                    break;
            }
        }

        me.columnMapping = {
                'workerSalary':           ['单号:1.5','姓名','联系方式:0.8','工程名称:1.5','款项名称','核算工资','申领工资','实付','余额','凭证','付款时间:1','付款人:0.8'],
                'staffSalary':            ['单号:1.5','部门','姓名','基本工资','岗位工资','绩效工资(提成)','社保','结算工资','实付','凭证','付款时间','付款人'],
                'materialPayment':        ['单号:1.5','供应商','工程名称:1','联系方式:0.8','领款人','款项名称','核对价','申领款','实付','余款','凭证','付款时间:1','付款人'],
                'reimbursementItems':     ['单号:1.5','报销人','报销项目:1','联系方式:0.8','报销金额','实付','凭证','付款时间:1','付款人','报销归属:1.5'],
                'financialFee':           ['单号:1.5','归属款项:1','贷款银行','交办人','本期利率','本期款项','付款','付款人','日期:1'],
                'companyBonus':           ['单号:1.5','项目名称:1','款项归属','申请人','联系方式:0.8','申请金额','付款金额','付款人','付款日期:1','备注:1'],
                'tax':                    ['单号:1.5','项目名称:1','款项归属','申请人','领款人','联系方式:0.8','申请金额','付款金额','付款人','付款日期:1','备注:1'],
                'qualityGuaranteeDeposit':['单号:1.5','工程名称:1','领款人','联系方式:0.8','应付金额','实付金额','付款日期:1','付款人','备注:1'],
                'designDeposit':          ['单号:1.5','工程名称:1','业务员','设计师','客户姓名','联系方式:0.8','收款额','收款人'],
                'projectFee':             ['单号:1.5','工程名称:1','项目经理','设计师','客户姓名','联系方式:0.8','应交款','已交款','款项','收款时间:1'],
                'loan':                   ['单号:1.5','项目名称:1','银行','交办人','联系方式:0.8','收款金额','收款人','收款时间:1','当前利率','期限','贷款时间:1'],
                'other':                  ['单号:1.5','项目名称:1','入账单位','交款人','联系方式:0.8','收款金额','收款人','收款时间:1','款项归属']
        }
        // dynamically generate columns according to entry and exit type
        function generateCols(rec) {
            if (rec) {
				var items = me.columnMapping[rec.get('name')];
				var newItem = [];
				for(var i = 0;i<items.length;i++){
					var cfgs = items[i].split(':');
					newItem.push({ text: cfgs[0], dataIndex: 'c'+i,flex:parseFloat(cfgs[1]||0.5),align:cfgs[2]||'left'});
				}
				return newItem;
			}else{
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

        me.refresh = function (rec) {
            var resObj = _getRes();
            me.rec = rec;
            me.setTitle(rec ? rec.get('value') : '&nbsp;' );
            initTbar(rec);
            if (rec) {
                var st = generateSt(rec);
                // bind current store to paging tool bar
                resObj.pagingTool.bindStore(st);
                me.reconfigure(st, generateCols(rec));
                st.setProxy({
                    type: 'rest',
                    url: './libs/api.php',
                    reader: {
                        type: 'json',
                        root: 'data',
                        totalProperty: 'total'
                    },
                    extraParams: {
                        action: 'EntryNExit.get',
                        type: rec.get('name')
                    }
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
                    refreshTbar(me.rec, item);
                }
            }
        );

        me.callParent();
    }
});