<?php
	include_once "conn.php";
	include_once "mainmaterialDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "addMaterial":
			$res = addMaterial($_POST);  
			break;
		case "deleteMaterial":
			$res = deleteMaterial($_REQUEST["id"]);
			break;
		case "deleteMaterialsByProjectId":
			$res = deleteMaterialsByProjectId($_REQUEST["projectId"]);
			break;
		case "editMaterial":
			$res = editMaterial($_POST);
			break;
		case "getMaterials":
			$res = getMaterials($_REQUEST["id"]);
			break;
		case "getMaterialsByProjectId":
			$res = getMaterialsByProjectId($_REQUEST["projectId"]);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>