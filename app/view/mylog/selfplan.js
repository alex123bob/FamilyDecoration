Ext.define('FamilyDecoration.view.mylog.SelfPlan', {
    extend: 'Ext.window.Window',
    alias: 'widget.mylog-selfplan',
    requires: [

    ],
    title: '个人计划',
    modal: true,
    layout: 'vbox',
    maximizable: true,
    width: 550,
    height: 340,
    bodyPadding: 4,
    defaults: {
        xtype: 'fieldcontainer',
        height: 20,
        width: '100%',
        layout: 'hbox'
    },
    closable: false,
    autoScroll: true,
    initInfo: null, // includes: staffName, rec(current selected item),
    afterClose: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        function _generateCmp(index, rec) {
            return {
                defaults: {
                    height: '100%'
                },
                items: [
                    {
                        xtype: 'button',
                        text: 'X',
                        name: 'button-logItem',
                        margin: '0 2 0 0',
                        hidden: rec ? (rec.editable == '0' ? true : false) : false,
                        handler: function () {
                            var btn = this,
                                ct = btn.ownerCt,
                                hiddenField = ct.items.items[3];
                            ajaxDel('LogList', {
                                id: hiddenField.getValue()
                            }, function (obj){
                                showMsg('删除成功！');
                                _refreshCmp();
                            });
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'textfield-logItem',
                        flex: 1,
                        labelWidth: 20,
                        allowBlank: false,
                        fieldLabel: (index + 1).toString(),
                        tabIndex: (index + 1),
                        readOnly: rec ? (rec.editable == '0' ? true : false) : false,
                        value: rec ? rec.content : '',
                        listeners: {
                            blur: function (txt, ev, opts){
                                var ct = txt.ownerCt,
                                    hiddenField = ct.items.items[3];
                                if (txt.isValid()) {
                                    ajaxUpdate('LogList', {
                                        content: txt.getValue(),
                                        id: hiddenField.getValue()
                                    }, 'id', function (obj){
                                        showMsg('计划内容更新成功！');
                                        // _refreshCmp();
                                    });
                                }
                            }
                        }
                    },
                    {
                        xtype: 'checkboxfield',
                        name: 'isFinished',
                        inputValue: false,
                        width: 40,
                        margin: '0 0 0 2',
                        value: rec ? (rec.isFinished == '1' ? true : false) : false,
                        listeners: {
                            change: function (chk, newVal, oldVal, opts){
                                var chk = this,
                                    ct = chk.ownerCt,
                                    hiddenField = ct.items.items[3];
                                ajaxUpdate('LogList', {
                                    isFinished: newVal ? 1 : 0,
                                    id: hiddenField.getValue()
                                }, 'id', function (obj){
                                    showMsg('计划状态更改成功！');
                                    // _refreshCmp();
                                });
                            }
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'hiddenfield-selfPlanId',
                        value: rec ? rec.id : ''
                    },
                    {
                        xtype: 'displayfield',
                        hideLabel: true,
                        name: 'displayfield-createTime',
                        value: rec ? (rec.editable == '0' ? rec.createTime.slice(5,10) : '') : '',
                        hidden: rec ? (rec.editable == '0' ? false : true) : true,
                        width: 40
                    }
                ]
            };
        }

        function _refreshCmp (){
            me.removeAll();
            ajaxGet('LogList', false, {
                committer: me.initInfo.staffName,
                logType: 0,
                day: me.initInfo.rec.get('year') + '-' + me.initInfo.rec.get('month') + '-' + me.initInfo.rec.get('day')
            }, function (obj){
                var arr = obj.data;
                Ext.each(arr, function (obj, index, self){
                    me.insert(index, _generateCmp(index, obj));
                });
            });
        }

        me.items = [];

        me.buttons = [
            {
                text: '添加',
                handler: function () {
                    ajaxAdd('LogList', {
                        committer: me.initInfo.staffName,
                        createTime: me.initInfo.rec.get('year') + '-' + me.initInfo.rec.get('month') + '-' + me.initInfo.rec.get('day'),
                        logType: 0
                    }, function (obj){
                        if (obj.status == 'successful') {
                            showMsg('添加成功！');
                            // _refreshCmp();
                            Ext.suspendLayouts();

                            var index = me.items.items.length;
                            me.insert(index, _generateCmp(index, obj.data));

                            Ext.resumeLayouts(true);
                        }
                    });

                }
            },
            {
                text: '关闭',
                handler: function () {
                    var ctArr = me.query('fieldcontainer'),
                        flag = true;
                    Ext.each(ctArr, function (ct, index, self){
                        if (ct.down('textfield').isValid()) {
                        }
                        else {
                            flag = false;
                            return false;
                        }
                    });
                    if (flag) {
                        me.close();
                        me.afterClose();
                    }
                }
            }
        ];

        me.addListener('afterrender', function (win, opts){
            _refreshCmp();
        });

        this.callParent();
    }
});