Ext.define('FamilyDecoration.view.projectprogress.ProgressTable', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.projectprogress-progresstable',
	requires: [
        'FamilyDecoration.store.ProjectProgress'
	],
	autoScroll: true,

	initComponent: function (){
		var me = this;

		me.columns = {
			defaults: {
				align: 'center'
			},
			items: [
				{
					flex: 1,
					text: '项目',
					dataIndex: 'parentItemName'
				},
                {
					flex: 1,
					text: '子项目',
					dataIndex: 'itemName'
				},
                {
                    flex: 1,
                    text: '计划进度',
                    dataIndex: 'planStartTime'
                },
                {
                    flex: 1,
                    text: '实际进度',
                    dataIndex: 'practicalStartTime'
                },
                {
                    flex: 1,
                    text: '监理意见',
                    dataIndex: 'supervisorComment'
                }
			]
		};

		me.store = Ext.create('FamilyDecoration.store.ProjectProgress', {
			autoLoad: false
		});

		me.listeners = {
			cellclick: function (view, td, cellIndex, rec, tr, rowIndex, e, opts){
				
			},
			selectionchange: function (selModel, sels, opts){
				
			}
		};

		me.callParent();
	}
});