<?php
	include_once "conn.php";
	include_once "announcementcommentDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		case "view": 	$res = getAnnouncementCommentsByBulletinId($_GET["bulletinId"]);  break;
		case "add":		$res = addCommentUnderAnnouncement($_POST["bulletinId"], $_POST["content"], $_POST["commenterName"]); break;
		default: throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>