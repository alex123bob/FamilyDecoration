Ext.define('FamilyDecoration.view.progress.ProjectList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.view.progress.SearchFieldTree', 'FamilyDecoration.view.progress.TreeFilter'],
	alias: 'widget.progress-projectlist',
	isForChart: false,
	isForAddCategory: false,
	isForFrozen: false,

	loadAll: true,
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
	                	action: 'getProjectYears'
	                },
	                reader: {
	                    type: 'json'
	                }
	            },
	            listeners: {
	            	beforeload: function (st, ope){
	            		var node = ope.node;
	            		if (node.get('projectYear')) {
	            			st.proxy.url = './libs/project.php';
	            			st.proxy.extraParams = {
	            				year: node.get('projectYear'),
	            				action: 'getProjectMonths'
	            			};
	            		}
	            		else if (node.get('projectMonth')) {
	            			st.proxy.url = './libs/project.php';
	            			st.proxy.extraParams = {
	            				year: node.parentNode.get('projectYear'),
	            				month: node.get('projectMonth'),
	            				action: 'getProjects'
	            			};
	            		}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (!pNode) {
	            		}
	            		else {
	            			if (node.get('projectName')) {
	            				node.set({
	            					text: node.get('projectName') + '(' + node.get('projectTime').split(' ')[0] + ')'
	            				});
	            			}
	            			else {
	            				node.set({
	            					text: node.get('projectMonth') || node.get('projectYear')
	            				});
	            			}
	            			if (me.isForChart) {
	            				if (node.get('projectName')) {
	            					// 图库面板，即使工程没有图库也出现工程名
	            					// if (node.get('isFrozen') != 1) {

	            					// 图库面板，工程没有图库就不出现工程名
	            					if (node.get('projectChart') && node.get('isFrozen') != 1) {
	            						node.set({
		            						leaf: true,
		            						icon: 'resources/img/project.gif'
		            					});
	            					}
	            					else {
	            						return false;
	            					}
	            				}
	            				else {
	            					node.set({
	            						icon: 'resources/img/calendar.gif'
	            					});
	            				}
	            			}
	            			else if (me.isForAddCategory) {
	            				if (node.get('projectName')) {
	            					if (!node.get('projectChart') && node.get('isFrozen') != 1) {
	            						node.set({
		            						leaf: true,
		            						icon: 'resources/img/project.gif'
		            					});
	            					}
	            					else {
	            						return false;
	            					}
	            				}
	            				else {
	            					node.set({
	            						icon: 'resources/img/calendar.gif'
	            					});
	            				}
	            			}
	            			else if (me.isForFrozen) {
	            				if (node.get('projectName')) {
	            					if (node.get('isFrozen') == 1) {
	            						node.set({
	            							leaf: true,
	            							icon: 'resources/img/project.gif'
	            						});
	            					}
	            					else {
	            						return false;
	            					}
	            				}
	            				else {
	            					node.set({
	            						icon: 'resources/img/calendar.gif'
	            					});
	            				}
	            			}
	            			else {
	            				if (node.get('projectName')) {
	            					if (node.get('isFrozen') != 1) {
	            						node.set({
	            							leaf: true,
	            							icon: 'resources/img/project.gif'
	            						});
	            					}
	            					else {
	            						return false;
	            					}
	            				}
	            				else {
	            					node.set({
	            						icon: 'resources/img/calendar.gif'
	            					});
	            				}
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