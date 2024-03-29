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
                    newVal = el.new,
                    content;
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
                    additionals: '附加条款'
                };
                switch (field) {
                    case 'additionals':
                        content = '从 "' + JSON.parse(oldVal).join(', ') + '" 到 "' + JSON.parse(newVal).join(', ') + '"';
                        break;

                    case 'captain':
                    case 'signatoryRep':
                        content = '从 "' + JSON.parse(oldVal) + '" 到 "' + JSON.parse(newVal) + '"';
                        break;

                    case 'stages':
                        content = '<br/>更改之前:<br/>';
                        oldVal = JSON.parse(oldVal);
                        content += oldVal.map(function(item){
                            return item.name + ': ' + item.amount + ' [' + item.time + '].';
                        }).join('<br/>');
                        content += '<br/>更改之之后:<br/>';
                        newVal = JSON.parse(newVal);
                        content += newVal.map(function(item){
                            return item.name + ': ' + item.amount + ' [' + item.time + '].';
                        }).join('<br/>');
                        break;

                    case 'custRemark':
                    case 'customer':
                    case 'projectName':
                        try {
                            oldVal = JSON.parse(oldVal);
                            newVal = JSON.parse(newVal);
                        }
                        catch(e) {
                            oldVal = oldVal;
                            newVal = newVal;
                        }
                        content = '从 "' + oldVal + '" 到 "' + newVal + '"';
                        break;

                    default:
                        content = '从 "' + oldVal + '" 到 "' + newVal + '"';
                        break;
                }
                return '更改"' + fieldMap[field] + '", ' + content;
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