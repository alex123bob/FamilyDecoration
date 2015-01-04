<?php
	include_once "conn.php";
	include_once "sysDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "adminHeartBeat": 	$res = adminHeartBeat();  break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>