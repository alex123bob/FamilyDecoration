Ext.define('FamilyDecoration.view.progress.ProjectList', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel'],
	alias: 'widget.progress-projectlist',
	isForChart: false,
	isForAddCategory: false,
	isForFrozen: false,

	initComponent: function (){
		var me = this;

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
	                url: 'libs/getprojectyears.php',
	                reader: {
	                    type: 'json'
	                }
	            },
	            listeners: {
	            	beforeload: function (st, ope){
	            		var node = ope.node;
	            		if (node.get('projectYear')) {
	            			st.proxy.url = 'libs/getprojectmonths.php';
	            			st.proxy.extraParams = {
	            				year: node.get('projectYear')
	            			};
	            		}
	            		else if (node.get('projectMonth')) {
	            			st.proxy.url = 'libs/getprojects.php';
	            			st.proxy.extraParams = {
	            				year: node.parentNode.get('projectYear'),
	            				month: node.get('projectMonth')
	            			};
	            		}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (!pNode) {
	            		}
	            		else {
	            			node.set('text', node.get('projectName') || node.get('projectMonth') || node.get('projectYear'));
	            			if (me.isForChart) {
	            				if (node.get('projectName')) {
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
	            	}
	            }
			})
		});

		this.callParent();
	}
})