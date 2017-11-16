Ext.define('FamilyDecoration.view.staffsalary.DepaList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.staffsalary-depalist',
    requires: [
        'FamilyDecoration.store.DepaList'
    ],
    layout: 'fit',
    initComponent: function () {
        var me = this;

        me.store = Ext.create('FamilyDecoration.store.DepaList', {
            autoLoad: true,
            listeners: {
                load: function (st, recs, success, opts){
                    if (success) {
                        st.filterBy(function (rec, id){
                            return (rec.get('name') != '006' && rec.get('name') != '010');
                        });
                    }
                }
            }
        });

        me.columns = {
            defaults: {
                flex: 1,
                align: 'center'
            },
            items: [
                {
                    text: '名称',
                    dataIndex: 'name',
                    renderer: function (val, meta, rec){
                        return User.renderDepartment(val);
                    }
                }
            ]
        };
        
        this.callParent();
    }
});