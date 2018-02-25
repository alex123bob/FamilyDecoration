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
    <button onclick="sortByDate()">sort by date</button>
    <button onclick="sortByCount()">sort by count</button>
    <script>
        let list = [];
        const itemPerTime = 30;

        function sortByDate (){
            list.sort((a, b) => a.sendtime - b.sendtime);
            buildPieByRegionalCommunities(list.slice(0, itemPerTime));
        }

        function sortByCount (){
            list.sort((a, b) => a.y - b.y);
            buildPieByRegionalCommunities(list.slice(0, itemPerTime));
        }

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

        function buildPieByRegionalCommunities (list){
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
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            },
                            connectorColor: 'silver'
                        }
                    }
                },
                series: [{
                    name: 'Community Counts',
                    data: list
                }]
            });
        }

        const promise = new Promise((resolve, reject) => {
            fetch('./libs/wechat.php?debug=true&action=get').then(res => res.json())
            .then(arr => {
                let map = {};
                if (arr.length > 0) {
                    arr.forEach((obj, index) => {
                        const content = obj['messagecontent'].toLowerCase();
                        if ( content && /^[a-zA-Z\s]+$/.test(content) ) {
                            if (map[content]) {
                                map[content].y++;
                            }
                            else {
                                map[content] = {
                                    y: 1,
                                    name: content,
                                    sendtime: new Date(obj['sendtime'])
                                }
                            }
                        }
                    });
                    for (const pro in map) {
                        if (map.hasOwnProperty(pro)) {
                            const obj = map[pro];
                            list.push(obj);
                        }
                    }
                    resolve(list);
                }
                else {
                    reject(arr);
                }
            });  
        });
        promise.then((list) => {
            let count = Math.ceil(list.length / itemPerTime);
            while (count > 0) {
                let button = document.createElement('button');
                button.setAttribute('index', count);
                button.setAttribute('class', 'switchGroup');
                button.setAttribute('style', 'cursor: pointer');
                let text = document.createTextNode(count + ' ');
                button.appendChild(text);
                document.body.insertBefore(button, document.body.firstChild);
                count--;
            }
            document.body.onclick = function (evt){
                const className = evt.target.getAttribute('class');
                if (className == 'switchGroup') {
                    let index = evt.target.getAttribute('index');
                    index = parseInt(index, 10) - 1;
                    buildPieByRegionalCommunities(list.slice(index * itemPerTime, index * itemPerTime + itemPerTime));
                }
            }
            buildPieByRegionalCommunities(list.slice(0, itemPerTime));
        }, (err) => {
            console.log(err);
        })
    </script>
</body>
</html>