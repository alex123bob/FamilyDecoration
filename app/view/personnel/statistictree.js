Ext.define('FamilyDecoration.view.personnel.StatisticTree', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.StatisticTree'],
	alias: 'widget.personnel-statistictree',

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: true
			},
			store: Ext.create('FamilyDecoration.store.StatisticTree', {
				autoLoad: false,
				proxy: {
					type: 'rest',
					url: 'libs/loglist.php',
					appendId: false,
					reader: {
						type: 'json'
					},
					extraParams: {
						action: 'getLogListDepartments',
						email: false,
						individual: false,
						fullList: true
					}
				},
				listeners: {
					beforeload: function (st, ope){
						var node = ope.node;
						// root node
						if (node.isRoot()) {

						}
						// department node
						else if (node.get('level') && !node.get('name')) {
							st.proxy.url = 'libs/loglist.php';
	            			st.proxy.extraParams = {
	            				action: 'getMembersByDepartment',
	            				department: node.get('level').split('-')[0],
	            				individual: false
	            			};
						}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (pNode) {
	            			if (!node.get('name')) {
	            				var level = node.get('level');
	            				node.set({
	            					text: User.renderDepartment(level),
	            					icon: 'resources/img/house.ico'
	            				});
	            			}
	            			else {
	            				node.set({
	            					text: node.get('realname'),
	            					leaf: true,
	            					icon: 'resources/img/user.ico'
	            				});
	            			}
	            		}
	            	},
	            	load: function (st, node, recs){
	            		me.expandAll();
	            	}
				}
			})
		});

		this.callParent();
	}
});