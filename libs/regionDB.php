<?php

	function addRegion($data){
		$name = $data['name'];
		$regions = getRegionByName($name);
		if(count($regions) != 0){
			throw new Exception("region with name:$name already exist!");
		}
		$obj = array(
			"id"=>date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT),
			"name"=>$name
		);
		global $mysql;
		$mysql->DBInsertAsArray("`region`",$obj);
		return array('status'=>'successful', 'errMsg' => '','regionId'=> $obj["id"]);
	}

	function deleteRegion($id){
		global $mysql;
		$condition = "`id` = '$id' ";
		$setValue = " `isDeleted` = 'true',`updateTime`= now()";
		$mysql->DBUpdateSomeCols("`region`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => '');
	}

	function getRegionList($isFrozen){
		global $mysql;
		$selectSql = "`region` r ";
		$whereSql = " where r.isDeleted = 'false' ";
		if(isset($isFrozen)){
			$selectSql.= ", `business` b";
			$whereSql .= " and b.regionId = r.id and r.isDeleted = 'false' and isFrozen = '$isFrozen' ";
		}
		$arr = $mysql->DBGetSomeRows($selectSql, " r.* ", $whereSql ," order by r.createTime desc");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["name"] = $val["name"];
			$res[$count]["createTime"] = $val["createTime"];
			$res[$count]["updateTime"] = $val["updateTime"];
		    $count ++;
        }
		return $res;
	}
	
	function getRegionByName($name){
		global $mysql;
		$whereSql = " where isDeleted = 'false' and name = '$name'";
		$arr = $mysql->DBGetSomeRows("`region`", " * ", $whereSql ," order by createTime desc");
		$count = 0;
		$res = array();
		foreach($arr as $key => $val) {
		    $res[$count]["id"] = $val["id"];
		    $res[$count]["name"] = $val["name"];
			$res[$count]["createTime"] = $val["createTime"];
			$res[$count]["updateTime"] = $val["updateTime"];
		    $count ++;
        }
		return $res;
	}

	function editRegion($data){
		global $mysql;
		$id = $data["id"];
		$name = $data["name"];
		$condition = "`id` = '$id' ";
		$setValue = " `name` = '$name',`updateTime`= now() ";
		$mysql->DBUpdateSomeCols("`region`", $condition, $setValue);
		return array('status'=>'successful', 'errMsg' => 'edit business ok');
	}
?>