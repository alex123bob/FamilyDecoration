<?php
	include_once "chart.php";
	include_once "projectDB.php";
	$chart = $_POST;
	if (isset($chart["chartType"])) {
		$chartType = $chart["chartType"];
		unset($chart["chartType"]); // 需要清楚该元素，否则传递数组进去，会将chartType进行赋值操作导致mysql操作错误。
	}
	else {
		$chartType = "empty";
	}

	if($chartType == "project"){
		$arr = getProjectsByProjectId($chart["chartId"]);
		$item = $arr[0];
		$pChart = trim($item["projectChart"]);
		$item["projectChart"] =  $pChart == "" || $pChart == "1" ? $chart["chartContent"] : $item["projectChart"]."<>".$chart["chartContent"] ;
		$res = editProject(array("projectId"=>$item['projectId'], "projectChart"=>$item["projectChart"])); // 这里只需要两个字段即可
       	echo (json_encode($res));
	}else if($chartType == "customized"){
		$arr = getChart($chart);
		$arr = json_decode($arr, true);
		$arr = $arr[0];
		$chart["chartContent"] = $arr["chartContent"] == "" ? $chart["chartContent"] : $arr["chartContent"]."<>".$chart["chartContent"];
		echo editChart($chart);
	}else{
		echo "unkown chartType :".$chartType;
	}

?>