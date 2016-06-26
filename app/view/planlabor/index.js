Ext.define('FamilyDecoration.view.planlabor.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.planlabor-index',
	requires: [
        'FamilyDecoration.store.ProfessionType', 'FamilyDecoration.view.planlabor.ScheduledTimeTable'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
		var me = this;

		me.getRes = function (){
			var timetable = me.down('planlabor-scheduledtimetable');

			return {
				timetable: timetable
			}
		};
		
		me.items = [
			{
				xtype: 'gridpanel',
				title: '工种',
				id: 'gridpanel-professionTypeInPlanLabor',
				name: 'gridpanel-professionTypeInPlanLabor',
				columns: [
					{
						text: '列表',
						dataIndex: 'cname',
						flex: 1
					}
				],
				store: Ext.create('FamilyDecoration.store.ProfessionType', {
					autoLoad: true
				}),
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				hideHeaders: true,
				width: 100,
				height: '100%',
				listeners: {
					selectionchange: function (selModel, sels, opts) {
						var rec = sels[0],
							resObj = me.getRes();
						ajaxGet('PlanMaking', 'getTimeSpanByProfessionType', {
							professionType: rec.get('value')
						}, function (obj){
							var startTime = obj.startTime,
								endTime = obj.endTime;
							resObj['timetable'].refresh(rec, startTime, endTime);
						});
					}
				}
			},
			{
				xtype: 'panel',
				flex: 2,
				height: '100%',
				title: '计划用工情况',
                layout: 'fit',
				items: [
					{
						xtype: 'planlabor-scheduledtimetable'
					}
				]
			}
		];

		this.callParent();
	}
});