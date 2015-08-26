<?php

	function addRegion($data){
		$name = $data['name'];
		$remark = $data['nameRemark'];
		$regions = getRegionByName($name, isset($data["parentID"]));
		if(count($regions) != 0){
			throw new Exception("region with name:$name already exist!");
		}
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"name"=>$name,
			"nameRemark"=>$remark
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
		$arr = $mysql->DBGetAsMap($sql.' order by createTime desc ',$params);
		// 获取小区的业务
		/*if(isset($data['parentID']) && $data['parentID'] != '-1' && $data['parentID'] != -1){
			for ($i = 0; $i < count($arr); $i++) {
				$arr[$i]["business"] = getBusinessByRegion($arr[$i]["id"], 'false', 'false');
			}			
		}*/			
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
		$mysql->DBUpdate('region',$obj,"`id` = '?' ",array($data["id"]));
		return array('status'=>'successful', 'errMsg' => 'edit business ok');
	}
?>