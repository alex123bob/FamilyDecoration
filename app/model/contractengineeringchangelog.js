Ext.define('FamilyDecoration.model.ContractEngineeringChangelog', {
    extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'string'},
		{name: 'contractId', type: 'string'},
		{name: 'changeContent', convert: function(val, rec) {
            var arr = JSON.parse(val);
            return arr.map(function(el){
                var field = el.field,
                    oldVal = el.old,
                    newVal = el.new;
                var fieldMap = {
                    address: '工程地址',
                    captain: "项目经理",
                    captainName: "项目经理账号",
                    custContact: "甲方联系方式",
                    custRemark: "甲方名称",
                    customer: "甲方负责人",
                    endTime: "工期结束时间",
                    period: "工期",
                    projectName: "工程名称",
                    signatoryRep: "签约代表",
                    signatoryRepName: "签约代表账号",
                    stages: '工程款',
                    startTime: "工程开始时间",
                    totalDays: "总工期",
                    totalPrice: "合同总额",
                }
                return '更改"' + fieldMap[field] + '", 从"' + oldVal + '"到"' + newVal + '"';
            }).join('<br />');
        }},
        {name: 'creator', type: 'string'},
        {name: 'creatorName', type: 'string'},
    ],
    proxy: {
        type: 'rest',
        url : './libs/api.php',
        extraParams: {
            action: 'ContractEngineeringChangelog.update'
        }
    }
});