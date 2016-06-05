Ext.define('FamilyDecoration.view.billaudit.Index', {
	extend: 'Ext.container.Container',
	alias: 'widget.billaudit-index',
	requires: [
        'FamilyDecoration.store.WorkCategory',
		'FamilyDecoration.view.manuallycheckbill.BillTable',
		'FamilyDecoration.store.StatementBill'
	],
	// autoScroll: true,
	layout: 'hbox',

	initComponent: function () {
		var me = this;
		// get all resources which used to be retrieved a lot of times. quite redundant before.
		// now we just encapsulate it.
		me.getRes = function (){
			var projectGrid = Ext.getCmp('treepanel-projectNameForBillCheck'),
				professionTypeGrid = Ext.getCmp('gridpanel-professionType'),
				billList = Ext.getCmp('gridpanel-billList'),
				billDetailPanel = Ext.getCmp('billtable-previewTable');
			return {
				projectGrid: projectGrid,
				project: projectGrid.getSelectionModel().getSelection()[0],
				professionTypeGrid: professionTypeGrid,
				professionTypeSt: professionTypeGrid.getStore(),
				professionType: professionTypeGrid.getSelectionModel().getSelection()[0],
				billList: billList,
				bill: billList.getSelectionModel().getSelection()[0],
				billDetailPanel: billDetailPanel,
				billCt: billDetailPanel.ownerCt
			}
		};
		
		me.items = [
			{
                xtype: 'gridpanel',
                title: '账单列表',
                flex: 1,
                height: '100%',
                style: {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px'
                },
                hideHeaders: true,
                columns: {
                    items: [
                        {
                            text: '单名',
                            dataIndex: 'billName'
                        },
                        {
                            text: '项目',
                            dataIndex: 'projectName'
                        },
                        {
                            text: '工种',
                            dataIndex: 'professionType',
                            renderer: function (val, meta, rec){
                                return FamilyDecoration.store.WorkCategory.renderer(val);
                            }
                        }
                    ],
                    defaults: {
                        flex: 1,
                        align: 'center'
                    }
                },
                store: Ext.create('FamilyDecoration.store.StatementBill', {
                    autoLoad: true
                })
            },
            {
                xtype: 'manuallycheckbill-billtable',
                flex: 2,
                title: '单据细目',
                header: true,
                height: '100%',
                isPreview: true
            }
		];

		this.callParent();
	}
});