<?php
	include_once "conn.php";
	include_once "tasklistDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	// $isQuarter = isset($_GET["isQuarter"])?$_GET["isQuarter"]:null;
	switch($action){
		case "addLogList": 	$res = addLogList($_REQUEST);  break;
		case "deleteLogList":$res = deleteLogList($_POST["id"]);break;
		case "deleteLogDetail":$res = deleteLogDetail($_POST["logDetailId"]);break;
		case "addLogDetail":$res = addLogDetail($_POST);break;
		case "editLogDetail":$res = editLogDetail($_POST);break;
		case "getTaskListYears":$res = getTaskListYears();break;
		case "getTaskListMonths":$res = getTaskListMonths($_GET["year"],$isQuarter);break;
		case "getTaskListByMonth":$res = getTaskListByMonth($_GET["year"],$_GET["month"]);break;
		//供 查看别人的日志使用
		case "getTaskListYearsByUser":$res = getTaskListYearsByUser($_GET['user']);break;
		case "getTaskListMonthsByUser":$res = getTaskListMonthsByUser($_GET["year"],$_GET['user']);break;
		case "getTaskListByMonthByUser":$res = getTaskListByMonthByUser($_GET["year"],$_GET["month"],$_GET['user']);break;
		case "getAllTaskLists": $res = getAllLogLists(); break;
		
		case "getLogDetailsByLogListId":$res = getLogDetailsByLogListId($_GET["logListId"]);break;
		case "addOrEditLogDetail":$res = isset($_POST["id"]) ? editLogDetail($_POST) : addLogDetail($_REQUEST);break;

		// check log page
		case "getLogListDepartments":$res = getLogListDepartments();break;
		case "getMembersByDepartment":$res = getMembersByDepartment($_GET["department"]);break;
		default: throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>