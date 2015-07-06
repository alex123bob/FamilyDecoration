Ext.define('FamilyDecoration.view.mylog.LogList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.LogList'],
	alias: 'widget.mylog-loglist',
	isQuarter: false, // tag indicating whether it is current quarter or not.

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: true
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
						action: 'getLogListYears',
						isQuarter: me.isQuarter
					}
				},
				listeners: {
					beforeload: function (st, ope){
						var node = ope.node;
						if (node.get('year')) {
							st.proxy.url = 'libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListMonths',
								year: node.get('year'),
								isQuarter: me.isQuarter
							};
						}
						else if (node.get('month')) {
							st.proxy.url = 'libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListByMonth',
								year: node.parentNode.get('year'),
								month: node.get('month')
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
	            		}
	            	},
	            	load: function (st, node, recs){
	            		
	            	}
				}
			})
		});

		this.callParent();
	}
});