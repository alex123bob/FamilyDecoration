<?php
	include_once "conn.php";
	include_once "subitemDB.php";

	$action = strtolower($_REQUEST["action"]);
	$res = array('status'=>'successful', 'errMsg' => '');
	switch($action){
		case "add":
			$res = addBasicSubItem($_POST);
			break;
		case "addsome":
			$res = addBunchBasicSubItems($_POST);
			break;
		case "edit":
			$res = editBasicSubItem($_POST);
			break;
		case "delete":
			$res = deleteBasicSubItem($_POST['subItemId']);
			break;
		case "get":
			$res = getBasicSubItems($_GET['parentId']);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	if(!$res){
		$res = array('status'=>'successful', 'errMsg' => '');
	}
	echo urldecode(json_encode($res));
?>