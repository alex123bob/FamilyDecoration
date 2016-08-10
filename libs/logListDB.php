<?php
	function deleteLogList($logListId){
		global $mysql;
		$mysql->DBUpdate("log_list",array('isDeleted'=>true),"`id` = '?' ",array($logListId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteLogDetail($logDetailId){
		global $mysql;
		// 方法已经失效，前端可能还在掉。
		return array('status'=>'successful', 'errMsg' => 'delete LogDetail Ok');
	}
	
	function addLogList($post){		
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"logName"=>$post["logName"],
			"createTime"=>$post["createTime"],
			"userName"=>$post["userName"]
		);
		global $mysql;
		$mysql->DBInsertAsArray("`log_list`",$obj);
		return array('status'=>'successful', 'errMsg' => '','logListId'=> $obj["id"]);
	}

	function addLogDetail($post){		
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"logListId"=>$post["logListId"],
			"logType"=>$post["logType"],
			"content"=>$post["content"]
		);
		global $mysql;
		// 方法已经失效，前端可能还在掉。
		return array('status'=>'successful', 'errMsg' => 'add logDetail OK', 'id' => $obj["id"]);
	}

	function getLogDetailsByLogListId($logListId){
		global $mysql;
		// 方法已经失效，前端可能还在掉。
        $res= array();
		return $res;
	}

	function getLogListYears($isQuarter){
		if($isQuarter == "true"){
			$res = array();
			$res[0] = array("year"=>date('Y',time()));
			return $res;
		}
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
		global $mysql;
        $res= array();
        $orderBy = " order by createTime DESC";
		//如果是管理员,管理员默认能看到所有人日志
		//if($currentUserLevel == "001-001" || $currentUserLevel == "001-002"){
		//	$whereSql = " where isDeleted = 'false' ";
		//}else{
			$whereSql = " where isDeleted = 'false' and userName = '$currentUser' ";
		//}
		$arr = $mysql->DBGetSomeRows("`log_list`", " DISTINCT year(createTime) ",$whereSql ,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("year"=>$val[0]);
		    $count ++;
        }
		return $res;
	}
	
	function getLogListYearsByUser($user, $isQuarter){
		if($isQuarter == "true"){
			$res = array();
			$res[0] = array("year"=>date('Y',time()));
			return $res;
		}
		global $mysql;
        $res= array();
        $orderBy = " order by createTime DESC ";
		$whereSql = " where isDeleted = 'false' and userName = '$user' ";
		$arr = $mysql->DBGetSomeRows("`log_list`", " DISTINCT year(createTime) ",$whereSql ,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("year"=>$val[0]);
		    $count ++;
        }
		return $res;
	}

	function getLogListMonths($year,$isQuarter){
		global $mysql;
        $res= array();
        $orderBy = "order by createTime DESC";
        $monthOfQuarters = array(
				1=>"1,2,3",2=>"1,2,3",3=>"1,2,3",
				4=>"4,5,6",5=>"4,5,6",6=>"4,5,6",
				7=>"7,8,9",8=>"7,8,9",9=>"7,8,9",
				10=>"10,11,12",11=>"10,11,12",12=>"10,11,12");
		$condition = " where isDeleted = 'false' and year(createTime) = '$year' " ;
		if($isQuarter == "true"){    
			$condition = $condition." and month(createTime) in (".$monthOfQuarters[date('n',time())].") ";
		}else{
			if($year == date('Y',time())){
	        	$condition = $condition." and date_format(createTime,'%c') not in (".$monthOfQuarters[date('n',time())].") ";
			}
		}
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
        $orderBy = " order by createTime DESC";
		//默认只有管理员能看到所有人日志
		//if($currentUserLevel != "001-001" && $currentUserLevel != "001-002"){
			$condition = $condition." and userName = '$currentUser' ";
		//}
		$arr = $mysql->DBGetSomeRows("`log_list`", " DISTINCT month(createTime)  ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("month"=>$val[0]);
		    $count ++;
        }
		return $res;
	}
	
	function getLogListMonthsByUser($year,$user,$isQuarter){
		global $mysql;
        $res= array();
		$condition = " where userName = '$user' and isDeleted = 'false' and year(createTime) = '$year' ";
        $orderBy = " order by createTime DESC ";
        $monthOfQuarters = array(
				1=>"1,2,3",2=>"1,2,3",3=>"1,2,3",
				4=>"4,5,6",5=>"4,5,6",6=>"4,5,6",
				7=>"7,8,9",8=>"7,8,9",9=>"7,8,9",
				10=>"10,11,12",11=>"10,11,12",12=>"10,11,12");
        if($isQuarter == "true"){    
			$condition = $condition." and month(createTime) in (".$monthOfQuarters[date('n',time())].") ";
		}else{
			if($year == date('Y',time())){
	        	$condition = $condition." and date_format(createTime,'%c') not in (".$monthOfQuarters[date('n',time())].") ";
			}
		}
		$arr = $mysql->DBGetSomeRows("`log_list`", " DISTINCT month(createTime)  ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("month"=>$val[0]);
		    $count ++;
        }
		return $res;
	}

	function getLogListByMonth($year,$month){
		global $mysql;
        $res= array();
        $orderBy = "order by createTime DESC";
        $condition = " where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' ";
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
        $orderBy = " order by createTime DESC ";
		//默认只有管理员能看到所有人日志
		//if($currentUserLevel != "001-001" && $currentUserLevel != "001-002"){
			$condition = $condition." and userName = '$currentUser' ";
		//}
		$arr = $mysql->DBGetSomeRows("`log_list`", " * ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["logListId"] = $val["id"];
		    $res[$count]["logName"] = $val["logName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["userName"] = $val["userName"];
		    $count ++;
        }
		return $res;
	}
	
	function getLogListByMonthByUser($year,$month,$user){
		global $mysql;
        $res= array();
        $condition = " where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' ";
        $orderBy = " order by createTime DESC ";
		$condition = $condition." and userName = '$user' ";
		$arr = $mysql->DBGetSomeRows("`log_list`", " * ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["logListId"] = $val["id"];
		    $res[$count]["logName"] = $val["logName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["userName"] = $val["userName"];   
		    $count ++;
        }
		return $res;
	}

	function editLogDetail($data){
		global $mysql;
		// 方法已经失效，前端可能还在掉。
		return array('status'=>'successful', 'errMsg' => 'edit logdetail ok');
	}

	function getLogListDepartments($forEmail){
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
		global $mysql;
        $res= array();

		//如果是管理员,管理员默认能看到所有部门的所有人的日志，或者需要在发送邮件时，请求到所有用户列表的时候，用fullList标志位
		if($_GET["individual"] == "false" 
			&& ($currentUserLevel == "001-001" || $currentUserLevel == "001-002" || $_GET["fullList"] == "true")){
			$whereSql = " where `name` in (select `committer` from `log_list`) ";
			$orderBy = " ORDER BY `user`.`level` ASC ";
			$arr = $mysql->DBGetSomeRows("`user`", " DISTINCT `level` ",$whereSql ,$orderBy);
			foreach($arr as $key => $val) {
				$depa = explode("-", $val[0]);
				$depa = $depa[0];
				// if ($depa != "001") {
				$flag = false;
				for ($i = 0; $i < count($res); $i++) {
					$tmp = preg_match("/^".$depa."-\d{3}$/", $res[$i]["level"]);
					if ($tmp == 1) {
						$flag = true;
						break;
					}
				}
				if ($flag) {
					// todo
				}
				else {
					array_push($res, array("level"=>$val[0]));
				}
				// }
	        }
		}
		else {
			if ($forEmail == "true") {
				$res[0] = array("level"=>"001-001");
				$res[1] = array("level"=>"005-001");
				$res[2] = array("level"=>$currentUserLevel);
			}
			else {
				$res[0] = array("level"=>$currentUserLevel);
			}
		}
		
		return $res;
	}

	function getMembersByDepartment($department){
		global $mysql;
        $res= array();
        $whereSql = "where level like '".$department."-%' and `isDeleted` = 'false' ";

        if ($_GET["individual"] == 'true') {
        	$whereSql .= " and `name` = '".$_SESSION["name"]."' ";
        }

        $arr = $mysql->DBGetSomeRows("`user`", "*", $whereSql);

        return $arr;
	}

	// This is used for chart generation
	function getAllLogLists() {
		global $mysql;

		$condition = "left join `user` on `user`.`name` = `log_list`.`userName` where `log_list`.`isDeleted` = 'false' ";

        $arr = $mysql->DBGetSomeRows("`log_list`", "`log_list`.`id`, `logName`, `log_list`.`createTime`, `userName`, `realName`", $condition);

        return $arr;
	}

	function getUserNameAndLogListIdByLogDetailId ($logDetailId){
		global $mysql;
		// 方法已经失效，前端可能还在掉。
		return array();
	}
?>