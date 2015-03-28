<?php
	include_once "conn.php";
	include_once "sysDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		default: 		throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>