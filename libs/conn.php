<?php
	header("Content-type: text/html; charset=utf-8");
	header("message-queue: 1");
	if (!session_id()) session_start();
	// error_reporting(E_ALL ^ E_DEPRECATED);
	date_default_timezone_set('Asia/Shanghai');
	
	if (defined("SAE_MYSQL_HOST_M")) {
		include_once "mysql.class.php";
	}
	else {
		include_once "mysqli.class.php";	
	}
	include_once "common.php";

	if (defined("SAE_MYSQL_HOST_M")) {
		$mysql = new mysql(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, 'utf8');
	} else {
		$mysql = new mysql('127.0.0.1', 'root', '', 'familydecoration', 'utf8');
	}
	if(!strpos($_SERVER["REQUEST_URI"],"user.php?action=log") 
		&& 
		!strpos($_SERVER["REQUEST_URI"],"cron_sendmail.php")
		&&
		!strpos($_SERVER["REQUEST_URI"], "cron_busialert.php")
		&&
		!strpos($_SERVER["REQUEST_URI"], "mode=application_request_url")
	){
		checkUserOnlineUniqueness();
	}

	if (isset($_GET["action"]) && $_GET["action"] == "ga") {
		ga($_POST);
	}
	require_once "svc/base/TableMapping.php";
	require_once "svc/base/BaseSvc.class.php";
?>
