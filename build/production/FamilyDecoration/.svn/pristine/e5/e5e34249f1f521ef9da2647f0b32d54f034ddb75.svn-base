<?php
	header("Content-type: text/html; charset=utf-8"); 

	// error_reporting(E_ALL ^ E_DEPRECATED);
	date_default_timezone_set('Asia/Shanghai'); 
	include_once "mysql.class.php";
	include_once "common.php";

	if (defined("SAE_MYSQL_HOST_M")) {
		$mysql = new mysql(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, 'utf8');
	}
	else {
		$mysql = new mysql('localhost', 'root', '', 'familydecoration', 'utf8');
	}
	
?>