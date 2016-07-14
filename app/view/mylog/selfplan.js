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
    autoScroll: true,
    initInfo: null, // includes: staffName, rec(current selected item)

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
                        hidden: rec ? !rec.isToday : false,
                        handler: function () {
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'textfield-logItem',
                        flex: 1,
                        labelWidth: 20,
                        fieldLabel: (index + 1).toString(),
                        // readOnly: rec ? rec.isToday : false,
                        value: rec ? rec.content : ''
                    },
                    {
                        xtype: 'checkboxfield',
                        name: 'isFinished',
                        inputValue: false,
                        width: 40,
                        margin: '0 0 0 2'
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'hiddenfield-selfPlanId',
                        value: rec ? rec.id : ''
                    }
                ]
            };
        }

        function _refreshCmp (){
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
                        createTime: Ext.Date.format(new Date(), 'Y-m-d H:i:s'),
                        logType: 0
                    }, function (obj){
                        if (obj.status == 'successful') {
                            showMsg('添加成功！');
                            _refreshCmp();
                        }
                    });
                    // Ext.suspendLayouts();

                    // var index = me.items.items.length;
                    // me.insert(index, _generateCmp(index));

                    // Ext.resumeLayouts(true);

                }
            },
            {
                text: '取消',
                handler: function () {
                    me.close();
                }
            }
        ];

        me.addListener('afterrender', function (win, opts){
            
        });

        this.callParent();
    }
});