<?php
	include_once "conn.php";
	include_once "mailDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "send": 	$res = sendMail($_POST["recipient"], $_POST["subject"], $_POST["body"], null);  break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));	
?>