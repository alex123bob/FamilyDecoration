<?php
	include_once "conn.php";
	include_once "mailDB.php";
	
	$action = strtolower($_REQUEST["action"]);
	$res = "";
	switch($action){
		case "send":
			$res = BaseSvc::getSvc('Mail')->add(array(
					'@mailSubject'=>$_REQUEST["subject"],
					'@mailContent'=>$_REQUEST["body"],
					'@mailReceiver'=>$_REQUEST["recipient"],
					'@mailSender'=> isset($_REQUEST['mailSender']) ? $_REQUEST['mailSender'] : $_SESSION['name']
				));
			break;
		case "sendmail":
			$res = BaseSvc::getSvc('Mail')->add(array(
					'@mailSubject'=>$_REQUEST["mailSubject"],
					'@mailContent'=>$_REQUEST["mailContent"],
					'@mailReceiver'=>$_REQUEST["mailReceiver"],
					'@mailSender'=> isset($_REQUEST['mailSender']) ? $_REQUEST['mailSender'] : $_SESSION['name']
				));
			break;
		case "getreceivedmailbyuser":
			$res = getReceivedMailByUser($_REQUEST["mailUser"]);
			break;
		case "getsentmailbyuser":
			$res = getSentMailByUser($_REQUEST["mailUser"]);
			break;
		case "setmailread":
			$res = setMailRead($_REQUEST["id"]);
			break;
		case "setmailreadbyreceiver":
			$res = setMailReadByReceiver($_REQUEST["mailReceiver"]);
			break;
		default: 		
			throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);	
?>