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
		// 这边的isWaiting不是数据库的那个字段
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
	
	function getBusinessLevelBAndC($q){
		global $mysql;
		$sql = "select `b`.*, `r`.name from `business` `b` left join `region` `r` on `b`.regionId = `r`.id where `b`.`isDeleted` = 'false' and b.salesmanName = '?' order by level desc ";
		return $mysql->DBGetAsMap($sql,$q['salesmanName']);
	}
	
	function getSalesmanlistWidthLevelBAndC(){
		global $mysql;
		return $mysql->DBGetAsMap("select distinct salesman,salesmanName,count(*) as number from business where isDeleted = 'false' group by salesman,salesmanName  order by level desc ;");
	}
	
	function getSalesmanlist(){
		global $mysql;
		// get list and number of business
		$res1 = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and salesmanName is not null group by salesman;");
		// get list and number of A level business
		$res3 = $mysql->DBGetAsMap("select distinct salesman,salesmanName, count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and level = 'A' and salesmanName is not null group by salesman;");
		// get list and number of business which require designer  
		$res2 = $mysql->DBGetAsMap("select distinct salesman,count(*) as number from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' and applyDesigner = 1 and salesmanName is not null group by salesman;");
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
		$fields = array('floorArea','houseType','regionId','potentialBusinessId','address','isFrozen','requestDead','isDead','requestDeadBusinessTitle','requestDeadBusinessReason','customer','custContact','salesman','salesmanName','designer','designerName','csStaff','csStaffName','applyDesigner','level','ds_lp','ds_fc','ds_bs','ds_bp','isWaiting','isLocked', 'createTime' );
		$params = array();
		$sql = "select `b`.*, `r`.name from `business` `b` left join `region` `r` on `b`.regionId = `r`.id where `b`.`isDeleted` = 'false' and b.isTransfered = 'false' ";
		foreach($fields as $field){
			if(isset($data[$field])){
				array_push($params,$data[$field]);
				if ($field == 'csStaff' || $field == 'csStaffName') {
					$sql .= " or $field = '?' ";
				}
				// we assume the following two fields,
				// we would only search vaguely;
				// we need to figure out a way when later there is exact matching requirement.
				else if ($field == 'salesman' || $field == 'designer') {
					$sql .= " and $field like '%?%' ";
				}
				else if ($field == 'createTime') {
					$sql .= " and `b`.$field like '%?%' ";
				}
				else {
					$sql .= " and $field = '?' ";
				}
			}				
		}
		// put result in order according to level. from A to D.
		// force NULL value rank the last
		$sql .= " order by IF(ISNULL(`level`), 1, 0), `level` , id desc ";
		// echo $sql;
		// var_dump($params);
		$needPaging = false;
		if (isset($data["needPaging"]) && $data["needPaging"] == 'true' && isset($data["limit"])) {
			$needPaging = true;
			$sqlWithoutPaging = $sql;
			$sql .= " LIMIT ".$data["start"].', '.$data["limit"];
		}
		$data = $mysql->DBGetAsMap($sql,$params);
		if ($needPaging == 'true' ) {
			$total = $mysql->DBGetAsMap($sqlWithoutPaging, $params);
			$total = count($total);
			return array(
				"data" => $data,
				"total" => $total
			);
		}
		else {
			return $data;
		}
	}
	
	
	function getBusinessListForBudget (){
		global $mysql;
		return $mysql->DBGetAsMap("select `b`.*, `r`.`name` from `business` `b` left join `region` `r` on (`b`.`regionId` = `r`.`id`) where `b`.`isDeleted` = 'false' and `b`.`isTransfered` = 'false' and `b`.`applyBudget` != 0 and `b`.`budgetFinished` = 'false' ");
	}
	function addBusiness($post){
		$businesss = getBusinessByAddress($post["address"], $post["regionId"]);
		if(count($businesss) != 0){
			throw new Exception("该地址已经存在业务中:".$post["address"]."!");
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
		$fields = array("potentialBusinessId","isFrozen","isTransfered","updateTime","designer","designerName","applyDesigner");
		foreach($fields as $field){
			if(isset($post[$field]))
				$obj[$field] = $post[$field];
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
		$fields = array("regionId","potentialBusinessId","address","isFrozen",'requestDead','isDead','requestDeadBusinessTitle','requestDeadBusinessReason',"isTransfered","updateTime","signTime","customer","custContact","salesman","source","salesmanName","csStaff","csStaffName","designer","designerName","applyDesigner","applyProjectTransference","applyBudget","ds_lp","ds_fc","ds_bs","ds_bp","isWaiting","isLocked");
		$obj = array('updateTime'=>'now()');
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
		$fields = array("projectTime","projectName","designer","designerName","captain","captainName","salesman","supervisor","supervisorName","salesmanName","isWaiting","isLocked");
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
		// start of inserting projectId into relative budget record.
		$mysql->DBUpdate('budget',array('projectId'=>$res["projectId"],'lastUpdateTime'=>'now()'),"businessId = '?'",array($businessId));
		// end of inserting
		return array('status'=>'successful', 'errMsg' => '','projectId'=>$res['projectId']);
	}

	function clientRank($data) {
		global $mysql;
		$id = $data["id"];
		$date = date('Y-m-d H:i:s');
		$obj = array();
		$obj['level'] = $data["level"];
		$obj['levelTime'] = $date;
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

	function revertTelemarketingBusiness(){
		global $mysql;
		//电销超期回退
		echo "电销超期回退<br />";
		$date = date('Y-m-d');
		$sql = "update potential_business set telemarketingStaff = '',telemarketingDeadline = '' , telemarketingStaffName = '' , lastUpdateTime = now() where telemarketingDeadline is not null and telemarketingDeadline < '".$date."' and isImportant = 'false';";
		echo "$sql<br />";
		try{
			$mysql->DBExecute($sql);
			echo "ok<br />";
		}catch(Exception $e){
			var_dump($e);
		}
	}

	function getBusinessAggregation($data) {
		global $mysql;
		$searchArr = array(
			'isDead' => 'false',
			'isFrozen' => 'false',
			// 'isWaiting' => 'false',
			'needPaging' => 'true',
			'start' => $data['start'],
			'limit' => $data['limit']
		);
		$filterSql = "";
		$params = array();
		$fields = array('salesman', 'designer', 'level', 'createTime');
		foreach ($fields as $field) {
			if (isset($data[$field])) {
				$searchArr[$field] = $data[$field];
				if ($field == 'salesman' || $field == 'designer' || $field == 'createTime') {
					$filterSql .= " and $field like '%?%' ";
				}
				else {
					$filterSql .= " and $field = '?' ";
				}
				array_push($params, $data[$field]);
			}
		}
		$list = getBusiness(
			$searchArr
		);
		$list = $list["data"];
		$total = $mysql->DBGetAsMap("select count(*) as totalBusiness from business where isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' ".$filterSql, $params);
		$total = $total[0]["totalBusiness"];
		$B = $mysql->DBGetAsMap("select count(*) as totalB from business where level = 'B' and isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' ".$filterSql, $params);
		$A = $mysql->DBGetAsMap("select count(*) as totalA from business where level = 'A' and isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' ".$filterSql, $params);
		$C = $mysql->DBGetAsMap("select count(*) as totalC from business where level = 'C' and isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' ".$filterSql, $params);
		$D = $mysql->DBGetAsMap("select count(*) as totalD from business where level = 'D' and isDeleted = 'false' and isTransfered = 'false' and isFrozen = 'false' and isDead = 'false' ".$filterSql, $params);
		$res = array(
			"data" => $list,
			"total" => $total,
			"totalA" => $A[0]["totalA"],
			"totalB" => $B[0]["totalB"],
			"totalC" => $C[0]["totalC"],
			"totalD" => $D[0]["totalD"]
		);

		return $res;
	}

	function getBusinessByDate() {
		global $mysql;
		$arr = $mysql->DBGetAsMap("select count(*) as num, date(createTime) as date FROM `business` WHERE isDeleted = 'false' and isFrozen = 'false' and isDead = 'false' and isTransfered = 'false' GROUP by date(createTime) order by date(createTime) asc");
		$extraArr = array();
		for ($i=0; $i < count($arr); $i++) { 
			if ($i >= 1) {
				$days = (strtotime($arr[$i]["date"]) - strtotime($arr[$i - 1]["date"])) / 60 / 60 / 24;
				if ($days > 1) {
					for ($j = 1; $j < $days; $j++) {
						array_push($extraArr, array(
							"num" => $arr[$i - 1]["num"],
							"date" => date("Y-m-d", strtotime("+".$j." day", strtotime($arr[$i - 1]["date"])))
						));
					}
					$arr[$i]["num"] += $arr[$i - 1]["num"];
				}
				else if ($days == 1) {
					$arr[$i]["num"] += $arr[$i - 1]["num"];
				}
			}
		}
		// return $extraArr;
		$arr = array_merge($arr, $extraArr);
		$sortlist = array();
		foreach ($arr as $key => $value) {
			$sortlist[$key]["date"] = $value["date"];
		}
		array_multisort($arr, SORT_ASC, $sortlist);
		$res = array(
			"data" => $arr,
			"status" => "successful",
			"errMsg" => ""
		);
		return $res;
	}
?>