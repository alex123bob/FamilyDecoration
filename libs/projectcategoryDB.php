<?php
	include_once "conn.php";

	function getProjectCategoryItems (){
		global $mysql;
		$start = $_GET["start"];
		$limit = $_GET["limit"];
		if (isset($_GET["userName"])) {
			$userName = $_GET["userName"];
			$userCheckSql = " and (`captainName` = '$userName' or `designerName` = '$userName' or `salesmanName` = '$userName' or `supervisorName` = '$userName') ";
		}
		else {
			$userCheckSql = '';
		}
		$sql = "select *, YEAR(`projectTime`) as projectYear , MONTH(`projectTime`) as projectMonth from `project` where `isDeleted` = 'false' and `isFrozen` = 0 ".$userCheckSql;
		$limitSql = " limit $start, $limit ";
		$count = count($mysql->DBGetAsMap($sql));
		$projects = $mysql->DBGetAsMap($sql.$limitSql);
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
			$projectProgress = $mysql->DBGetAsMap("select `progress` from `progress` where `projectId` = '?' and `isDeleted` = 'false' ORDER BY createTime DESC", $projectId);
			if (count($projectProgress) > 0) {
				$projects[$i]["projectProgress"] = $projectProgress[0]["progress"];
			}
			else {
				$projects[$i]["projectProgress"] = '';
			}
		}
		return array("items"=>$projects, "total"=>$count);
	}
?>
