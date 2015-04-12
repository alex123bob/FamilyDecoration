<?php
	include_once "conn.php";

	function addProject (array $pro){
		global $mysql;
		// fields that could be edit.
		$fields = array('projectId','businessId','projectName','period','captain','supervisor','createTime', 'salesman', 'designer','projectTime','budgetId','isFrozen');
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
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getProjectNames (){
		global $mysql;
		$arr =  $mysql->DBGetAllRows("`project`", "`projectName`", " where `isDeleted` = 'false' ");
		$res = array();
		$count = 0;
		foreach($arr as $item){
			$res[$count++]['projectName'] = $item['projectName'];
		}
		return $res;
	}

	function getVisitorProject($visitorName,$filter){
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
		$where = " left join project p on p.projectId = user.projectId where user.name = '$visitorName' and p.projectId is not null and p.isDeleted = 'false' "; 
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`user`", $select , $where,"");
		return $arr;
	}
	function getProjectYears (){
		global $mysql;
		$arr =  $mysql->DBGetSomeRows("`project`", "distinct YEAR(`projectTime`) as `projectYear` ","where `isDeleted` = 'false' ", " ORDER BY `projectYear` DESC");
		$res = array();
		$count = 0;
		foreach($arr as $item){
			$res[$count++]['projectYear'] = $item['projectYear'];
		}
		return $res;
	}

	function getProjectMonths ($year){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`project`", "distinct MONTH(`projectTime`) as `projectMonth`", "where YEAR(`projectTime`) = $year and `isDeleted` = 'false' ",
			" ORDER BY `projectMonth` DESC");
		$res = array();
		$count = 0;
		foreach($arr as $item){
			$res[$count++]['projectMonth'] = $item['projectMonth'];
		}
		return $res;
	}

	function getProjects ($year, $month){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`project`", "*", "where YEAR(`projectTime`) = $year and MONTH(`projectTime`) = $month and `isDeleted` = 'false' ");
		$res = array();
		foreach($arr as $key => $val) {
			$res[$key]['projectName'] = urlencode($val['projectName']);
			$res[$key]['projectId'] = urlencode($val['projectId']);
			$res[$key]['projectYear'] = date("Y", strtotime($val["projectTime"]));
			$res[$key]['projectMonth'] = date("m", strtotime($val["projectTime"]));
			$res[$key]['budgetId'] = urlencode($val['budgetId']);
			$res[$key]['period'] = urlencode($val['period']);
			$res[$key]['captain'] = urlencode($val['captain']);
			$res[$key]['supervisor'] = urlencode($val['supervisor']);
			$res[$key]['salesman'] = urlencode($val['salesman']);
			$res[$key]['designer'] = urlencode($val['designer']);
			$res[$key]['projectTime'] = $val['projectTime'];
			$res[$key]['isFrozen'] = $val['isFrozen'];
			$res[$key]['businessId'] = $val['businessId'];
			$res[$key]['hasChart'] = $val['hasChart'];
		}
		return $res;
	}
	
	function getProjectsByProjectId ($projectId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`project`", "*", "where `projectId` = '$projectId' ");
		if ($arr) {
			foreach($arr as $key => $val) {
				$res[$key]['projectName'] = urlencode($val['projectName']);
				$res[$key]['projectId'] = urlencode($val['projectId']);
				$res[$key]['budgetId'] = urlencode($val['budgetId']);
				$res[$key]['period'] = urlencode($val['period']);
				$res[$key]['isFrozen'] = $val['isFrozen'];
				$res[$key]['captain'] = urlencode($val['captain']);
				$res[$key]['supervisor'] = urlencode($val['supervisor']);
				$res[$key]['salesman'] = urlencode($val['salesman']);
				$res[$key]['designer'] = urlencode($val['designer']);
				$res[$key]['projectTime'] = $val['projectTime'];
				$res[$key]['businessId'] = $val['businessId'];
				$res[$key]['hasChart'] = $val['hasChart'];
			}
		}
		return $arr;
	}

	function editProject (array $pro){
		global $mysql;
		// fields that could be edit.
		$obj = array();
		$keys = array('projectName','period','captain','supervisor', 'salesman', 'designer','projectTime','budgetId','isFrozen', 'hasChart');
		foreach($keys as $key){
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
		$keys = array('projectName','period','captain','supervisor', 'salesman', 'designer','projectTime','budgetId','isFrozen');
		$obj = array();
		foreach($keys as $key)
			if(isset($pro[$key]))
				$obj[$key]=$pro[$key];
		$mysql->DBUpdate("project",$obj,"`projectName` = '?'",array($pro['projectName']));
		return array('status'=>'successful', 'errMsg' => '');
	}
?>
