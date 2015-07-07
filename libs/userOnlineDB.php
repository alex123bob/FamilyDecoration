<?php
	include_once "conn.php";

	function getOnlineUsers($timeFilter = 'onlineTime',$beginTime,$endTime,$pageNumber=1,$pageSize=-1,$orderBy='onlineTime',$order='desc'){
		global $mysql, $prefix;
		$condition = "left join `user` on `user`.`name` = `online_user`.`userName` where `onlineTime` >= '$beginTime' and  ( `offlineTime` <= '$endTime' or `offlineTime` is null) ";
		$append = "";
		if($pageSize > 0){
			$append = "limit $pageSize offset ".($pageSize*($pageNumber-1));
		}
		$arr = $mysql->DBGetSomeRows("`online_user` ", " `sessionId`, `userName`, `realName`, `userAgent`, `onlineTime`, `offlineTime`, `lastUpdateTime`, `ip` ",$condition," order by $orderBy $order ".$append);
		for ($i = 0; $i < count($arr); $i++) {
			$ips = explode(", ", $arr[$i]["ip"]);
			$location = array();
			for ($j = 0; $j < count($ips); $j++) {
				$ch = curl_init("http://api.map.baidu.com/location/ip?ak=5317a07f6f679290c051680fc0be7cf4&ip=".$ips[$j]."&coor=bd09ll");
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回  
				curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回
				$output = curl_exec($ch);
				$output = json_decode($output, true);
				if ($output["status"] == 0) {
					$tmp = $output["content"]["address"]."(".$output["content"]["point"]["x"].", ".$output["content"]["point"]["y"].")";
					array_push($location, $tmp);
				}
			}
			if (count($location) > 0) {
				$location = join(", ", $location);
			}
			else {
				$location = '地理位置获取异常';
			}
			$arr[$i]["location"] = $location;
		}
		return $arr;
	}
	function getOnlineUsersCount($beginTime,$endTime){
		global $mysql;
		$condition = " `onlineTime` >= '$beginTime' and  ( `offlineTime` <= '$endTime' or `offlineTime` is null) ";
		$res = $mysql->DBGetOneRow("`online_user` ", " count(*) as count ",$condition,"");
		return $res['count'];
	}
?>