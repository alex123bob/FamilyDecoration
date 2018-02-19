<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            width: 960px;
            height: 500px;
            position: relative;
        }
        path.slice{
            stroke-width:2px;
        }
        polyline{
            opacity: .3;
            stroke: black;
            stroke-width: 2px;
            fill: none;
        } 
        svg text.percent{
            fill:white;
            text-anchor:middle;
            font-size:12px;
        }
    </style>
    <title>FamilyDecoration Data Analyses</title>
    <script src="chart/d3.v3.min.js"></script>
    <script src="chart/Donut3D.js"></script>
</head>
<body>
    <script>
        var salesData=[
            {label:"Basic", color:"#3366CC"},
            {label:"Plus", color:"#DC3912"},
            {label:"Lite", color:"#FF9900"},
            {label:"Elite", color:"#109618"},
            {label:"Delux", color:"#990099"}
        ];

        var regionMap = {},
            regions = [];

        function getColor (){
            var arr = [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'],
                color = '#',
                counter = 0;
            while (counter < 6) {
                color += arr[Math.floor(15*Math.random())];
                counter++;
            }
            return color;
        }

        var svg = d3.select("body").append("svg").attr("width",2000).attr("height",1000);

        svg.append("g").attr("id","salesDonut");
        svg.append("g").attr("id","quotesDonut");

        // Donut3D.draw("salesDonut", randomData(), 150, 150, 130, 100, 30, 0.4);
        // Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);
            
        function changeData(){
            // Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
            // Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
        }

        function randomData(){
            return salesData.map(function(d){ 
                return {label:d.label, value:1000*Math.random(), color:d.color};});
        }

        fetch('./libs/business.php?debug=true&action=getBusiness').then(res => res.json())
        .then(arr => {
            arr.forEach((obj, index) => {
                if (regionMap[obj.regionId]) {
                    regionMap[obj.regionId].value++;
                }
                else {
                    regionMap[obj.regionId] = {
                        value: 1,
                        label: obj.name,
                        color: getColor()
                    }
                }
            })
            for (const pro in regionMap) {
                if (regionMap.hasOwnProperty(pro)) {
                    const obj = regionMap[pro];
                    regions.push(obj);
                }
            }
            Donut3D.draw("salesDonut", regions, 1000, 400, 700, 300, 30, 0.4);
        })
    </script>
    <input type="button" value="change data" onclick="changeData()" />
</body>
</html>