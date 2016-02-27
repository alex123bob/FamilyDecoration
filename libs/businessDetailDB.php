<?php
	function getBusinessDetails($businessId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`business_detail`", " * "," where businessId = '$businessId' and `isDeleted` = 'false' " ,"ORDER BY  `id` DESC");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["content"] = $val["content"];
		    $res[$count]["createTime"] = $val["createTime"];
		    $count ++;
        }
		return $res;
	}

	function addBusinessDetail($post){
		$businessId = $post["businessId"];
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"businessId"=>$businessId,
			"content"=>$post["content"]
		);
		global $mysql;
		$mysql->DBInsertAsArray("`business_detail`",$obj);
		$mysql->DBUpdate('business',array('updateTime'=>'now()'),"id='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '','businessDetailId'=> $obj["id"],'content'=>$post["content"]);
	}

	function deleteBusinessDetail($businessDetailId){
		global $mysql;
		$mysql->DBUpdate("business_detail",array('isDeleted'=>true),"`id`='?'",array($businessDetailId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function editBusinessDetail($data){
		global $mysql;
		$id = $data["id"];
		$mysql->DBUpdate("business_detail",array('content'=>$data['content']),"`id` = '?'",array($id));
		return array('status'=>'successful', 'errMsg' => 'edit business detail ok');
	}
?>