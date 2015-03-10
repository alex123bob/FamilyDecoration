<?php
/**
	progress process and process comments
*/
	include_once "conn.php";
	include_once "progressDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "addProgress":
			$res = addProgress($_REQUEST);  
			break;
		case "deleteProgress":
			$res = deleteProgress($_REQUEST["id"]);
			break;
		case "deleteProgressByProjectId":
			$res = deleteProgressByProjectId($_REQUEST["projectId"]);
			break;
		case "editProgress":
			$res = editProgress($_REQUEST);
			break;
		case "getProgress":
			$res = getProgress($_REQUEST["id"]);
			break;
		case "getProgressByProjectId":
			$res = getProgressByProjectId($_REQUEST["projectId"]);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);
?>