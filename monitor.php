<?php
	header("Content-type: text/html; charset=utf-8"); 
	header("message-queue: 1"); 
	// error_reporting(E_ALL ^ E_DEPRECATED);
	date_default_timezone_set('Asia/Shanghai'); 
	include_once "./libs/mysql.class.php";

	if (defined("SAE_MYSQL_HOST_M")) {
		$mysql = new mysql(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, 'utf8');
	} else {
		$mysql = new mysql('localhost', 'root', '', 'familydecoration', 'utf8');
	}

	$res = $mysql->DBGetAsMap("select `user_behavior`.*, `user`.`realname` from `user_behavior` left join `user` on `user_behavior`.`userName` = `user`.`name` where `user_behavior`.`userName` != 'admin' ORDER by `user_behavior`.`createTime` DESC");
	$str = '';
	foreach($res as $key => $val) {
		$str .= "<br /><br />".$val["realname"].":"."&nbsp;&nbsp;".$val["interfaceName"].";".$val["createTime"];
	}
	echo $str;
?>