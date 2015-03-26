<?php
	include_once "conn.php";
	
	function send($content){
		global $mysql;
		// fields that could be edit.
		$fields = array('id', 'name', 'realname', 'level', 'content');

		$id = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$keys = "`id`";
		$values = "$id";

		foreach($fields as $field){
			if(isset($content[$field])){
				$keys = $keys.",`$field`";
				$values = $values.",'".$content[$field]."'";
			}
		}
		$mysql->DBInsert("`feedback`", $keys , $values );
		return array('status'=>'successful', 'errMsg' => '','feedbackId'=>$id);
	}
?>