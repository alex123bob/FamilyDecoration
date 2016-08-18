<?php
	include_once "userDB.php";
	
	function getReceivedMailByUser($user){
		global $mysql;
		$forPage = isset($_GET["limit"]) && isset($_GET["start"]) ? true : false;
		$sql = "select * from mail where `isDeleted` = 'false' and mailReceiver = '?' or mailReceiver like '%?,%' or mailReceiver like '%,?%' ORDER BY `createTime` DESC";
		if ($forPage) {
			$start = $_GET["start"];
			$limit = $_GET["limit"];
			$limitSql = " LIMIT $start, $limit ";
			$count = count($mysql->DBGetAsMap($sql, $user, $user, $user));
			$arr = $mysql->DBGetAsMap($sql.$limitSql,$user, $user, $user);
		}
		else {
			$arr = $mysql->DBGetAsMap($sql,$user, $user, $user);
		}
		$usernames = array();
		for ($i = 0; $i < count($arr); $i++) {
			$receiver = $arr[$i]["mailReceiver"];
			$receiverList = explode(',',$receiver);
			$usernames = array_merge($receiverList, $usernames);
			array_push($usernames,$arr[$i]["mailSender"]);
		}
		$namesArray = $mysql->DBGetAsMap("select realname,name from user where name in ( '".implode("','", array_unique($usernames))."' )");
        $names = array();
        for ($i = 0; $i < count($namesArray); $i++) {
        	$names[$namesArray[$i]['name']] = $namesArray[$i]['realname'];
        }
		for ($i = 0; $i < count($arr); $i++) {
			$receiver = $arr[$i]["mailReceiver"];
			$receiverList = explode(',',$receiver);
			for ($j = 0; $j < count($receiverList); $j++) {
                $n = $receiverList[$j];
                $receiverList[$j] = isset( $names[$n] ) ? $names[$n]  : '未知用户' ;
			}
			$receiver = implode(",", $receiverList);
			$arr[$i]["mailReceiver"] = $receiver;
            $arr[$i]["mailSender"] = isset( $names[$arr[$i]["mailSender"]] ) ? $names[$arr[$i]["mailSender"]]  : '未知用户';
		}
		if ($forPage) {
			$res = array("totalCount"=>$count, "resultSet"=>$arr);
			return $res;
		}
		else {
			return $arr;
		}
	}
	
	function getSentMailByUser($user){
		global $mysql;
		$sql = "select * from mail where `isDeleted` = 'false' and mailSender = '?' ORDER BY `createTime` DESC ";
		$forPage = isset($_GET["limit"]) && isset($_GET["start"]) ? true : false;
		if ($forPage) {
			$start = $_GET["start"];
			$limit = $_GET["limit"];
			$limitSql = " LIMIT $start, $limit ";
			$count = count($mysql->DBGetAsMap($sql, $user));
			$arr = $mysql->DBGetAsMap($sql.$limitSql,$user);
		}
		else {
			$arr = $mysql->DBGetAsMap($sql,$user);
		}
		$usernames = array();
		
		for ($i = 0; $i < count($arr); $i++) {
			$receiver = $arr[$i]["mailReceiver"];
			$receiverList = explode(',',$receiver);
			$usernames = array_merge($receiverList, $usernames);
			array_push($usernames,$arr[$i]["mailSender"]);
		}
		$namesArray = $mysql->DBGetAsMap("select realname,name from user where name in ( '".implode("','", array_unique($usernames))."' )");
        $names = array();
        for ($i = 0; $i < count($namesArray); $i++) {
        	$names[$namesArray[$i]['name']] = $namesArray[$i]['realname'];
        }
		for ($i = 0; $i < count($arr); $i++) {
			$receiver = $arr[$i]["mailReceiver"];
			$receiverList = explode(',',$receiver);
			for ($j = 0; $j < count($receiverList); $j++) {
				$n = $receiverList[$j];
                $receiverList[$j] = isset( $names[$n] ) ? $names[$n]  : '未知用户' ;
			}
			$receiver = implode(",", $receiverList);
			$arr[$i]["mailReceiver"] = $receiver;
			$arr[$i]["mailSender"] = isset( $names[$arr[$i]["mailSender"]] ) ? $names[$arr[$i]["mailSender"]]  : '未知用户';
		}
		if ($forPage) {
			$res = array("totalCount"=>$count, "resultSet"=>$arr);
			return $res;
		}
		else {
			return $arr;
		}
	}

	function setMailRead($id) {
		global $mysql;
		$mysql->DBUpdate("mail",array('isRead'=>true),"`id` = '?' ",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function setMailReadByReceiver ($receiverName) {
		global $mysql;
		$mysql->DBUpdate("mail",array("isRead"=>true),"`mailReceiver` = '?' or `mailReceiver` like '%?,%' or `mailReceiver` like '%,?%'",array($receiverName, $receiverName, $receiverName));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	
?>