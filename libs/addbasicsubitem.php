<?php
	include_once "basicsubitem.php";

	$subItem = $_POST;
	$count = count(explode("<>", $subItem["subItemName"]));
	
	foreach($subItem as $key => $value) {
		if ($key != "parentId") {
			$subItem[$key] = explode("<>", $value);
		}
	}

	$result = array();
	$addArr = array();

	for ($i = 0; $i < $count; $i++) {
		$addArr["subItemId"] = "basic-sub-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);

		// multiply 1000, forced convert price into integer.
		$addArr["subItemName"] = $subItem["subItemName"][$i];
		$addArr["subItemUnit"] = $subItem["subItemUnit"][$i];
		$addArr["mainMaterialPrice"] = $subItem["mainMaterialPrice"][$i];
		$addArr["auxiliaryMaterialPrice"] = $subItem["auxiliaryMaterialPrice"][$i];
		$addArr["manpowerPrice"] = $subItem["manpowerPrice"][$i];
		$addArr["machineryPrice"] = $subItem["machineryPrice"][$i];
		$addArr["lossPercent"] = $subItem["lossPercent"][$i];
		$addArr["parentId"] = $subItem["parentId"];
		$addArr["cost"] = $subItem["cost"][$i];

		$info = addBasicSubItem($addArr);
		$info = json_decode($info, true);

		if ($info["status"] != "successful") {
			array_push($result, $addArr["subItemName"]);
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