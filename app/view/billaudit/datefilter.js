Ext.define('FamilyDecoration.view.billaudit.DateFilter', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.billaudit-datefilter',
    requires: [],
    layout: 'vbox',

    txtEmptyText: undefined,
    txtParam: undefined,

    filterFn: Ext.emptyFn,
    clearFn: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        function getRes() {
            var startTime = me.getComponent('startTime'),
                endTime = me.getComponent('endTime'),
                projectName = me.getComponent('projectName'),
                customTxt = me.down('fieldcontainer').getComponent('customTxt');
            return {
                startTime: startTime,
                projectName: projectName,
                endTime: endTime,
                customTxt: customTxt
            };
        }

        me.items = [
            {
                xtype: 'datefield',
                flex: 1,
                editable: false,
                width: '100%',
                name: 'startTime',
                itemId: 'startTime',
                emptyText: '开始时间',
                cleanBtn: true,
                cleanHandler: function (){
                    var resObj = getRes();
                    resObj.endTime.isValid();
                },
                validator: function (val) {
                    var resObj = getRes();
                    if (val && resObj.endTime.getValue()) {
                        return true;
                    }
                    else if (!val && resObj.endTime.getValue()) {
                        return '开始时间和结束时间不能有一个为空';
                    }
                    else if (val && !resObj.endTime.getValue()) {
                        resObj.endTime.isValid();
                        return true;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                xtype: 'datefield',
                flex: 1,
                editable: false,
                width: '100%',
                emptyText: '结束时间',
                name: 'endTime',
                itemId: 'endTime',
                cleanBtn: true,
                cleanHandler: function (){
                    var resObj = getRes();
                    resObj.startTime.isValid();
                },
                validator: function (val) {
                    var resObj = getRes();
                    if (val && resObj.startTime.getValue()) {
                        return true;
                    }
                    else if (!val && resObj.startTime.getValue()) {
                        return '开始时间和结束时间不能有一个为空';
                    }
                    else if (val && !resObj.startTime.getValue()) {
                        resObj.startTime.isValid();
                        return true;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                xtype: 'textfield',
                flex: 1,
                editable: false,
                width: '100%',
                emptyText: '项目名称',
                name: 'projectName',
                itemId: 'projectName',
                enableKeyEvents:true,
                listeners : {
                    keydown : function(field,e){
                        console.log(e.keyCode);
                        if(e.keyCode == 13){
                            
                            
                        }
                  }
                }
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                width: '100%',
                items: [
                    {
                        xtype: 'textfield',
                        flex: 1,
                        itemId: 'customTxt',
                        name: me.txtParam,
                        emptyText: me.txtEmptyText
                    },
                    {
                        xtype: 'button',
                        text: '过滤',
                        handler: function (){
                            var resObj = getRes();
                            var obj = {};
                            if (resObj.startTime.isValid() && resObj.endTime.isValid()) {
                                    obj.startTime = resObj.startTime.getValue(),
                                    obj.endTime = resObj.endTime.getValue()
                            }
                            obj[me.txtParam] = resObj.customTxt.getValue();
                            obj.projectName = resObj.projectName.getValue();
                            me.filterFn(obj);
                        }
                    },
                    {
                        xtype: 'button',
                        text: '清空',
                        handler: function (){
                            var resObj = getRes();
                            resObj.startTime.setValue('').clearInvalid();
                            resObj.endTime.setValue('').clearInvalid();
                            resObj.customTxt.setValue('');
                            me.clearFn();
                        }
                    }
                ]
            }
        ];

        me.callParent();
    }
});