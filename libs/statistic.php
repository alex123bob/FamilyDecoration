<?php
	include_once "conn.php";
	include_once "statisticDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		// check log page
		case "getStatisticDepartments":$res = getStatisticDepartments();break;
		case "getMembersByDepartment":$res = getMembersByDepartment($_GET["department"]);break;
		default: throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>