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
					'@mailSender'=> isset($_REQUEST['mailSender']) ? $_REQUEST['mailSender'] : $_SESSION['name']
				));
			break;
		case "sendmail":
			$res = $mailSvc->add(array(
					'@mailSubject'=>$_REQUEST["mailSubject"],
					'@mailContent'=>$_REQUEST["mailContent"],
					'@mailReceiver'=>$_REQUEST["mailReceiver"],
					'@mailSender'=> isset($_REQUEST['mailSender']) ? $_REQUEST['mailSender'] : $_SESSION['name']
				));
			break;
		case "getreceivedmailbyuser":$res = $mailSvc->($_REQUEST["mailUser"]);break;
		case "getsentmailbyuser": $res = $mailSvc->($_REQUEST["mailUser"]); break;
		case "setmailread":	$res = $mailSvc->($_REQUEST["id"]);	break;
		case "setmailreadbyreceiver":$res = $mailSvc->($_REQUEST["mailReceiver"]);break;
		default: throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);	
?>