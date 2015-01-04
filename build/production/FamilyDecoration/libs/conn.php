<?php
	
	header("Content-type: text/html; charset=utf-8"); 
	if (!session_id()) session_start();
	// error_reporting(E_ALL ^ E_DEPRECATED);
	date_default_timezone_set('Asia/Shanghai'); 
	include_once "mysql.class.php";
	include_once "common.php";

	if (defined("SAE_MYSQL_HOST_M")) {
		$mysql = new mysql(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, 'utf8');
	} else {
		$mysql = new mysql('localhost', 'root', '', 'familydecoration', 'utf8');
	}
	
	if(isset($_SESSION["admin"]) && $_SESSION["admin"] && !strpos($_SERVER["REQUEST_URI"],"user.php?action=log")){
		$res = $mysql->DBGetOneRow("`system`", "count(*) as count", "`id` = '2'  and `paramValue` = '".session_id()."'");
		if($res["count"] != 1){
			header('HTTP/1.1 401 admin login somewhere else !');
		}
	}
?>