<?php
	include_once "conn.php";
	include_once "mailDB.php";
	$action = strtolower($_REQUEST["action"]);
	$res = "";
	switch($action){
		case "send":
			$res = sendMail($_REQUEST["recipient"], $_REQUEST["subject"], $_REQUEST["body"], null);  
			break;
		case "sendmail":
			$mailSender = $_REQUEST['mailSender'];
			$senderAddress = $_REQUEST['senderAddress'];
			$mailReceiver = $_REQUEST['mailReceiver'];
			$receiverAddress = $_REQUEST['receiverAddress'];
			$mailSubject =  $_REQUEST['mailSubject'];
			$mailContent =  $_REQUEST['mailContent'];
			sendMail($receiverAddress, $mailSubject, $mailContent, null);
			$res = insert($mailSender,$senderAddress,$mailReceiver,$receiverAddress,$mailSubject,$mailContent);
			break;
		case "getreceivedmailbyuser":
			$res = getReceivedMailByUser($_REQUEST["mailUser"]);
			break;
		case "getsentmailbyuser":
			$res = getSentMailByUser($_REQUEST["mailUser"]);
			break;
		case "setmailread":
			$res = setMailRead($_REQUEST["mailId"]);
			break;
		default: 		
			throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);	
?>