<?php

	function addProgress($post){
		$projectId = $post["projectId"];
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"projectId"=>$projectId,
			"progress"=>isset($post["progress"])?$post["progress"]:'',
			"comments"=>isset($post["comments"])?$post["comments"]:''
		);
		global $mysql;
		$mysql->DBInsertAsArray("`progress`",$obj);
		return array('status'=>'successful', 'errMsg' => '','progressId'=> $obj["id"]);
	}

	function deleteProgress($progressId){
		global $mysql;
		$mysql->DBUpdate("progress",array('isDeleted'=>true),"`id` = '?' ",array($progressId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteProgressByProjectId($projectId){
		global $mysql;
		$mysql->DBUpdate("progress",array('isDeleted'=>true),"`projectId` = '?' ",array($projectId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getProgress($id){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`progress`", " * "," where id = '$id' " ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["progress"] = $val["progress"];
		    $res[$count]["createTime"] = $val["createTime"];
			$res[$count]["comments"] = $val["comments"];
			$res[$count]["projectId"] = $val["projectId"];
		    $count ++;
        }
		return $res;
	}

	function getProgressByProjectId($projectId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`progress`", " * "," where projectId = '$projectId' and isDeleted = 'false' " ," order by createTime desc ");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["progress"] = $val["progress"];
		    $res[$count]["createTime"] = $val["createTime"];
			$res[$count]["comments"] = $val["comments"];
			$res[$count]["projectId"] = $val["projectId"];
		    $count ++;
        }
		return $res;
	};

	function editProgress($data){
		global $mysql;
		$obj = array();
		$ok = false;
		if(isset($data['comments'])){
			$obj['comments'] = $data['comments'];
			$ok = true;
		}
		if(isset($data['progress'])){
			$obj['progress'] = $data['progress'];
			$ok = true;
		}
		if(!$ok) 
			return array('status'=>'successful', 'errMsg' => 'edit progress ok');
		$mysql->DBUpdate("progress",$obj,"`id` = '?' ",array($data['id']));
		return array('status'=>'successful', 'errMsg' => 'edit progress ok');
	}
?>