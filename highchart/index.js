if (document.getElementById('analysisChart')) {
    document.getElementById('analysisChart').onclick = function (){
        var win = Ext.getCmp('chartOwner') ||
        Ext.create('Ext.window.Window', {
            id: 'chartOwner',
            contentEl: 'chartContainer',
            title: '统计图表',
            width: 800,
            height: 600,
            modal: true,
            closeAction: 'hide',
            maximizable: true,
            maximized: true,
            autoScroll: true
        });
        win.show();

        var data = [];

        Ext.Ajax.request({
            url: './libs/loglist.php?action=getAllLogLists',
            method: 'GET',
            callback: function (opts, success, res){
                if (success) {
                    var obj = Ext.decode(res.responseText),
                        tmp = {};
                    if (obj.length > 0) {
                        for (var i = 0; i < obj.length; i++) {
                            if (tmp[obj[i]['userName']] != undefined) {
                                tmp[obj[i]['userName']][1] ++;
                            }
                            else {
                                tmp[obj[i]['userName']] = [obj[i]['realName'], 0];
                            }
                        }
                        for (var pro in tmp) {
                            data.push(tmp[pro]);
                        }
                        // Build the chart
                        $('#chartContainer').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false
                            },
                            title: {
                                text: '用户日志统计图表'
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        style: {
                                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                name: '日志比例',
                                data: data
                            }]
                        });
                    }
                }
            }
        });
    }
}