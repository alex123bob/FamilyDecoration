Ext.define('FamilyDecoration.view.progress.ProjectListByCaptain', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.view.progress.SearchFieldTree', 'FamilyDecoration.view.progress.TreeFilter'],
	alias: 'widget.progress-projectlistbycaptain',
	isForChart: false,
	isForAddCategory: false,
	isForFrozen: false,

	loadAll: false,
	searchFilter: false,

	initComponent: function (){
		var me = this;

		if (me.searchFilter) {
			me.plugins = [{
				ptype: 'treefilter',
				allowParentFolders: true,
				collapseOnClear:false
		    }];

		    me.dockedItems = [
				{
				  dock: 'top',
				  xtype: 'toolbar',
				  items:[
				     {
				         xtype: 'searchfieldtree'
				     }
				  ]
				}
			];
		}

		Ext.apply(me, {
			rootVisible: false,
			root: {
				text: 'root',
				expanded: true
			},
			store: Ext.create('FamilyDecoration.store.Project', {
				autoLoad: false,
	            proxy: {
	                type: 'rest',
	                appendId: false,
	                url: './libs/project.php',
	                extraParams: {
	                	action: 'getProjectCaptains'
	                },
	                reader: {
	                    type: 'json'
	                }
	            },
	            listeners: {
	            	beforeload: function (st, ope){
	            		var node = ope.node;
	            		if (node.get('captain')) {
	            			st.proxy.url = './libs/project.php';
	            			st.proxy.extraParams = {
	            				captainName: node.get('captainName'),
	            				action: 'getProjectsByCaptainName'
	            			};
	            		}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (!pNode) {
	            		}
	            		else {
	            			if (node.get('projectName')) {
	            				node.set({
	            					text: node.get('projectName'),
	            					leaf: true
	            				})
	            			}
	            			else {
	            				node.set('text', node.get('captain'));
	            			}
	            		}
	            	},
	            	load: function (st, node, recs){
	            		if (window.pro && node.isRoot() && recs != null) {
	            			var year = pro.year,
	            				month = parseInt(pro.month, 10),
	            				pid = pro.pid;
	            			for (var i  = 0; i < recs.length; i++) {
	            				if (recs[i].get('projectYear') == year) {
	            					recs[i].expand(false, function (ms){
	            						Ext.defer(function (){
	            							for (i = 0; i < ms.length; i++) {
	            								if (ms[i].get('projectMonth') == month) {
	            									ms[i].expand(false, function (ps) {
	            										Ext.defer(function (){
	            											for (i = 0; i < ps.length; i++) {
	            												if (ps[i].getId() == pid) {
	            													me.getSelectionModel().select(ps[i]);
	            												}
	            											}
	            										}, 300);
	            									});
	            								}
	            							}
	            						}, 300);
	            					});
	            					break;
	            				}
	            			}
	            			delete window.pro;
	            		}

	            		if (me.loadAll) {
	            			me.expandAll();
	            		}
	            	}
	            }
			})
		});

		this.callParent();
	}
})