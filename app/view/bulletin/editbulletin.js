Ext.define('FamilyDecoration.view.bulletin.EditBulletin', {
	extend: 'Ext.window.Window',
    width: 500,
    height: 400,
    modal: true,
    layout: 'fit',

    bulletin: null,
    
    initComponent: function (){
    	var me = this;

    	me.title = me.bulletin ? '编辑公告' : '添加公告';

    	me.items = [{
    		xtype: 'textareafield',
            emptyText: '请输入公告内容',
            hideLabel: true,
            value: me.bulletin ? unescape(me.bulletin.get('content')) : ''
    	}];

    	me.buttons = [{
	        text: '确定',
	        handler: function (){
	            var textarea = me.down('textareafield'),
	            	p = {
	                    content: escape(textarea.getValue())
	                };
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