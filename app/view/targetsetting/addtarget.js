Ext.define('FamilyDecoration.view.targetsetting.AddTarget', {
    extend: 'Ext.window.Window',
    alias: 'widget.targetsetting-addtarget',
    requires: [
        'FamilyDecoration.view.checklog.MemberList',
        'FamilyDecoration.store.User'
    ],
    title: '添加目标量',
    width: 500,
    height: 280,
    bodyPadding: 10,
    modal: true,
    layout: 'fit',

    depa: undefined,
    timeObj: undefined,

    initComponent: function () {
        var me = this,
            configuredItems = [
                {
                    fieldLabel: '人员',
                    name: 'user',
                    allowBlank: false,
                    readOnly: true,
                    listeners: {
                        focus: function (txt, ev, opts) {
                            var win = Ext.create('Ext.window.Window', {
                                width: 400,
                                height: 300,
                                modal: true,
                                title: '选择人员',
                                layout: 'fit',
                                items: [
                                    {
                                        hideHeaders: true,
                                        xtype: 'gridpanel',
                                        store: Ext.create('FamilyDecoration.store.User', {
                                            autoLoad: true,
                                            filters: [
                                                function (item){
                                                    if (me.depa.get('value') == 'marketDepartment') {
                                                        return /^004-\d{3}$/i.test(item.get('level'));
                                                    }
                                                    else if (me.depa.get('value') == 'designDepartment') {
                                                        return /^002-\d{3}$/i.test(item.get('level'));
                                                    }
                                                }
                                            ]
                                        }),
                                        columns: [
                                            {
                                                text: '姓名',
                                                dataIndex: 'realname',
                                                align: 'center',
                                                flex: 1
                                            }
                                        ]
                                    }
                                ],
                                buttons: [
                                    {
                                        text: '确定',
                                        handler: function () {
                                            var grid = win.down('gridpanel'),
                                                user = grid.getSelectionModel().getSelection()[0],
                                                userField = me.down('[name="user"]'),
                                                userNameField = me.down('[name="userName"]');
                                            userField.setValue(user.get('realname'));
                                            userNameField.setValue(user.get('name'));
                                            win.close();
                                        }
                                    },
                                    {
                                        text: '取消',
                                        handler: function () {
                                            win.close();
                                        }
                                    }
                                ]
                            });
                            win.show();
                        }
                    }
                },
                {
                    xtype: 'hidden',
                    name: 'userName'
                }
            ];

        if (me.depa.get('value') == 'marketDepartment') {
            configuredItems.push(
                {
                    fieldLabel: '扫楼',
                    name: 'c1',
                    allowBlank: false
                },
                {
                    fieldLabel: '电销',
                    name: 'c2',
                    allowBlank: false
                },
                {
                    fieldLabel: '到店',
                    name: 'c3',
                    allowBlank: false
                },
                {
                    fieldLabel: '定金',
                    name: 'c4',
                    allowBlank: false
                }
            );
        }
        else if (me.depa.get('value') == 'designDepartment') {
            configuredItems.push(
                {
                    fieldLabel: '定金率',
                    name: 'c1',
                    allowBlank: false
                },
                {
                    fieldLabel: '签单额',
                    name: 'c2',
                    allowBlank: false
                }
            );
        }

        me.items = [
            {
                xtype: 'form',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                autoScroll: true,
                defaultType: 'textfield',
                items: configuredItems
            }
        ];

        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var frm = me.down('form'),
                        obj;
                    if (frm.isValid()) {
                        obj = frm.getValues();
                        obj['user'] = obj['userName'];
                        delete obj.userName;
                        Ext.apply(obj, {
                            targetMonth: me.timeObj.year + '-' + me.timeObj.month
                        });
                        ajaxAdd('BusinessGoal', obj, function (obj){
                            showMsg('添加成功！');
                            me.close();
                        });
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ]

        me.callParent();
    }
})