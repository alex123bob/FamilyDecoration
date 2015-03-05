Ext.define('FamilyDecoration.view.chat.Index', {
  extend: 'Ext.window.Window',
  alias: 'widget.chat-index',
  title: '信息',
  layout: 'fit',
  closable: false,
  collapsed: true,
  expandOnShow: false,
  x: 0,
  width: 400,
  height: 300,
  resizable: false,
  tools: [{
    type: 'toggle',
    handler: function() {
      var win = this.up('window');
      if (win.collapsed) {
        if (win.getY() + 300 > Ext.getBody().getHeight()) {
          win.anchorTo('userInfo', 'tl-bl?', [win.getX(), -300]);
        }
        
        win.expand();
      }
      else {
        win.collapse();
      } 
    }
  }, {
    type: 'minimize',
    handler: function() {
      var win = this.up('window');
      win.collapse();
      setTimeout(function (){
        win.anchorTo('userInfo');
      }, 300);
    }
  }],
  items: [{
    xtype: 'box',
    autoEl: {
      tag: 'iframe',
      src: 'http://104.224.167.12/chat',
    }
  }]
});