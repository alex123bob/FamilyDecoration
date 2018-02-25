<?php
	include_once "conn.php";
	$action = $_GET["action"];
	$res = "";
	switch($action){
        case "get":
            global $mysql;
            $res = $mysql->DBGetAsMap("select * from wechat_content");
			break;
		default: 		throw new Exception("unknown action:".$action);
	}
	if(!$res) $res = array('status'=>'successful', 'errMsg' => '');
	echo json_encode($res);
?>