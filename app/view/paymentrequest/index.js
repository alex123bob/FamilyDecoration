Ext.define('FamilyDecoration.view.paymentrequest.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.paymentrequest-index',
    requires: [
        'FamilyDecoration.view.paymentrequest.PaymentListCt',
        'FamilyDecoration.view.setting.DepartmentCombo',
        'FamilyDecoration.store.User'
    ],
    refresh: Ext.emptyFn,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        height: '100%'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                title: '申请人员',
                flex: 1,
                xtype: 'gridpanel',
                name: 'gridpanel-requestUser',
                store: Ext.create('FamilyDecoration.store.User', {
                    autoLoad: User.isManager() || User.isAdmin() ? false : true,
                    proxy: {
                        type: 'rest',
                        reader: {
                            type: 'json'
                        },
                        url: 'libs/user.php',
                        extraParams: {
                            action: 'getUserByName',
                            name: User.getName()
                        }
                    }
                }),
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                hideHeaders: true,
                tbar: User.isManager() || User.isAdmin() ? [
                    {
                        xtype: 'setting-departmentcombo',
                        editable: false,
                        filterFn: function (item){
                            if (User.isAdmin()) {
                                return true;
                            }
                            else if (User.isManager()) {
                                return item.get('value') == User.level.slice(0, 3);
                            }
                            else {
                                return false;
                            }
                        },
                        listeners: {
                            afterrender: function (combo, opts){
                                combo.select(User.level.slice(0, 3));
                            },
                            change: function (combo, newVal, oldVal, opts){
                                var grid = combo.up('gridpanel'),
                                    st = grid.getStore();
                                st.setProxy({
                                    type: 'rest',
                                    reader: {
                                        type: 'json'
                                    },
                                    url: './libs/user.php?action=getFullUserListByDepartment',
                                    extraParams: {
                                        department: newVal
                                    }
                                });
                                st.load();
                            }
                        }
                    }
                ] : false,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '姓名',
                            dataIndex: 'realname'
                        },
                        {
                            text: '部门',
                            dataIndex: 'level',
                            renderer: function (val, meta, rec){
                                return User.renderDepartment(val);
                            }
                        }
                    ]
                },
                listeners: {
                    selectionchange: function (selModel, sels, opts){
                        var paymentListCt = me.down('paymentrequest-paymentlistct'),
                            requestUserGrid = me.down('[name="gridpanel-requestUser"]'),
                            user = requestUserGrid.getSelectionModel().getSelection()[0];
                        paymentListCt.user = user;
                        paymentListCt.initBtn(user);
                    }
                }
            },
            {
                xtype: 'paymentrequest-paymentlistct',
                flex: 5
            }
        ];

        me.callParent();
    }
});