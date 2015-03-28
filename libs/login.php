<?php
	session_start();
	if (isset($_SESSION["name"]) && isset($_SESSION["password"])) {

	}
	else {
		echo "<script type='text/javascript'>alert('请先登录！'); location.href='./login.html';</script>";
	}
?>