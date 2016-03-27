<?php
include_once "conn.php";
include_once "messageDB.php";
	$action = $_REQUEST["action"];
	$action = strtolower($action);
	$res;
	switch($action){
		case "get":
			$res = get($_REQUEST);
			break;
		case "addmessage":
		case "add":
			$res = addMessage($_REQUEST);
			break;
		case "delete":
		case "deletemessage":
			$res = deleteMessage($_REQUEST['id']);
			break;
		case "edit":
		case "editmessage":
			$res = editMessage($_REQUEST);
		case "read":
			$res = read($_REQUEST['id']);
			break;
		case "setallread":
			$res = setallread($_REQUEST["receiverName"]);
			break;
		default: 		
			throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>