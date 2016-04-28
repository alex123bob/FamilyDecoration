Ext.define('FamilyDecoration.view.user.Index', {
	extend: 'Ext.window.Window',
	alias: 'widget.user-index',
	title: '用户监管平台',
	width: 650,
	height: 500,
	requires: [
		'FamilyDecoration.store.OnlineUser'
	],
	layout: 'fit',
	maximizable: true,
	modal: true,

	initComponent: function (){
		var me = this,
			st = Ext.create('FamilyDecoration.store.OnlineUser', {
				autoLoad: true,
				pageSize: 30
			});

		// get time 7 days ago
		// var fromTime = new Date();
		// fromTime.setTime(fromTime.getTime() - 7*24*60*60*1000);

		// me.tbar = [{
	 //        xtype: 'datefield',
	 //        fieldLabel: '开始时间',
	 //        name: 'datefield-startTime',
	 //        id: 'datefield-startTime',
	 //        format: 'Y-m-d H:i:s',
	 //        value: fromTime,
	 //        listeners: {
	 //        	change: function (field, newVal, oldVal){
	 //        		var grid = Ext.getCmp('gridpanel-onlineusercheck'),
	 //        			st = grid.getStore(),
	 //        			from = Ext.getCmp('datefield-startTime'),
	 //        			to = Ext.getCmp('datefield-endTime');
	 //        		st.reload({
	 //        			params: {
	 //        				beginTime: from.getRawValue(),
	 //        				endTime: to.getRawValue()
	 //        			}
	 //        		});
	 //        	}
	 //        }
	 //    }, {
	 //        xtype: 'datefield',
	 //        fieldLabel: '结束时间',
	 //        name: 'datefield-endTime',
	 //        id: 'datefield-endTime',
	 //        format: 'Y-m-d H:i:s',
	 //        value: new Date(),
	 //        listeners: {
	 //        	change: function (field, newVal, oldVal){
	 //        		var grid = Ext.getCmp('gridpanel-onlineusercheck'),
	 //        			st = grid.getStore(),
	 //        			from = Ext.getCmp('datefield-startTime'),
	 //        			to = Ext.getCmp('datefield-endTime');
	 //        		st.reload({
	 //        			params: {
	 //        				beginTime: from.getRawValue(),
	 //        				endTime: to.getRawValue()
	 //        			}
	 //        		});
	 //        	}
	 //        }
	 //    }];

		me.items = [{
			xtype: 'gridpanel',
			autoScroll: true,
			id: 'gridpanel-onlineusercheck',
			name: 'gridpanel-onlineusercheck',
			dockedItems: [{
                xtype: 'pagingtoolbar',
                store: st,   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            }],
			columns: [{
				text: '姓名',
				dataIndex: 'realName',
				flex: 1
			}, {
				text: '用户终端',
				dataIndex: 'userAgent',
				flex: 1
			}, {
				text: '上线时间',
				dataIndex: 'onlineTime',
				flex: 1
			}, {
				text: '下线时间',
				dataIndex: 'offlineTime',
				flex: 1
			}, {
				text: '最后更新时间',
				dataIndex: 'lastUpdateTime',
				flex: 1
			}, {
				text: 'ip地址',
				dataIndex: 'ip',
				flex: 1
			}, {
				text: '登录地点',
				dataIndex: 'location',
				flex: 1
			}
			// , {
			// 	text: 'sessionId',
			// 	dataIndex: 'sessionId',
			// 	flex: 1
			// }
			],
			store: st,
			listeners: {
				afterrender: function(grid, opts) {
					var view = grid.getView();
					var tip = Ext.create('Ext.tip.ToolTip', {
						target: view.el,
						delegate: view.cellSelector,
						trackMouse: true,
						renderTo: Ext.getBody(),
						listeners: {
							beforeshow: function(tip) {
								var gridColumns = view.getGridColumns();
								var column = gridColumns[tip.triggerElement.cellIndex];
								var val = view.getRecord(tip.triggerElement.parentNode).get(column.dataIndex);
								if (val) {
									val.replace && (val = val.replace(/\n/g, '<br />'));
									tip.update(val);
								} else {
									return false;
								}
							}
						}
					});
                }
			}
		}];

		me.buttons = [{
			text: '关闭监管平台',
			handler: function (){
				me.close();
			}
		}];

		this.callParent();
	}
});