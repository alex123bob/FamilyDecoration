<?php
	include_once "conn.php";

	$action = $_GET["action"];

	$res = "";

	switch($action){
		case "publish": 				$res = publish();  break;
		case "view":					$res = view(); break;
		default: 		throw new Exception("unknown action:".$action);
	}
	echo $res;

	/**
	 * publishes announcement only by administrator
	 * @return [type] [description]
	 */
	function publish (){
		try {
			$content = $_POST["content"];

			global $mysql;

			$mysql->DBInsert("`bulletin`", "`content`", "\"$content\"");

			return json_encode(array('status'=>'successful', 'errMsg' => ''));

		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}

	/**
	 * view the announcement
	 * @return string
	 */
	function view (){
		try {
			global $mysql;
			
			$content = $mysql->DBGetFirstRow("`bulletin` ORDER by `id` DESC");

			return json_encode($content);

		}
		catch (Exception $e) {
			return json_encode(array('status' => 'failing', 'errMsg'=>$e->getMessage()));
		}
	}
?>