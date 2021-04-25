Ext.define('Ext.ux.form.SearchField', {
    extend: 'Ext.form.field.Trigger',

    alias: 'widget.searchfield',

    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',

    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',

    hasSearch : false,
    paramName : 'query',

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });

        // Add change event to monitor changing. Edit by Alexander Lee.
        me.on({
            'change': {
                fn: function (field, newVal){
                    if (newVal == '') {
                        this.onTrigger1Click();
                    }
                    else {
                        this.onTrigger2Click();
                    }
                },
                scope: this,
                buffer: 250
            }
        });

        // We're going to use filtering
        // Close remoteFilter. if you wanna remote filter, open it in store manually. Edit by Alexander Lee
        // me.store.remoteFilter = true;  

        // Set up the proxy to encode the filter in the simplest way as a name/value pair

        // If the Store has not been *configured* with a filterParam property, then use our filter parameter name
        if (!me.store.proxy.hasOwnProperty('filterParam')) {
            me.store.proxy.filterParam = me.paramName;
        }
        me.store.proxy.encodeFilters = function(filters) {
            return filters[0].value;
        }
    },

    afterRender: function(){
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
    },

    onTrigger1Click : function(){
        var me = this;

        if (me.hasSearch) {
            me.setValue('');
            me.store.clearFilter();
            if (me.store.remoteFilter) {
                var proxy = me.store.getProxy(),
                    extraParams = proxy.extraParams;
                delete extraParams._filter;
                me.store.setProxy(proxy);
                me.store.load();
            }
            me.hasSearch = false;
            me.triggerCell.item(0).setDisplayed(false);
            me.updateLayout();
        }
    },

    onTrigger2Click : function(){
        var me = this,
            value = me.getValue();

        if (value.length > 0) {
            // Param name is ignored here since we use custom encoding in the proxy.
            // id is used by the Store to replace any previous filter
            // me.store.filter({
            //     id: me.paramName,
            //     property: me.paramName,
            //     value: new RegExp(value) // edit by Alexander Lee
            // });
            if (me.store.remoteFilter) {
                var proxy = me.store.getProxy(),
                    extraParams = proxy.extraParams;

                extraParams._filter = JSON.stringify([
                    {
                        field: me.paramName,
                        value: value,
                        oper: 'like'// like, notlike, equal, not equal, in , not in, gt, st,
                    }
                ]);

                me.store.setProxy(Ext.apply(proxy, {
                    extraParams: extraParams
                }));
                me.store.load();
            }
            else {
                me.store.filterBy(function (rec, id){
                    var flag = false;
                    if (Ext.isArray(me.paramName)) {
                        Ext.each(me.paramName, function (param, index, self){
                            flag = new RegExp(value).test(rec.data[param]);
                            if (flag) {
                                return false;
                            }
                        });
                    }
                    else if (Ext.isString(me.paramName)) {
                        flag = new RegExp(value).test(rec.data[me.paramName]);
                    }
                    return flag;
                });
            }
            me.hasSearch = true;
            me.triggerCell.item(0).setDisplayed(true);
            me.updateLayout();
        }
    }
});