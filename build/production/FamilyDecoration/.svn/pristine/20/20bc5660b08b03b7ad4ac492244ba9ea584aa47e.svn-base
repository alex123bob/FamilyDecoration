<?php
	include_once "conn.php";
	include_once "businessDB.php";
	include_once "businessDetailDB.php";
	include_once "regionDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		//获取小区列表
		case "getRegionList":
			$res = getRegionList(isset($_REQUEST['isFrozen']) ? $_REQUEST['isFrozen'] : null);
			break;
		//增加小区
		case "addRegion":
			$res = addRegion($_REQUEST);  
			break;
		//删除小区
		case "deleteRegion":
			$res = deleteRegion($_REQUEST["id"]);
			break;
		//修改小区
		case "editRegion":
			$res = editRegion($_REQUEST);
			break;
		//根据小区获取所有业务
		case "getBusinessByRegion":
			$isFrozen = isset($_REQUEST["isFrozen"])? $_REQUEST["isFrozen"] : 'false';
			$res = getBusinessByRegion($_REQUEST["regionId"],$isFrozen);
			break;
		//新增业务
		case "addBusiness":
			$res = addBusiness($_REQUEST);
			break;
		//修改业务
		case "editBusiness":
			$res = editBusiness($_REQUEST);
			break;
		//删除业务
		case "deleteBusiness":
			$res = deleteBusiness($_REQUEST["id"]);
			break;
		//获取业务详细信息
		case "getBusinessDetails":
			$res = getBusinessDetails($_REQUEST['businessId']);
			break;
		//增加一条业务信息
		case "addBusinessDetail":
			$res = addBusinessDetail($_REQUEST);
			break;		
		//删除一条业务信息
		case "deleteBusinessDetail":
			$res = deleteBusinessDetail($_REQUEST['detailId']);
			break;
		//修改一条业务信息
		case "editBusinessDetail":
			$res = editBusinessDetail($_REQUEST);
			break;
		//将业务转为死单
		case "frozeBusiness":
			$res = frozeBusiness($_REQUEST['businessId']);
			break;
		case "defrostBusiness":
			$res = defrostBusiness($_REQUEST['businessId']);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo urldecode(json_encode($res));
?>