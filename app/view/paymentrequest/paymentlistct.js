Ext.define('FamilyDecoration.view.paymentrequest.PaymentListCt', {
    extend: 'Ext.container.Container',
    alias: 'widget.paymentrequest-paymentlistct',
    layout: 'vbox',
    requires: [

    ],
    defaults: {
        width: '100%',
        xtype: 'gridpanel'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                title: '&nbsp;',
                flex: 3,
                tbar: [
                    {
                        name: 'button-addRequest',
                        text: '添加',
                        icon: 'resources/img/add_request.png',
                        handler: function () {

                        }
                    },
                    {
                        name: 'button-editRequest',
                        text: '编辑',
                        icon: 'resources/img/edit_request.png',
                        handler: function () {

                        }
                    },
                    {
                        name: 'button-deleteRequest',
                        text: '删除',
                        icon: 'resources/img/delete_request.png',
                        handler: function () {

                        }
                    },
                    {
                        name: 'button-submitRequest',
                        text: '递交申请',
                        icon: 'resources/img/submit_request.png',
                        handler: function () {

                        }
                    },
                    {
                        name: 'button-passRequest',
                        text: '审核通过',
                        icon: 'resources/img/pass_request.png',
                        handler: function () {

                        }
                    }
                ],
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '项目名称'
                        },
                        {
                            text: '归属项目'
                        },
                        {
                            text: '申请金额'
                        },
                        {
                            text: '申请日期'
                        },
                        {
                            text: '提交状态'
                        },
                        {
                            text: '申请属性'
                        },
                        {
                            text: '备注'
                        },
                        {
                            text: '附件'
                        }
                    ]
                }
            },
            {
                title: '往年记录',
                flex: 2,
                columns: {
                    defaults: {
                        flex: 1,
                        align: 'center'
                    },
                    items: [
                        {
                            text: '年份'
                        },
                        {
                            text: '笔数'
                        },
                        {
                            text: '总额'
                        }
                    ]
                }
            }
        ];

        me.callParent();
    }
});