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

		me.items = [
			{
				xtype: 'container',
				layout: 'fit',
				flex: 1,
				height: '100%',
				items: [{
					style: {
						borderRightStyle: 'solid',
						borderRightWidth: '1px'
					},
					xtype: 'progress-projectlistbycaptain',
					searchFilter: true,
					title: '工程列表',
					id: 'treepanel-projectNameForMaterialRequest',
					name: 'treepanel-projectNameForMaterialRequest',
					autoScroll: true,
					listeners: {
						selectionchange: function (selModel, sels, opts) {
							var pro = sels[0];
							if (pro && pro.get('projectName')) {
								
							}
							else if (!pro) {
								
							}
						}
					}
				}]
			},
			{
				xtype: 'panel',
				flex: 3,
                title: '&nbsp;',
				height: '100%',
                layout: 'vbox',
                defaults: {
                    width: '100%'
                },
                items: [
                    {
                        xtype: 'materialrequest-materialorder',
                        flex: 1
                    }
                ]
			}
		];

		this.callParent();
	}
});