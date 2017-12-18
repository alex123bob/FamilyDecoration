<?php
	header("Content-type: text/html; charset=utf-8");
	header("message-queue: 1");
	header( 'Access-Control-Allow-Origin:'.$_SERVER['HTTP_ORIGIN']);
	header( 'Access-Control-Allow-Credentials:true');
	header( 'Access-Control-Allow-Headers:Origin, X-Requested-With, Content-Type, Accept');

	$isLocal = $_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['HTTP_HOST'] == '127.0.0.1';
    if(!$isLocal && $_SERVER['HTTPS'] != 'on') {
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
        exit();
    }

	//print_r($_REQUEST);
	//print_r($_SERVER);
	define('__ROOT__', dirname(dirname(__FILE__))); 

	if (!session_id()) session_start();
	// error_reporting(E_ALL ^ E_DEPRECATED);
	date_default_timezone_set('Asia/Shanghai');
	require_once "svc/base/TableMapping.php";
	require_once "svc/base/BaseSvc.class.php";
	include_once "mysqli.class.php";
	include_once "common.php";

	if (defined("SAE_MYSQL_HOST_M")) {
		$mysql = new mysql(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, 'utf8',SAE_MYSQL_PORT);
	} else {
		$mysql = new mysql('127.0.0.1', 'root', '', 'familydecoration', 'utf8');
	}
	if(!strpos($_SERVER["REQUEST_URI"],"user.php?action=log") 
		&& 
		!strpos($_SERVER["REQUEST_URI"],"cron_sendmail.php")
		&&
		!strpos($_SERVER["REQUEST_URI"], "cron_busialert.php")
		&&
		!strpos($_SERVER["REQUEST_URI"], "cron_businesspropertychange.php")
		&&
		!strpos($_SERVER["REQUEST_URI"], "mode=application_request_url")
		&&
		!strpos($_SERVER["REQUEST_URI"], "api.php?action=PlanMaking.designerAlarm")
		&&
		!strpos($_SERVER["REQUEST_URI"], "api.php?action=PlanMaking.msgPreNotice")
		&&
		!strpos($_SERVER["REQUEST_URI"], "business.php?action=revertTelemarketingBusiness")
		&&
		!strpos($_SERVER["REQUEST_URI"], "api.php?action=MsgLog.cron")
		&&
		!strpos($_SERVER["REQUEST_URI"], "api.php?action=Mail.cron")
		&&
		!strpos($_SERVER["REQUEST_URI"], "fpdf/plan.php?id=")
		&&
		!strpos($_SERVER["REQUEST_URI"], "debug=true")
	){
		checkUserOnlineUniqueness();
	}

	if (isset($_GET["action"]) && $_GET["action"] == "ga") {
		ga($_POST);
	}
?>
