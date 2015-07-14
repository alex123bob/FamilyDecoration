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
			//删除小区下对应的业务
			$res = deleteBusinessByRegion($_REQUEST["id"]);
			break;
		//修改小区
		case "editRegion":
			$res = editRegion($_REQUEST);
			break;
		//根据小区获取所有业务
		case "getBusinessByRegion":
			$isFrozen = isset($_REQUEST["isFrozen"])? $_REQUEST["isFrozen"] : 'false';
			$isTransfered = isset($_REQUEST["isTransfered"])? $_REQUEST["isTransfered"] : 'false';
			$salesmanName = isset($_REQUEST["salesmanName"])? $_REQUEST["salesmanName"] : null;
			$res = getBusinessByRegion($_REQUEST["regionId"],$isFrozen,$isTransfered,$salesmanName);
			break;
			//根据小区获取所有业务
		case "getBusinessByDesigner":
			$res = getBusinessByDesigner($_REQUEST);
			break;
		//新增业务
		case "addBusiness":
			$res = addBusiness($_REQUEST);
			break;
		case "getBusinessById":
			$res = getBusinessById($_REQUEST['businessId']);
			break;
		case "getBusinessListForBudget":
			$res = getBusinessListForBudget();
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
		//将死单的业务转为活单
		case "defrostBusiness":
			$res = defrostBusiness($_REQUEST['businessId']);
			break;
		//将业务转为工程
		case "transferBusinessToProject":
			$res = transferBusinessToProject($_REQUEST);
			break;
		case "clientRank":
			$res = clientRank($_REQUEST);
			break;
		//申请设计师
		case "applyfordesigner":
			$res = editBusiness(array('id'=>$_REQUEST['businessId'],'applyDesigner'=>1));
			break;
		//设计师申请完成
		case "completedesignerapply":
			$res = editBusiness(array('id'=>$_REQUEST['businessId'],'applyDesigner'=>2));
			break;
		//分配设计师
		case "distributeDesigner":
			$res = editBusiness(array( 'id'=>$_REQUEST['businessId'],'designer'=>$_REQUEST['designer'],'designerName'=>$_REQUEST['designerName'],'applyDesigner'=>2));
			break;
		//获取设计师列表
		case "getDesignerlist":
			$res = getDesignerlist();
			break;
		//获取业务员列表
		case "getSalesmanlist":
			$res = getSalesmanlist();
			break;
		//申请将业务转为工程
		case "applyprojecttransference":
			$res = editBusiness(array( 'id'=>$_REQUEST['businessId'],'applyProjectTransference'=>1));
			break;
		//申请业务预算
		case "applyforbudget":
			$res = editBusiness(array( 'id'=>$_REQUEST['businessId'],'applyBudget'=>1));
			break;
		//业务之星,上个星期谁新建的业务最多,或者最少
		case "businessStar":
			$desc = isset($_REQUEST['desc']) ? $_REQUEST['desc'] == "true" : true;
			$number = isset($_REQUEST['number']) ? intval($_REQUEST['number']) : 5;
			$number = $number < 1 ? 5 : $number;
			$startTime = date("Y-m-d H:i:s",mktime(0, 0 , 0,date("m"),date("d")-date("w")+1-7,date("Y"))); 
			$endTime = date("Y-m-d H:i:s",mktime(23,59,59,date("m"),date("d")-date("w")+7-7,date("Y"))); 
			$res = getBusinessStar($desc,$number,$startTime,$endTime);
			break;
		//签单之星,上个星期谁签单的业务最多,或者最少
		case "signStar":
			$desc = isset($_REQUEST['desc']) ? $_REQUEST['desc'] == "true" : true;
			$number = isset($_REQUEST['number']) ? intval($_REQUEST['number']) : 5;
			$number = $number < 1 ? 5 : $number;
			$startTime = date("Y-m-d H:i:s",mktime(0, 0 , 0,date("m"),date("d")-date("w")+1-7,date("Y"))); 
			$endTime = date("Y-m-d H:i:s",mktime(23,59,59,date("m"),date("d")-date("w")+7-7,date("Y"))); 
			$res = getSignStar($desc,$number,$startTime,$endTime);
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>