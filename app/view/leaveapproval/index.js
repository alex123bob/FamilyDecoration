Ext.define('FamilyDecoration.view.leaveapproval.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.leaveapproval-index',
	requires: [
		'FamilyDecoration.view.checklog.MemberList',
		'FamilyDecoration.view.checklog.UserLogList',
		'FamilyDecoration.store.ScrutinizeList'
	],
	autoScroll: true,
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
				xtype: 'checklog-memberlist',
				title: '成员列表',
				id: 'treepanel-memberName',
				name: 'treepanel-memberName',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				listeners: {
					itemclick: function (view, rec){
					},
					load: function (){
						var treepanel = Ext.getCmp('treepanel-memberName');
						treepanel.expandAll();
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 1,
			layout: 'fit',
			margin: '0 1 0 0',
			items: [{
				xtype: 'checklog-userloglist',
				title: '请假列表',
				id: 'treepanel-logNameByUser',
				name: 'treepanel-logNameByUser',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				autoScroll: true,
				listeners: {
					itemclick: function (view, rec){
					},
					selectionchange: function (selModel, sels, opts){
					},
					load: function (){
					}
				}
			}]
		}, {
			xtype: 'container',
			flex: 3,
			layout: 'border',
			items: [{
				xtype: 'gridpanel',
				id: 'gridpanel-logDetailByUser',
				name: 'gridpanel-logDetailByUser',
				title: '请假详情',
				height: 320,
				autoScroll: true,
				region: 'north',
				refresh: function (rec){
					var grid = this;
					if (rec) {
						Ext.Ajax.request({
							url: 'libs/loglist.php?action=getLogDetailsByLogListId',
							params: {
								logListId: rec.getId()
							},
							method: 'GET',
							callback: function (opts, success, res){
								if (success) {
									var obj = Ext.decode(res.responseText);
									grid.getStore().loadData(obj);
								}
							}
						});
					}
					else {
						grid.getStore().loadData([]);
					}
				},
				tbar: [{
					text: '批阅',
					disabled: true,
					icon: './resources/img/comment.png',
					id: 'button-censorship',
					name: 'button-censorship',
					handler: function (){
					}
				}],
				store: Ext.create('Ext.data.Store', {
					fields: ['content', 'id', 'createTime'],
					autoLoad: false
				}),
				columns: [
			        {
			        	text: '日志内容', 
			        	dataIndex: 'content', 
			        	flex: 1,
			        	renderer: function (val){
			        		return val.replace(/\n/g, '<br />');
			        	}
			        },
			        {
			        	text: '创建时间', 
			        	dataIndex: 'createTime', 
			        	flex: 1
			        }
			    ],
			    listeners: {
			    	selectionchange: function (view, sels){
			    	}
			    }
			}, {
				xtype: 'gridpanel',
				id: 'gridpanel-scrutinizeForCheckLog',
				name: 'gridpanel-scrutinizeForCheckLog',
				store: Ext.create('FamilyDecoration.store.ScrutinizeList', {
					autoLoad: false
				}),
				autoScroll: true,
				region: 'center',
				// hideHeaders: true,
				columns: [{
					text: '批阅内容',
					dataIndex: 'scrutinizeContent',
					flex: 1,
					menuDisabled: true,
					draggable: false,
					sortable: false,
					renderer: function (val){
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
			}]
		}];

		this.callParent();
	}
});