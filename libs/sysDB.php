<?php
	//更新项目ItemCode
	function adminHeartBeat(){
		global $mysql;
		$sessionId = session_id();
		$res = $mysql->DBGetOneRow("`system`", "count(*) as count", "`id` = '2'  and `paramValue` = '$sessionId'");
		if($res["count"] != 1){
			header('HTTP/1.1 401 admin login somewhere else !');
			throw new Exception("admin已在别处登陆！");
		}
		$mysql->DBUpdateSomeCols("`system`", " `id` = '2' ", " `updateTime` = CURRENT_TIMESTAMP");
		return array("status" => "ok","errMsg" =>"");
	}
?>