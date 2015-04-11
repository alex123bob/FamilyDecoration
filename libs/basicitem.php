<?php
	include_once "basicitemDB.php";
	include_once "subitemDB.php";

	$action = strtolower($_REQUEST["action"]);
	$res = array('status'=>'successful', 'errMsg' => '');
	switch($action){
		case "addbunchbasicitems":
			$res = addBunchBasicItems($_POST);
			break;
		case "getbasicitems":
			$res = getBasicItems();
			break;
		case "deletebasicitem":
			$id = $_POST['itemId'];
			deleteBasicItem($id);
			deleteBasicSubItemByParentId($id);
			break;
		case "editbasicitem":
			$res = editBasicItem($_POST);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>