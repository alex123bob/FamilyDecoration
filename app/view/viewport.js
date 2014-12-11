Ext.define('FamilyDecoration.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.grid.Panel',
        'Ext.layout.container.Border',
        'FamilyDecoration.store.Feature'
    ],

    layout: {
        type: 'border'
    },

    minWidth: 960,
    minHeight: 600,
    autoScroll: true,

    initComponent: function (){
        var featureStore = Ext.create('FamilyDecoration.store.Feature');
        featureStore.filterFeature(User);

        this.items = [{
            xtype: 'gridpanel',
            region: 'west',
            split: true,
            collapsible: true,
            title: '选项',
            hideHeaders: true,
            columns: [
                {
                    dataIndex: 'name', 
                    flex: 1, 
                    sortable: false,
                    menuDisabled: true,
                    draggable: false
                }
            ],
            width: 200,
            minWidth: 200,
            maxWidth: 400,
            store: featureStore,
            margin: '8 1 2 8',
            listeners: {
                selectionchange: function (selModel, sels){
                    var rec = sels[0], xtype;
                    if (rec) {
                        xtype = rec.get('cmp');
                        changeMainCt(xtype);
                    }
                }
            }
        }, {
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            margin: '8 8 2 1',
            items: [{
                xtype: 'bulletin-index'
            }]
        }, {
            xtype: 'container',
            region: 'south',
            margin: '2 4 4 4',
            contentEl: 'userInfo'
        }];

        this.on('afterrender', function (){
            Ext.util.Cookies.set('lastXtype', 'basicitem-index');

            var grid = this.down('gridpanel'),
                st = grid.getStore(),
                bulletin = st.getById('bulletin-index');

            this.down('gridpanel').getSelectionModel().select(bulletin);

            Ext.select('[name="authority"]').elements[0].innerHTML = User.getStatus();
            Ext.select('[name="account"]').elements[0].innerHTML = User.getName();
        });
        
        this.callParent();
    }
});

function changeMainCt (xtype){
    Ext.Ajax.abortAll();
    Ext.suspendLayouts();

    var viewport = Ext.ComponentQuery.query('viewport')[0];
    var items = viewport.items.items;

    var i = 0, newCt, center, option,
        len = items.length;
    var cur = Ext.util.Cookies.get('lastXtype');

    while (i < len) {
        if (items[i].region === 'center') {
            center = items[i];
        }
        else if (items[i].region === 'west') {
            option = items[i];
        }
        i++;
    }

    if (cur) {
        if (cur == xtype) {
            newCt = center.items.items[0];
        }
        else {
            center.removeAll(true);
            newCt = center.insert(0, {
                xtype: xtype
            });
        }
    }
    else {
        newCt = center.insert(0, {
            xtype: xtype
        });
    }

    var cmp = option.getStore().find('cmp', xtype);
    option.getSelectionModel().select(cmp);

    Ext.util.Cookies.set('lastXtype', xtype);

    Ext.resumeLayouts(true);

    return newCt;
}