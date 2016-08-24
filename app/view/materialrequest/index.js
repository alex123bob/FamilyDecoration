Ext.define('FamilyDecoration.view.materialrequest.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.materialrequest-index',
	requires: [
		'FamilyDecoration.view.materialrequest.MaterialOrder'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
		var me = this;

		function _getRes() {
			var projectPane = me.getComponent('treepanel-projectName'),
				projectPaneSelModel = projectPane.getSelectionModel(),
				project = projectPaneSelModel.getSelection()[0],
				billPane = me.getComponent('panel-billPanel'),
				billRecPane = billPane.down('[name="gridpanel-billRecords"]'),
				billRecPaneSelModel = billRecPane.getSelectionModel(),
				billRec = billRecPaneSelModel.getSelection()[0],
				billRecPaneSt = billRecPane.getStore();

			return {
				projectPane: projectPane,
				projectPaneSelModel: projectPaneSelModel,
				project: project,
				billPane: billPane,
				billRecPane: billRecPane,
				billRecPaneSelModel: billRecPaneSelModel,
				billRec: billRec,
				billRecPaneSt: billRecPaneSt
			};
		}

		me.items = [
			{
				xtype: 'progress-projectlistbycaptain',
				flex: 1,
				height: '100%',
				style: {
					borderRightStyle: 'solid',
					borderRightWidth: '1px'
				},
				searchFilter: true,
				title: '工程列表',
				itemId: 'treepanel-projectName',
				autoScroll: true,
				listeners: {
					selectionchange: function (selModel, sels, opts) {
						var resObj = _getRes();
						resObj.billPane.initBtn();
					}
				}
			},
			{
				xtype: 'panel',
				flex: 4,
                title: '&nbsp;',
				height: '100%',
                layout: 'vbox',
				itemId: 'panel-billPanel',
                defaults: {
                    width: '100%'
                },
				_getBtns: function () {
					var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
					return {
						add: tbar.down('[name="add"]'),
						edit: tbar.down('[name="edit"]'),
						del: tbar.down('[name="del"]'),
						submit: tbar.down('[name="submit"]'),
						applyfor: tbar.down('[name="applyfor"]'),
						approve: tbar.down('[name="approve"]'),
						preview: tbar.down('[name="preview"]'),
						print: tbar.down('[name="print"]')
					}
				},
				initBtn: function () {
					var btnObj = this._getBtns(),
						resObj = _getRes();
					
					for (var key in btnObj) {
						if (btnObj.hasOwnProperty(key)) {
							var btn = btnObj[key];
							if (key == 'add') {
								btn.setDisabled(!resObj.project || !resObj.project.get('projectName'));
							}
							else {
								btn.setDisabled(!resObj.project || !resObj.billRec);
							}
						}
					}
				},
				tbar: [
					{
						xtype: 'button',
						text: '添加',
						name: 'add',
						icon: 'resources/img/material_request_add.png',
						disabled: true,
						handler: function (){
							var win = Ext.create('Ext.window.Window', {
								layout: 'fit',
								title: '添加',
								modal: true,
								width: 700,
								height: 400,
								maximizable: true,
								autoScroll: true,
								items: [
									{
										xtype: 'materialrequest-materialorder'
									}
								],
								tbar: [
									{
										xtype: 'button',
										icon: 'resources/img/material_request_add_small_item.png',
										text: '添加小项',
										handler: function (){

										}
									}
								],
								buttons: [
									{
										text: '确定',
										handler: function (){

										}
									},
									{
										text: '取消',
										handler: function (){
											win.close();
										}
									}
								]
							});
							win.show();
						}
					},
					{
						xtype: 'button',
						text: '编辑',
						name: 'edit',
						icon: 'resources/img/material_request_edit.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '删除',
						name: 'del',
						icon: 'resources/img/material_request_delete.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '递交审核',
						name: 'submit',
						icon: 'resources/img/material_request_submit.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '申请付款',
						name: 'applyfor',
						icon: 'resources/img/material_request_apply.png',
						disabled: true
					},
					{
						// limited show
						xtype: 'button',
						text: '审核通过',
						name: 'approve',
						icon: 'resources/img/material_request_approve.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '打印预览',
						name: 'preview',
						icon: 'resources/img/material_request_preview.png',
						disabled: true
					},
					{
						xtype: 'button',
						text: '打印订购单',
						name: 'print',
						icon: 'resources/img/material_request_print.png'
					}
				],
                items: [
                    {
                        xtype: 'materialrequest-materialorder',
                        flex: 1,
						previewMode: true
                    },
					{
						title: '记录',
						xtype: 'gridpanel',
						name: 'gridpanel-billRecords',
						flex: 0.5,
						columns: {
							defaults: {
								flex: 1,
								align: 'center'
							},
							items: [
								{
									text: '序号'
								},
								{
									text: '单据名称'
								},
								{
									text: '总额(元)'
								},
								{
									text: '单据状态' // 是否提交审核及通过，是否提交付款，是否付款
								}
							]
						},
						listeners: {
							selectionchange: function (selModel, sels, opts){
								var resObj = _getRes();
								resObj.billPane.initBtn();
							}
						}
					}
                ]
			}
		];

		this.callParent();
	}
});