<?php
	include_once "basicitem.php";

	$basicitems = $_POST;
	$basicitems = explode("<>", $basicitems["itemName"]);
	$result = array();

	for ($i = 0; $i < count($basicitems); $i++) {
		$item = array(
			"itemId" => "basic-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"itemName" => $basicitems[$i]
		);
		$info = addBasicItem($item);
		$info = json_decode($info, true);
		if ($info["status"] != "successful") {
			array_push($result, $item["itemName"]);
		}
	}

	if (count($result) <= 0) {
		echo json_encode(array('status'=>'successful', 'errMsg' => ''));
	}
	else {
		$result = implode(",", $result);
		echo json_encode(array('status' => 'failing', 'errMsg'=> $result."未添加成功！"));
	}
?>