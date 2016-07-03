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

	//附带最新状态
	function getAllPotentialBusiness($data){
		$params = array();
		$sql = "select d.comments as lbs,d.createTime as lbst,d.committer as lbsc,
					r.*,g.name as rn from `potential_business` r 
					left join region g on g.id = r.regionId and g.isDeleted = 'false' 
					left join (
						select * from potential_business_detail where id in ( 
							select max(id) from potential_business_detail group by potentialBusinessId
						)
					) d on d.potentialBusinessId = r.id and d.isDeleted = 'false'
					where r.isDeleted = 'false'  ";
		$fields = array('regionID','status','status_second','status_third','salesman','salesmanName','telemarketingStaff','telemarketingStaffName');
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				$sql .= " and r.$field = '?' ";
			}
		}
		$fields = array('address','proprietor','phone');
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				$sql .= " and r.$field like '%?%' ";
			}
		}
		global $mysql;
		$count = $mysql->DBGetAsOneArray("select count(1) as count from ( $sql ) as temp",$params);
		if($count[0] == 0)
			return array('total'=>$count[0],'data'=>$res);
		$res = $mysql->DBGetAsMap($sql.'  order by r.createTime desc limit '.$data['start'].",".$data['limit'],$params);
		$potentailBusinessIds = array();
		foreach($res as $item){
			array_push($potentailBusinessIds, $item['id']);
		}
		//获取详细
		$details = array();	
		$potentailBusinessIds = join(",",$potentailBusinessIds);
		if($potentailBusinessIds != ""){
			$sql = "select potentialBusinessId,comments,committer,createTime from potential_business_detail where isDeleted = 'false' and potentialBusinessId in ($potentailBusinessIds)";
			$details = $mysql->DBGetAsMap($sql.' order by createTime desc ',$params);
		}
		foreach($res as &$item){
			unset($item['reginId']);
			unset($item['isDeleted']);
		}
		return array('total'=>$count[0],'data'=>$res);
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