<?php
	include_once "../phpmailer/class.smtp.php";
	include_once "../phpmailer/class.phpmailer.php";
	include_once "userDB.php";

	function sendMail($sendTo,$subject,$body = "",$attachement = null){
		date_default_timezone_set('PRC');
		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPDebug = 0;
		$mail->Host = "smtp.sina.com";
		$mail->Port = "465";  
		$mail->SMTPSecure = "ssl";
		$mail->SMTPAuth = true;
		$mail->Username = "dqjczs@sina.com";
		$mail->Password = "86676688";
		$mail->Priority = 1;
		$mail->Charset = 'utf-8';
		$mail->Encoding = 'base64';
		$mail->From = 'dqjczs@sina.com';
		$mail->FromName = '佳诚装饰';
		$mail->Timeout = 30;

		if (isset($_REQUEST['mailSender'])) {
			$realname = getUserRealName($_REQUEST['mailSender']);
			$mail->FromName = $realname["realname"];
		}
		if(contains($sendTo,",")){
			$sendToList = explode(',',$sendTo);
			foreach($sendToList as $st){
				$mail->addAddress($st);
			}
		}else{
			$mail->addAddress($sendTo);     // Add a recipient
		}
		$mail->isHTML(true); // Set email format to HTML
		if($attachement != null){
			$mail->addStringAttachment($attachement['content'],$attachement['name']);
		}
		$mail->Subject = "=?utf-8?B?".base64_encode($subject)."?=";
		$mail->Body    =  nl2br($body);
		$mail->AltBody = "To view the message, please use an HTML compatible email viewer!";
		
		if(!$mail->send()) {
			$errorInfo = $mail->ErrorInfo;
			$mail->smtpClose();
			throw new Exception('Mail could not be sent.Error: ' . $errorInfo);
		}
		$mail->smtpClose();
		return array('status'=>'successful', 'errMsg' => 'Message has been sent');;
	}
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
		$sql = "select * from mail where `isDeleted` = 'false' and mailReceiver like '%?%' ORDER BY `mailTime` DESC ";
		$arr = $mysql->DBGetAsMap($sql,$user);
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
		$sql = "select * from mail where `isDeleted` = 'false' and mailSender like '%?%' ORDER BY `mailTime` DESC ";
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
	
	
?>