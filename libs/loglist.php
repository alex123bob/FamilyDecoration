<?php
	include_once "conn.php";
	include_once "logListDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	$isQuarter = isset($_GET["isQuarter"])?$_GET["isQuarter"]:null;
	switch($action){
		case "addLogList": 	$res = addLogList($_REQUEST);  break;
		case "deleteLogList":$res = deleteLogList($_POST["id"]);break;
		case "deleteLogDetail":$res = deleteLogDetail($_POST["logDetailId"]);break;
		case "addLogDetail":$res = addLogDetail($_POST);break;
		case "editLogDetail":$res = editLogDetail($_POST);break;
		case "getLogListYears":$res = getLogListYears($isQuarter);break;
		case "getLogListMonths":$res = getLogListMonths($_GET["year"],$isQuarter);break;
		case "getLogListByMonth":$res = getLogListByMonth($_GET["year"],$_GET["month"]);break;
		//供 查看别人的日志使用
		case "getLogListYearsByUser":$res = getLogListYearsByUser($_GET['user']);break;
		case "getLogListMonthsByUser":$res = getLogListMonthsByUser($_GET["year"],$_GET['user']);break;
		case "getLogListByMonthByUser":$res = getLogListByMonthByUser($_GET["year"],$_GET["month"],$_GET['user']);break;
		case "getAllLogLists": $res = getAllLogLists(); break;
		
		case "getLogDetailsByLogListId":$res = getLogDetailsByLogListId($_GET["logListId"]);break;
		case "addOrEditLogDetail":$res = isset($_POST["id"]) ? editLogDetail($_POST) : addLogDetail($_REQUEST);break;

		// check log page
		case "getLogListDepartments":$res = getLogListDepartments();break;
		case "getMembersByDepartment":$res = getMembersByDepartment($_GET["department"]);break;
		default: throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>