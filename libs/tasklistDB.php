<?php
	function addTaskList($post){		
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"taskName"=>$post["taskName"],
			"taskContent"=>$post["taskContent"],
			"taskDispatcher"=>$_SESSION["name"],
			"taskExecutor"=>$post["taskExecutor"],
			"taskProcess"=>0
		);
		global $mysql;
		$mysql->DBInsertAsArray("`task_list`",$obj);
		return array('status'=>'successful', 'errMsg' => '','taskListId'=> $obj["id"]);
	}

	function addTaskAssessment ($post){
		global $mysql;
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"taskListId"=>$post["taskListId"],
			"taskExecutor"=>$_SESSION["name"],
			"selfAssessment"=>$post["selfAssessment"]
		);
		$mysql->DBInsertAsArray("`task_self_assessment`", $obj);
		return array('status'=>'successful', 'errMsg' => '','taskListId'=> $obj["id"]);
	}

	function editTaskAssessment ($post){
		global $mysql;
		$condition = "`id` = '".$post["id"]."' ";
		$setValue = array();
		$fields = array("id", "taskListId", "taskExecutor", "selfAssessment");
		foreach ($fields as $field) {
			if (isset($post[$field])) {
				array_push($setValue, " `$field` = '".$post[$field]."'");
			}
		}
		$setValue = implode(",", $setValue);
		// $setValue = " `taskName` = '".$post["taskName"]."', `taskContent` = '".$post["taskContent"]."', `taskExecutor` = '".$data["taskExecutor"]."'";
		$mysql->DBUpdateSomeCols("`task_self_assessment`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit task assessment ok');
	}

	function getTaskAssessmentByTaskListId ($taskListId){
		global $mysql;
		$res = array();
		$orderBy = " order by createTime ";
		$currentUser = $_SESSION["name"];
		$whereSql = " where `isDeleted` = 'false' and `taskListId` = '$taskListId' and `taskExecutor` = '$currentUser' ";
		$arr = $mysql->DBGetSomeRows("`task_self_assessment`", "*", $whereSql, $orderBy);

		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskListId"] = $val["taskListId"];
		    $res[$count]["isDeleted"] = $val["isDeleted"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = $val["taskExecutor"];
		    $res[$count]["selfAssessment"] = $val["selfAssessment"];
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

	function getTaskListMonths($year){
		global $mysql;
        $res= array();
        $orderBy = "order by createTime";
		$condition = " where isDeleted = 'false' and year(createTime) = '$year' " ;
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
        $orderBy = " order by createTime ";
		//默认只有管理员能看到所有人日志
		//if($currentUserLevel != "001-001" && $currentUserLevel != "001-002"){
			$condition = $condition." and taskExecutor like '%$currentUser%' ";
		//}
		$arr = $mysql->DBGetSomeRows("`task_list`", " DISTINCT month(createTime)  ",$condition,$orderBy);
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
		    $res[$count]["taskContent"] = $val["taskContent"];
		    $res[$count]["taskProcess"] = $val["taskProcess"];
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

	function editTaskList($data){
		global $mysql;
		$condition = "`id` = '".$data["id"]."' ";
		$setValue = array();
		$fields = array("id", "taskName", "taskContent", "createTime", "taskDispatcher", "taskExecutor", "isDeleted", "taskProcess");
		foreach ($fields as $field) {
			if (isset($data[$field])) {
				array_push($setValue, " `$field` = '".$data[$field]."'");
			}
		}
		$setValue = implode(",", $setValue);
		// $setValue = " `taskName` = '".$data["taskName"]."', `taskContent` = '".$data["taskContent"]."', `taskExecutor` = '".$data["taskExecutor"]."'";
		$mysql->DBUpdateSomeCols("`task_list`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit tasklist ok');
	}
?>