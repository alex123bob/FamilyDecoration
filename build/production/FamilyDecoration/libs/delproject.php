<?php
	include_once "project.php";
	$id = $_POST['projectId'];
	echo delProject($id);
?>