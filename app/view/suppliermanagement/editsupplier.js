Ext.define('FamilyDecoration.view.suppliermanagement.EditSupplier', {
    extend: 'Ext.window.Window',
    alias: 'widget.suppliermanagement-editsupplier',
    requires: [
        'FamilyDecoration.store.Supplier'
    ],
    modal: true,
    title: '供应商编辑',
    width: 500,
    height: 400,
    bodyPadding: 5,
    maximizable: true,
    layout: 'fit',
    supplier: undefined,

    initComponent: function () {
        var me = this;

        me.setTitle(me.supplier ? '供应商编辑' : '供应商添加');

        me.items = [
            {
                xtype: 'form',
                layout: 'anchor',
                autoScroll: true,
                defaults: {
                    anchor: '100%',
                    allowBlank: false
                },
                defaultType: 'textfield',
                getPhoneCmp: function (sp) {
                    return {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            hideLabel: true,
                            allowBlank: false
                        },
                        defaultType: 'textfield',
                        isValid: function () {
                            var desc = this.down('[name="desc"]'),
                                phone = this.down('[name="phone"]');
                            return desc.isValid() && phone.isValid();
                        },
                        items: [
                            {
                                emptyText: '描述',
                                flex: 1,
                                name: 'desc',
                                maskRe: /[^:]/,
                                value: sp ? sp.desc : ''
                            },
                            {
                                xtype: 'displayfield',
                                value: ':',
                                width: 4
                            },
                            {
                                emptyText: '电话号码',
                                flex: 2,
                                name: 'phone',
                                vtype: 'phone',
                                value: sp ? sp.phone : ''
                            },
                            {
                                xtype: 'button',
                                width: 40,
                                text: 'X',
                                handler: function () {
                                    var fct = this.up('fieldcontainer'),
                                        frm = me.down('form');
                                    frm.remove(fct);
                                }
                            }
                        ]
                    }
                },
                items: [
                    {
                        fieldLabel: '供应商名称',
                        name: 'name',
                        value: me.supplier ? me.supplier.get('name') : ''
                    },
                    {
                        fieldLabel: '联系人',
                        name: 'boss',
                        value: me.supplier ? me.supplier.get('boss') : ''
                    },
                    {
                        fieldLabel: '供应商地址',
                        name: 'address',
                        value: me.supplier ? me.supplier.get('address') : ''
                    },
                    {
                        fieldLabel: '供应商邮箱',
                        name: 'email',
                        vtype: 'mail',
                        value: me.supplier ? me.supplier.get('email') : ''
                    },
                    {
                        xtype: 'button',
                        anchor: 'auto auto',
                        text: '添加联系人',
                        name: 'addContact',
                        handler: function () {
                            var frm = me.down('form'),
                                cmp = frm.getPhoneCmp();
                            frm.add(cmp);
                        }
                    }
                ]
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var frm = me.down('form'),
                        obj = {},
                        phone;
                    if (frm.isValid()) {
                        obj = frm.getValues();
                        if (Ext.isArray(obj.phone)) {
                            phone = [];
                            Ext.each(obj.phone, function (item, index, arr) {
                                phone.push(obj.desc[index] + ':' + item);
                            });
                            phone = phone.join(',');
                        }
                        else if (obj.phone) {
                            phone = obj['desc'] + ':' + obj['phone'];
                        }
                        else {
                            obj.phone = '';
                        }
                        obj.phone = phone;
                        delete obj.desc;
                        if (me.supplier) {
                            Ext.apply(obj, {
                                id: me.supplier.getId()
                            });
                            ajaxUpdate('Supplier', obj, ['id'], function (obj){
                                showMsg('更改成功！');
                                me.callback();
                                me.close();
                            });
                        }
                        else {
                            ajaxAdd('Supplier', obj, function (obj) {
                                showMsg('添加成功！');
                                me.callback();
                                me.close();
                            });
                        }
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

        me.addListener(
            {
                show: function (win, opts) {
                    if (win.supplier) {
                        var sp = win.supplier,
                            phone = sp.get('phone'),
                            frm = win.down('form');
                        phone = phone.split(',');
                        Ext.each(phone, function (p, i, a) {
                            p = p.split(':');
                            p = {
                                desc: p[0],
                                phone: p[1]
                            };
                            frm.add(frm.getPhoneCmp(p));
                        });
                    }
                }
            }
        );

        this.callParent();
    }
});