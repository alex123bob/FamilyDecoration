<?php
	function addMessage($data){
		$tableName = '`message`';
		$receiver = $data["receiver"];
		$receivers = explode(',',$receiver); 
		global $mysql;
		foreach($receivers as $re){
			$obj = array(
				"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"content"=>$data["content"],
				"sender"=>$data["sender"],
				"receiver"=>$re
			);
			$mysql->DBInsertAsArray($tableName,$obj);
		}
		return array('status'=>'successful', 'errMsg' => '');
	}
	function deleteMessage($id){
		$tableName = '`message`';
		global $mysql;
		$condition = "`id` = '$id' ";
		$setValue = " `isDeleted` = 'true' , `readTime` = now() ";
		$mysql->DBUpdateSomeCols($tableName, $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}
	function editMessage($data){
		$tableName = '`message`';
		global $mysql;
		$id = $data['id'];
		$condition = "`id` = '$id' ";
		$setValue = " `isDeleted` = 'isDeleted' ";
		if(isset($data['content'])){
			$setValue = $setValue." ,`content`= '".mysql_real_escape_string($data['content'])."'";
		}
		if(isset($data['sender'])){
			$setValue = $setValue." ,`sender`= '".$data['sender']."'";
		}
		if(isset($data['receiver'])){
			$setValue = $setValue." ,`receiver`= '".$data['receiver']."'";
		}
		$mysql->DBUpdateSomeCols($tableName, $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function read($id){
		$tableName = '`message`';
		global $mysql;
		$condition = "`id` = '$id' ";
		$setValue = " `isRead` = 'true' , `readTime` = now() ";
		$mysql->DBUpdateSomeCols($tableName, $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function get($data){
		$fields = array('id','content','createTime','sender','receiver','isDeleted','isRead','readTme');
		$tableName = '`message`';
		global $mysql;
		$where = " where 1 = 1 ";
		
		$filters = array('sender','receiver','isRead','isDeleted','id');
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