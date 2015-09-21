<?php
	function addMessage($data){
		$receiver = $data["receiver"];
		$receivers = explode(',',$receiver); 
		$type = isset($data["type"]) ? $data["type"] : NULL;
		$extraId = isset($data["extraId"]) ? $data["extraId"] : NULL;
		global $mysql;
		foreach($receivers as $re){
			$obj = array(
				"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"content"=>$data["content"],
				"sender"=>$data["sender"],
				"receiver"=>$re,
				"type"=>$type,
				"extraId"=>$extraId
			);
			$mysql->DBInsertAsArray('message',$obj);
		}
		return array('status'=>'successful', 'errMsg' => '');
	}
	function deleteMessage($id){
		global $mysql;
		$mysql->DBUpdate('message',array('isDeleted'=>true,'readTime'=>'now()'),"`id` = '?'",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}
	function editMessage($data){
		global $mysql;
		$obj = array();
		$id = $data['id'];
		if(isset($data['content'])){
			$obj['content'] = $data['content'];
		}
		if(isset($data['sender'])){
			$obj['sender'] = $data['sender'];
		}
		if(isset($data['receiver'])){
			$obj['receiver'] = $data['receiver'];
		}
		$mysql->DBUpdate('message',$obj,"`id` = '?' ",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function read($id){
		global $mysql;
		$mysql->DBUpdate('message',array('isRead'=>true,'readTime'=>'now()'),"`id` = '?'",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function get($data){
		$fields = array('id','content','createTime','sender','receiver','type','extraId','isDeleted','isRead','readTme');
		$tableName = '`message`';
		global $mysql;
		$where = " where 1 = 1 ";
		
		$filters = array('sender','receiver','type','extraId','isRead','isDeleted','id');
		foreach($filters as $filter){
			if(isset($data[$filter])){
				$where .= " and `$filter` = '".$data[$filter]."'";
			}
		}
		$arr = $mysql->DBGetSomeRows($tableName, " * ", $where ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val){
			foreach($fields as $field){
				if(isset( $val[$field] ))
					$res[$count][$field] = $val[$field];
			}
		    $count ++;
        }
		return $res;
	}
?>