<?php

	function addPotentialBusiness($data){
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"address"=>$data['address'],
			"regionID"=>$data['regionID'],
			"proprietor"=>$data['proprietor'],
			"salesman"=>$data['salesman'],
			"salesmanName"=>$data['salesmanName'],
			"lastUpdateTime"=>'now()'
		);
		if(isset($data['phone']))
			$obj['phone'] = $data['phone'];
		if(isset($data['status']))
			$obj['status'] = $data['status'];
		if(isset($data['isDecorated']))
			$obj['isDecorated'] = $data['isDecorated'];
		if(isset($data['status_second']))
			$obj['status_second'] = $data['status_second'];
		if(isset($data['status_third']))
			$obj['status_third'] = $data['status_third'];
		global $mysql;
		$mysql->DBInsertAsArray("potential_business",$obj);
		return array('status'=>'successful', 'errMsg' => '','regionId'=> $obj["id"]);
	}

	function deletePotentialBusiness($id){
		global $mysql;
		$mysql->DBUpdate('potential_business',array('isDeleted'=>true,'lastUpdateTime'=>'now()'),"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getAllPotentialBusiness($data){
		$params = array();
		$sql = "select r.* from `potential_business` r where isDeleted = 'false' ";
		$fields = array('regionID','status','status_second','status_third','salesman','salesmanName','telemarketingStaff','telemarketingStaffName');
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
		$fields = array('address','regionID','proprietor','phone','status','isDecorated','status_second','status_third','salesman','salesmanName','telemarketingStaff','telemarketingStaffName','distributeTime');
		$obj = array('lastUpdateTime'=>'now()');
		foreach($fields as $field){
			if(isset($data[$field]))
				$obj[$field] = $data[$field];
		}
		global $mysql;
		$ids = explode(":", $data["id"]);
		if (count($ids) > 0) {
			for ($i=0; $i < count($ids); $i++) { 
				$id = $ids[$i];
				$mysql->DBUpdate('potential_business',$obj,"`id` = '?' ",array($id));
			}
		}
		else {
			$id = $ids[0];
			$mysql->DBUpdate('potential_business',$obj,"`id` = '?' ",array($id));
		}
		return array('status'=>'successful', 'errMsg' => 'edit business ok');
	}

	function getTeleMarketingStaffList(){
		global $mysql;
		$sql = "select distinct telemarketingStaffName, telemarketingStaff from `potential_business` where telemarketingStaffName IS NOT NULL and isDeleted = 'false' ";
		return $mysql->DBGetAsMap($sql);
	}
?>