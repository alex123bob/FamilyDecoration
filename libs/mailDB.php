<?php
	include_once "common_mail.php";
	include_once "userDB.php";
	
	function insert($mailSender,$senderAddress,$mailReceiver,$receiverAddress,$mailSubject,$mailContent){
		global $mysql;
		$mailId = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$obj = array(
			'mailId'=>$mailId,
			'mailSender'=>$mailSender,
			'senderAddress'=>$senderAddress,
			'mailReceiver'=>$mailReceiver,
			'receiverAddress'=>$receiverAddress,
			'mailSubject'=>$mailSubject,
			'mailContent'=>$mailContent
			);
		$mysql->DBInsertAsArray("`mail`", $obj);
		return array('status'=>'successful', 'errMsg' => '','mailId'=>$mailId);
	}
	function getReceivedMailByUser($user){
		global $mysql;
		$sql = "select * from mail where `isDeleted` = 'false' and mailReceiver = '?' or mailReceiver like '%?,%' or mailReceiver like '%,?%' ORDER BY `mailTime` DESC ";
		$arr = $mysql->DBGetAsMap($sql,$user, $user, $user);
		for ($i = 0; $i < count($arr); $i++) {
			$receiver = $arr[$i]["mailReceiver"];
			$receiverList = explode(',',$receiver);
			for ($j = 0; $j < count($receiverList); $j++) {
				$receiverList[$j] = getUserRealName($receiverList[$j]);
				$receiverList[$j] = $receiverList[$j]["realname"];
			}
			$receiver = implode(",", $receiverList);
			$arr[$i]["mailReceiver"] = $receiver;
			$sender = getUserRealName($arr[$i]["mailSender"]);
			$arr[$i]["mailSender"] = $sender["realname"];
		}
		return $arr;
	}
	
	function getSentMailByUser($user){
		global $mysql;
		$sql = "select * from mail where `isDeleted` = 'false' and mailSender = '?' ORDER BY `mailTime` DESC ";
		$arr = $mysql->DBGetAsMap($sql,$user);
		for ($i = 0; $i < count($arr); $i++) {
			$receiver = $arr[$i]["mailReceiver"];
			$receiverList = explode(',',$receiver);
			for ($j = 0; $j < count($receiverList); $j++) {
				$realName = getUserRealName($receiverList[$j]);
				$realName = $realName["realname"];
				if($realName != "" && $realName != null){
					$receiverList[$j] = $realName;
				}
			}
			$receiver = implode(",", $receiverList);
			$arr[$i]["mailReceiver"] = $receiver;
			$sender = getUserRealName($arr[$i]["mailSender"]);
			$arr[$i]["mailSender"] = $sender["realname"];
		}
		return $arr;
	}

	function setMailRead($mailId) {
		global $mysql;
		$mysql->DBUpdate("mail",array('isRead'=>true),"`mailId` = '?' ",array($mailId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function setMailReadByReceiver ($receiverName) {
		global $mysql;
		$mysql->DBUpdate("mail",array("isRead"=>true),"`mailReceiver` = '?' or `mailReceiver` like '%?,%' or `mailReceiver` like '%,?%'",array($receiverName));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	
?>