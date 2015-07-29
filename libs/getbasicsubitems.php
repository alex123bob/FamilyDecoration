<?php
	include_once "basicsubitem.php";

	$pid = $_GET['parentId'];

	$result = json_decode(getBasicSubItems($pid), true);

	if (!array_key_exists("status", $result)) {
		for ($i = 0; $i < count($result); $i++) {
			$result[$i]["mainMaterialPrice"] = $result[$i]["mainMaterialPrice"];
			$result[$i]["auxiliaryMaterialPrice"] = $result[$i]["auxiliaryMaterialPrice"];
			$result[$i]["manpowerPrice"] = $result[$i]["manpowerPrice"];
			$result[$i]["machineryPrice"] = $result[$i]["machineryPrice"];
			$result[$i]["cost"] = $result[$i]["cost"];
		}
		echo json_encode($result);
	}
	else {
		echo json_encode($result);
	}
?>