Ext.define('FamilyDecoration.view.contractmanagement.PickUser', {
    extend: 'Ext.window.Window',
    alias: 'widget.contractmanagement-PickUser',
    requires: [
        'FamilyDecoration.store.User'
    ],
    layout: 'fit',
    defaults: {

    },
    title: '选择人员',
    modal: true,
    width: 400,
    height: 300,
    userFilter: undefined,
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridpanel',
                itemId: 'gridpanel-personnelList',
                columns: [
                    {
                        text: '姓名',
                        dataIndex: 'realname',
                        flex: 1
                    },
                    {
                        text: '部门',
                        dataIndex: 'level',
                        flex: 1,
                        renderer: function (val) {
                            return User.renderDepartment(val);
                        }
                    },
                    {
                        text: '职位',
                        dataIndex: 'level',
                        flex: 1,
                        renderer: function (val) {
                            return User.renderRole(val);
                        }
                    }
                ],
                store: Ext.create('FamilyDecoration.store.User', {
                    autoLoad: true,
                    filters: [
                        function (item) {
                            if (me.userFilter) {
                                if (me.userFilter.test(item.get('level'))) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                return true;
                            }
                        }
                    ]
                }),
                autoScroll: true
            }
        ];
        me.buttons = [
            {
                text: '确定',
                handler: function () {
                    var grid = me.getComponent('gridpanel-personnelList'),
                        rec = grid.getSelectionModel().getSelection()[0];
                    if (rec) {
                        me.callback && me.callback(rec);
                    }
                    else {
                        showMsg('请选择人员!');
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