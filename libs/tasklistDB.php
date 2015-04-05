<?php
	function deleteLogList($logListId){
		global $mysql;
		$condition = "`id` = '$logListId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`log_list`", $condition, $setValue);

		$condition = "`logListId` = '$logListId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`log_detail`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteLogDetail($logDetailId){
		global $mysql;
		$condition = "`id` = '$logDetailId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`log_detail`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'delete LogDetail Ok');
	}
	
	function addTaskList($post){		
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"taskName"=>$post["taskName"],
			"taskContent"=>$post["taskContent"],
			"taskDispatcher"=>$_SESSION["name"],
			"taskExecutor"=>$post["taskExecutor"],
			"taskProcess"=>0,
			"selfAssessment"=>""
		);
		global $mysql;
		$mysql->DBInsertAsArray("`task_list`",$obj);
		return array('status'=>'successful', 'errMsg' => '','taskListId'=> $obj["id"]);
	}

	function addLogDetail($post){		
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"logListId"=>$post["logListId"],
			"content"=>$post["content"]
		);
		global $mysql;
		$mysql->DBInsertAsArray("`log_detail`",$obj);
		return array('status'=>'successful', 'errMsg' => 'add logDetail OK');
	}

	function getLogDetailsByLogListId($logListId){
		global $mysql;
        $res= array();
        $condition = " where isDeleted = 'false' and logListId = '$logListId' ";
        $orderBy = " order by createTime ";
		$arr = $mysql->DBGetSomeRows("`log_detail`", " * ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("id"=>$val["id"],"createTime"=>$val["createTime"],"content"=>$val["content"]);
		    $count ++;
        }
		return $res;
	}

	function getTaskListYears(){
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
		global $mysql;
        $res= array();
        $orderBy = " order by createTime ";
		//如果是管理员,管理员默认能看到所有人日志
		//if($currentUserLevel == "001-001" || $currentUserLevel == "001-002"){
		//	$whereSql = " where isDeleted = 'false' ";
		//}else{
			$whereSql = " where isDeleted = 'false' and taskExecutor like '%$currentUser%' ";
		//}
		$arr = $mysql->DBGetSomeRows("`task_list`", " DISTINCT year(createTime) ",$whereSql ,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("year"=>$val[0]);
		    $count ++;
        }
		return $res;
	}
	
	function getTaskListYearsByUser($user){
		global $mysql;
        $res= array();
        $orderBy = " order by createTime ";
		$whereSql = " where isDeleted = 'false' and taskExecutor like '%$user%' ";
		$arr = $mysql->DBGetSomeRows("`task_list`", " DISTINCT year(createTime) ",$whereSql ,$orderBy);
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
        $orderBy = "order by createTime";
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
        $orderBy = " order by createTime ";
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
	
	function getTaskListMonthsByUser($year,$user){
		global $mysql;
        $res= array();
		$condition = " where taskExecutor like '%$user%' and isDeleted = 'false' and year(createTime) = '$year'";
        $orderBy = " order by createTime ";
		$arr = $mysql->DBGetSomeRows("`task_list`", " DISTINCT month(createTime)  ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count] = array("month"=>$val[0]);
		    $count ++;
        }
		return $res;
	}

	function getTaskListByMonth($year,$month){
		global $mysql;
        $res= array();
        $orderBy = "order by createTime";
        $condition = " where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' ";
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
        $orderBy = " order by createTime ";
		//默认只有管理员能看到所有人日志
		//if($currentUserLevel != "001-001" && $currentUserLevel != "001-002"){
			$condition = $condition." and taskExecutor like '%$currentUser%' ";
		//}
		$arr = $mysql->DBGetSomeRows("`task_list`", " * ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskName"] = $val["taskName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = $val["taskExecutor"];
		    $count ++;
        }
		return $res;
	}
	
	function getTaskListByMonthByUser($year,$month,$user){
		global $mysql;
        $res= array();
        $condition = " where isDeleted = 'false' and year(createTime) = '$year' and month(createTime) = '$month' ";
        $orderBy = " order by createTime ";
		$condition = $condition." and taskExecutor like '%$user%' ";
		$arr = $mysql->DBGetSomeRows("`task_list`", " * ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskName"] = $val["taskName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = $val["taskExecutor"];
		    $res[$count]["taskContent"] = $val["taskContent"];
		    $res[$count]["taskProcess"] = $val["taskProcess"];
		    $count ++;
        }
		return $res;
	}

	function editLogDetail($data){
		global $mysql;
		$condition = "`id` = '".$data["id"]."' ";
		$setValue = " `content` = '".$data["content"]."'";
		$mysql->DBUpdateSomeCols("`log_detail`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit logdetail ok');
	}

	function getLogListDepartments(){
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
		global $mysql;
        $res= array();

		//如果是管理员,管理员默认能看到所有部门的所有人的日志
		if($currentUserLevel == "001-001" || $currentUserLevel == "001-002"){
			$whereSql = " where `name` in (select `userName` from `log_list`) ";
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
			$res[0] = array("level"=>$currentUserLevel);
		}
		
		return $res;
	}

	function getMembersByDepartment($department){
		global $mysql;
        $res= array();
        $whereSql = "where level like '".$department."-%' and `isDeleted` = 'false' ";

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
?>