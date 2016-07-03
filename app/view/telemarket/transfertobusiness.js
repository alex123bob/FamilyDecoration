Ext.define('FamilyDecoration.view.telemarket.TransferToBusiness', {
	extend: 'Ext.window.Window',
	alias: 'widget.telemarket-transfertobusiness',
	requires: [

    ],
	title: '转为业务',
	width: 500,
	height: 300,
	bodyPadding: 10,
	modal: true,
    layout: 'form',
    potentialBusiness: undefined,
    defaultType: 'textfield',

	initComponent: function (){
		var me = this;

		me.items = [
            {
                fieldLabel: '客户姓名',
                name: 'proprietor',
                readOnly: true,
                value: me.potentialBusiness.get('proprietor')
            },
            {
                fieldLabel: '联系方式',
                name: 'phone',
                readOnly: true,
                value: me.potentialBusiness.get('phone')
            },
            {
                fieldLabel: '工程地址',
                name: 'address',
                readOnly: true,
                value: me.potentialBusiness.get('address')
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '业务代表',
                        name: 'telemarketingStaffName',
                        readOnly: true,
                        flex: 1,
                        value: me.potentialBusiness.get('telemarketingStaff')
                    },
                    {
                        xtype: 'button',
                        text: '更改',
                        width: 40,
                        handler: function (){
                            
                        }
                    }
                ]
            },
            {
                fieldLabel: '业务来源',
                name: 'source',
                xtype: 'combobox',
                displayField: 'value',
                valueField: 'name',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: 'telemarketing',
                            value: '电销'
                        },
                        {
                            name: 'friend',
                            value: '朋友介绍'
                        },
                        {
                            name: 'transferIntroduction',
                            value: '转介绍'
                        },
                        {
                            name: 'constructionSite',
                            value: '工地业务'
                        },
                        {
                            name: 'activityCustomer',
                            value: '活动客户'
                        },
                        {
                            name: 'other',
                            value: '其它'
                        }
                    ]
                })
            }
        ];

		me.buttons = [{
			text: '确定',
			handler: function (){
			}
		}, {
			text: '取消',
			handler: function (){
				me.close();
			}
		}]

		me.callParent();
	}
})