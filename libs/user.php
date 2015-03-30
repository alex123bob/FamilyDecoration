<?php
	include_once "conn.php";
	include_once "userDB.php";
	$action = $_GET["action"];
	$res = "";
	switch($action){
		case "register": 				$res = register();  break;
		case "login":					$res = login(); break;
		case "logout":					$res = logout(); break;
		case "edit":					$res = edit(); break;
		case "modify":					$res = modify(); break;
		case "delete":					$res = delete($_POST['name']); break;
		case "view":					$res = getList(); break;
		case "reset":					$res = resetAccount(); break;
		case "checkUserOnlineUniqueness":$res = checkUserOnlineUniqueness();break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo json_encode($res);
?>