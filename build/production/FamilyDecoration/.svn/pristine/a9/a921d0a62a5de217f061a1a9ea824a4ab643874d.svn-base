<?php
	include_once "project.php";
	$pro = $_POST;
	// $pro["projectId"] = preg_replace("/[\/:\s]/i", "-", $_POST['projectTime']);
	$pro["projectId"] = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
	$pro["projectProgress"] = "";
	$pro["projectChart"] = "";
	echo addProject($pro);
?>