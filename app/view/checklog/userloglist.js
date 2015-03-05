Ext.define('FamilyDecoration.view.checklog.UserLogList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.LogList'],
	alias: 'widget.checklog-userloglist',
	userName: undefined,

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
						action: 'getLogListYearsByUser'
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
								user: me.userName
							};
						}
						else if (node.get('month')) {
							st.proxy.url = 'libs/loglist.php';
							st.proxy.extraParams = {
								action: 'getLogListByMonthByUser',
								year: node.parentNode.get('year'),
								month: node.get('month'),
								user: me.userName
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