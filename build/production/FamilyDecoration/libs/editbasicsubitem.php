<?php
	include_once "basicsubitem.php";

	$item = $_POST;

	$item["mainMaterialPrice"] = $item["mainMaterialPrice"];
	$item["auxiliaryMaterialPrice"] = $item["auxiliaryMaterialPrice"];
	$item["manpowerPrice"] = $item["manpowerPrice"];
	$item["machineryPrice"] = $item["machineryPrice"];
	$item["lossPercent"] = $item["lossPercent"];
	$item["cost"] = $item["cost"];

	echo editBasicSubItem($item);
?>