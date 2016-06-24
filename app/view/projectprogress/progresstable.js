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
                    flex: 1,
                    text: '实际进度',
                    dataIndex: 'practicalProgress',
					editor: {
						xtype: 'textfield',
						allowBlank: false
					}
                },
                {
                    flex: 1,
                    text: '监理意见',
                    dataIndex: 'supervisorComment',
					editor: {
						xtype: 'textfield',
						allowBlank: false
					}
                }
			]
		};

		me.store = Ext.create('FamilyDecoration.store.ProjectProgress', {
			autoLoad: false
		});

		me.plugins = [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
				listeners: {
					edit: function (editor, e) {
						Ext.suspendLayouts();

						e.record.commit();
						editor.completeEdit();
						if (e.field == 'practicalProgress' || e.field == 'supervisorComment') {
							var updateObj = {};
							updateObj[e.field] = e.record.get(e.field);
							Ext.apply(updateObj, {
								id: e.record.getId()
							});
							ajaxUpdate('ProjectProgress.updateItem', updateObj, 'id', function (obj) {
								showMsg('编辑成功！');
								me.refresh();
							}, true);
						}

						Ext.resumeLayouts();
					},
					validateedit: function (editor, e, opts) {
						var rec = e.record;
						if (e.value == e.originalValue) {
							return false;
						}
					}
				}
			})
		];

		me.callParent();
	}
});