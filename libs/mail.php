<?php
	include_once "conn.php";

	$action = strtolower($_REQUEST["action"]);
	$res = "";
	$mailSvc = BaseSvc::getSvc('Mail');
	switch($action){
		case "send":
			$res = $mailSvc->add(array(
					'@mailSubject'=>$_REQUEST["subject"],
					'@mailContent'=>$_REQUEST["body"],
					'@mailReceiver'=>$_REQUEST["recipient"],
					'@mailSender'=> isset($_REQUEST['mailSender']) ? $_REQUEST['mailSender'] : $_SESSION['realname']
				));
			break;
		case "sendmail":
			$res = $mailSvc->add(array(
					'@mailSubject'=>$_REQUEST["mailSubject"],
					'@mailContent'=>$_REQUEST["mailContent"],
					'@mailReceiver'=>$_REQUEST["mailReceiver"],
					'@mailSender'=> isset($_REQUEST['mailSender']) ? $_REQUEST['mailSender'] : $_SESSION['realname']
			));
			break;
		case "getreceivedmailbyuser": $res = $mailSvc->getreceivedmailbyuser($_REQUEST["mailUser"]);break;
		case "getsentmailbyuser": $res = $mailSvc->getsentmailbyuser($_REQUEST["mailUser"]); break;
		case "setmailread":	$res = $mailSvc->setmailread($_REQUEST["id"]);	break;
		case "setmailreadbyreceiver":$res = $mailSvc->setmailreadbyreceiver($_REQUEST["mailReceiver"]);break;
		default: throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);	
?>