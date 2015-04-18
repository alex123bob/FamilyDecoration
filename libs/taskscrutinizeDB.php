<?php

	function addCensorship($post){
		$currentUser = $_SESSION["name"];
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"taskListId"=>$post["taskListId"],
			"content"=>$post["content"],
			"userName"=> $currentUser
		);
		global $mysql;
		$mysql->DBInsertAsArray("`taskcensor`",$obj);
		return array('status'=>'successful', 'errMsg' => '','censorshipId'=> $obj["id"]);
	}

	function deleteCensorship($censorshipId){
		global $mysql;
		$mysql->DBUpdate("censorship",array('isDeleted'=>true),"`id` = '?' ",array($censorshipId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteCensorshipByLogListId($logListId){
		global $mysql;
		$mysql->DBUpdate("censorship",array('isDeleted'=>true),"`logListId` = '?' ",array($logListId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getCensorship($id){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`censorship`", " * "," where id = '$id' " ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["logListId"] = $val["logListId"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["userName"] = $val["userName"];
			$res[$count]["content"] = $val["content"];
		    $count ++;
        }
		return $res;
	}

	function getCensorshipByTaskListId($taskListId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`taskcensor`", " * "," where taskListId = '$taskListId' and isDeleted = 'false' " ," order by createTime ");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["taskListId"] = $val["taskListId"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["userName"] = $val["userName"];
			$res[$count]["content"] = $val["content"];
			$tmp = $mysql->DBGetOneRow("`user`", "`realname`", "`name` = '".$val["userName"]."'");
			$res[$count]["realName"] = $tmp["realname"];
		    $count ++;
        }
		return $res;
	};
	function getCensorshipByUser($userName){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`censorship`", " * "," where userName = '$userName' and isDeleted = 'false' " ," order by createTime ");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["logListId"] = $val["logListId"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $res[$count]["userName"] = $val["userName"];
			$res[$count]["content"] = $val["content"];
		    $count ++;
        }
		return $res;
	}
	
	function editCensorship($data){
		global $mysql;
		$mysql->DBUpdate('censorship',array('content'=>$data['content']),"`id` = '?' ",array($data["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit censorship ok');
	}
?>