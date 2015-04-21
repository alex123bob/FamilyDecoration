<?php
	
	function getBusinessByRegion($reginId,$isFrozen,$isTransfered){
		global $mysql;
		$where = " where regionId = '$reginId' and `isDeleted` = 'false' and `isFrozen` = '$isFrozen' and `isTransfered` = '$isTransfered' ";
		$arr = $mysql->DBGetSomeRows("`business`", " * ", $where,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["regionId"] = $val["regionId"];
		    $res[$count]["address"] = $val["address"];
			$res[$count]["isFrozen"] = $val["isFrozen"];
			$res[$count]["isTransfered"] = $val["isTransfered"];
			$res[$count]["createTime"] = $val["createTime"];
			$res[$count]["updateTime"] = $val["updateTime"];
			$res[$count]["customer"] = $val["customer"];
			$res[$count]["salesman"] = $val["salesman"];
			$res[$count]["source"] = $val["source"];
		    $count ++;
        }
		return $res;
	}
	function getBusinessByAddress($address){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`business`", " * "," where address = '$address' and `isDeleted` = 'false' " ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["regionId"] = $val["regionId"];
		    $res[$count]["address"] = $val["address"];
			$res[$count]["isFrozen"] = $val["isFrozen"];
			$res[$count]["isTransfered"] = $val["isTransfered"];
			$res[$count]["createTime"] = $val["createTime"];
			$res[$count]["updateTime"] = $val["updateTime"];
			$res[$count]["customer"] = $val["customer"];
			$res[$count]["salesman"] = $val["salesman"];
			$res[$count]["source"] = $val["source"];
		    $count ++;
        }
		return $res;
	}
	
	function getBusinessById($businessId){
		global $mysql;
		$arr = $mysql->DBGetSomeRows("`business`", " * "," where id = '$businessId' and `isDeleted` = 'false' " ,"");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["regionId"] = $val["regionId"];
		    $res[$count]["address"] = $val["address"];
			$res[$count]["isFrozen"] = $val["isFrozen"];
			$res[$count]["isTransfered"] = $val["isTransfered"];
			$res[$count]["createTime"] = $val["createTime"];
			$res[$count]["updateTime"] = $val["updateTime"];
			$res[$count]["customer"] = $val["customer"];
			$res[$count]["salesman"] = $val["salesman"];
			$res[$count]["source"] = $val["source"];
		    $count ++;
        }
		return $res;	
	}
	function addBusiness($post){
		$address = $post["address"];
		$regionId = $post["regionId"];
		$businesss = getBusinessByAddress($address);
		if(count($businesss) != 0){
			throw new Exception("business with address:$address already exist!");
		}
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"regionId"=>$regionId,
			"customer"=>$post["customer"],
			"address"=>$address,
			"salesman"=>$post["salesman"],
			"source"=>$post["source"]
		);
		global $mysql;
		$mysql->DBInsertAsArray("`business`",$obj);
		return array('status'=>'successful', 'errMsg' => '','businessId'=> $obj["id"]);
	}

	function deleteBusiness($businessId){
		global $mysql;
		$mysql->DBUpdate("`business`",array('isDeleted'=>true,'updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function editBusiness($data){
		global $mysql;
		$id = $data["id"];
		$obj = array();
		$obj['regionId'] = $data["regionId"];
		$obj['address'] = $data["address"];
		$obj['isFrozen'] = $data["isFrozen"];
		$obj['isTransfered'] = $data["isTransfered"];
		$obj['updateTime'] = 'now()';
		$obj['customer'] = $data["customer"];
		$obj['salesman'] = $data["salesman"];
		$obj['source'] = $data["source"];
		$mysql->DBUpdate('business',$obj,"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => 'edit business ok');
	}
	
	function frozeBusiness($businessId){
		global $mysql;
		$mysql->DBUpdate('business',array('isFrozen'=>'true','updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function defrostBusiness($businessId){
		global $mysql;
		$mysql->DBUpdate('business',array('isFrozen'=>'false','updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function transferBusinessToProject($request){
		global $mysql;
		$businessId = $request['businessId'];
		$pro = array(  	'customer'=>$request['customer'],
						'projectTime'=>$request['createTime'],
						'projectName'=>$request['projectName'],
						'designer'=>$request['designer'],
						'businessId'=>$businessId,
						'salesman'=>$request['salesman']
					);
		include_once "projectDB.php";
		$pro = addProject($pro);
		$mysql->DBUpdate('business',array('isTransfered'=>'true','updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '','projectId'=>$pro['projectId']);
	}
?>