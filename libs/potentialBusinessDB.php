<?php

	function addPotentialBusiness($data){
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"address"=>$data['address'],
			"regionID"=>$data['regionID'],
			"proprietor"=>$data['proprietor'],
			"salesman"=>$data['salesman'],
			"salesmanName"=>$data['salesmanName'],
		);
		if(isset($data['phone']))
			$obj['phone'] = $data['phone'];
		if(isset($data['status']))
			$obj['status'] = $data['status'];
		global $mysql;
		$mysql->DBInsertAsArray("potential_business",$obj);
		return array('status'=>'successful', 'errMsg' => '','regionId'=> $obj["id"]);
	}

	function deletePotentialBusiness($id){
		global $mysql;
		$mysql->DBUpdate('potential_business',array('isDeleted'=>true,'updateTime'=>'now()'),"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getAllPotentialBusiness($data){
		$params = array();
		$sql = "select r.* from `potential_business` r where isDeleted = 'false' ";
		$fields = array('regionID','status','salesman','salesmanName');
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				$sql .= " and $field = '?' ";
			}
		}
		$fields = array('address','proprietor','phone');
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				$sql .= " and $field like '%?%' ";
			}
		}
		global $mysql;
		return $mysql->DBGetAsMap($sql.' order by createTime desc ',$params);
	}
	
	function editPotentialBusiness($data){
		$fields = array('address','regionID','proprietor','phone','status','salesman','salesmanName');
		$obj = array('lastUpdateTime'=>'now()');
		foreach($fields as $field){
			if(isset($data[$field]))
				$obj[$field] = $data[$field];
		}
		global $mysql;
		$mysql->DBUpdate('potential_business',$obj,"`id` = '?' ",array($data["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit business ok');
	}
?>