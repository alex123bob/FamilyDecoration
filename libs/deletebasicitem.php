<?php
	include_once "basicitem.php";
	include_once "basicsubitem.php";

	$id = $_POST['itemId'];

	$resultOfItem = deleteBasicItem($id);
	$resultOfItem = json_decode($resultOfItem, true);

	$resultOfSubItem = deleteBasicSubItemByParentId($id);
	$resultOfSubItem = json_decode($resultOfSubItem, true);

	if ($resultOfItem["status"] == "successful" && $resultOfSubItem["status"] == "successful") {
		echo json_encode(array('status'=>'successful', 'errMsg' => ''));
	}
	else if ($resultOfItem["status"] == "failing") {
		echo json_encode($resultOfItem);
	}
	else if ($resultOfSubItem["status"] == "failing") {
		echo json_encode($resultOfSubItem);
	}
?>