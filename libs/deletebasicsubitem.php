<?php
	include_once "basicsubitem.php";

	$id = $_POST['subItemId'];

	echo deleteBasicSubItem($id);
?>