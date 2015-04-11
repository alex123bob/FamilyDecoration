<?php
	include_once "conn.php";
	
	function send($content){
		global $mysql;
		// fields that could be edit.
		$fields = array('id', 'name', 'realname', 'level', 'content');

		$id = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$obj = array('id'=>$id);
		foreach($fields as $field){
			if(isset($content[$field]))
				$obj[$field] = $content[$field];
		}
		$mysql->DBInsertAsArray("`feedback`", $obj);
		return array('status'=>'successful', 'errMsg' => '','feedbackId'=>$id);
	}

	function fetchFeedbacks (){
		global $mysql;
		$res = $mysql->DBGetAllRows("`feedback`", "*", " ORDER BY `id` DESC");
		return $res;
	}

	function editFeedback ($data) {
		global $mysql;
		$id = $data["id"];
		$condition = "`id` = '$id' ";
		if(isset($data["result"])){
			$tmp = $data["result"];
			$setValue = "`result` = '$tmp' ";
		}
		$mysql->DBUpdateSomeCols("`feedback`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit feedback ok');
	}
?>