<?php

	function addMaterial($post){
		$projectId = $post["projectId"];
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"projectId"=>$projectId,
			"productName" => $post["productName"],
			"productType" => $post["productType"],
			"productNumber" => $post["productNumber"],
			"productMerchant" => $post["productMerchant"],
			"productSchedule" => $post["productSchedule"],
			"productDeliver" => $post["productDeliver"]
		);
		global $mysql;
		$mysql->DBInsertAsArray("`mainmaterial`",$obj);
		return array('status'=>'successful', 'errMsg' => '','materialId'=> $obj["id"]);
	}

	function deleteMaterial($materialId){
		global $mysql;
		$mysql->DBUpdate("mainmaterial",array('isDeleted'=>true),"`id` = '?'",array($materialId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function deleteMaterialsByProjectId($projectId){
		global $mysql;
		$mysql->DBUpdate("mainmaterial",array('isDeleted'=>true),"`projectId` = '?' ",array($projectId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getMaterials($id){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`mainmaterial`", " * "," where id = '$id' " ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["projectId"] = $val["projectId"];
		    $res[$count]["createTime"] = $val["createTime"];
			$res[$count]["productName"] = $val["productName"];
			$res[$count]["productType"] = $val["productType"];
			$res[$count]["productNumber"] = $val["productNumber"];
			$res[$count]["productMerchant"] = $val["productMerchant"];
			$res[$count]["productSchedule"] = $val["productSchedule"];
			$res[$count]["productDeliver"] = $val["productDeliver"];
			$res[$count]["isDeleted"] = $val["isDeleted"];
		    $count ++;
        }
		return $res;
	}

	function getMaterialsByProjectId($projectId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`mainmaterial`", " * "," where projectId = '$projectId' and isDeleted = 'false' " ," order by createTime ");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["projectId"] = $val["projectId"];
		    $res[$count]["createTime"] = $val["createTime"];
			$res[$count]["productName"] = $val["productName"];
			$res[$count]["productType"] = $val["productType"];
			$res[$count]["productNumber"] = $val["productNumber"];
			$res[$count]["productMerchant"] = $val["productMerchant"];
			$res[$count]["productSchedule"] = $val["productSchedule"];
			$res[$count]["productDeliver"] = $val["productDeliver"];
			$res[$count]["isDeleted"] = $val["isDeleted"];
		    $count ++;
        }
		return $res;
	};

	function editMaterial($data){
		global $mysql;
		$obj= array();
		$obj['projectId'] = $data['projectId'];
		$obj['productName'] = $data['productName'];
		$obj['productType'] = $data['productType'];
		$obj['productNumber'] = $data['productNumber'];
		$obj['productDeliver'] = $data['productDeliver'];
		$obj['productMerchant'] = $data['productMerchant'];
		$obj['productSchedule'] = $data['productSchedule'];
		$mysql->DBUpdate("`mainmaterial`",$obj,"`id` = '?' ",array($data["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit mainmaterial ok');
	}
?>