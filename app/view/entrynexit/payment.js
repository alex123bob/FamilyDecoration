Ext.define('FamilyDecoration.view.entrynexit.Payment', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-payment',
    title: '付款',

    requires: [
    ],

    layout: 'vbox',
    width: 500,
    height: 300,
    modal: true,
    maximizable: true,
    bodyPadding: 5,

    category: undefined,
    item: undefined,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'fieldset',
                title: '信息',
                itemId: 'fieldset-headerInfo',
                width: '100%',
                flex: 1,
                defaults: {
                    xtype: 'displayfield'
                },
                items: [

                ]
            },
            {
                xtype: 'fieldset',
                title: '选项',
                width: '100%',
                flex: 1,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: '付款金额',
                        xtype: 'textfield'
                    },
                    {
                        fieldLabel: '付款账户',
                        xtype: 'combobox',
                        displayfield: 'name',
                        valuefield: 'value',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value']
                        })
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        this.addListener({
            show: function (win, opts){
                var headerSet = me.getComponent('fieldset-headerInfo');
                ajaxGet('EntryNExit', 'getPayHeader', {
                    id: me.item.get('c0'),
                    type: me.category.get('name')
                }, function (obj){
                    if (obj.length > 0) {
                        Ext.each(obj, function (item, index, arr){
                            arr[index] = {
                                fieldLabel: item['k'],
                                value: item['v']
                            }
                        });
                        headerSet.add(obj);
                    }
                    else {

                    }
                });
            }
        })

        this.callParent();
    }
});