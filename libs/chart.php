<?php
	include_once "conn.php";

	function addCategory (array $category){
		global $mysql;
		$obj = array('chartId'=>$category['chartId'],'chartCategory'=> $category['chartCategory']);
		$mysql->DBInsertAsArray('chart',$obj);
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}

	function getCategories (){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`chart`", "*", "where `isDeleted` = 'false'");
		return json_encode($arr);
	}

	function getCategoryById ($chartId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`chart`", "*", "where `chartId` = '$chartId' ");
		return json_encode($arr);
	}

	function editChart (array $chart){
		global $mysql;
		$obj=array();
		foreach ($chart as $key => $val) {
			if ($key == "chartId" || is_numeric ($key)) 
				continue;
			$obj[$key]=$val;
		}
		$mysql->DBUpdate('chart',$obj,"`chartId` = '?'",array($chart['chartId']));
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}

	function deleteCategory (array $chart) {
		global $mysql;
		$condition = "`chartId` = '".$chart['chartId']."'";
		$mysql->DBDelete("`chart`", $condition);
		return json_encode(array('status'=>'successful', 'errMsg' => ''));
	}

	function getChart (array $chart){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`chart`", "*", "where `chartId` = '".$chart["chartId"]."'");
		return json_encode($arr);
	}
?>