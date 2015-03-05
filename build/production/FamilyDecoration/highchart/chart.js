Keen && Keen.ready(function () {

    var client = new Keen({
        projectId: '54ddaf6396773d3d2e0989a9',
        readKey: '0e5c1d0cc763b44c38f7b2591118894923670a4a13527bb2dabc00ce4bafbce0260563830bee686beafad22db0e236e1ef9ff1547f56d7f54d580761acf022734b4254ff673b56c5320f67518d48f8c1da7854ba293929d7386ff5c22e96a336e6f57d9751987476e170423f07f8de2e',
        writeKey: '6738aa4270d12d224a62b9c5a95e78902312b78dc49e40e453746aeea913e0a2410a50ea67feb3dff72e53e2ef3ca6e71f182fc118fd4760624288b88165a637a5346b2d50af868cd7c8713fdc3233fa76fbfbb12393ec53ac65744d52bff64fc60e45217158cb94b9872f6ad9e2dbc6'
    });

    var pageViewEvent = {
        userName: User.name,
        userLevel: User.level,
        time: Ext.Date.format(new Date(), 'Y/m/d/H/i/s')
    };

    client.addEvent('pageview', pageViewEvent, function (err, res){
        if (err) {
            console.log(err);
        }
        else {
            console.log(arguments);
        }
    });

    // bind chart event
    document.getElementById('keen-io-chart').onclick = function (){
        var client = new Keen({
            projectId: '54ddaf6396773d3d2e0989a9',
            readKey: '0e5c1d0cc763b44c38f7b2591118894923670a4a13527bb2dabc00ce4bafbce0260563830bee686beafad22db0e236e1ef9ff1547f56d7f54d580761acf022734b4254ff673b56c5320f67518d48f8c1da7854ba293929d7386ff5c22e96a336e6f57d9751987476e170423f07f8de2e'
        });

        var query = new Keen.Query("count", {
            eventCollection: "pageview",
            groupBy: "userName",
            interval: "hourly",
            timeframe: "today",
            filters: [
                // {
                //     'property_name': 'userName',
                //     'operator': 'in',
                //     'property_value': ['admin', 'vadmin']
                // }
            ]
        });

        client.draw(query, document.getElementById("grid-1-1"), {
            chartType: "areachart",
            title: false,
            height: 250,
            width: "auto",
            chartOptions: {
                chartArea: {
                    height: "85%",
                    left: "5%",
                    top: "5%",
                    width: "80%"
                },
                isStacked: true
            }
        });

        var pieChartCount = new Keen.Query('count', {
            eventCollection: 'pageview',
            groupBy: 'userName'
        });
        
        client.run(pieChartCount, function (err, res){
            if (!err) {
                var arr = res.result,
                    data = [];
                for (var i = 0; i < arr.length; i++) {
                    data.push([arr[i].userName, arr[i].result]);
                }
                $('#grid-1-2').highcharts({
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        },
                        height: 250
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'page view times:',
                        data: data
                    }]
                });
            }
            else {
                console.log(err);
            }
        });

        var columnChartCount = new Keen.Query('count', {
            eventCollection: 'pageview',
            groupBy: 'userName'
        });

        client.run(columnChartCount, function (err, res){
            if (!err) {
                var arr = res.result,
                    data = [], cata = [];
                for (var i = 0; i < arr.length; i++) {
                    data.push(arr[i].result);
                    cata.push(arr[i].userName);
                }

                $('#grid-2-1').highcharts({
                    chart: {
                        type: 'column',
                        margin: 75,
                        height: 250,
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 25,
                            depth: 70
                        }
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    plotOptions: {
                        column: {
                            depth: 25
                        }
                    },
                    xAxis: {
                        categories: cata
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    series: [{
                        name: 'user name',
                        data: data
                    }]
                });
            }
            else {
                console.log(err);
            }
        });

        client.draw(query, document.getElementById("grid-2-2"), {
            chartType: "linechart",
            title: false,
            height: 250,
            width: "auto",
            chartOptions: {
                chartArea: {
                    height: "75%",
                    left: "10%",
                    top: "5%",
                    width: "60%"
                },
                bar: {
                    groupWidth: "85%"
                },
                isStacked: true
            }
        });

        var win = Ext.getCmp('chartOwner') 
                || Ext.create('Ext.window.Window', {
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
        
        var seriousLineChartCount = new Keen.Query("count", {
            eventCollection: "pageview",
            interval: "hourly",
            timeframe: "this_7_days"
        });

        var percentageAreaChartCount = new Keen.Query("count", {
            eventCollection: "pageview",
            interval: "hourly",
            timeframe: "this_2_days",
            groupBy: 'userName'
        });

        client.run(seriousLineChartCount, function (err, res){
            if (!err) {
                var arr = res.result,
                    data = [],
                    startDate = new Date(arr[0].timeframe.start);
                for (var i = 0; i < arr.length; i++) {
                    data.push(arr[i].value);
                }
                
                $('#grid-3-1').highcharts({
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: 'various users page view chart'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                                'Click and drag in the plot area to zoom in' :
                                'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        type: 'datetime',
                        minRange: 3600 * 1000 // per hour
                    },
                    yAxis: {
                        title: {
                            text: 'page view number'
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: 'page viewers',
                        pointInterval: 3600 * 1000,
                        pointStart: Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                        data: data
                    }]
                });
            }
        });

        client.run(percentageAreaChartCount, function (err, res){
            if (!err) {
                var arr = res.result,
                    data = [], cata = [],
                    startDate = new Date(arr[0].timeframe.start);
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arr[i].value.length; j++) {
                        if (data[j]) {
                            data[j].data.push(arr[i].value[j].result);
                        }
                        else {
                            data.push({
                                name: arr[i].value[j].userName,
                                data: [arr[i].value[j].result]
                            });
                        }
                    }
                }


                for (i = 0; i < arr.length; i++) {
                    var tmpDate = new Date(arr[i].timeframe.start);
                    cata.push(tmpDate.getFullYear() + '-' + (tmpDate.getMonth() + 1) + '-' + tmpDate.getDate() + ' ' + tmpDate.getHours() + ':' + tmpDate.getMinutes() + ':' + tmpDate.getSeconds());
                }

                $('#grid-4-1').highcharts({
                    chart: {
                        type: 'area'
                    },
                    title: {
                        text: 'page view percentage area sorted by username'
                    },
                    subtitle: {
                        text: 'this 2 days\' data'
                    },
                    xAxis: {
                        categories: cata,
                        tickmarkPlacement: 'on',
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Percent'
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
                        shared: true
                    },
                    plotOptions: {
                        area: {
                            stacking: 'percent',
                            lineColor: '#ffffff',
                            lineWidth: 1,
                            marker: {
                                lineWidth: 1,
                                lineColor: '#ffffff'
                            }
                        }
                    },
                    series: data
                });

            }
            else {
                console.log(err);
            }
        });
    }
});