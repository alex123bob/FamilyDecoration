Ext.define('Ext.ux.form.ButtonAttachedText', {
    extend:'Ext.form.FieldContainer',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    alias: 'widget.buttonattachedtext',
    requires: ['Ext.form.field.Text', 'Ext.button.Button'],
    alternateClassName: ['Ext.form.ButtonAttachedText', 'Ext.form.BtnAtText'],

    // text for button text
    text: undefined,

    // chainable
    setBtnText: function (val){
        var btn = this.down('button');
        return (val && typeof val === 'string') ? btn.setText(val) : btn.setText('浏览');
    },

    setValue: function (val){
        var txt = this.down('textfield');
        return txt.setValue(val);
    },

    clear: function (){
        var txt = this.down('textfield');
        txt.setValue('');
    },

    // button click event
    handler: function (){
        console.log('This is click event');
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    xtype: 'textfield',
                    hideLabel: true,
                    readOnly: true,
                    flex: 3.4,
                    value: me.value || '',
                    emptyText: me.emptyText || '',
                    blankText: me.blankText || 'This field is required',
                },
                {
                    xtype: 'button',
                    text: me.text || '浏览',
                    handler: me.handler,
                    flex: 1
                }
            ]
        })

        me.callParent();
    }
});
