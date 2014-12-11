<?php
	include_once "project.php";

	$year = $_GET['year'];
	$month = $_GET['month'];

	echo getProjects($year, $month);
?>