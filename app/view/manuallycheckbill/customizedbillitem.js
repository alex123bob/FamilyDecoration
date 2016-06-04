Ext.define('FamilyDecoration.view.manuallycheckbill.CustomizedBillItem', {
    extend: 'Ext.window.Window',
    alias: 'widget.manuallycheckbill-customizedbillitem',

    requires: [
    ],

    layout: 'form',
    width: 500,
    height: 300,
    modal: true,
    maximizable: true,
    bodyPadding: 5,
    defaultType: 'textfield',
    
    isForPrePaidItem: false,
    bill: undefined,
    callbackAfterClose: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                fieldLabel: '项目',
                name: 'billItemName',
                allowBlank: false,
                readOnly: me.isForPrePaidItem,
                value: me.isForPrePaidItem ? '预付': ''
            }, 
            {
                fieldLabel: '单位',
                name: 'unit',
                allowBlank: false,
                readOnly: me.isForPrePaidItem,
                value: me.isForPrePaidItem ? '项': ''
            }, 
            {
                fieldLabel: '数量',
                name: 'amount',
                allowBlank: false,
                readOnly: me.isForPrePaidItem,
                value: me.isForPrePaidItem ? '1': '',
                validator: function (val){
                    if (Ext.isNumber(parseFloat(val))) {
                        return true;
                    }
                    else {
                        return '请填写正确的数字!';
                    }
                }
            }, 
            {
                fieldLabel: '单价',
                name: 'unitPrice',
                allowBlank: false,
                validator: function (val){
                    if (Ext.isNumber(parseFloat(val))) {
                        return true;
                    }
                    else {
                        return '请填写正确的数字!';
                    }
                }
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var txts = me.query('textfield'),
                        flag = true,
                        item = {};
                    Ext.each(txts, function (txt, index, arr){
                        flag = txt.isValid();
                        if (!flag) {
                            return false;
                        }
                        else {
                            item[txt.name] = txt.getValue();
                        }
                    });
                    if (flag) {
                        item['billId'] = me.bill.getId();
                        ajaxAdd('StatementBillItem', item, function (obj){
                            showMsg('添加成功！');
                            me.close();
                            me.callbackAfterClose();
                        });
                    }
                    else {
                        // todo: error, can't be submitted
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.callParent();
    }
});