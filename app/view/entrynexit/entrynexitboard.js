Ext.define('FamilyDecoration.view.entrynexit.EntryNExitBoard', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.entrynexit-entrynexitboard',
    title: '&nbsp;',
    requires: [

    ],
    viewConfig: {
        emptyText: '请选择条目进行加载',
        deferEmptyText: false
    },
    columns: [],
    
	initComponent: function () {
        var me = this;

        function setTitle (rec) {
            if (rec) {
                me.setTitle(rec.get('value'));
            }
            else {
                me.setTitle('&nbsp;');
            }
        }

        me.refresh = function (rec){
            setTitle(rec);
            if (rec) {
                
            }
            else {

            }
        }

        me.items = [

        ];

        me.callParent();
    }
});