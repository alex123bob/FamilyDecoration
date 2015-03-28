<?php
	include_once "chart.php";
	$chart = $_POST;
	if (!array_key_exists("chartId", $chart)) {
		$chart["chartId"] = "chart"."-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
	}
	if (!array_key_exists("chartContent", $chart)) {
		$chart["chartContent"] = "";
	}
	echo addCategory($chart);
?>