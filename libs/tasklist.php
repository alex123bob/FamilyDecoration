<?php
	include_once "conn.php";
	include_once "tasklistDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	// $isQuarter = isset($_GET["isQuarter"])?$_GET["isQuarter"]:null;
	switch($action){
		case "addTaskList": 	$res = addTaskList($_REQUEST);  break;
		case "editTaskList":$res = editTaskList($_POST);break;
		case "getTaskListYears":$res = getTaskListYears();break;
		case "getTaskListMonths":$res = getTaskListMonths($_GET["year"]);break;
		case "getTaskListByMonth":$res = getTaskListByMonth($_GET["year"],$_GET["month"]);break;
		case "getTaskInfoByTaskId":$res = getTaskInfoByTaskId($_GET["taskId"]);break;

		case "addTaskAssessment":$res = addTaskAssessment($_POST);break;
		case "editTaskAssessment":$res = editTaskAssessment($_POST);break;
		case "getTaskAssessmentByTaskListId":$res = getTaskAssessmentByTaskListId($_GET["taskListId"]);break;
		case "getTaskAssessmentByTaskListIdByUser":$res = getTaskAssessmentByTaskListIdByUser($_GET);break;
		
		case "getTaskListYearsByUser":$res = getTaskListYearsByUser($_GET['user']);break;
		case "getTaskListMonthsByUser":$res = getTaskListMonthsByUser($_GET["year"],$_GET['user']);break;
		case "getTaskListByMonthByUser":$res = getTaskListByMonthByUser($_GET["year"],$_GET["month"],$_GET['user']);break;
		default: throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>