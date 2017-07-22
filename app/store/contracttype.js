Ext.define('FamilyDecoration.store.ContractType', {
    extend: 'Ext.data.Store',
    model: 'FamilyDecoration.model.ContractType',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    data: [
        {
            id: '0001',
            name: '工程合同'
        },
        {
            id: '0002',
            name: '分包合同'
        },
        {
            id: '0003',
            name: '物资合同'
        },
        {
            id: '0004',
            name: '设备合同'
        },
        {
            id: '0005',
            name: '劳动合同'
        }
    ]
});