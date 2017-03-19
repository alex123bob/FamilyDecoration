<?php
	function addTaskList($post){
		$executor = explode(",", $post["taskExecutor"]);
		global $mysql;
		for ($i=0; $i < count($executor); $i++) { 
			$obj = array(
				"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"taskName"=>$post["taskName"],
				"taskContent"=>myStrEscape($post["taskContent"]),
				"taskDispatcher"=>$_SESSION["name"],
				"taskExecutor"=>$executor[$i],
				"taskProcess"=>0,
				"startTime"=>$post["startTime"],
				"endTime"=>$post["endTime"],
				"priority"=>$post["priority"]
			);
			$mysql->DBInsertAsArray("`task_list`",$obj);
		}
		return array('status'=>'successful', 'errMsg' => '','taskListId'=> $obj["id"]);
	}

	function addTaskAssessment ($post){
		global $mysql;
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"taskListId"=>$post["taskListId"],
			"taskExecutor"=>"-".$_SESSION["name"]."-",
			"selfAssessment"=>myStrEscape($post["selfAssessment"])
		);
		$mysql->DBInsertAsArray("`task_self_assessment`", $obj);
		return array('status'=>'successful', 'errMsg' => '','taskListId'=> $obj["id"]);
	}

	function editTaskAssessment ($post){
		global $mysql;
		$obj = array();
		$fields = array("id", "taskListId","selfAssessment","");
		foreach ($fields as $field) {
			if (isset($post[$field]))
				$obj[$field] = $post[$field];
		}
		if (isset($post["taskExecutor"]))
			$obj['taskExecutor'] = '-'.str_replace(",", "-", $post["taskExecutor"]).'-';
		$mysql->DBUpdate("task_self_assessment",$obj,"`id` = '?' ",array($post["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit task assessment ok');
	}

	function getTaskAssessmentByTaskListId ($taskListId){
		global $mysql;
		$res = array();
		$orderBy = " order by createTime DESC ";
		$currentUser = "-".$_SESSION["name"]."-";
		$whereSql = " where `isDeleted` = 'false' and `taskListId` = '$taskListId' and `taskExecutor` = '$currentUser' ";
		$arr = $mysql->DBGetSomeRows("`task_self_assessment`", "*", $whereSql, $orderBy);

		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskListId"] = $val["taskListId"];
		    $res[$count]["isDeleted"] = $val["isDeleted"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = str_replace("-",",",$val["taskExecutor"]);
		    $res[$count]["selfAssessment"] = $val["selfAssessment"];
		    $count ++;
        }
        return $res;
	}

	function getTaskAssessmentByTaskListIdByUser ($get){
		global $mysql;
		$res = array();
		$orderBy = " order by createTime DESC ";
		$taskExecutor = $get["taskExecutor"];
		$taskListId = $get["taskListId"];
		$whereSql = " where `isDeleted` = 'false' and `taskListId` = '$taskListId' and `taskExecutor` = '-$taskExecutor-' ";
		$arr = $mysql->DBGetSomeRows("`task_self_assessment`", "*", $whereSql, $orderBy);

		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskListId"] = $val["taskListId"];
		    $res[$count]["isDeleted"] = $val["isDeleted"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = str_replace("-",",",$val["taskExecutor"]);
		    $res[$count]["selfAssessment"] = $val["selfAssessment"];
		    $count ++;
        }
        return $res;
	}

	function getTaskList ($data){
		global $mysql;
		$sql = " SELECT t.*, u.realname as taskDispatcherRealName, p.realname as taskExecutorRealName FROM `task_list` t left join user u on t.taskDispatcher=u.name left join user p on t.taskExecutor = p.name";
		$orderBy = " ORDER BY t.priority DESC, endTime ASC ";
		$fields = array("taskName", "taskContent", "startTime", "endTime", "priority", "assistant", "score", "taskDispatcher", "taskExecutor", "taskProcess");
		$params = array();
		$values = array();
		foreach ($fields as $key => $field) {
			if (isset($data[$field])) {
				array_push($params, "t.`".$field."` = '?'");
				array_push($values, $data[$field]);
			}
		}
		if (count($params) > 0) {
			$params = implode(" and ", $params);
			$sql .= " where t.isDeleted = 'false' and ".$params;
		}
		$sql .= $orderBy;
		$res = $mysql->DBGetAsMap($sql, $values);
		include_once "userDB.php";
		for ($i=0; $i < count($res); $i++) { 
			$assistantArr = explode(",", $res[$i]["assistant"]);
			for ($j=0; $j < count($assistantArr); $j++) { 
				$assistantArr[$j] = getUserRealName($assistantArr[$j])["realname"];
			}
			$res[$i]["assistantRealName"] = implode(",", $assistantArr);
		}
		return $res;
	}

	function getTaskListYears(){
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
		global $mysql;
        $res= array();
        $orderBy = " order by createTime DESC ";
		//如果是管理员,管理员默认能看到所有人日志
		//if($currentUserLevel == "001-001" || $currentUserLevel == "001-002"){
		//	$whereSql = " where isDeleted = 'false' ";
		//}else{
			$whereSql = " where isDeleted = 'false' and taskExecutor like '%-$currentUser-%' ";
		//}
		//echo $whereSql;
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
        $orderBy = " order by createTime DESC ";
		$whereSql = " where isDeleted = 'false' and taskExecutor like '%-$user-%' ";
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
        $orderBy = "order by createTime DESC";
		$condition = " where isDeleted = 'false' and year(createTime) = '$year' " ;
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
        $orderBy = " order by createTime DESC ";
		//默认只有管理员能看到所有人日志
		//if($currentUserLevel != "001-001" && $currentUserLevel != "001-002"){
			$condition = $condition." and taskExecutor like '%-$currentUser-%' ";
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
		$condition = " where taskExecutor like '%-$user-%' and isDeleted = 'false' and year(createTime) = '$year'";
        $orderBy = " order by createTime DESC ";
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
        $condition = " left join `user` u on u.name = REPLACE(t.taskDispatcher,'-','') where t.isDeleted = 'false' and year(t.createTime) = '$year' and month(t.createTime) = '$month' ";
		$currentUser = $_SESSION["name"];
		$currentUserLevel = $_SESSION["level"];
        $orderBy = " order by createTime DESC ";
		//默认只有管理员能看到所有人日志
		//if($currentUserLevel != "001-001" && $currentUserLevel != "001-002"){
			$condition = $condition." and taskExecutor like '%-$currentUser-%' ";
		//}
		$arr = $mysql->DBGetSomeRows("`task_list` t", " t.*,u.realname,u.phone,u.mail ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskName"] = $val["taskName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = str_replace("-",",",$val["taskExecutor"]);
		    $res[$count]["taskContent"] = $val["taskContent"];
		    $res[$count]["taskProcess"] = $val["taskProcess"];
			$res[$count]["taskDispatcher"] = str_replace("-","",$val["taskDispatcher"]);
			$res[$count]["realName"] = $val["realname"];
			$res[$count]["taskDispatcherPhoneNumber"] = $val["phone"];
			$res[$count]["taskDispatcherMail"] = $val["mail"];
		    $count ++;
        }
		return $res;
	}

	function getTaskInfoByTaskId($taskId) {
		global $mysql;
		$res= array();
        $condition = "where `isDeleted` = 'false' and `id` = '$taskId'";
		$arr = $mysql->DBGetSomeRows("`task_list`", "*", $condition, "");
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskName"] = $val["taskName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = str_replace("-",",",$val["taskExecutor"]);
		    $res[$count]["taskContent"] = $val["taskContent"];
		    $res[$count]["taskProcess"] = $val["taskProcess"];
			$res[$count]["taskDispatcher"] = str_replace("-","",$val["taskDispatcher"]);
		    $count ++;
        }
		return $res;
	}
	
	function getTaskListByMonthByUser($year,$month,$user){
		global $mysql;
        $res= array();
        $condition = " left join `user` u on u.name = REPLACE(t.taskDispatcher,'-','') where t.isDeleted = 'false' and year(t.createTime) = '$year' and month(t.createTime) = '$month' ";
        $orderBy = " order by t.createTime ";
		$condition = $condition." and taskExecutor like '%-$user-%'  ";
		$arr = $mysql->DBGetSomeRows("`task_list` t ", " t.* , u.realname ",$condition,$orderBy);
		$count = 0;
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskName"] = $val["taskName"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["taskExecutor"] = str_replace("-",",",$val["taskExecutor"]);
		    $res[$count]["taskContent"] = $val["taskContent"];
			$res[$count]["taskDispatcher"] = str_replace("-","",$val["taskDispatcher"]);
			$res[$count]["realName"] = $val["realname"];
		    $res[$count]["taskProcess"] = $val["taskProcess"];
		    $count ++;
        }
		return $res;
	}

	function editTaskList($data){
		global $mysql;
		$obj = array();
		$fields = array("id", "taskName","createTime", "taskContent","isDeleted", "taskProcess", "startTime", "endTime", "priority", "assistant", "score");
		foreach ($fields as $field)
			if (isset($data[$field]))
				$obj[$field] = $data[$field];
		if (isset($data['taskDispatcher']))
			$obj['taskDispatcher'] = $data["taskDispatcher"];
		if (isset($data['taskExecutor']))
			$obj['taskExecutor'] = $data["taskExecutor"];
		$mysql->DBUpdate('task_list',$obj,"`id` = '?' ",array($data["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit tasklist ok');
	}

	function getTaskListByUser($user){
		global $mysql;
		$res= $mysql->DBGetAsMap("select t.*, u.realname as realName, u.phone, u.mail from task_list t left join `user` u on u.name = REPLACE(t.taskDispatcher,'-','') where t.taskExecutor like '%-$user-%' and t.isDeleted = 'false'");
		return $res;
	}
?>