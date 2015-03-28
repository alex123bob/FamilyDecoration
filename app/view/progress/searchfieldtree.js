/**
 * @class SearchFieldTree
 *
 * A simply field to search the content of a tree, using Sencha ExtJS 4.2+
 *
 * Based at the excellent idea of component created by Seth Lemos (http://try.sencha.com/extjs/4.1.1/community/treefilter/),
 * I developed a new one using the events for the triggers that don't work appropriately on MVC structure,
 * abstracting the problem.
 *
 * Example:
 *
 * @example
 *
 * Ext.define('YourApp.view.Menu', {
 *   extend: 'Ext.tree.Panel',
 *   alias: "widget.mainmenu",
 *   useArrows: true,
 *   rootVisible: false,
 *   singleExpand: false,
 *   hideHeaders:true,
 *
 *   store: 'Menu',
 *
 *   plugins: [{
 *              ptype: 'treefilter',              // Defined at the file TreeField.js
 *              allowParentFolders: true,
 *              collapseOnClear:false
 *   }],
 *
 *   columns:[
 *      {
 *          xtype:'treecolumn',
 *          flex:1,
 *          dataIndex:'text'
 *      }
 *  ],
 *
 *  dockedItems: [
 *      {
 *           dock: 'top',
 *           xtype: 'toolbar',
 *           items:[
 *              {
 *                  xtype: 'searchfieldtree'    // Defined at this file
 *              }
 *           ]
 *      }
 *  ]
 *
 * });
 *
 *
 *
 */
Ext.define('FamilyDecoration.view.progress.SearchFieldTree', {
    extend: 'Ext.form.field.Trigger',

    requires:['FamilyDecoration.view.progress.TreeFilter'],

    alias: 'widget.searchfieldtree',

    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',

    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',

    enableKeyEvents: true,
    flex:1,

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
        me.on('specialkey', function(f, e){
            if (e.getKey() == e.ENTER) {
                me.onTrigger2Click();
            }
        });

        me.on({
            'trigger1click' : {                 // The X button for clear the content of the field
                fn: this.onTrigger1Click,
                scope: this
            },
            'trigger2click' : {
                fn: this.onTrigger2Click,      // The button to search
                scope: this
            },
            'change': {
                fn: this.onSelectChange,      // When the user type something, with 200ms of buffer
                scope: this,
                buffer: 200
            }
        });

    },

    /**
     * @event
     *
     * Simply clear the content of the field
     */
    onTrigger1Click: function(){
        this.reset();
        this.focus();
    },


    /**
     * @event
     *
     * The button simply calls the onSelectChange event
     */
    onTrigger2Click: function(){
        this.onSelectChange(this,this.getValue())
    },

    /**
     * @event
     * @param field
     * @param newVal
     *
     * Locate the treepanel above this component and filter with the new value typed.
     */
    onSelectChange: function(field, newVal){
        var tree = this.up('treepanel');
        tree.filter(newVal);
    }

});