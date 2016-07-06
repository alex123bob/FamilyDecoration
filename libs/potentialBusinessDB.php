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
		if (isset($data["initialStatus"])) {
			$detailObj = array(
				"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"potentialBusinessId"=>$obj['id'],
				"comments"=>$data['initialStatus'],
				"committer"=>$_SESSION["name"],
				"isDeleted"=>'false',
				"createTime"=>"now()"
			);
			$mysql->DBInsertAsArray("potential_business_detail",$detailObj);
		}
		return array('status'=>'successful', 'errMsg' => '','regionID'=> $obj["id"]);
	}

	function deletePotentialBusiness($id){
		global $mysql;
		$mysql->DBUpdate('potential_business',array('isDeleted'=>true,'lastUpdateTime'=>'now()'),"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}

	function transferToBusiness ($id, $salesmanName, $source) {
		global $mysql;
		$potentialBusiness = $mysql->DBGetAsMap("select * from potential_business where `id` = '?' and isDeleted = 'false' ", array($id));
		$potentialBusinessDetail = $mysql->DBGetAsMap("select * from potential_business_detail where `potentialBusinessId` = '?' and isDeleted = 'false' ORDER BY createTime DESC ", array($id));
		$salesman = $mysql->DBGetAsMap("select realname from user where name = '?' and isDeleted = 'false' ", $salesmanName);
		$salesman = $salesman[0]["realname"];
		if (count($potentialBusiness) > 0) {
			$businessItem = $potentialBusiness[0];
			$obj = array(
				"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
				"updateTime"=>'now()'
			);
			$obj["regionId"] = $businessItem["regionID"];
			$obj["customer"] = $businessItem["proprietor"];
			$obj["custContact"] = $businessItem["phone"];
			$obj["address"] = $businessItem["address"];
			$obj["salesmanName"] = $salesmanName;
			$obj["salesman"] = $salesman;
			$obj["source"] = $source;
			
			// 将字段先置为true，表明当前潜在业务被转为了业务。
			$mysql->DBUpdate('potential_business',array("isTransfered"=>"true"),"`id` = '?' ",array($id));
			$mysql->DBInsertAsArray("business", $obj);

			if (count($potentialBusinessDetail) > 0) {
				for ($i=0; $i < count($potentialBusinessDetail); $i++) {
					$detailItem = $potentialBusinessDetail[$i]; 
					$detailObj = array(
						"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
						"businessId"=>$obj["id"],
						"content"=>$detailItem["comments"],
						"committer"=>$detailItem["committer"],
						"createTime"=>$detailItem["createTime"]
					);
					$mysql->DBInsertAsArray("business_detail", $detailObj);
				}
			}

			return array('status'=>'successful', 'errMsg' => '','businessId'=> $obj["id"]);
		}
		else {
			throw new Exception("查不到对应扫楼业务！");
		}
	}

	//附带最新状态
	function getAllPotentialBusiness($data){
		$params = array();
		$sql = "select r.*,g.name as rn from `potential_business` r left join region g on g.id = r.regionID and r.isDeleted = 'false' and r.isTransfered = 'false'  where g.isDeleted = 'false'";
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
			return array('total'=>$count[0],'data'=>array());
		$res = $mysql->DBGetAsMap($sql.'  order by r.createTime desc limit '.$data['start'].",".$data['limit'],$params);
		$potentailBusinessIds = array();
		foreach($res as $item){
			array_push($potentailBusinessIds, $item['id']);
		}
		//d.comments as lbs,d.createTime as lbst,d.committer as lbsc,
		//获取详细
		$details = array();	
		$potentailBusinessIds = join(",",$potentailBusinessIds);
		if($potentailBusinessIds != ""){
			$sql = "select d.potentialBusinessId,d.comments,d.committer,u.realName as committerRealName,d.createTime from potential_business_detail d left join user u on u.name = d.committer where d.isDeleted = 'false' and potentialBusinessId in ($potentailBusinessIds) ";
			$details = $mysql->DBGetAsMap($sql.' order by potentialBusinessId,d.id desc ',$params);
		}
		foreach($res as &$item){
			$item['lbd'] = array();
			foreach ($details as $detail) {
				if(isset($detail['potentialBusinessId']) && $detail['potentialBusinessId'] == $item['id']){
					array_push($item['lbd'], $detail);
					unset($detail['potentialBusinessId']);
					if(!isset($item['lbs'])){
						$item['lbs'] = $detail['comments'];
						$item['lbc'] = $detail['committer'];
						$item['lbcr'] = $detail['committerRealName'];
						$item['lbt'] = $detail['createTime'];
					}
				}
			}
			unset($item['reginId']);
			unset($item['isDeleted']);
		}
		// 获取提醒内容
		$today = date("Y-m-d");
		$sql = "select * from message where isRead = 'false' and isDeleted = 'false' and receiver = '?' and type = 'telemarket_individual_remind' and extraId = '?' and showTime is not null and DATE_FORMAT(`showTime`, '%Y-%m-%d') >= '$today' order by showTime ";
		foreach($res as &$item){
			$item["reminders"] = $mysql->DBGetAsMap($sql, $item["telemarketingStaffName"], $item["id"]);
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