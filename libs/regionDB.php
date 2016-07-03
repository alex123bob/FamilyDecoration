<?php
	function addRegion($data){
		$name = $data['name'];
		$remark = $data['nameRemark'];
		$openingTime = $data["openingTime"];
		$regions = getRegionByName($name, isset($data["parentID"]));
		if(count($regions) != 0){
			throw new Exception("region with name:$name already exist!");
		}
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"name"=>$name,
			"nameRemark"=>$remark,
			"openingTime"=>$openingTime
		);
		if(isset($data['parentID']))
			$obj['parentID'] = $data['parentID'];
		global $mysql;
		$mysql->DBInsertAsArray("`region`",$obj);
		return array('status'=>'successful', 'errMsg' => '','regionId'=> $obj["id"]);
	}

	function deleteRegion($id){
		global $mysql;
		$mysql->DBUpdate('region',array('isDeleted'=>true,'updateTime'=>'now()'),"`id`='?'",array($id));
		return array('status'=>'successful', 'errMsg' => '');
	}

	//获取小区列表以及潜在客户数量
	function getRegionList2($data){
		$params = array();
		array_push($params,$data['parentID']);
		//总数，不管装没装修的
		$sql = "SELECT	IFNULL(p.num,0) as totalBusinessNumber,	r.* FROM `region` r 
					LEFT JOIN (select count(*) as num,regionId  from potential_business where isDeleted = 'false' {myselfonly} group by regionId)
				p ON r.id = p.regionId where r.parentID = '?'";
		//潜在业务数，未装修的
		$sql2 = "SELECT	IFNULL(p.num,0) as potentialBusinessNumber,	r.id FROM `region` r 
					LEFT JOIN (select count(*) as num,regionId  from potential_business where isDeleted = 'false' {myselfonly} and (isDecorated is null or isDecorated = 'false') group by regionId)
				p ON r.id = p.regionId where r.parentID = '?' ";
		if(isset($data['myselfOnly']) && ($data['myselfOnly'] === 'true' || $data['myselfOnly'] === true)){
			$sql = str_replace("{myselfonly}", " and salesmanName = '".$_SESSION['name']."'", $sql);
			$sql2 = str_replace("{myselfonly}", " and salesmanName = '".$_SESSION['name']."'", $sql2);
		}else{
			$sql = str_replace("{myselfonly}", '', $sql);
			$sql2 = str_replace("{myselfonly}", '', $sql2);
		}
		global $mysql;
		$arr = $mysql->DBGetAsMap($sql.' order by totalBusinessNumber desc ',$params);
		$arr2 = $mysql->DBGetAsMap($sql2.' order by r.createTime asc ',$params);
		$pB = array();
		foreach($arr2 as &$item){
			$pB[$item['id']] = $item['potentialBusinessNumber'];
		}
		foreach($arr as &$item){
			$item['potentialBusinessNumber'] = isset($pB[$item['id']]) ? $pB[$item['id']] : 0 ;
		}
		return $arr;
	}

	function getRegionList($data){
		$params = array();
		if(isset($data['isFrozen'])){
			array_push($params,$data['isFrozen'] == true || $data['isFrozen'] == 'true');
			$sql = "select r.* from `region` r , `business` b where r.isDeleted = 'false' and b.isDeleted = 'false' and b.regionId = r.id and r.isDeleted = 'false' and isFrozen = '?' ";
		}else{
			$sql = "select r.* from `region` r where isDeleted = 'false' ";
		}
		if(isset($data['parentID'])){
			$sql = $sql." and r.parentID = '?' ";
			array_push($params,$data['parentID']);
		}else{
			$sql = $sql." and r.parentID = -1 ";
		}
		global $mysql;
		$arr = $mysql->DBGetAsMap($sql.' order by createTime asc ',$params);
		return $arr;
	}
	
	function getRegionByName($name,$isArea){
		global $mysql;
		if ($isArea) {
			return $mysql->DBGetAsMap("select * from region where isDeleted = 'false' and name = '?' and parentID != -1 order by createTime desc ",$name);
		}
		else {
			return $mysql->DBGetAsMap("select * from region where isDeleted = 'false' and name = '?' and parentID = -1 order by createTime desc ",$name);
		}
	}

	function editRegion($data){
		global $mysql;
		$obj = array('updateTime'=>'now()');
		if(isset($data['parentID']))
			$obj['parentID'] = $data['parentID'];
		if(isset($data['nameRemark']))
			$obj['nameRemark'] = $data['nameRemark'];
		if(isset($data['name']))
			$obj['name'] = $data['name'];
		if(isset($data['openingTime']))
			$obj['openingTime'] = $data['openingTime'];
		$mysql->DBUpdate('region',$obj,"`id` = '?' ",array($data["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit business ok');
	}
?>