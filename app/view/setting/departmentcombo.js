Ext.define('FamilyDecoration.view.setting.DepartmentCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.setting-departmentcombo',
    editable: false,
    displayField: 'name',
    valueField: 'value',
    queryMode: 'local',

    initComponent: function () {
        var me = this;

        // default return all items, don't filter anything.
        me.filterFn = me.filterFn ? me.filterFn : function (item) {
            return true;
        };

        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'name',
                    convert: function (v, rec) {
                        return User.renderDepartment(rec.raw.value);
                    }
                },
                {
                    name: 'value',
                    convert: function (v, rec) {
                        return rec.raw.value.split('-')[0];
                    }
                }
            ],
            proxy: {
                type: 'memory'
            },
            data: User.role,
            filters: [me.filterFn],
            listeners: {
                load: function (st, recs) {
                    var hits = {};
                    st.filterBy(function (record) {
                        var department = record.get('value');
                        if (hits[department]) {
                            return false;
                        }
                        else {
                            hits[department] = true;
                            return true;
                        }
                    });
                    delete st.snapshot;
                }
            }
        });

        me.callParent();
    }
});