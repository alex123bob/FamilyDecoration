<?php
	include_once "conn.php";

	function addProject (array $pro){
		global $mysql;
		// fields that could be edit.
		$fields = array('projectId','businessId','projectName','period','hasChart','captain','captainName','supervisor','supervisorName','createTime', 'salesman','salesmanName', 'designer','designerName','projectTime','budgetId','isFrozen');
		$projectName = $pro['projectName'];
		$array = $mysql->DBGetSomeRows("`project`", "`projectName`", " where `isDeleted` = 'false' and `projectName` = '$projectName'");
		if(count($array) > 0 ){
			throw new Exception("project Named :$projectName already exsit");
		}
		$projectId = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$obj = array('projectId'=>$projectId);
		foreach($fields as $field){
			if(isset($pro[$field]))
				$obj[$field] = $pro[$field];
		}
		$mysql->DBInsertAsArray("`project`", $obj);
		return array('status'=>'successful', 'errMsg' => '','projectId'=>$projectId);
	}

	function delProject ($projectId){
		global $mysql;
		$mysql->DBUpdate("project",array('isDeleted'=>true),"`projectId` = '?'",array($projectId));
		$mysql->DBUpdate("budget",array('isDeleted'=>true),"`projectId` = '?'",array($projectId));
		//TODO 删除plan和progress,budgetItem，其实不删也可以
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getProjectNames (){
		global $mysql;
		$sql = "select projectName from project where `isDeleted` = 'false' ORDER BY `projectTime` DESC ";
		return $mysql->DBGetAsMap($sql);
	}

	function getVisitorProject($visitorName,$filter){
		global $mysql;
		$select = "";
		switch($filter){
			case "onlyYears":
				$select = " YEAR(p.projectTime) as projectYear ";
				break;
			case "onlyMonth":
				$select = " MONTH(p.projectTime) as projectMonth  ";
				break;
			case "project":
			default:
				$select = " p.*,MONTH(p.projectTime) as projectMonth,YEAR(p.projectTime) as projectYear ";
				break;
		}
		$sql = "select $select from user left join project p on p.projectId = user.projectId where user.name = '?' and p.projectId is not null and p.isDeleted = 'false' "; 
		return $mysql->DBGetAsMap($sql,$visitorName);
	}

	function getVisitorProjectCaptain($visitorName) {
		global $mysql;
		$sql = "select DISTINCT `captainName`, `captain` from user left join project p on p.projectId = user.projectId where user.name = '?' and p.projectId is not null and p.isDeleted = 'false' and p.isFrozen = 'false' "; 
		return $mysql->DBGetAsMap($sql, $visitorName);
	}

	function getProjectYears (){
		global $mysql;
		$sql = "select distinct YEAR(`projectTime`) as `projectYear` from project where `isDeleted` = 'false' ORDER BY `projectTime` DESC ";
		return $mysql->DBGetAsMap($sql);
	}
	function getProjectCaptains ($captainName){
		global $mysql;
		if ($captainName != "") {
			return $mysql->DBGetAsMap("select distinct `captainName`, `captain` from project where `isDeleted` = 'false' and `captainName` = '$captainName' ");
		}
		else {
			return $mysql->DBGetAsMap("select distinct `captainName`, `captain` from project where `isDeleted` = 'false' and `captainName` is not NULL");
		}
	}

	function getVisitorProjectsByCaptain($visitorName, $captainName){
		global $mysql;
		$sql = "select * from user left join project p on p.projectId = user.projectId where user.name = '?' and p.captainName = '?' and p.projectId is not null and p.isDeleted = 'false' ";
		return $mysql->DBGetAsMap($sql,$visitorName,$captainName);
	}

	function getProjectMonths ($year){
		global $mysql;
		$sql = "select distinct MONTH(`projectTime`) as `projectMonth` from project where YEAR(`projectTime`) = '?' and `isDeleted` = 'false' ORDER BY `projectMonth` DESC ";
		return $mysql->DBGetAsMap($sql,$year);
	}

	function getProjects ($year, $month){
		global $mysql;
		$sql = "select *, YEAR(`projectTime`) as projectYear , MONTH(`projectTime`) as projectMonth from `project` where YEAR(`projectTime`) = '?' and MONTH(`projectTime`) = '?' and `isDeleted` = 'false' ";
		$sqlBudget = "select * from budget where projectId = '?' and isDeleted = 'false'";
		$projects = $mysql->DBGetAsMap($sql,$year,$month);
		foreach($projects as $key=>$project){
			$projects[$key]['budgets']=$mysql->DBGetAsMap($sqlBudget,$project['projectId']);
		}
		return $projects;
	}
	
	function getProjectsByProjectId ($projectId){
		global $mysql;
		$sql = "select * from project where projectId = '?'  and `isDeleted` = 'false' ";
		$sqlBudget = "select * from budget where projectId = '?' and isDeleted = 'false'";
		$projects = $mysql->DBGetAsMap($sql,$projectId);
		foreach($projects as $key=>$project){
			$projects[$key]['budgets']=$mysql->DBGetAsMap($sqlBudget,$project['projectId']);
		}
		return $projects;
	}

	function editProject (array $pro){
		global $mysql;
		// fields that could be edit.
		$obj = array();
		$fields = array('businessId','projectName','period','captain','captainName','supervisor','supervisorName','hasChart','createTime', 'salesman','salesmanName', 'designer','designerName','projectTime','budgetId','isFrozen');

		foreach($fields as $key){
			if(isset($pro[$key]))
				$obj[$key] = $pro[$key];
		}	
		$mysql->DBUpdate("project",$obj,"`projectId` = '?'",array($pro['projectId']));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function editProjectByProjectName (array $pro){
		global $mysql;
		$projectName = $pro['projectName'];
		$setValue = " isDeleted = isDeleted ";
		// fields that could be edit.
		$fields = array('businessId','projectName','period','captain','captainName','supervisor','supervisorName','hasChart','createTime', 'salesman','salesmanName', 'designer','designerName','projectTime','budgetId','isFrozen');
		$obj = array();
		foreach($fields as $key)
			if(isset($pro[$key]))
				$obj[$key]=$pro[$key];
		$mysql->DBUpdate("project",$obj,"`projectName` = '?'",array($pro['projectName']));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getProjectsByCaptainName ($captainName){
		global $mysql;
		$userName = isset($_REQUEST["userName"]) ? $_REQUEST["userName"] : "";
		if ($userName == "") {
			$projects = $mysql->DBGetAsMap("select * from project where `isDeleted` = 'false' and `captainName` = '?' and `isFrozen` = 'false' ORDER BY `projectTime` ASC ", $captainName);
		}
		else {
			$projects = $mysql->DBGetAsMap("select * from project where `isDeleted` = 'false' and `captainName` = '?' and `isFrozen` = 'false' and (`salesmanName` = '?' || `designerName` = '?') ORDER BY `projectTime` ASC ", $captainName, $userName, $userName);
		}
		$sqlBudget = "select * from budget where projectId = '?' and isDeleted = 'false'";
		foreach($projects as $key=>$project) {
			$projects[$key]["budgets"] = $mysql->DBGetAsMap($sqlBudget,$project['projectId']);
		}
		return $projects;
	}
?>
