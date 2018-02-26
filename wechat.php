<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FamilyDecoration Data Analyses</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/fullcalendar.min.css" />
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="tools/jquery-1.11.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/fullcalendar.min.js"></script>
    <style>
        .background-red {
            background-color: red;
        }
    </style>
</head>
<body>
    <div id="regionCountPie" style="min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto"></div>
    <button onclick="sortByDate()">sort by date</button>
    <button onclick="sortByCount()">sort by count</button>
    <div id="calendar"></div>
    <script>
        function formatDate (d, includeTime = true){
            if (d instanceof Date) {
                let year = d.getFullYear(),
                    month = d.getMonth() + 1,
                    day = d.getDate(),
                    hours = d.getHours(),
                    minutes = d.getMinutes(),
                    seconds = d.getSeconds();
                year = year.toString();
                month = month > 9 ? month.toString() : '0' + month;
                day = day > 9 ? day.toString() : '0' + day;
                hours = hours > 9 ? hours.toString() : '0' + hours;
                minutes = minutes > 9 ? minutes.toString() : '0' + minutes;
                seconds = seconds > 9 ? seconds.toString() : '0' + seconds;
                const dateStr = year + '-' + month + '-' + day;
                return includeTime === true ? (dateStr + ' ' + hours + ':' + minutes + ':' + seconds) : (dateStr);
            }
            else {
                return false;
            }
        }
        
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

        $(function (){
            $('#calendar').fullCalendar({
                dayClick: function(date, jsEvent, view) {

                    let cluster = [];

                    cluster = list.filter(obj => formatDate(obj.sendtime, false) == date.format());

                    console.log(cluster);

                    buildPieByRegionalCommunities(cluster);

                    console.log('Clicked on: ' + date.format());

                    console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

                    console.log('Current view: ' + view.name);

                    // change the day's background color just for fun
                    // $(this).toggleClass('background-red');

                }
            });
        });
        
    </script>
</body>
</html>