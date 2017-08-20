<?php
	require_once "conn.php";
	require_once "userDB.php";
	require_once "businessDB.php";
	require_once "potentialBusinessDB.php";
	require_once "businessDetailDB.php";
	require_once "regionDB.php";

	$action = $_REQUEST["action"];
	$res = "";
	switch($action){
		//获取小区列表
		case "getRegionList":
			$res = getRegionList($_REQUEST);
			break;
		//获取小区列表以及潜在客户数量
		case "getRegionList2":
			$res = getRegionList2($_REQUEST);
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
		case "getBusiness":
			$res = getBusiness($_REQUEST);
			break;
		case "getDeadBusinessOrRequestDeadBusiness":
			$res = getDeadBusinessOrRequestDeadBusiness($_REQUEST["salesmanName"]);
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
		// 我的业务评级
		case "clientRank":
			$res = clientRank($_REQUEST);
			break;
		// 签单业务评级
		case "gradeBusiness":
			$res = gradeBusiness($_REQUEST);
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
			$res = editBusiness(
				array(
					'id'=>$_REQUEST['businessId'],
					'designer'=>$_REQUEST['designer'],
					'designerName'=>$_REQUEST['designerName'],
					'applyDesigner'=>2,
					'signTime'=>date('Y-m-d H:i:s'),
					'ds_lp'=>-1,
					'ds_fc'=>-1,
					'ds_bs'=>-1,
					'ds_bp'=>-1
				)
			);
			break;
		//获取B类C类客户的业务员列表
		case "getSalesmanlistWidthLevelBAndC":
			$res = getSalesmanlistWidthLevelBAndC();
			break;
		//获取B类C类客户的业务列表
		case "getBusinessLevelBAndC":
			$res = getBusinessLevelBAndC($_REQUEST);
			break;
		//获取设计师列表
		case "getDesignerlist":
			$res = getDesignerlist();
			break;
		//获取业务员列表
		case "getSalesmanlist":
			$res = getSalesmanlist();
			break;
		// 获取业务员列表，需要附带业务员对应申请废单和已经是废单数量
		case "getSalesmanlistWithDeadBusinessNumber":
			$res = getSalesmanlistWithDeadBusinessNumber();
			break;
		// 将当前业务退回
		case "returnBusiness":
			$res = editBusiness(
				array(
					'id'=>$_REQUEST["id"],
					'applyDesigner'=>1,
					'designerName'=>"NULL",
					'designer'=>"NULL",
					'ds_lp'=>"NULL",
					'ds_fc'=>"NULL",
					'ds_bs'=>"NULL",
					'ds_bp'=>"NULL"
				)
			);
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
			$desc = isset($_REQUEST['desc']) ? $_REQUEST['desc'] == "true" : false;
			$number = isset($_REQUEST['number']) ? intval($_REQUEST['number']) : 5;
			$number = $number < 1 ? 5 : $number;
			$startTime = date("Y-m-d H:i:s",mktime(0, 0 , 0,date("m"),date("d")-date("w")+1-7,date("Y"))); 
			$endTime = date("Y-m-d H:i:s",mktime(23,59,59,date("m"),date("d")-date("w")+7-7,date("Y"))); 
			$res = getBusinessStar($desc,$number,$startTime,$endTime);
			break;
		//签单之星,上个星期谁签单的业务最多,或者最少
		case "signStar":
			$desc = isset($_REQUEST['desc']) ? $_REQUEST['desc'] == "true" : false;
			$number = isset($_REQUEST['number']) ? intval($_REQUEST['number']) : 5;
			$number = $number < 1 ? 5 : $number;
			$startTime = date("Y-m-d H:i:s",mktime(0, 0 , 0,date("m"),date("d")-date("w")+1-7,date("Y"))); 
			$endTime = date("Y-m-d H:i:s",mktime(23,59,59,date("m"),date("d")-date("w")+7-7,date("Y"))); 
			$res = getSignStar($desc,$number,$startTime,$endTime);
			break;
		//获取所有潜在业务，扫楼名单
		case "getAllPotentialBusiness":
			//'address','proprietor','phone' 模糊查询
			// 'regionID','status','salesman','salesmanName' 精确查询
			$res = getAllPotentialBusiness($_REQUEST);
			break;
		//增加潜在业务，扫楼名单	
		case "addPotentialBusiness":
			$res = addPotentialBusiness($_REQUEST);
			break;
		//修改潜在业务，扫楼名单
		case "editPotentialBusiness":
			$res = editPotentialBusiness($_REQUEST);
			break;
		// 将潜在业务专为正式业务，需要潜在业务id，由于在转换过程中，业务员和来源是可变化的，所以应该前端传递，而不能读对应id的老数据
		case "transferToBusiness":
			$res = transferToBusiness($_REQUEST["id"], $_REQUEST["salesmanName"], $_REQUEST["source"],$_REQUEST["houseType"],$_REQUEST["floorArea"]);
			break;
		//删除潜在业务，扫楼名单
		case "deletePotentialBusiness":
			$res = deletePotentialBusiness($_REQUEST['id']);
			break;
		// request dead business
		case "requestDeadBusiness":
			$res = requestDeadBusiness($_REQUEST["businessId"], $_REQUEST["requestDeadBusinessTitle"], $_REQUEST["requestDeadBusinessReason"]);
			break;
		// 获取电销人员列表
		case "getTeleMarketingStaffList":
			$res = getTeleMarketingStaffList();
			break;
		case "revertTelemarketingBusiness":
			$res = revertTelemarketingBusiness();
			break;
		case "getBusinessAggregation":
			$res = getBusinessAggregation($_REQUEST);
			break;
		case "getBusinessByDate":
			$res = getBusinessByDate();
			break;
		case "distributeBusiness":
			editBusiness(array(
				"id" => $_REQUEST["id"],
				"isWaiting" => "false",
				"salesmanName" => $_REQUEST["salesmanName"],
				"salesman" => $_REQUEST["salesman"]
			));
			$realname = getUserRealName($_SESSION["name"]);
			$realname = $realname["realname"];
			$res = addBusinessDetail(array(
				"businessId" => $_REQUEST["id"],
				"content" => $realname.'将当前业务分配至'.$_REQUEST["salesman"]."名下"
			));
			break;
		default: 
			throw new Exception("unknown action:".$action);
	}
	echo (json_encode($res));
?>