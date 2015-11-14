<?php
	session_start();
	if (isset($_SESSION["name"]) && isset($_SESSION["password"])) {

	}
	else {
		echo "<script type='text/javascript'>location.href='login/index.html';</script>";
	}
?>