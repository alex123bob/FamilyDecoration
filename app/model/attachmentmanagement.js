Ext.define('FamilyDecoration.model.AttachmentManagement', {
	extend: 'Ext.data.Model',
	fields: [
		'id',
        'refType', // 关联对象类型，可以定义为表名
        'refId',
        'name',
        'path',
        'size',
        'type',
        'desc',
        'other',
        'uploader',
        'isDeleted',
        'createTime',
        'updateTime'
	],
	idProperty: 'id'
});