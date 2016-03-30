Ext.define('FamilyDecoration.view.personnel.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.personnel-index',
	requires: [
		'FamilyDecoration.view.personnel.StatisticTree',
		'FamilyDecoration.store.Personnel'
	],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	initComponent: function (){
		var me = this;
		me.items = [{
			xtype: 'container',
			margin: '0 1 0 0',
			flex: 1,
			layout: 'fit',
			items: [{
				xtype: 'personnel-statistictree',
				title: '成员列表',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
					itemclick: function (view, rec){
						var curYear = new Date().getFullYear(),
							curMonth = new Date().getMonth() + 1;
						if (rec && rec.get('name') && rec.childNodes.length == 0) {
							var startYear = 2014,
								obj = [];
							while(startYear <= curYear) {
								obj = {
									year: startYear
								};
								rec.appendChild(obj);
								rec.lastChild.set({
									leaf: true,
									icon: 'resources/img/calendar2.png',
									text: startYear
								});
								rec.set({
									leaf: false
								});
								startYear++;
							}
							view.refresh();
							rec.expand();
						}
						else if (rec && rec.get('year') != '' && rec.childNodes.length == 0) {
							var startMonth = 1,
								endMonth = (rec.get('year') == curYear) ? curMonth : 12;
							while (startMonth <= endMonth) {
								rec.appendChild({
									month: startMonth
								});
								rec.lastChild.set({
									leaf: true,
									icon: 'resources/img/month1.png',
									text: startMonth
								});
								rec.set({
									leaf: false
								});
								startMonth++;
							}
							view.refresh();
							rec.expand();
						}
					},
					selectionchange: function (selModel, sels, opts){
						var rec = sels[0];
						var grid = Ext.getCmp('gridpanel-individualInformation'),
							st = grid.getStore(),
							curTime = new Date();
						if (rec && rec.get('name')) {
							st.reload({
								params: {
									user: rec.get('name'),
									year: curTime.getFullYear(),
									month: curTime.getMonth() + 1
								}
							});
						}
						else if (rec && rec.get('month') != '') {
							st.reload({
								params: {
									user: rec.parentNode.parentNode.get('name'),
									year: rec.parentNode.get('year'),
									month: rec.get('month')
								}
							});
						}
					}
				}
			}],
			height: '100%'
		}, {
			xtype: 'container',
			flex: 5,
			layout: 'vbox',
			height: '100%',
			items: [{
				xtype: 'gridpanel',
				title: '个人情况',
				width: '100%',
				id: 'gridpanel-individualInformation',
				name: 'gridpanel-individualInformation',
				flex: 1,
				autoScroll: true,
				store: Ext.create('FamilyDecoration.store.Personnel', {
					autoLoad: false,
					proxy: {
						type: 'rest',
						url: 'libs/statistic.php',
						reader: {
							type: 'json'
						},
						extraParams: {
							action: 'getIndividualStatisticsByYearByMonthByUser'
						}
					}
				}),
				refresh: function (rec){
					
				},
				columns: [
			        {
			        	text: '日期',
			        	dataIndex: 'day',
			        	flex: 1,
	                	draggable: false,
	                	align: 'center',
	                	sortable: false,
	                	menuDisabled: true
			        },
			        {
			        	text: '日志',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '日记录',
			        			dataIndex: 'logListDailyAmount',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '月纪录',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'logListMonthlyAmount'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '业务',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '日记录',
			        			dataIndex: 'businessDailyAmount',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '月纪录',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'businessMonthlyAmount'
			        		},
			        		{
			        			text: '总量',
			        			width: 60,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true,
			        			dataIndex: 'businessTotalNumber'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '签单业务',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '日记录',
			        			dataIndex: 'signedBusinessDailyAmount',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '月纪录',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'signedBusinessMonthlyAmount'
			        		},
			        		{
			        			text: '总量',
			        			width: 60,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true,
			        			dataIndex: 'signedBusinessTotalNumber'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        },
			        {
			        	text: '扫楼',
			        	menuDisabled: true,
			        	columns: [
			        		{
			        			text: '日记录',
			        			dataIndex: 'potentialBusinessDailyAmount',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true
			        		},
			        		{
			        			text: '月纪录',
			        			width: 60,
	                			draggable: false,
	                			align: 'center',
	                			sortable: false,
	                			menuDisabled: true,
	                			dataIndex: 'potentialBusinessMonthlyAmount'
			        		},
			        		{
			        			text: '总量',
			        			width: 60,
			        			draggable: false,
			        			align: 'center',
			        			sortable: false,
			        			menuDisabled: true,
			        			dataIndex: 'potentialBusinessTotalNumber'
			        		}
			        	],
	                	draggable: false,
	                	align: 'center'
			        }
			    ],
			    listeners: {
			    	selectionchange: function (view, sels){
			    	}
			    }
			}, {
				xtype: 'panel',
				width: '100%',
				flex: 1,
				autoScroll: true,
				title: '项目情况'
			}]
		}];

		this.callParent();
	}
});