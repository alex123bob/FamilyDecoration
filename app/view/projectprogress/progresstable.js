Ext.define('FamilyDecoration.view.projectprogress.ProgressTable', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.projectprogress-progresstable',
	requires: [
        'FamilyDecoration.store.ProjectProgress'
	],
	autoScroll: true,
	refresh: Ext.emptyFn,

	initComponent: function () {
		var me = this;

		me.columns = {
			defaults: {
				align: 'center'
			},
			items: [
				{
					flex: 0.7,
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
                    dataIndex: 'planStartTime',
					renderer: function (val, meta, rec) {
						if (val) {
							return val + ' ~ ' + rec.get('planEndTime');
						}
						else {
							return '';
						}
					}
                },
                {
                    flex: 2,
                    text: '实际进度',
                    dataIndex: 'practicalProgress',
					renderer: function (val, meta, rec){
						var result = '';
						if (val.length > 0) {
							Ext.each(val, function (obj, index){
								result += (index + 1) + '. ' + obj['content'].replace(/\n/gi, '<br />') + '(' + obj['createTime'] + ')<br />';
							});
							return result;
						}
						else {
							return '';
						}
					}
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

		me.callParent();
	}
});