Ext.define('FamilyDecoration.view.mytask.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.mytask-index',
	requires: [
		'FamilyDecoration.view.mytask.TaskGrid', 'FamilyDecoration.view.mytask.SelfAssess',
		'FamilyDecoration.view.mylog.AskLeave', 'FamilyDecoration.model.TaskSelfAssessment',
		'FamilyDecoration.view.mytask.EditProcess'
	],
	layout: 'border',
	taskId: undefined,

	initComponent: function () {
		if (!$('#mytaskCompleteProcess').length) {
			$('body').append('<div class="x-hide-display" id="mytaskCompleteProcess"></div>');
		}
		var me = this;
		me.items = [
			{
				xtype: 'container',
				region: 'west',
				layout: 'fit',
				width: 200,
				margin: '0 1 0 0',
				hidden: me.taskId ? true : false,
				items: [
					{
						title: '任务查看',
						xtype: 'mytask-taskgrid',
						taskId: me.taskId,
						refresh: function () {
							this.getStore().load();
						},
						listeners: {
							selectionchange: function (selModel, sels, opts) {
								var taskContent = Ext.getCmp('panel-taskContent'),
									taskScrutinize = Ext.getCmp('gridpanel-myTaskScrutinizeContent'),
									selfAssessment = Ext.getCmp('panel-selfAssessment'),
									taskComplete = Ext.getCmp('panel-completeProcess'),
									rec = sels[0];
								taskContent.refresh(rec);
								taskScrutinize.refresh(rec);
								selfAssessment.refresh(rec);
								taskComplete.refresh(rec);
							}
						}
					}
				]
			},
			{
				region: 'center',
				xtype: 'container',
				layout: 'border',
				items: [
					{
						id: 'panel-taskContent',
						name: 'panel-taskContent',
						title: '任务内容',
						region: 'west',
						autoScroll: true,
						width: 300,
						refresh: function (rec) {
							if (rec) {
								var content = rec.get('taskContent').replace(/\\n/ig, '<br />');
								this.body.update(content);
							}
							else {
								this.body.update('');
							}
						},
						margin: '0 1 0 0'
					},
					{
						xtype: 'gridpanel',
						id: 'gridpanel-myTaskScrutinizeContent',
						name: 'gridpanel-myTaskScrutinizeContent',
						store: Ext.create('FamilyDecoration.store.TaskScrutinize', {
							autoLoad: false
						}),
						refresh: function (rec) {
							var grid = this,
								st = grid.getStore();
							if (rec) {
								st.load({
									params: {
										taskListId: rec.getId()
									}
								});
							}
							else {
								st.loadData([]);
							}
						},
						region: 'center',
						// hideHeaders: true,
						columns: [{
							text: '批阅内容',
							dataIndex: 'scrutinizeContent',
							flex: 1,
							menuDisabled: true,
							draggable: false,
							sortable: false,
							renderer: function (val) {
								return val.replace(/\n/ig, '<br />');
							}
						}, {
								text: '批阅人',
								dataIndex: 'realName',
								flex: 1,
								menuDisabled: true,
								draggable: false,
								sortable: false
							}, {
								text: '批阅时间',
								dataIndex: 'scrutinizeTime',
								flex: 1,
								menuDisabled: true,
								draggable: false,
								sortable: false
							}],
						width: '100%',
						title: '批阅内容'
					},
					{
						xtype: 'panel',
						region: 'south',
						height: 300,
						width: '100%',
						header: false,
						// title: '完成情况及自我评价',
						id: 'panel-processAndSelfAssessment',
						name: 'panel-processAndSelfAssessment',
						layout: 'hbox',

						items: [
							{
								xtype: 'panel',
								id: 'panel-selfAssessment',
								name: 'panel-selfAssessment',
								width: 300,
								height: '100%',
								title: '自我评价',
								autoScroll: true,
								bbar: [{
									text: '评价',
									id: 'button-selfassess',
									name: 'button-selfassess',
									icon: './resources/img/assess.png',
									header: false,
									disabled: true,
									handler: function () {
										var taskTree = Ext.getCmp('treepanel-myTask'),
											task = taskTree.getSelectionModel().getSelection()[0];
										if (task && task.get('taskName')) {
											Ext.Ajax.request({
												url: './libs/tasklist.php?action=getTaskAssessmentByTaskListId',
												method: 'GET',
												params: {
													taskListId: task.getId()
												},
												callback: function (opts, success, res) {
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.length > 0) {
															var assessment = Ext.create('FamilyDecoration.model.TaskSelfAssessment', obj[0]);
															var win = Ext.create('FamilyDecoration.view.mytask.SelfAssess', {
																task: task,
																assessment: assessment
															});
															win.show();
														}
														else {
															var win = Ext.create('FamilyDecoration.view.mytask.SelfAssess', {
																task: task
															});
															win.show();
														}
													}
												}
											});
										}
										else {

										}
									}
								}
								],
								refresh: function (rec) {
									if (rec) {
										var me = this;
										if (rec && rec.get('taskName')) {
											Ext.Ajax.request({
												url: './libs/tasklist.php?action=getTaskAssessmentByTaskListId',
												method: 'GET',
												params: {
													taskListId: rec.getId()
												},
												callback: function (opts, success, res) {
													if (success) {
														var obj = Ext.decode(res.responseText);
														if (obj.length > 0) {
															var content = obj[0]['selfAssessment'].replace(/\\n/gi, '<br />');
															me.body.update(content);
														}
														else {
															me.body.update('');
														}
													}
												}
											})
										}
									}
									else {
										this.body.update('');
									}
								},
								style: {
									borderRightStyle: 'solid',
									borderRightWidth: '1px'
								}
							},
							{
								xtype: 'panel',
								id: 'panel-completeProcess',
								name: 'panel-completeProcess',
								flex: 1,
								height: '100%',
								title: '任务完成进度',
								contentEl: 'mytaskCompleteProcess',
								autoScroll: true,
								refresh: function (rec) {
									if (rec) {
										var completed = parseFloat(rec.get('taskProcess')),
											uncompleted = parseFloat(completed.sub(1));
										$('#mytaskCompleteProcess').highcharts({
											chart: {
												plotBackgroundColor: null,
												plotBorderWidth: null,
												plotShadow: false,
												height: 220
											},
											title: {
												text: '任务完成情况'
											},
											tooltip: {
												pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
											},
											plotOptions: {
												pie: {
													allowPointSelect: true,
													cursor: 'pointer',
													dataLabels: {
														enabled: false
													},
													showInLegend: true
												}
											},
											series: [{
												type: 'pie',
												name: '百分比',
												data: [
													['已完成', completed],
													['未完成', uncompleted]
												]
											}]
										});
									}
									else {
										$('#mytaskCompleteProcess').html('');
									}
								},
								bbar: [{
									text: '编辑完成进度',
									id: 'button-editProcess',
									icon: './resources/img/process.png',
									name: 'button-editProcess',
									disabled: true,
									handler: function () {
										var tree = Ext.getCmp('treepanel-myTask'),
											task = tree.getSelectionModel().getSelection()[0];
										if (task) {
											var win = Ext.create('FamilyDecoration.view.mytask.EditProcess', {
												task: task
											});
											win.show();
										}
										else {
											showMsg('没有选择任务！');
										}
									}
								}]
							}
						]
					}
				]
			}
		];

		this.callParent();
	}
});