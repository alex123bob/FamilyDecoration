<?php
	include_once "conn.php";
	include_once "planDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "addPlan":
			$res = addPlan($_POST);  
			break;
		case "deletePlan":
			$res = deletePlan($_REQUEST["id"]);
			break;
		case "deletePlanByProjectId":
			$res = deletePlanByProjectId($_REQUEST["projectId"]);
			break;
		case "editPlan":
			$res = editPlan($_POST);
			break;
		case "getPlan":
			$res = getPlan($_REQUEST["id"]);
			break;
		case "getPlanByProjectId":
			$res = getPlanByProjectId($_REQUEST["projectId"]);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>