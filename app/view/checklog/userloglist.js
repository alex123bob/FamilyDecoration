Ext.define('FamilyDecoration.view.checklog.UserLogList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.LogList'],
	alias: 'widget.checklog-userloglist',
	userName: undefined,
	isQuarter: false,
	logListId: undefined,

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: false
			},
			store: Ext.create('FamilyDecoration.store.LogList', {
				autoLoad: false,
				proxy: {
					type: 'rest',
					url: 'libs/loglist.php',
					appendId: false,
					reader: {
						type: 'json'
					},
					extraParams: {
						action: 'getLogListYearsByUser',
						isQuarter: me.isQuarter
					}
				},
				listeners: {
					beforeload: function (st, ope){
						var node = ope.node;
						if (node.get('year')) {
							st.proxy.url = 'libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListMonthsByUser',
								year: node.get('year'),
								user: me.userName,
								isQuarter: me.isQuarter
							};
						}
						else if (node.get('month')) {
							st.proxy.url = 'libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListByMonthByUser',
								year: node.parentNode.get('year'),
								month: node.get('month'),
								user: me.userName,
								isQuarter: me.isQuarter
							};
						}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (pNode) {
	            			node.set({
	            				text: node.get('year') || node.get('month') || node.get('logName')
	            			});
	            			if (node.get('year') || node.get('month')) {
	            				node.set({
	            					icon: 'resources/img/calendar.gif'
	            				});
	            			}
	            			else if (node.get('logName')) {
	            				if ((me.logListId && me.logListId == node.getId()) || !me.logListId) {
	            					node.set({
		            					icon: 'resources/img/log.ico',
		            					leaf: true
		            				});
		            				Ext.Ajax.request({
										url: 'libs/loglist.php?action=getLogDetailsByLogListId',
										params: {
											logListId: node.getId()
										},
										method: 'GET',
										callback: function (opts, success, res){
											if (success) {
												var obj = Ext.decode(res.responseText),
													flag = false;
												for (var i = 0; i < obj.length; i++) {
													if (obj[i].logType == 1) {
														flag = true;
														break;
													}
												}
												if (flag) {
													node.set({
														icon: 'resources/img/hint.png',
														iconCls: 'blinkNode'
													});
												}
											}
										}
									});
	            				}
	            				else {
	            					return false;
	            				}
	            			}
	            		}
	            	},
	            	load: function (st, node, recs){
	            		if (me.logListId) {
	            			for (var i = recs.length - 1; i >= 0; i--) {
	            				var rec = recs[i];
	            				if (me.logListId == rec.get('logListId')) {
	            					me.getSelectionModel().select(rec);
	            				}
	            			};
	            		}
	            	}
				}
			})
		});

		this.callParent();
	}
});