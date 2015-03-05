<?php
	include_once "project.php";
	if( $_SESSION["level"] == "006-001"){
		//游客仅且只能看到一个项目。因此不需要取年，月过滤啦
		$visitorName = $_SESSION["name"];
		echo getVisitorProject($visitorName,"project");
	}else{
		$year = $_GET['year'];
		$month = $_GET['month'];
		echo getProjects($year, $month);
	}
	
?>