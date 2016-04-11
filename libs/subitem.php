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
			$res = getBasicSubItems();
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	if (is_array($res) && empty($res)) {
		// todo
	}
	else if (!$res) {
		$res = array('status'=>'successful', 'errMsg' => '');
	}
	echo (json_encode($res));
?>