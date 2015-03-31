<?php
	include_once "conn.php";
	include_once "chartdetailDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "getChartsByProjectId": 	$res = getChartsByProjectId($_POST["projectId"]);  break;
		case "getChartsByChartId": 	$res = getChartsByChartId($_POST["chartId"]);  break;
		case "delChartsByProjectId": $res = delChartsByProjectId($_POST["projectId"]); break;
		case "delChartsByChartId": $res = delChartsByChartId($_POST["chartId"]); break;
		case "addCharts": $res = addCharts($_POST); break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>