Ext.define('FamilyDecoration.model.NormCostItem', {
    extend: 'Ext.data.Model',
    idProperty: 'itemId',
	fields: [
		{name: 'normId', type: 'string'},
        {name: 'itemId', type: 'string'},
        {name: 'version', type: 'int'},
        {name: 'item'}, // item object
        {name: 'norm'}, // norm object
        {
            name: 'itemName', 
            convert: function(val, rec){
                return rec.get('item').name;
            } 
        },
        {
            name: 'itemUnit', 
            convert: function(val, rec){
                return rec.get('item').unit;
            } 
        },
        {
            name: 'itemProfessionType', 
            convert: function(val, rec){
                return rec.get('item').professionType;
            } 
        },
        {
            name: 'itemIsLabour', 
            convert: function(val, rec){
                return rec.get('item').isLabour;
            } 
        },
        {
            name: 'itemRemark', 
            convert: function(val, rec){
                return rec.get('item').remark;
            } 
        },
        {
            name: 'normName',
            convert: function(val, rec){
                return rec.get('norm').name;
            }
        }
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'CostRefNormItem.update'
        }
    }
});