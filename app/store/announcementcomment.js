Ext.define('FamilyDecoration.store.AnnouncementComment', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.AnnouncementComment',
	proxy: {
        type: 'rest',
        url: './libs/announcementcomment.php?action=view',
        reader: {
            type: 'json'
        },
        extraParams: {
        }
    }
});