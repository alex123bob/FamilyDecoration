Ext.define('FamilyDecoration.view.progress.ProjectListByCaptain', {
	extend: 'Ext.tree.Panel',
	requires: ['Ext.tree.Panel', 'FamilyDecoration.view.progress.SearchFieldTree', 'FamilyDecoration.view.progress.TreeFilter'],
	alias: 'widget.progress-projectlistbycaptain',
	isForChart: false,
	isForAddCategory: false,
	isForFrozen: false,

	loadAll: true,
	searchFilter: false,
	projectId: undefined,
	
	needStatementBillCount: false,

	initComponent: function (){
		var me = this;

		if (me.searchFilter && !me.projectId) {
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
	                extraParams: (function (){
	                	var p = {
	                		action: 'getProjectCaptains'
	                	}
	                	if (User.isProjectStaff()) {
	                		Ext.apply(p, {
	                			captainName: User.getName()
	                		});
	                	}
	                	return p;
	                })(),
	                reader: {
	                    type: 'json'
	                }
	            },
	            listeners: {
	            	beforeload: function (st, ope){
	            		var node = ope.node;
	            		if (node.get('captain')) {
	            			st.proxy.url = './libs/project.php';
	            			if (User.isAdmin() || User.isProjectManager() || User.isSupervisor() || User.isProjectStaff() || User.isAdministrationManager() || User.isFinanceManager() || User.isBudgetManager() || User.isBudgetStaff()) {
								st.proxy.extraParams = {
		            				captainName: node.get('captainName'),
		            				action: 'getProjectsByCaptainName',
									needStatementBillCount: me.needStatementBillCount
		            			};	            				
	            			}
	            			else {
	            				st.proxy.extraParams = {
	            					captainName: node.get('captainName'),
	            					action: 'getProjectsByCaptainName',
	            					userName: User.getName(),
									needStatementBillCount: me.needStatementBillCount
	            				};
	            			}
	            		}
	            	},
	            	beforeappend: function (pNode, node){
	            		if (!pNode) {
	            		}
	            		else {
	            			if (node.get('projectName')) {
	            				if ((me.projectId && me.projectId == node.getId()) || !me.projectId) {
									var renderedTxt = node.get('projectName');
									if (me.needStatementBillCount) {
										if (!isNaN(parseInt(node.get('rdyckBillCount'), 10)) ) {
											renderedTxt += '&nbsp;<font style="color: orange;"><strong>[' 
														+ node.get('rdyckBillCount') 
														+ ']</strong></font>'; 
										}
										if (!isNaN(parseInt(node.get('chkBillCount'), 10))) {
											renderedTxt += '&nbsp;<font style="color: skyblue;"><strong>[' 
														+ node.get('chkBillCount') 
														+ ']</strong></font>';
										}
										if (!isNaN(parseInt(node.get('paidBillCount'), 10))) {
											renderedTxt += '&nbsp;<font style="color: green;"><strong>[' 
														+ node.get('paidBillCount') 
														+ ']</strong></font>';
										}
									}
									else {
									}
	            					node.set({
		            					// text: node.get('projectName') + '(' + node.get('projectTime').split(' ')[0] + ')',
		            					text: renderedTxt,
		            					leaf: true,
		            					icon: './resources/img/project.png'
		            				});
	            				}
	            				else {
	            					return false;
	            				}
	            			}
	            			else {
	            				node.set({
	            					text: node.get('captain'),
	            					icon: './resources/img/user.ico'
	            				});
	            			}

	            			if (me.isForChart) {
	            				if (node.get('projectName')) {
	            					// 图库面板，即使工程没有图库也出现工程名
	            					// if (node.get('isFrozen') != 1) {

	            					// 图库面板，工程没有图库就不出现工程名
	            					if (node.get('hasChart') == 1 && node.get('isFrozen') != 1) {
	            						node.set({
		            						leaf: true,
		            						icon: 'resources/img/project.png'
		            					});
	            					}
	            					else {
	            						return false;
	            					}
	            				}
	            			}
	            			else if (me.isForAddCategory) {
	            				if (node.get('projectName')) {
	            					if (node.get('hasChart') == 0 && node.get('isFrozen') != 1) {
	            						node.set({
		            						leaf: true,
		            						icon: 'resources/img/project.png'
		            					});
	            					}
	            					else {
	            						return false;
	            					}
	            				}
	            			}
	            		}
	            	},
	            	load: function (st, node, recs){
	            		if (window.pro && node.isRoot() && recs != null) {
	            			var captainName = pro.captainName,
	            				pid = pro.pid;
	            			for (var i  = 0; i < recs.length; i++) {
	            				if (recs[i].get('captainName') == captainName) {
	            					recs[i].expand(false, function (ps){
										Ext.defer(function (){
											for (i = 0; i < ps.length; i++) {
												if (ps[i].getId() == pid) {
													me.getSelectionModel().select(ps[i]);
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
							// shutdown this feature temporarily. data is huge. 
	            			false && me.expandAll(function (){
	            				var treePanel = me;
	            				var rec = treePanel.getRootNode().findChild('projectId', me.projectId, true);
								if (rec) {
									treePanel.getSelectionModel().select(rec);
								}
	            			});
	            		}
	            	}
	            }
			})
		});

		this.callParent();
	}
})