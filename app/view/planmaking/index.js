Ext.define('FamilyDecoration.view.planmaking.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.planmaking-index',
	requires: [
 		'FamilyDecoration.view.progress.ProjectListByCaptain',
		'FamilyDecoration.view.planmaking.PlanTable', 'FamilyDecoration.view.planmaking.AddPlanTable'
	],
	layout: 'border',
	loadAll: true,

	initComponent: function () {
		var me = this;

		me.getRes = function (){
			var projectPane = Ext.getCmp('treepanel-projectNameForPlanMaking'),
				project = projectPane.getSelectionModel().getSelection()[0],
				planPane = Ext.getCmp('panel-projectPlan'),
				planTable = planPane.down('planmaking-plantable'),
				planGrid = planTable.down('grid');
			return {
				projectPane: projectPane,
				project: project,
				planPane: planPane,
				planTable: planTable,
				planGrid: planGrid
			};
		};

		me.items = [
			{
				xtype: 'container',
				region: 'west',
				layout: 'fit',
				width: 200,
				margin: '0 1 0 0',
				items: [{
					xtype: 'progress-projectlistbycaptain',
					searchFilter: true,
					loadAll: me.loadAll,
					title: '工程项目',
					id: 'treepanel-projectNameForPlanMaking',
					name: 'treepanel-projectNameForPlanMaking',
					autoScroll: true,
					listeners: {
						itemclick: function (view, rec) {
							if (rec.get('projectName')) {
								return true;
							}
							else {
								return false;
							}
						},
						selectionchange: function (selModel, sels, opts) {
							var rec = sels[0],
								projectPlanPane = Ext.getCmp('panel-projectPlan'),
								planTable = projectPlanPane.down('planmaking-plantable'),
								btns = projectPlanPane.getButtons();
							if (rec && rec.get('projectName')) {
								btns.editPlan.enable();
								btns.deletePlan.enable();
								btns.backToProject.enable();
								btns.previewPlan.enable();
								btns.printPlan.enable();
								planTable.rerenderGridByProject(rec);
								planTable.renderHeaderAndFooterInfo(rec);
							}
							else {
								btns.editPlan.disable();
								btns.deletePlan.disable();
								btns.backToProject.disable();
								btns.previewPlan.disable();
								btns.printPlan.disable();
								planTable.rerenderGridByProject();
								planTable.renderHeaderAndFooterInfo();
							}

						}
					}
				}]
			},
			{
				region: 'center',
				xtype: 'panel',
				title: '工程计划',
				id: 'panel-projectPlan',
				name: 'panel-projectPlan',
				layout: 'fit',
				getButtons: function (){
					var panel = this;
					return {
						editPlan: panel.query('[name="button-editplan"]')[0],
						deletePlan: panel.query('[name="button-deleteplan"]')[0],
						backToProject: panel.query('[name="button-backToProject"]')[0],
						previewPlan: panel.query('[name="button-previewPlan"]')[0],
						printPlan: panel.query('[name="button-printPlan"]')[0]
					}
				},
				tbar: [
					{
						text: '编辑',
						icon: './resources/img/edit.png',
						name: 'button-editplan',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes(),
								period = resourceObj.project.get('period').split(':');
							function add (custName){
								ajaxGet('PlanMaking', false, {
									projectId: resourceObj.project.getId()
								}, function (obj){
									if (obj.data.length > 0) {
										var win = Ext.create('FamilyDecoration.view.planmaking.AddPlanTable', {
											planId: obj['data'][0]['id'],
											project: resourceObj.project,
											isEdit: true,
											callbackAfterClose: function (){
												var resourceObj = me.getRes();
												resourceObj.planGrid.getStore().reload();
											}
										});
										win.show();
										showMsg('进入计划编辑！');
									}
									else {
										ajaxAdd('PlanMaking', {
											projectId: resourceObj.project.getId(),
											projectAddress: resourceObj.project.get('projectName'),
											startTime: period[0],
											endTime: period[1],
											custName: custName
										}, function (obj){
											var win = Ext.create('FamilyDecoration.view.planmaking.AddPlanTable', {
												planId: obj['data']['id'],
												project: resourceObj.project,
												callbackAfterClose: function (){
													var resourceObj = me.getRes();
													resourceObj.planTable.rerenderGridByProject(resourceObj.project);
												}
											});
											win.show();
											showMsg('已添加计划！');
										});
									}
								});
							}
							if (resourceObj.project.get('businessId')) {
								Ext.Ajax.request({
									url: './libs/business.php',
									method: 'GET',
									params: {
										action: 'getBusinessById',
										businessId: resourceObj.project.get('businessId')
									},
									callback: function (opts, success, res){
										if (success) {
											var obj = Ext.decode(res.responseText);
											if (obj.length > 0) {
												add(obj[0]['customer']);
											}
											else {
												add();
											}
										}
									}
								});
							}
							else {
								add();
							}
						}
					},
					{
						text: '删除',
						icon: './resources/img/delete.png',
						name: 'button-deleteplan',
						hidden: User.isGeneral() ? true : false,
						disabled: true,
						handler: function () {
							var resourceObj = me.getRes();
							Ext.Msg.warning('确定要删除此计划吗？', function (btn) {
								if ('yes' == btn) {
									ajaxGet('PlanMaking', false, {
										projectId: resourceObj.project.getId()
									}, function (obj){
										if (obj.data.length > 0) {
											var planId = obj['data'][0]['id'];
											ajaxUpdate('PlanMaking', {
												id: planId,
												isDeleted: 'true'
											}, 'id', function (obj){
												resourceObj.planTable.rerenderGridByProject(resourceObj.project);
												resourceObj.planTable.renderHeaderAndFooterInfo(resourceObj.project);
											});
										}
										else {
											showMsg('改工程暂时没有计划，不能执行删除操作！');
										}
									});
								}
							});
						}
					},
					{
						text: '返回工程',
						icon: './resources/img/back.png',
						name: 'button-backToProject',
						disabled: true,
						handler: function () {
							var sel = Ext.getCmp('treepanel-projectNameForPlanMaking').getSelectionModel().getSelection()[0];
							if (sel) {
								window.pro = {
									// year: sel.get('projectYear'),
									// month: sel.get('projectMonth'),
									captainName: sel.get('captainName'),
									pid: sel.getId()
								};

								changeMainCt('projectprogress-index', {
									loadAll: false
								});
							}
							else {
								showMsg('请选择工程！');
							}
						}
					},
					{
						text: '打印预览',
						icon: 'resources/img/preview_plan.png',
						name: 'button-previewPlan',
						disabled: true,
						handler: function (){
							var resourceObj = me.getRes(),
								project = resourceObj.project;
							if (project) {
								ajaxGet('PlanMaking', false, {
									projectId: resourceObj.project.getId()
								}, function (obj){
									if (obj.data.length > 0) {
										var planId = obj['data'][0]['id'];
										var win = window.open('./fpdf/plan.php?id=' + planId + '&page=A3','打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
									}
									else {
										showMsg('该工程没有计划！');
									}
								});
							}
							else {
								showMsg('没有选中项目！');
							}
						}
					},
					{
						text: '打印进度表',
						icon: 'resources/img/print_plan.png',
						name: 'button-printPlan',
						disabled: true,
						xtype: 'splitbutton',
						printHandler: function (paperType){
							var resourceObj = me.getRes(),
								project = resourceObj.project;
							if (project) {
								ajaxGet('PlanMaking', false, {
									projectId: resourceObj.project.getId()
								}, function (obj){
									if (obj.data.length > 0) {
										var planId = obj['data'][0]['id'];
										var win = window.open('./fpdf/plan.php?id=' + planId + '&page=' + paperType,'打印','height=650,width=700,top=10,left=10,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no');
										win.print();
									}
									else {
										showMsg('该工程没有计划！');
									}
								});
							}
							else {
								showMsg('没有选中项目！');
							}
						},
						menu: [
							{
								text: 'A3',
								handler: function (){
									var splitBtn = this.ownerCt.ownerButton,
										printFunc = splitBtn.printHandler;
									printFunc('A3');
								}
							},
							{
								text: 'A2',
								handler: function (){
									var splitBtn = this.ownerCt.ownerButton,
										printFunc = splitBtn.printHandler;
									printFunc('A2');
								}
							}
						]
					}
				],
				items: [
					{
						xtype: 'planmaking-plantable'
					}
				]
			}
		];

		this.callParent();
	}
});