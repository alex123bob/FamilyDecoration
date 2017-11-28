Ext.define('FamilyDecoration.view.staffsalary.Index', {
    extend: 'Ext.container.Container',
    alias: 'widget.staffsalary-index',
    requires: [
        'FamilyDecoration.view.staffsalary.DetailedSalary',
        'FamilyDecoration.view.staffsalary.DepaList'
    ],
    layout: 'hbox',
    defaults: {
        height: '100%'
    },
    initComponent: function () {
        var me = this;

        function _getRes (){
            var depaList = me.down('staffsalary-depalist'),
                listSelModel = depaList.getSelectionModel(),
                listStore = depaList.getStore(),
                depa = listSelModel.getSelection()[0],
                detailedGrid = me.down('staffsalary-detailedsalary'),
                detailedGridSelModel = detailedGrid.getSelectionModel(),
                detailedStore = detailedGrid.getStore(),
                detailedItem = detailedGridSelModel.getSelection()[0];
            return {
                list: depaList,
                listSelModel: listSelModel,
                listSt: listStore,
                depa: depa,

                selTime: detailedGrid.getTime(),
                detailedGrid: detailedGrid,
                detailedGridSelModel: detailedGridSelModel,
                detailedSt: detailedStore,
                detailedItem: detailedItem
            };
        }

        function _selChange (){
            var resObj = _getRes();
            if (resObj.depa) {
                ajaxGet('StaffSalary', undefined, Ext.apply(resObj.selTime, {
                    depa: resObj.depa.get('name')
                }), function (obj){
                    var msg = User.renderDepartment(resObj.depa.get('name')) + '在' + resObj.selTime.year + '年' + resObj.selTime.month + '月没有工资录入记录，需要添加工资纪录吗？';
                    if (obj.total === 0) {
                        Ext.Msg.warning(msg, function (btnId){
                            if ('yes' === btnId) {

                            }
                        });
                    }
                });
            }
        }

        me.items = [
            {
                title: '部门',
                xtype: 'staffsalary-depalist',
                width: 200,
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                hideHeaders: true,
                listeners: {
                    selectionchange: function (selModel, sels, opts){
                        _selChange();
                    }
                }
            },
            {
                xtype: 'staffsalary-detailedsalary',
                flex: 1,
                selChange: _selChange
            }
        ];

        
        this.callParent();
    }
});