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
		case "getProjectCaptains":
			$visitorName = $_SESSION["name"];
			$captainName = isset($_GET["captainName"]) ? $_GET["captainName"] : "";
			if ($_SESSION["level"] == "006-001") {
				$res = getVisitorProjectCaptain($visitorName);
			}
			else {
				$res = getProjectCaptains($captainName);
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
		case "getProjectsByCaptainName":
			$settled = isset($_REQUEST['settled']) ? (int)$_REQUEST['settled'] : -1;
			if ($_SESSION["level"] == "006-001") {
				$visitorName = $_SESSION["name"];
				$res = getVisitorProjectsByCaptain($visitorName, $_REQUEST["captainName"], $settled);
			}
			else {
				$res = getProjectsByCaptainName($_REQUEST["captainName"], $settled);
			}
			break;
		case "filterProjectByProjectName":
			$projectStaff = isset($_REQUEST["projectStaff"]) ? $_REQUEST["projectStaff"] : false;
			$userName = isset($_REQUEST["userName"]) ? $_REQUEST["userName"] : false;
			$res = filterProjectByProjectName($_REQUEST["projectName"], $projectStaff, $userName, $_REQUEST["includeFrozen"]);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>
