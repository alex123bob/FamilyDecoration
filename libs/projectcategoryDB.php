<?php
	include_once "conn.php";

	function getProjectCategoryItems (){
		global $mysql;
		$start = $_GET["start"];
		$limit = $_GET["limit"];
		$filterSql = "";
		$filterParams = array();
		if (isset($_GET["userName"])) {
			$userName = $_GET["userName"];
			$userCheckSql = " and (`captainName` = '$userName' or `designerName` = '$userName' or `salesmanName` = '$userName' or `supervisorName` = '$userName') ";
		}
		else {
			$userCheckSql = '';
		}
		if (isset($_GET["captain"])) {
			$filterSql .= " and `captain` like '%?%' ";
			array_push($filterParams, $_GET["captain"]);
		}
		if (isset($_GET["projectName"])) {
			$filterSql .= " and `projectName` like '%?%' ";
			array_push($filterParams, $_GET["projectName"]);
		}
		if (isset($_GET["designer"])) {
			$filterSql .= " and `designer` like '%?%' ";
			array_push($filterParams, $_GET["designer"]);
		}
		if (isset($_GET["salesman"])) {
			$filterSql .= " and `salesman` like '%?%' ";
			array_push($filterParams, $_GET["salesman"]);
		}
		$orderBySql = " ORDER BY `captainName` ASC ";
		$sql = "select * from `project` where `isDeleted` = 'false' and `isFrozen` = 0 ".$userCheckSql.$filterSql.$orderBySql;
		$limitSql = " limit $start, $limit ";
		$projects = $mysql->DBGetAsMap($sql.$limitSql, $filterParams);
		$count = count($mysql->DBGetAsMap($sql, $filterParams));
		for ($i=0; $i < count($projects); $i++) {
			$projects[$i]["serialNumber"] = $start + $i + 1;
			$businessId = $projects[$i]["businessId"];
			$projectId = $projects[$i]["projectId"];
			if ($businessId) {
				// $customer = $mysql->DBGetAsMap("select customer from business where id = '?' and `isDeleted` = 'false' and `isFrozen` = 'false' and `isTransfered` = 'true' and `isDead` = 'false' ", $businessId);
				$customer = $mysql->DBGetAsMap("select customer from business where id = '?' ", $businessId);
				if (count($customer) > 0) {
					$projects[$i]["customer"] = $customer[0]["customer"];
				}
				else {
					$projects[$i]["customer"] = '';
				}
			}
			else {
				$projects[$i]["customer"] = '';
			}
			$proCheck = $mysql->DBGetAsMap("select tilerProCheck, woodProCheck from plan where projectId = '?' and `isDeleted` = 'false' ", $projectId);
			if (count($proCheck) > 0) {
				$projects[$i]["tilerProCheck"] = $proCheck[0]["tilerProCheck"];
				$projects[$i]["woodProCheck"] = $proCheck[0]["woodProCheck"];
			}
			else {
				$projects[$i]["tilerProCheck"] = "";
				$projects[$i]["woodProCheck"] = "";
			}
			$projectProgress = $mysql->DBGetAsMap("select `content` from `project_progress` where `projectId` = '?' and `isDeleted` = 'false' ORDER BY createTime DESC", $projectId);
			if (count($projectProgress) > 0) {
				$projects[$i]["projectProgress"] = $projectProgress[0]["content"];
			}
			else {
				$projects[$i]["projectProgress"] = '';
			}
		}
		return array("items"=>$projects, "total"=>$count);
	}
?>
