<?php
	include_once "conn.php";
	include_once "projectcategoryDB.php";

	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "get":
			$res = getProjectCategoryItems();  
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>
