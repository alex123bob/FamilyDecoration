<?php
	include_once "conn.php";
	include_once "projectDB.php";
	include_once "budgetDB.php";

	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "addProject":
			$res = addProject($_REQUEST);  
			break;
		case "delProject":
			if(isset($_REQUEST['budgetId'])){
				delBudget($_REQUEST['budgetId']);
			}
			//TODO 删除plan和progress，其实不删也可以
			$res = delProject($_REQUEST["projectId"]);
			break;
		case "editProject":
        case "editproject":
		case "editProjectHeadInfo":
			$res = editProject($_REQUEST);
			break;
		case "editProjectByProjectName":
			$res = editProjectByProjectName($_REQUEST);
			break;
		case "getProjectsByProjectId":
        case "getprojectbyid":
			$res = getProjectsByProjectId($_REQUEST['projectId']);
			break;
		case "getProjectNames":
			$res = getProjectNames();
			break;
		case "getProjectYears":
			$visitorName = $_SESSION["name"];
			if( $_SESSION["level"] == "006-001"){
				$res = getVisitorProject($visitorName,"onlyYears");
			}else{
				$res = getProjectYears();
			}
			break;
		case "getProjects":
			if( $_SESSION["level"] == "006-001"){
				//游客仅且只能看到一个项目。因此不需要取年，月过滤啦
				$visitorName = $_SESSION["name"];
				$res =  getVisitorProject($visitorName,"project");
			}else{
				$year = $_REQUEST['year'];
				$month = $_REQUEST['month'];
				$res = getProjects($year, $month);
			}
			break;
		case "getProjectMonths":
			if( $_SESSION["level"] == "006-001"){
				//游客仅且只能看到一个项目。因此不需要取年过滤啦
				$visitorName = $_SESSION["name"];
				$res = getVisitorProject($visitorName,"onlyMonth");
			}else{
				$year = $_REQUEST['year'];
				$res = getProjectMonths($year);
			}
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>
