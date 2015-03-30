<?php
	include_once "basicsubitem.php";

	$item = $_POST;

	$item["mainMaterialPrice"] = $item["mainMaterialPrice"];
	$item["auxiliaryMaterialPrice"] = $item["auxiliaryMaterialPrice"];
	$item["manpowerPrice"] = $item["manpowerPrice"];
	$item["machineryPrice"] = $item["machineryPrice"];
	$item["lossPercent"] = $item["lossPercent"];
	$item["cost"] = $item["cost"];
	$item["remark"] = $item["remark"];

	echo editBasicSubItem($item);
?>