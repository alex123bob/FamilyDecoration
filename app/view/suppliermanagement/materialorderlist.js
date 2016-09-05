Ext.define('FamilyDecoration.view.suppliermanagement.MaterialOrderList', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.suppliermanagement-materialorderlist',
    title: '订购单列表',
	requires: [
		'FamilyDecoration.store.MaterialOrderList',
        'FamilyDecoration.view.suppliermanagement.ApplyForPayment'
	],
    supplier: undefined,

	initComponent: function () {
		var me = this;

        var st = Ext.create('FamilyDecoration.store.MaterialOrderList', {
            autoLoad: false
        });

        function _getRes() {
            var st = me.getStore(),
                selModel = me.getSelectionModel(),
                order = selModel.getSelection()[0];
            return {
                st: st,
                selModel: selModel,
                order: order
            };
        }

        function _getBtns() {
            return {
                confirm: me.down('button[name="confirm"]'),
                request: me.down('button[name="request"]'),
                pass: me.down('button[name="pass"]'),
                return: me.down('button[name="return"]')
            };
        }

        function _initBtn(supplier) {
            var btnObj = _getBtns(),
                resObj = _getRes();
            btnObj.confirm.setDisabled(!supplier || !resObj.order);
            btnObj.request.setDisabled(!supplier || !resObj.order);
            btnObj.pass.setDisabled(!supplier || !resObj.order);
            btnObj.return.setDisabled(!supplier || !resObj.order);
        }

        function _initGrid(supplier) {
            var resObj = _getRes();
            if (supplier) {
                var proxy = resObj.st.getProxy();
                proxy.extraParams.supplierId = supplier.getId();
                resObj.st.setProxy(proxy);
                resObj.st.loadPage(1, {
                    callback: function (recs, ope, success) {
                        if (success) {
                            var index = resObj.st.indexOf(resObj.order);
                            resObj.selModel.deselectAll();
                            if (-1 != index) {
                                resObj.selModel.select(index);
                            }
                        }
                    }
                });
            }
            else {
                resObj.st.removeAll();
            }
        }

        me.refresh = function (supplier) {
            me.supplier = supplier;
            _initBtn(supplier);
            _initGrid(supplier);
        };

        me.store = st;

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: st,
                dock: 'bottom',
                displayInfo: true
            }
        ];

        me.tbar = [
            {
                text: '确认发货',
                name: 'confirm',
                disabled: true,
                icon: 'resources/img/confirm_dispatch.png',
                handler: function (){
                    
                }
            },
            {
                text: '申请付款',
                name: 'request',
                disabled: true,
                icon: 'resources/img/request_payment.png',
                handler: function (){
                    var win = Ext.create('FamilyDecoration.view.suppliermanagement.ApplyForPayment', {

                    });
                    win.show();
                }
            },
            {
                text: '申付审核通过',
                name: 'pass',
                disabled: true,
                icon: 'resources/img/payment_approval.png',
                handler: function (){
                    
                }
            },
            {
                text: '退回申付',
                name: 'return',
                disabled: true,
                icon: 'resources/img/payment_return.png',
                handler: function (){

                }
            },
            {
                xtype: 'textfield',
                fieldLabel: '总累计金额',
                readOnly: true,
                labelWidth: 80
            }
        ];

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    text: '工程名称'
                },
                {
                    text: '项目经理'
                },
                {
                    text: '订购总金额'
                },
                {
                    text: '订购单'
                },
                {
                    text: '订购日期'
                },
                {
                    text: '是否审核'
                },
                {
                    text: '申领金额'
                },
                {
                    text: '已付金额'
                }
            ]
        };

		this.callParent();
	}
});