Ext.define('FamilyDecoration.store.PlanMaking', {
	extend: 'Ext.data.Store',
	model: 'FamilyDecoration.model.PlanMaking',
    proxy: {
        type: 'rest',
        url: './libs/api.php',
        pageParam: false, //to remove param "page"
        startParam: false, //to remove param "start"
        limitParam: false, //to remove param "limit"
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            action: 'PlanMaking.getItems'
        }
    }/*,
    data: {
        data: [
            {
                serialNumber: '0001',
                parentItemName: '父名称',
                itemName: '子项目',
                startTime: '2015-07-12',
                endTime: '2015-07-18',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0002',
                parentItemName: '父名称2',
                itemName: '子项目2',
                startTime: '2015-07-14',
                endTime: '2015-07-16',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0003',
                parentItemName: '父名称3',
                itemName: '子项目3',
                startTime: '2015-07-20',
                endTime: '2015-07-30',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0004',
                parentItemName: '父名称4',
                itemName: '子项目4',
                startTime: '2015-07-06',
                endTime: '2015-07-20',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0005',
                parentItemName: '父名称5',
                itemName: '子项目5',
                startTime: '2015-07-10',
                endTime: '2015-07-14',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0006',
                parentItemName: '父名称6',
                itemName: '子项目6',
                startTime: '2015-07-08',
                endTime: '2015-07-09',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0007',
                parentItemName: '父名称7',
                itemName: '子项目7',
                startTime: '2015-07-06',
                endTime: '2015-07-30',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0008',
                parentItemName: '父名称8',
                itemName: '子项目8',
                startTime: '2015-07-13',
                endTime: '2015-07-13',
                projectId: '201503120934479771',
                professionType: '0004'
            },
            {
                serialNumber: '0009',
                parentItemName: '父名称9',
                itemName: '子项目9',
                startTime: '2015-07-28',
                endTime: '2015-07-30',
                projectId: '201503120934479771',
                professionType: '0004'
            }
        ]
    }*/
});