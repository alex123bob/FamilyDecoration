Ext.define('FamilyDecoration.view.bulletin.EditBulletin', {
	extend: 'Ext.window.Window',
    width: 500,
    height: 400,
    modal: true,
    layout: 'vbox',

    bulletin: null,
    
    initComponent: function (){
    	var me = this;

    	me.title = me.bulletin ? '编辑公告' : '添加公告';

    	me.items = [{
    		xtype: 'textfield',
    		emptyText: '请输入公告标题',
    		hideLabel: true,
    		width: '100%',
    		flex: 1,
    		value: me.bulletin ? unescape(me.bulletin.get('title')) : ''
    	}, {
    		xtype: 'textareafield',
            emptyText: '请输入公告内容',
            hideLabel: true,
            width: '100%',
            flex: 9,
            value: me.bulletin ? unescape(me.bulletin.get('content')) : ''
    	}, {
    		xtype: 'checkbox',
    		boxLabel: '邮件通知',
    		hideLabel: true,
    		width: '100%',
            flex: 1,
    		id: 'checkbox-announcementViaEmail',
    		name: 'checkbox-announcementViaEmail'
    	}];

    	me.buttons = [{
	        text: '确定',
	        handler: function (){
	            var textarea = me.down('textareafield'),
	            	titleField = me.down('textfield'),
	            	p = {
	            		title: escape(titleField.getValue()),
	                    content: escape(textarea.getValue())
	                },
	                chk = Ext.getCmp('checkbox-announcementViaEmail');
	            me.bulletin && Ext.apply(p, {
	            	id: me.bulletin.getId()
	            })
	            Ext.Ajax.request({
	                url: './libs/bulletin.php?action=publish',
	                method: 'POST',
	                params: p,
	                callback: function (opts, success, res){
	                    if (success) {
	                        var obj = Ext.decode(res.responseText);
	                        if (obj.status == 'successful') {
	                            me.bulletin ? showMsg('编辑成功！') : showMsg('发布成功！');
	                            Ext.getCmp('gridpanel-bulletin').refresh();
	                            me.close();
	                        }
	                    }
	                }
	            });

	            if (chk.getValue()) {
	            	Ext.Ajax.request({
						url: './libs/user.php?action=view',
						method: 'GET',
						callback: function (opts, success, res){
							if (success) {
								var userArr = Ext.decode(res.responseText);
								var content = User.getRealName() + '发布了公告，公告内容为：\n' + textarea.getValue(),
									subject = '公告通知';

								for (i = 0; i < userArr.length; i++) {
									if (userArr[i].level != '006-001') {
										setTimeout((function (index){
											return function (){
												sendMail(userArr[index].name, userArr[index].mail, subject, content);
											}
										})(i), 1000 * (i + 1));
									}
								}
							}
						}
					});
	            }
	        }
	    }, {
	        text: '取消',
	        handler: function (){
	            me.close();
	        }
	    }];

    	me.callParent();
    }
});