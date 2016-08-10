Ext.define('FamilyDecoration.view.entrynexit.ProjectList', {
    extend: 'Ext.window.Window',
    alias: 'widget.entrynexit-projectlist',
    requires: [
        'FamilyDecoration.model.Project',
        'FamilyDecoration.view.progress.ProjectListByCaptain'
    ],
    modal: true,
    layout: 'fit',
    maximizable: true,

    title: '工程选择',
    width: 520,
    height: 300,
    callback: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'progress-projectlistbycaptain',
                itemId: 'treepanel-projectList',
                searchFilter: true
            }
        ];

        me.buttons = [
            {
                text: '确认',
                handler: function () {
                    var projectList = me.getComponent('treepanel-projectList'),
                        project = projectList.getSelectionModel().getSelection()[0];
                    if (project) {
                        me.callback(project);
                        me.close();
                    }
                    else {
                        showMsg('请选择项目！');
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