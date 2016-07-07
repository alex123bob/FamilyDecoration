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
	function getBusinessByAddress($address, $region){
		global $mysql;
		return $mysql->DBGetAsMap("select * from business where address = '?' and `regionId` = '?' and `isDeleted` = 'false' ",$address, $region);
	}
	function getBusinessByDesigner($post){
		global $mysql;
		// isWaiting: default false, 传递为true表示查询当前designer的待转列表业务
		if (isset($post["isWaiting"]) && $post["isWaiting"] == true) {
			$waitingListSql = " and ds_lp = '-1' ";
		}
		else {
			$waitingListSql = "and (ds_lp != '-1' || ds_lp is null) ";
		}
		// force NULL value to be ranked the last
		return $mysql->DBGetAsMap("select `b`.*, `r`.`name` from `business` `b` left join `region` `r` on `b`.`regionId` = `r`.`id` where  `b`.`designerName` = '?' and `b`.`isDeleted` = 'false' and `b`.`isFrozen` = 'false' and `b`.`isTransfered` = 'false' and `b`.`isDead` = 'false' ".$waitingListSql." order by IF( ISNULL(`b`.`signBusinessLevel`), 1, 0), `b`.`signBusinessLevel` DESC ",$post["designerName"]);
	}
	function getDesignerlist(){
		global $mysql;
		$res0 = $mysql->DBGetAsMap("select distinct designer,designerName from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and designer is not null ;");
		//signedBusinesAllcount
		$res4 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and applyDesigner = 2 and designer is not null group by designer;");
		//signedBusinesALevelCount
		$res1 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and signBusinessLevel = 'A' and applyDesigner = 2 and designer is not null group by designer;");
		//applyBudgetCount
		$res2 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and applyBudget = 1 and designer is not null group by designer;");
		//applyTransferCount
		$res3 = $mysql->DBGetAsMap("select distinct designer,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and applyProjectTransference  = 1 and designer is not null group by designer;");

		$signedBusinesCount = array();
		$signedBusinesAllCount = array();
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
		foreach($res4 as $item){
			$signedBusinesAllCount[$item['designer']] = $item['number'];
		}

		foreach($res0 as $key => $val){
			$res0[$key]['signedBusinesALevelCount'] = isset($signedBusinesCount[$val['designer']]) ? intval($signedBusinesCount[$val['designer']]) : 0;			
			$res0[$key]['applyBudgetCount'] = isset($applyBudgetCount[$val['designer']]) ? intval($applyBudgetCount[$val['designer']]) : 0;			
			$res0[$key]['applyTransferCount'] = isset($applyTransferCount[$val['designer']]) ? intval($applyTransferCount[$val['designer']]) : 0;			
			$res0[$key]['signedBusinesAllCount'] = isset($signedBusinesAllCount[$val['designer']]) ? intval($signedBusinesAllCount[$val['designer']]) : 0;			
		}
		return $res0;
	}
	function getSalesmanlist(){
		global $mysql;
		// get list and number of business
		$res1 = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' group by salesman;");
		// get list and number of A level business
		$res3 = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and level = 'A' group by salesman;");
		// get list and number of business which require designer  
		$res2 = $mysql->DBGetAsMap("select distinct salesman,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and applyDesigner = 1 group by salesman;");
		// sort from map list to map     [{'salesman':aaa,'number':111},{'salesman':bbb,'number':222}...]  to [aaa:111,bbb:222]
		$applyDesignerCount = array();
		$ALevelBuisness = array();
		foreach($res2 as $item){
			$applyDesignerCount[$item['salesman']] = $item['number'];
		}
		foreach($res3 as $item){
			$ALevelBuisness[$item['salesman']] = $item['number'];
		}
		// set $res1 with applyDesignerCount in $applyDesignerCount
		foreach($res1 as $key => $val){
			$res1[$key]['apply'] = isset($applyDesignerCount[$val['salesman']]) ? $applyDesignerCount[$val['salesman']] : 0;			
		}
		// set $res1 with applyDesignerCount in $applyDesignerCount
		foreach($res1 as $key => $val){
			$res1[$key]['ALevelNumber'] = isset($ALevelBuisness[$val['salesman']]) ? $ALevelBuisness[$val['salesman']] : 0;			
		}
		return $res1;
	}
	function getSalesmanlistWithDeadBusinessNumber (){
		global $mysql;
		$requestDeadRes = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as requestDeadNumber from business where isDeleted = 'false' and isTransfered = 'false' and requestDead = 1 group by salesman ");
		$alreadyDeadRes = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as alreadyDeadNumber from business where isDeleted = 'false' and isTransfered = 'false' and isDead = 'true'  group by salesman ");
		for ($i=0; $i < count($requestDeadRes); $i++) { 
			$outerItem = $requestDeadRes[$i];
			for ($j=0; $j < count($alreadyDeadRes); $j++) { 
				$innerItem = $alreadyDeadRes[$j];
				if ($innerItem["salesmanName"] == $outerItem["salesmanName"]
					&& $innerItem["salesman"] == $outerItem["salesman"]) {
					$outerItem["alreadyDeadNumber"] = $innerItem["alreadyDeadNumber"];
					array_splice($alreadyDeadRes, $j, 1);
					break;
				}
				else {
					$outerItem["alreadyDeadNumber"] = 0;
				}
			}
			$requestDeadRes[$i] = $outerItem;
		}
		for ($k=0; $k < count($alreadyDeadRes); $k++) {
			$remainingItem = $alreadyDeadRes[$k];
			$remainingItem["requestDeadNumber"] = 0;
			array_push($requestDeadRes, $remainingItem);
		}
		return $requestDeadRes;
	}
	function getDeadBusinessOrRequestDeadBusiness ($salesmanName){
		global $mysql;
		$requestDeadArr = getBusiness(array("salesmanName"=>$salesmanName, "requestDead"=>"1"));
		$deadBusinessArr = getBusiness(array("salesmanName"=>$salesmanName, "isDead"=>"true"));
		$res = array_merge($requestDeadArr, $deadBusinessArr);
		return $res;
	}
	function getBusinessById($businessId){
		global $mysql;
		return $mysql->DBGetAsMap("select * from business where id = '?' and `isDeleted` = 'false' ",$businessId);
	}
	
	function getBusiness($data){
		global $mysql;
		$fields = array('regionId','address','isFrozen','requestDead','isDead','requestDeadBusinessTitle','requestDeadBusinessReason','customer','custContact','salesman','salesmanName','designer','designerName','applyDesigner','level','ds_lp','ds_fc','ds_bs','ds_bp');
		$params = array();
		$sql = "select `b`.*, `r`.name from `business` `b` left join `region` `r` on `b`.regionId = `r`.id where `b`.`isDeleted` = 'false' and b.isTransfered = 'false' ";
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				$sql .= " and $field = '?' ";
			}				
		}
		// put result in order according to level. from A to D.
		// force NULL value rank the last
		$sql .= " order by IF(ISNULL(`level`), 1, 0), `level` , id desc ";
		return $mysql->DBGetAsMap($sql,$params);
	}
	
	
	function getBusinessListForBudget (){
		global $mysql;
		return $mysql->DBGetAsMap("select `b`.*, `r`.`name` from `business` `b` left join `region` `r` on (`b`.`regionId` = `r`.`id`) where `b`.`isDeleted` = 'false' and `b`.`isTransfered` = 'false' and `b`.`applyBudget` != 0 and `b`.`budgetFinished` = 'false' ");
	}
	function addBusiness($post){
		$businesss = getBusinessByAddress($post["address"], $post["regionId"]);
		if(count($businesss) != 0){
			throw new Exception("business with address:".$post["address"]." already exist in region:".$post["regionId"]." !");
		}
		//必填字段
		$obj = array("id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"regionId"=>$post["regionId"],
			"customer"=>$post["customer"],
			"custContact"=>$post["custContact"],
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
		$fields = array("regionId","address","isFrozen",'requestDead','isDead','requestDeadBusinessTitle','requestDeadBusinessReason',"isTransfered","updateTime","signTime","customer","custContact","salesman","source","salesmanName","designer","designerName","applyDesigner","applyProjectTransference","applyBudget","ds_lp","ds_fc","ds_bs","ds_bp");
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
		$obj = array('customer'=>$data['customer'],"custContact"=>$data["custContact"],"businessId"=>$businessId);
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

	function requestDeadBusiness ($businessId, $title, $reason){
		global $mysql;
		$mysql->DBUpdate('business',array('requestDead'=>'1','requestDeadBusinessTitle'=>$title,'requestDeadBusinessReason'=>$reason,'updateTime'=>'now()'),"`id`='?'",array($businessId));
		return array('status'=>'successful', 'errMsg'=> 'dead business has been requested!');
	}
?>