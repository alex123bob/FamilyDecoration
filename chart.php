<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FamilyDecoration Data Analyses</title>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
</head>
<body>
    <div id="regionCountPie" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div>
    <div id="communityCountByLevel" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div>
    <div id="communityCountByTime" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div>
    <script>
        let regionMap = {}, regions = [];
        // Radialize the colors
        Highcharts.setOptions({
            colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
                return {
                    radialGradient: {
                        cx: 0.5,
                        cy: 0.3,
                        r: 0.7
                    },
                    stops: [
                        [0, color],
                        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                    ]
                };
            })
        });

        function buildDonutByCommunityLevel (regionId) {
            if (Object.keys(regionMap).length === 0 && regionMap.constructor === Object) {
                return false;
            }
            let communities = regionMap[regionId].communities,
                map = {},
                arr = [];
            communities.forEach((obj, index, self) => {
                if (!obj.level) {obj.level = 'others'};
                if (map[obj.level]) {
                    map[obj.level].count++;
                }
                else {
                    map[obj.level] = {
                        level: obj.level,
                        count: 1
                    };
                }
            });
            for (const key in map) {
                if (map.hasOwnProperty(key)) {
                    const el = map[key];
                    arr.push([el.level, el.count]);
                }
            }
            Highcharts.chart('communityCountByLevel', {
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45
                    }
                },
                title: {
                    text: 'Community Aggregation By Level'
                },
                subtitle: {
                    text: '3D donut in Highcharts'
                },
                plotOptions: {
                    pie: {
                        innerSize: 100,
                        depth: 45
                    }
                },
                series: [{
                    name: 'Level Amount',
                    data: arr
                }]
            });
        }

        function buildPieByRegionalCommunities (regions){
            // Build the chart
            Highcharts.chart('regionCountPie', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Regional Communities Counting'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function () {
                                    buildDonutByCommunityLevel(this.regionId);
                                    buildLineChartForCommunitiesByTime(this.regionId);
                                }
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            },
                            connectorColor: 'silver'
                        }
                    }
                },
                series: [{
                    name: 'Community Counts',
                    data: regions
                }]
            });
        }

        function buildLineChartForCommunitiesByTime (regionId){
            if (Object.keys(regionMap).length === 0 && regionMap.constructor === Object) {
                return false;
            }
            let communities = regionMap[regionId].communities,
                map = {},
                arr = [],
                xAxis = [],
                data = [];
            communities.forEach(obj => {
                const d = obj.createTime.slice(0, 10);
                if (map[d]) {
                    map[d].count++;
                }
                else {
                    map[d] = {
                        x: d,
                        count: 1
                    };
                }
            });
            for (const key in map) {
                if (map.hasOwnProperty(key)) {
                    const el = map[key];
                    arr.push(el);
                }
            }
            arr.sort((a, b) => {
                a = new Date(a.x);
                b = new Date(b.x);
                return a - b;
            });
            arr.forEach(obj => {
                xAxis.push(obj.x);
                data.push(obj.count);
            });
            Highcharts.chart('communityCountByTime', {
                chart: {
                    type: 'spline'
                },
                title: {
                    text: 'Community Count By CreateTime'
                },
                subtitle: {
                    text: 'FamilyDecoration Statistical Analyses'
                },
                xAxis: {
                    categories: xAxis
                },
                yAxis: {
                    title: {
                        text: 'Community Count'
                    },
                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    }
                },
                series: [{
                    name: 'Community Count',
                    marker: {
                        symbol: 'square',
                        radius: 2
                    },
                    data: data
                }]
            });
        }

        const promise = new Promise((resolve, reject) => {
            fetch('./libs/business.php?debug=true&action=getBusiness').then(res => res.json())
            .then(arr => {
                if (arr.length > 0) {
                    arr.forEach((obj, index) => {
                        if (regionMap[obj.regionId]) {
                            regionMap[obj.regionId].y++;
                            regionMap[obj.regionId].communities.push(obj);
                        }
                        else {
                            regionMap[obj.regionId] = {
                                regionId: obj.regionId,
                                y: 1,
                                name: obj.name,
                                communities: [obj]
                            }
                        }
                    })
                    for (const pro in regionMap) {
                        if (regionMap.hasOwnProperty(pro)) {
                            const obj = regionMap[pro];
                            regions.push(obj);
                        }
                    }
                    resolve(regions);
                }
                else {
                    reject(arr);
                }
            });  
        });
        promise.then((regions) => {
            buildPieByRegionalCommunities(regions);
        }, (err) => {
            console.log(err);
        })
    </script>
</body>
</html>