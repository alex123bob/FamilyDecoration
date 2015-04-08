<?php
	include_once "conn.php";
	include_once "feedbackDB.php";
	$action = $_GET["action"];
	$res = "";
	switch($action){
		case "send": 				$res = send($_POST);  break;
		case "fetchFeedbacks": 				$res = fetchFeedbacks();  break;
		case "editFeedback": 				$res = editFeedback($_POST);  break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);
?>