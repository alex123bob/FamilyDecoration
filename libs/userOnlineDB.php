<?php
	include_once "conn.php";

	function getOnlineUsers($timeFilter = 'onlineTime',$beginTime,$endTime,$pageNumber=1,$pageSize=-1,$orderBy='onlineTime',$order='desc'){
		global $mysql, $prefix;
		$condition = " where `onlineTime` >= '$beginTime' and  ( `offlineTime` <= '$endTime' or `offlineTime` is null) ";
		$append = "";
		if($pageSize > 0){
			$append = "limit $pageSize offset ".($pageSize*($pageNumber-1));
		}
		$arr = $mysql->DBGetSomeRows("`online_user` ", " * ",$condition," order by $orderBy $order ".$append);
		return $arr;
	}
	function getOnlineUsersCount($beginTime,$endTime){
		global $mysql;
		$condition = " `onlineTime` >= '$beginTime' and  ( `offlineTime` <= '$endTime' or `offlineTime` is null) ";
		$res = $mysql->DBGetOneRow("`online_user` ", " count(*) as count ",$condition,"");
		return $res['count'];
	}
?>