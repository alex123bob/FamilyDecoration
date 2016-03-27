<?php
	//打折
	function makeDiscount($data){
		if(!isset($data['discount'])){
			return array('status'=>'successful', 'errMsg' => '');
		}
		$discount = (int)$data['discount'];
		if($discount> 130 || $discount < 85)
			throw new Exception("discount must be 85 ~ 130 , now :"+$discount);
		global $mysql;
		$budgetId = $data['budgetId'];
		$whereSql = " budgetId='?' and `itemCode` not in ('N','O','P','Q','R','S')";
		$param = array($budgetId);
		if(isset($data['budgetItemId'])){
			$budgetItemId= $data['budgetItemId'];
			$item = $mysql->DBGetAsMap("select itemCode from `budget_item` where budgetItemId = '?' ",$budgetItemId);
			if(count($item) == 0)
				throw new Exception("no item with budgetItemId:".$budgetItemId);
			$itemCode = $item[0]['itemCode'];
			//给大项打折
			if(strlen($itemCode) == 1){
				$whereSql = $whereSql." and `itemCode` like '%?%'";
			}else{
			//给小项打折
				$whereSql = $whereSql." and `itemCode` = '?' ";
			}
			array_push($param,$itemCode);
		}
		//给所有项打折
		$mysql->DBUpdate('budget_item',array('discount'=>$discount,'lastUpdateTime'=>'now()'),$whereSql,$param);
		return array('status'=>'successful', 'errMsg' => '');
	}
	//获取项目下一个ItemCode编码
	function _getNextItemCode($budgetId){
		global $mysql;
		$sql = "SELECT DISTINCT LEFT( itemCode, 1 ) as code , itemName FROM  `budget_item` WHERE `isDeleted` = 'false' and `budgetId` = '?' and LEFT( itemCode, 1 ) NOT IN ('N','O','P','Q','R','S') order by code asc";
		$existItemCodes = $mysql->DBGetAsOneArray($sql,$budgetId);
		$ItemCodeList = array("A","B","C","D","E","F","G","H","I","J","K","L","M");
		foreach($ItemCodeList as $char){
			if(!in_array($char,$existItemCodes)){
				return $char;
			}
		}
		throw new Exception("超过itemCode最大值M");
	}
	//获取大项下一个小项的itemCode编码
	function _getNextBasicCode($budgetId,$ItemCode){
		global $mysql;
		$sql = "SELECT SUBSTRING(itemCode,3) as code  FROM `budget_item` where `isDeleted` = 'false' and `budgetId` = '?' and `itemCode` like '%?%' and SUBSTRING(itemCode,3) != \"\" order by code asc ";
		$existItemCodes = $mysql->DBGetAsOneArray($sql,$budgetId,$ItemCode);
		$count = 1;
		while(in_array($count."",$existItemCodes)){
			$count ++;
		}
		return $ItemCode."-".$count;
	}
	//添加大项
	function addBigItem($post){
		$itemCode = _getNextItemCode($post["budgetId"]);
		global $mysql;
		$fields = array('itemName','budgetId','itemUnit','itemAmount','mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice','lossPercent','remark','basicItemId','basicSubItemId');
		$obj = array('itemCode'=>$itemCode,'budgetItemId' => "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT));
		foreach($fields as $field){
			if(isset($post[$field]))
				$obj[$field] = $post[$field];
		}
		$mysql->DBInsertAsArray("`budget_item`",$obj);
		return array('status'=>'successful', 'errMsg' => '','itemCode'=>$itemCode);
	}
	//添加小项
	function addItem($post){
		$itemCode = _getNextBasicCode($post["budgetId"],$post["itemCode"]);
		global $mysql;
		$fields = array('itemName','budgetId','itemUnit','workCategory','itemAmount','remark','mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice','manpowerCost', 'mainMaterialCost', 'basicItemId','basicSubItemId');
		$obj = array('itemCode'=>$itemCode,'budgetItemId' => "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT));
		foreach($fields as $field){
			if(isset($post[$field])){
				$obj[$field] = $post[$field];
			}
		}
		//损耗=（主材单价+辅料单价）*0.05
		$obj['lossPercent'] = ($obj['mainMaterialPrice']+$obj['auxiliaryMaterialPrice']) * 0.05;
		$mysql->DBInsertAsArray("`budget_item`",$obj);
		return array('status'=>'successful', 'errMsg' => '','itemCode'=>$itemCode);
	}
	//修改项
	function editItem($post){
		global $mysql;
		$fields = array('itemName','budgetId','itemUnit','itemAmount','mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice','lossPercent','remark','basicItemId','basicSubItemId');
		$obj = array('budgetItemId'=>$post["budgetItemId"]);
		foreach($fields as $field){
			if(isset($post[$field]))
				$obj[$field] = $post[$field];
		}
		if(isset($post['budgetItemId'])) {
			$obj['lastUpdateTime']='now()';
			$mysql->DBUpdate("`budget_item`",$obj,"`budgetItemId`='?'",array($post['budgetItemId']));
		}
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	//删除项，不区分大小项
	function delItem($budgetItemId){
		global $mysql;
		$item = $mysql->DBGetAsMap("select budgetId,itemCode from `budget_item` where budgetItemId = '?' ",$budgetItemId);
		if(count($item) == 0)
			throw new Exception("no item with budgetItemId:".$budgetItemId);
		$budgetId = $item[0]['budgetId'];
		$itemCode = $item[0]['itemCode'];
		if(strlen($itemCode) == 1){
			if(in_array($itemCode,array('N','O','P','Q','R','S')))
				throw new Exception("you cant delete ".$itemCode);
			//删除大项		
			$mysql->DBUpdate("budget_item",array('isDeleted'=>true,'itemCode'=>'XXX','lastUpdateTime'=>'now()'),"`budgetId` = '?' and `itemCode` like '%?%' ",array($budgetId,$itemCode));
			//重排序大项
			$list = $mysql->DBGetAsOneArray("SELECT  distinct LEFT( itemCode, 1 ) as code FROM `budget_item` where `isDeleted` = 'false' and `budgetId` = '?'  and `itemCode` not in ('N','O','P','Q','R','S') and LEFT( itemCode, 1 ) > '?'",$budgetId,$itemCode);
			foreach($list as $itemCode){
				$newItemCode = chr(ord($itemCode)-1);
				$res = $sql = "update  `budget_item` set `itemCode` = REPLACE(`itemCode`,'".$itemCode."','".$newItemCode."') where `isDeleted` = 'false' and `budgetId` = '".$budgetId."' and `itemCode` like '%".$itemCode."%' ";
				$mysql->DBExecute($sql);
			}
		}else{
			//删除小项
			$mysql->DBUpdate('budget_item',array('isDeleted'=>true,'itemCode'=>'XXX','lastUpdateTime'=>'now()'),"`budgetItemId` = '?' ",array($budgetItemId));
			$code = substr($itemCode,0,1);
			$index = intval(substr($itemCode,2));
			//重排序小项
			$sql = "SELECT budgetItemId,SUBSTRING(itemCode,3) as idx FROM  `budget_item` WHERE `isDeleted` = 'false' and `budgetId` = '?' and `itemCode` like '%?%' and SUBSTRING(itemCode,3) > ? ";
			$list = $mysql->DBGetAsMap($sql,$budgetId,$code,$index);
			foreach($list as $item){
				$newidx = intval($item['idx']) - 1;
				$mysql->DBUpdate('budget_item',array('itemCode'=>"$code-$newidx",'lastUpdateTime'=>'now()'),"`budgetItemId` = '?' ",array($item['budgetItemId']));
			}
		}
		return array('status'=>'successful', 'errMsg' => '');
	}

	//添加预算
	function addBudget($post){
		global $mysql;
		if(!isset($post["projectId"]) && !isset($post["businessId"]) ){
			throw new Exception("预算必须有关联的项目或者业务！");
		}
		// 将applyBudget置为2表示当前业务可以进行预算查看了
		if (isset($post["businessId"])) {
			editBusiness(array("id"=>$post["businessId"], "applyBudget"=>2));
		}
		$budgetId = "budget-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$fields = array("projectId","businessId","custName","areaSize","totalFee","comments",'budgetName');
		$budget = array("isDeleted"=>false,"budgetId" =>$budgetId );
		foreach($fields as $field){
			if(isset($post[$field])){
				$budget[$field] = $post[$field];
			}
		}
		$mysql->DBInsertAsArray("budget",$budget);
		//N
		$item = array('itemCode'=>'N','itemName'=>'工程直接费','itemUnit'=>'元','budgetId'=>$budgetId);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//O
		$item = array('itemCode'=>'O','itemName'=>'设计费3%','itemUnit'=>'元','itemAmount'=>0.03,'budgetId'=>$budgetId);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//P
		$item = array('itemCode'=>'P','itemName'=>'效果图','itemUnit'=>'张','itemAmount'=>0,'budgetId'=>$budgetId);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//Q
		$item = array('itemCode'=>'Q','itemName'=>'5%管理费','itemUnit'=>'元','itemAmount'=>0.05,'budgetId'=>$budgetId);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//R
		$item = array('itemCode'=>'R','itemName'=>'税金','itemUnit'=>'元','itemAmount'=>0.03,'budgetId'=>$budgetId);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//S
		$item = array('itemCode'=>'S','itemName'=>'工程总造价','itemUnit'=>'元','budgetId'=>$budgetId);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		return array('status'=>'successful', 'errMsg' => '', "budgetId" => $budgetId);
	}

	//删除预算
	function delBudget ($budgetId){
		global $mysql;
		$mysql->DBUpdate('budget',array('isDeleted'=>true,'lastUpdateTime'=>'now()'),"`budgetId` = '?' ",array($budgetId));
		$mysql->DBUpdate('budget_item',array('isDeleted'=>true,'lastUpdateTime'=>'now()'),"`budgetId` = '?' ",array($budgetId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	//供本地备份脚本使用
	function getBudgetIds (){
		global $mysql;
		$arr = $mysql->DBGetAsMap("SELECT b.budgetId,p.projectName FROM `budget` b left join `project` p on b.projectId=p.projectId where b.`isDeleted` = 'false' ");
		foreach($arr as $key => $val) {
			echo $val['budgetId'].">".str2GBK($val['projectName'])."\n";
		}
	}
	function getBudgets (){
		global $mysql;
		return $mysql->DBGetAsMap("SELECT b.*,p.projectName,bz.address as businessAddress,`r`.`name` as businessRegion FROM `budget` b left join `project` p on b.projectId=p.projectId left join `business` `bz` on `bz`.`id` = `b`.`businessId` left join `region` `r` on `r`.`id` = `bz`.`regionId` where b.`isDeleted` = 'false' ");
	}
	
	function getBudgetsByBudgetId ($budgetId){
		global $mysql;
		//return $mysql->DBGetAsMap("SELECT b.*,p.projectName FROM `budget` b left join `project` p on b.projectId=p.projectId where b.`isDeleted` = 'false' and b.`budgetId` = '?' ",$budgetId);
		return $mysql->DBGetAsMap("SELECT b.*,p.projectName,bz.address as businessAddress,`r`.`name` as businessRegion FROM `budget` b left join `project` p on b.projectId=p.projectId left join `business` bz on bz.id = b.businessId left join `region` `r` on `bz`.`regionId` = `r`.id where b.`isDeleted` = 'false' and b.`budgetId` = '?' ",$budgetId);
	}

	function getBudgetsByBusinessId ($businessId){
		global $mysql;

		return $mysql->DBGetAsMap("SELECT b.*,bz.address as businessAddress,`r`.`name` as businessRegion FROM `budget` b left join `business` bz on bz.id = b.businessId left join `region` `r` on `bz`.`regionId` = `r`.id where b.`isDeleted` = 'false' and b.`businessId` = '?' ",$businessId);
	}
	
	function compareBudgetItem($arg1,$arg2){
		return strcasecmp($arg1["itemCode"],$arg2["itemCode"]);
	}
	//修改预算
	function editBudget (array $pro){
		global $mysql;
		$obj = array();
		$fields = array("custName","areaSize","projectId", "businessId", "totalFee", "comments",'budgetName');
		foreach($fields as $field) {
			if (isset($pro[$field])) {
				$obj[$field] = $pro[$field];
			}
		}
		$obj['lastUpdateTime']='now()';
		$mysql->DBUpdate('budget',$obj,"`budgetId` = '?'",array($pro['budgetId']));
		return array('status'=>'successful', 'errMsg' => '');
	}
	//成本分析
	function costAnalysis($budgetId){
		global $mysql;
		$res= array();
		$arr = $mysql->DBGetAsMap(" select itemCode,basicItemId,basicSubItemId,itemName,budgetItemId,itemAmount,itemUnit,manpowerCost,mainMaterialCost,workCategory from `budget_item` where `budgetId` = '?' and itemCode not in ('N','O','P','Q','R','S') and `isDeleted` = 'false' ORDER BY LEFT( itemCode, 2 ) ASC , ( SUBSTRING( itemCode, 2 ) ) *1 DESC ",$budgetId);
		$workCategorys = array();
		$count = 0;
		$isFirstSmallCount = true;
		$smallCount = array('manpowerTotalCost'=>0,'mainMaterialTotalCost'=>0);
		foreach($arr as $val) {
			$itemCode = $val['itemCode'];
			$itemAmount = $val['itemAmount'] == "" || $val['itemAmount'] == null ? 0 : $val['itemAmount'];
			if($val['itemAmount'] !== $itemAmount) $val['itemAmount'] = $itemAmount;
			$workCategory = $val['workCategory'] == "" || $val['workCategory'] == null ? '其他' : $val['workCategory'];
			if($val['workCategory'] !== $workCategory) $val['workCategory'] = $workCategory;
			$manpowerCost = $val['manpowerCost'] == "" || $val['manpowerCost'] == null ? 0 : $val['manpowerCost'];
			if($val['manpowerCost'] !== $manpowerCost) $val['manpowerCost'] = $manpowerCost;
			$mainMaterialCost = $val['mainMaterialCost'] == "" || $val['mainMaterialCost'] == null ? 0 : $val['mainMaterialCost'];
			if($val['mainMaterialCost'] !== $mainMaterialCost) $val['mainMaterialCost'] = $mainMaterialCost;
			if(strlen($itemCode) == 1){
				//大项
				if($isFirstSmallCount){
					$isFirstSmallCount = false;
				}else{
					//输出小计
					$res[$count] = array('itemName'=>'小计','budgetItemId'=>'budgetItemId'.$count,'manpowerTotalCost'=>$smallCount['manpowerTotalCost'],'mainMaterialTotalCost'=>$smallCount['mainMaterialTotalCost']);
					$count++;
					$smallCount = array('manpowerTotalCost'=>0,'mainMaterialTotalCost'=>0);
				}
				$res[$count] = array('itemCode'=>$itemCode,'itemName'=>$val['itemName'],'budgetItemId'=>$val['budgetItemId'],'basicItemId'=>$val['basicItemId'],'basicSubItemId'=>$val['basicSubItemId']);
			}else{
				$res[$count] = $val;
				//小项
				if(!isset($workCategorys[$workCategory])){
					$workCategorys[$workCategory] = array('manpowerCost'=>0,'mainMaterialCost'=>0,);
				}
				$manpowerTotalCost = $manpowerCost * $itemAmount;
				$mainMaterialTotalCost = $mainMaterialCost * $itemAmount;
				$res[$count]['manpowerTotalCost'] = $manpowerTotalCost;
				$res[$count]['mainMaterialTotalCost']  = $mainMaterialTotalCost;
				$res[$count]['basicItemId']  = $val['basicItemId'];
				$res[$count]['basicSubItemId']  = $val['basicSubItemId'];
				$workCategorys[$workCategory]['manpowerCost'] += $manpowerTotalCost;
				$workCategorys[$workCategory]['mainMaterialCost'] += $mainMaterialTotalCost;
				$smallCount['manpowerTotalCost'] += $manpowerTotalCost;
				$smallCount['mainMaterialTotalCost'] += $mainMaterialTotalCost;
			}
			$count ++;
		}
		if(!$isFirstSmallCount){
			//输出小计
			$res[$count] = array('itemName'=>'小计','budgetItemId'=>'budgetItemId'.$count,'manpowerTotalCost'=>$smallCount['manpowerTotalCost'],'mainMaterialTotalCost'=>$smallCount['mainMaterialTotalCost']);
			$count++;
		}
		//调整下workCategorys的格式
		$cates = array();
		$count = 0;
		foreach($workCategorys as $key=>$val){
			$cates[$count++] = array('name'=>$key,'manpowerCost'=>$val['manpowerCost'],'mainMaterialCost'=>$val['mainMaterialCost']);
		}
		return array('cost'=>$res,'total'=>$cates);
		
	}
	//获取预算所有条目
	function getBudgetItemsByBudgetId ($budgetId , $isGBK = false , $isAppendNOPQRSItems = true) {
		global $mysql;
		$res= array();
		$arr = $mysql->DBGetAsMap(" select * from `budget_item` where `budgetId` = '?' and `isDeleted` = 'false' ORDER BY LEFT( itemCode, 2 ) ASC , ( SUBSTRING( itemCode, 2 ) ) *1 DESC ",$budgetId);
		//供转成模板时使用
		if(!$isAppendNOPQRSItems){
			return $arr;
		}
		$count = 0;
		$smallCount = array(0,0,0,0,0,0);
		$directFee = 0;
		$isFirstSmallCount = true;
		$NOPQRSItems = array();
		foreach($arr as $val) {
			$itemCode = $val['itemCode'];
			$itemUnit = $val['itemUnit'];
			$itemAmount = $val['itemAmount'] == "" || $val['itemAmount'] == null ? 0 : $val['itemAmount'];
			$discount = $val['discount'];
			$budgetId = $val['budgetId'];
			$itemName = $isGBK ? str2GBK($val['itemName']) :  ($val['itemName']);
			$itemUnit = $isGBK ? str2GBK($val['itemUnit']) :  ($val['itemUnit']);
			//这几项需要单独计算
			if(in_array($itemCode,array('N','O','P','Q','R','S'))){
				$NOPQRSItems[$itemCode] = $val;
				continue;
			}
			// itemCode  长度为1时认为是大项
			if(strlen($itemCode) == 1){
				if($isFirstSmallCount){
				//第一个大项出现时不输出小计
					$isFirstSmallCount = false;
				}else{
					//增加一行小计
					$res[$count++] = array('budgetItemId'=>'NULL'.$count,'itemName'=>$isGBK ? str2GBK('小计') : ('小计'),'budgetId'=>$budgetId,
									'mainMaterialTotalPrice'=>$smallCount[0],'auxiliaryMaterialTotalPrice'=>$smallCount[1],'manpowerTotalPrice'=>$smallCount[2],
									'machineryTotalPrice'=>$smallCount[3],'manpowerTotalCost'=>$smallCount[4],'mainMaterialTotalCost'=>$smallCount[5]);
					$directFee+=$smallCount[0];
					$directFee+=$smallCount[1];
					$directFee+=$smallCount[2];
					$directFee+=$smallCount[3];
					$smallCount = array(0,0,0,0,0,0);
				}
				//输出大项
				$res[$count++] = array('itemName'=>$itemName,'basicItemId'=>$val['basicItemId'],'itemCode'=>$val['itemCode'],'budgetId'=>$val['budgetId'],'budgetItemId'=>$val['budgetItemId'],'isEditable'=>true);
				continue;
			}
			//正常输出项
			$res[$count] = $val;
			$res[$count]['itemName'] = $itemName;
			$res[$count]['itemAmount'] = $itemAmount;
			$res[$count]['itemUnit'] = $itemUnit;
			$res[$count]['mainMaterialPrice'] = $val['mainMaterialPrice'] * $discount/100;
			$res[$count]['auxiliaryMaterialPrice'] = $val['auxiliaryMaterialPrice'] * $discount/100;
			$res[$count]['manpowerPrice'] = $val['manpowerPrice'] * $discount/100;
			$res[$count]['machineryPrice'] = $val['machineryPrice'] * $discount/100;
			$res[$count]['orgMainMaterialPrice'] = "原价:".$val['mainMaterialPrice']." ".( $discount == 100 ? "" : ($discount/10)."折");
			$res[$count]['orgAuxiliaryMaterialPrice'] = "原价:".$val['auxiliaryMaterialPrice']." ".( $discount == 100 ? "" : ($discount/10)."折");
			$res[$count]['orgManpowerPrice'] = "原价:".$val['manpowerPrice']." ".( $discount == 100 ? "" : ($discount/10)."折");
			$res[$count]['orgMachineryPrice'] = "原价:".$val['machineryPrice']." ".( $discount == 100 ? "" : ($discount/10)."折");

			//损耗=（主材单价+辅料单价）*0.05,按折扣后的价格
			$loss = ($res[$count]['mainMaterialPrice']+$res[$count]['auxiliaryMaterialPrice']) * 0.05;
			if($val['lossPercent'] != $loss){
				$val['lossPercent'] = $loss;
				editItem($val);
			}
			$res[$count]['lossPercent'] = $loss;
			//主材总价=（主菜单价+损耗）* 数量,按折扣后的价格
			$mainMaterialTotalPrice = $itemAmount * ($res[$count]['mainMaterialPrice'] + $loss);
			$res[$count]['mainMaterialTotalPrice'] = $mainMaterialTotalPrice;
			$res[$count]['auxiliaryMaterialTotalPrice'] =  $itemAmount * $res[$count]['auxiliaryMaterialPrice'];
			$res[$count]['manpowerTotalPrice'] = $itemAmount * $res[$count]['manpowerPrice'];
			$res[$count]['machineryTotalPrice'] = $itemAmount * $res[$count]['machineryPrice'];
			$res[$count]['remark'] = $val['remark'] == 'NULL' ? '' : ($isGBK ? str2GBK($val['remark']) :  (addslashes(nl2br(str_replace("\n", "<br />", $val['remark'])))));
			$res[$count]['isEditable'] = true;
			/**
			2.辅材总价=辅材单价*数量
			3.人工总价=人工单价*数量
			4.机械总价=机械单价*数量
			6.小计=各类小项总价之和
			7.合计=所有小巷综合			
			**/
			$smallCount[0] +=  $res[$count]['mainMaterialTotalPrice'];
			$smallCount[1] +=  $res[$count]['auxiliaryMaterialTotalPrice'];
			$smallCount[2] +=  $res[$count]['manpowerTotalPrice'];
			$smallCount[3] +=  $res[$count]['machineryTotalPrice'];
			$smallCount[4] +=  $res[$count]['manpowerCost'];
			$smallCount[5] +=  $res[$count]['mainMaterialCost'];
			foreach($res[$count] as $key => $val){
				if($val === "" || $val === null){
					//去除空值，减少网络数据量
					unset($res[$count][$key]);
				}
			}
			$count++;
		}
		//如果 isFirstSmallCount 还是初始化的状态true说明没有一行小计,false的时候，说明至少有一个大项输出了。
		if(!$isFirstSmallCount){
			//最后一行小计
			$res[$count++] = array('budgetItemId'=>'NULL'.$count,'itemName'=>$isGBK ? str2GBK('小计') : ('小计'),'budgetId'=>$budgetId,
							'mainMaterialTotalPrice'=>$smallCount[0],'auxiliaryMaterialTotalPrice'=>$smallCount[1],'manpowerTotalPrice'=>$smallCount[2],
							'machineryTotalPrice'=>$smallCount[3],'manpowerTotalCost'=>$smallCount[4],'mainMaterialTotalCost'=>$smallCount[5],'isEditable'=>false);
			$directFee+=$smallCount[0];
			$directFee+=$smallCount[1];
			$directFee+=$smallCount[2];
			$directFee+=$smallCount[3];
			$smallCount = array(0,0,0,0,0,0);
		}
		//增加一行空行
		$res[$count++] = array('budgetItemId'=>'NULL'.$count,'budgetId'=>$budgetId,'isEditable'=>false);
		//计算其他项
		$totalFee = $directFee;
		//N 工程直接费
		$itemUnit = '元';
		$itemName = '工程直接费';
		$itemCode = 'N';
		$item = $NOPQRSItems[$itemCode];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'mainMaterialTotalPrice'=>$fee,'isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// O 设计费
		$itemUnit = '元';
		$itemName = '设计费3%';
		$itemCode = 'O';
		$item = $NOPQRSItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$itemAmount ,'mainMaterialTotalPrice'=>$fee,'isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// P 效果图
		$itemUnit = '张';
		$itemName = '效果图';
		$itemCode = 'P';
		$item = $NOPQRSItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = 500 * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$itemAmount ,'mainMaterialTotalPrice'=>$fee,'isEditable'=>false);
		// Q 5%管理费
		$itemUnit = '元';
		$itemName = '5%管理费';
		$itemCode = 'Q';
		$item = $NOPQRSItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$itemAmount ,'mainMaterialTotalPrice'=>$fee,'isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// R 税金
		$itemUnit = '元';
		$itemName = '税金';
		$itemCode = 'R';
		$item = $NOPQRSItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$itemAmount ,'mainMaterialTotalPrice'=>$fee,'isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// S 工程总造价
		$itemUnit = '元';
		$itemName = '工程总造价';
		$itemCode = 'S';
		$item = $NOPQRSItems[$itemCode];
		$budgetItemId = $item['budgetItemId'];
		$itemAmount = '';
		$fee = $totalFee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$itemAmount ,'mainMaterialTotalPrice'=>$fee,'isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		
			
		foreach($res as $count=>$bItem){
			//保留小数点后两位,不足补0
			foreach($bItem as $key=> $val){
				if(!in_array($key,array('itemAmount','mainMaterialTotalPrice','auxiliaryMaterialTotalPrice','manpowerTotalPrice','mainMaterialTotalCost','lossPercent','manpowerTotalCost','machineryTotalPrice','mainMaterialPrice','auxiliaryMaterialPrice','machineryPrice','manpowerPrice')))
					continue;
				$res[$count][$key] = formatNumber($val);
			}
		}
		return $res;
	}
?>