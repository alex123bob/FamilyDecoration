<?php
	function getBusinessStar($desc,$number,$startTime,$endTime){
		global $mysql;
		$order = $desc == true ? "DESC" : "ASC";
		$sql = 	"SELECT name AS salesmanName, realName AS salesman, IFNULL(number,0) as number FROM user LEFT JOIN ("
					." SELECT salesman, salesmanName, COUNT( * ) AS number FROM business"
					." WHERE createTime >=  '?' AND createTime <= '?' and isDeleted = 'false' GROUP BY salesman ORDER BY number ? LIMIT ?"
				.") a ON a.salesmanName = user.name where user.isDeleted = 'false' and user.level like '004-%' ORDER BY number ? LIMIT ? ";
		return $mysql->DBGetAsMap($sql,$startTime,$endTime,$order,$number,$order,$number);
	}
	function getSignStar($desc,$number,$startTime,$endTime){
		global $mysql;
		$order = $desc == true ? "DESC" : "ASC";
		$sql = 	"SELECT name AS designerName, realName AS designer, IFNULL(number,0) as number  FROM user LEFT JOIN ("
					." SELECT designer, designerName, COUNT( * ) AS number FROM business"
					." WHERE `applyDesigner` = '2' and createTime >=  '?' AND createTime <= '?' and isDeleted = 'false' GROUP BY designer ORDER BY number ? LIMIT ?"
				.") a ON a.designerName = user.name where user.isDeleted = 'false' and user.level like '002-%' ORDER BY number ? LIMIT ? ";
		return $mysql->DBGetAsMap($sql,$startTime,$endTime,$order,$number,$order,$number);
	}

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
		return $mysql->DBGetAsMap("select `b`.*, `r`.`name` from `business` `b` left join `region` `r` on `b`.`regionId` = `r`.`id` where  `b`.`designerName` = '?' and `b`.`isDeleted` = 'false' and `b`.`isFrozen` = 'false' and `b`.`isTransfered` = 'false' order by `b`.`signBusinessLevel` DESC ",$post["designerName"]);
	}
	function getDesignerlist(){
		global $mysql;
		$res0 = $mysql->DBGetAsMap("select distinct designer,designerName from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and designer is not null ;");
		//signedBusinesCount
		$res1 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and applyDesigner = 2 and designer is not null group by designer;");
		//applyBudgetCount
		$res2 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and applyBudget = 1 and designer is not null group by designer;");
		//applyTransferCount
		$res3 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and applyProjectTransference  = 1 and designer is not null group by designer;");

		$signedBusinesCount = array();
		$applyBudgetCount = array();
		$applyTransferCount = array();

		foreach($res1 as $item){
			$signedBusinesCount[$item['designer']] = $item['number'];
		}
		foreach($res2 as $item){
			$applyBudgetCount[$item['designer']] = $item['number'];
		}
		foreach($res3 as $item){
			$applyTransferCount[$item['designer']] = $item['number'];
		}

		foreach($res0 as $key => $val){
			$res0[$key]['signedBusinesCount'] = isset($signedBusinesCount[$val['designer']]) ? intval($signedBusinesCount[$val['designer']]) : 0;			
			$res0[$key]['applyBudgetCount'] = isset($applyBudgetCount[$val['designer']]) ? intval($applyBudgetCount[$val['designer']]) : 0;			
			$res0[$key]['applyTransferCount'] = isset($applyTransferCount[$val['designer']]) ? intval($applyTransferCount[$val['designer']]) : 0;			
		}
		return $res0;
	}
	function getSalesmanlist(){
		global $mysql;
		// get list and number of business
		$res1 = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' group by salesman;");
		// get list and number of business which require designer  
		$res2 = $mysql->DBGetAsMap("select distinct salesman,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and applyDesigner = 1 group by salesman;");
		// sort from map list to map     [{'salesman':aaa,'number':111},{'salesman':bbb,'number':222}...]  to [aaa:111,bbb:222]
		$applyDesignerCount = array();
		foreach($res2 as $item){
			$applyDesignerCount[$item['salesman']] = $item['number'];
		}
		// set $res1 with applyDesignerCount in $applyDesignerCount
		foreach($res1 as $key => $val){
			$res1[$key]['apply'] = isset($applyDesignerCount[$val['salesman']]) ? $applyDesignerCount[$val['salesman']] : 0;			
		}
		return $res1;
	}
	
	function getBusinessById($businessId){
		global $mysql;
		return $mysql->DBGetAsMap("select * from business where id = '?' and `isDeleted` = 'false' ",$businessId);
	}
	
	function getBusiness($data){
		global $mysql;
		$fields = array('regionId','address','isFrozen','customer','salesman','salesmanName','designer','designerName','applyDesigner','level');
		$params = array();
		$sql = "select `b`.*, `r`.name from `business` `b` left join `region` `r` on `b`.regionId = `r`.id where `b`.`isDeleted` = 'false' and b.isTransfered = 'false' ";
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				$sql .= " and $field = '?' ";
			}				
		}
		// put result in order according to level. from A to D.
		$sql .= " order by `level`";
		return $mysql->DBGetAsMap($sql,$params);
	}
	
	
	function getBusinessListForBudget (){
		global $mysql;
		return $mysql->DBGetAsMap("select `b`.*, `r`.`name` from `business` `b` left join `region` `r` on (`b`.`regionId` = `r`.`id`) where `b`.`isDeleted` = 'false' and `b`.`isTransfered` = 'false' and `b`.`applyBudget` != 0 ");
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
			"updateTime"=>'now()',
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
		$fields = array("regionId","address","isFrozen","isTransfered","updateTime","signTime","customer","salesman","source","salesmanName","designer","designerName","applyDesigner","applyProjectTransference","applyBudget");
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
	
	function transferBusinessToProject($data){
		global $mysql;
		//必须字段
		$businessId = $data['businessId'];
		$obj = array('customer'=>$data['customer'],"businessId"=>$businessId);
		//可选字段
		$fields = array("projectTime","projectName","designer","designerName","captain","captainName","salesman","supervisor","supervisorName","salesmanName");
		foreach($fields as $field){
			if(isset($data[$field]))
				$obj[$field] = $data[$field];
		}
		if(isset($data["startTime"])){
			$obj["period"] = $data["startTime"];
		}else{
			$obj["period"] = "";
		}
		if(isset($data["endTime"])){
			$obj["period"] = $obj["period"].":".$data["endTime"];
		}	
		include_once "projectDB.php";
		$res = addProject($obj);
		$mysql->DBUpdate('business',array('isTransfered'=>'true','updateTime'=>'now()','applyProjectTransference'=>2),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg' => '','projectId'=>$res['projectId']);
	}

	function clientRank($data) {
		global $mysql;
		$id = $data["id"];
		$obj = array();
		$obj['level'] = $data["level"];
		$mysql->DBUpdate('business',$obj,"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => 'rank client successfully!');
	}

	function gradeBusiness ($data) {
		global $mysql;
		$id = $data["id"];
		$obj = array();
		$obj["signBusinessLevel"] = $data["signBusinessLevel"];
		$mysql->DBUpdate("business",$obj,"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg'=> 'rank signed business successfully!');
	}
?>