<?php
	
	function getBusinessByRegion($reginId,$isFrozen,$isTransfered,$salesmanName=null){
		global $mysql;
		$where = "where regionId = '?' and `isDeleted` = 'false' and `isFrozen` = '?' and `isTransfered` = '?' ";
		if($salesmanName != null)
			$where = $where." and salesmanName = '?' ";
		return $mysql->DBGetAsMap("select * from business ".$where,$reginId,$isFrozen,$isTransfered,$salesmanName);
	}
	function getBusinessByAddress($address){
		global $mysql;
		return $mysql->DBGetAsMap("select * from business where address = '?' and `isDeleted` = 'false' ",$address);
	}
	function getBusinessByDesigner($post){
		global $mysql;
		return $mysql->DBGetAsMap("select `b`.*, `r`.`name` from `business` `b` left join `region` `r` on `b`.`regionId` = `r`.`id` where  `b`.`designerName` = '?' and `b`.`isDeleted` = 'false' and `b`.`isFrozen` = 'false' ",$post["designerName"]);
	}
	
	function getSalesmanlist(){
		global $mysql;
		return $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' group by salesman;");
	}
	
	function getBusinessById($businessId){
		global $mysql;
		return $mysql->DBGetAsMap("select * from business where id = '?' and `isDeleted` = 'false' ",$businessId);
	}
	function addBusiness($post){
		$businesss = getBusinessByAddress($post["address"]);
		if(count($businesss) != 0){
			throw new Exception("business with address:".$post["address"]." already exist!");
		}
		//必填字段
		$obj = array("id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"regionId"=>$post["regionId"],
			"customer"=>$post["customer"],
			"address"=>$post["address"],
			"salesman"=>$post["salesman"],
			"salesmanName"=>$post["salesmanName"],
			"source"=>$post["source"]
		);
		//可选字段
		$fields = array("isFrozen","isTransfered","updateTime","designer","designerName","applyDesigner");
		foreach($fields as $field){
			if(isset($data[$field]))
				$obj[$field] = $data[$field];
		}
		global $mysql;
		$mysql->DBInsertAsArray("`business`",$obj);
		return array('status'=>'successful', 'errMsg' => '','businessId'=> $obj["id"]);
	}

	function deleteBusiness($businessId){
		global $mysql;
		$mysql->DBUpdate("`business`",array('isDeleted'=>true,'updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	function deleteBusinessByRegion($regionId){
		global $mysql;
		$mysql->DBUpdate("`business`",array('isDeleted'=>true,'updateTime'=>'now()'),"`regionId`='?'",array($regionId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function editBusiness($data){
		global $mysql;
		$id = $data["id"];
		$fields = array("regionId","address","isFrozen","isTransfered","updateTime","customer","salesman","source","salesmanName","designer","designerName","applyDesigner");
		$obj = array();
		foreach($fields as $field){
			if(isset($data[$field]))
				$obj[$field] = $data[$field];
		}
		$mysql->DBUpdate("business",$obj,"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => "business #$id edit business ok");
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
						'captain'=>$request['captain'],
						'businessId'=>$businessId,
						'salesman'=>$request['salesman'],
						'period'=>$request['period']
					);
		include_once "projectDB.php";
		$pro = addProject($pro);
		$mysql->DBUpdate('business',array('isTransfered'=>'true','updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '','projectId'=>$pro['projectId']);
	}

	function clientRank($data) {
		global $mysql;
		$id = $data["id"];
		$obj = array();
		$obj['level'] = $data["level"];
		$mysql->DBUpdate('business',$obj,"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => 'rank client successfully!');
	}
?>