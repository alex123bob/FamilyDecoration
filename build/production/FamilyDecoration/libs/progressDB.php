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
		$condition = "`id` = '$progressId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`progress`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteProgressByProjectId($projectId){
		global $mysql;
		$condition = "`projectId` = '$projectId' ";
		$setValue = " `isDeleted` = 'true'";
		$mysql->DBUpdateSomeCols("`progress`", $condition, $setValue);
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
		$id = $data["id"];
		$condition = "`id` = '$id' ";
		$setValue = " isDeleted = isDeleted ";
		if(isset($data["progress"])){
			$tmp = $data["progress"];
			$setValue = $setValue.",`progress` = '$tmp' ";
		}
		if(isset($data["comments"])){
			$tmp = $data["comments"];
			$setValue = $setValue.",`comments` = '$tmp' ";
		}
		$mysql->DBUpdateSomeCols("`progress`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit progress ok');
	}
?>