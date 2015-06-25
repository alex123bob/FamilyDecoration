Ext.define('FamilyDecoration.view.checklog.MemberList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.store.MemberList'],
	alias: 'widget.checklog-memberlist',
	isCheckMode: false,
	assignees: undefined,
	forEmail: false,
	fullList: false,

	initComponent: function (){
		var me = this;

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: true
			},
			store: Ext.create('FamilyDecoration.store.MemberList', {
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
						email: me.forEmail,
						fullList: me.fullList
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
	            				department: node.get('level').split('-')[0]
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
	            				var checkStat = me.isCheckMode ? false : null,
	            					result;
	            				if (me.assignees) {
	            					result = Ext.Array.indexOf(me.assignees, node.get('name'));
	            					if (result != -1) {
	            						checkStat = true;
	            					}
	            					else if (result == -1) {
	            						checkStat = false;
	            					}
	            				}
	            				node.set({
	            					text: node.get('realname'),
	            					leaf: true,
	            					icon: 'resources/img/user.ico',
	            					checked: checkStat
	            				})
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