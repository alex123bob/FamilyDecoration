<?php
	include_once "conn.php";
	include_once "taskscrutinizeDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "mark":
			$res = addCensorship($_REQUEST);  
			break;
		case "deleteCensorship":
			$res = deleteCensorship($_REQUEST["id"]);
			break;
		case "deleteCensorshipByLogListId":
			$res = deleteCensorshipByLogListId($_REQUEST["logListId"]);
			break;
		case "editCensorship":
			$res = editCensorship($_REQUEST);
			break;
		case "getCensorship":
			$res = getCensorship($_REQUEST["id"]);
			break;
		case "getScrutinizeContent":
			$res = getCensorshipByTaskListId($_REQUEST["taskListId"]);
			break;
		case "getCensorshipByUser":
			$res = getCensorshipByUser($_REQUEST["userName"]);
			break;
		default: 
			echo $_SESSION["name"];
			throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>