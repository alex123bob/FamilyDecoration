<?php
	include_once "conn.php";
	include_once "mailDB.php";
	$action = strtolower($_REQUEST["action"]);
	$res = "";
	switch($action){
		case "send":
			$mailSender = $_SESSION['name'];
			$senderAddress = $_SESSION['mail'];
			$receiverAddress = $_REQUEST["recipient"];
			$mailSubject = $_REQUEST["subject"];
			$mailContent = $_REQUEST["body"];
			sendMail($receiverAddress,$mailSubject, $mailContent, null);
			global $mysql;
			$mailReceivers = $mysql->DBGetAsOneArray("select name from user where `name` = '$receiverAddress' and `isDeleted` = 'false' ");
			$mailReceiver = count($mailReceivers == 0)? $receiverAddress : $mailReceivers[0];
			$res = insert($mailSender,$senderAddress,$mailReceiver,$receiverAddress,$mailSubject,$mailContent);
			break;
		case "insert":
			$res = insert($_POST["mailSender"],$_POST["senderAddress"],$_POST["mailReceiver"],
				$_POST["receiverAddress"],$_POST["mailSubject"],$_POST["mailContent"]);
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