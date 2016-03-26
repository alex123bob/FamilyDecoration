<?php
	//添加预算
	function createTemplateFromBudget($budgetId){
		global $mysql,$templateFields;
		if($budgetId == null){
			throw new Exception("no budget id！");
		}
		//创建模板
		$budgets = getBudgetsByBudgetId($budgetId);
		if(empty($budgets)){
			throw new Exception("no budget id with id ".$budgetId);
		}
		$template = $budgets[0];
		$templateId = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$template['budgetTemplateName'] = $template['budgetName'];
		$template['budgetTemplateId'] = $templateId;
		$template['custName'] = '客户姓名';
		$templateFields = array('budgetTemplateName','custName','budgetTemplateId','areaSize','comments','isDeleted');
		foreach($template as $key=> $val){
			if(is_numeric($key) || !in_array($key,$templateFields))
				unset($template[$key]);
		}
		//$mysql->DBInsertAsArray("budget_template",$template);
			
		//创建模板对应条目
		$items = getBudgetItemsByBudgetId($budgetId);
		
		
		$templateItemFields = array('budgetTemplateItemId','itemName','budgetTemplateId','itemCode','itemUnit','itemAmount','mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice','lossPercent','isDeleted','remark','basicItemId','basicSubItemId','manpowerCost','mainMaterialCost','discount','workCategory');
		foreach($items as $key=> $item){
			print_r($item);
			foreach($item as $key=> $val){
				if(is_numeric($key) || !in_array($key,$templateItemFields))
					unset($item[$key]);
			}
			$item['budgetTemplateId'] = $templateId;
			$item['budgetTemplateItemId'] = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
			$mysql->DBInsertAsArray("`budget_template_item`",$item);
		}
		
		return array('status'=>'successful', 'errMsg' => '', "templateId" => $templateId);
	}

	//删除预算
	function delBudgetTemplate ($templateId){
		global $mysql;
		$mysql->DBUpdate('budget_template',array('isDeleted'=>true),"`budgetTemlateId` = '?' ",array($budgetId));
		$mysql->DBUpdate('budget_template_item',array('isDeleted'=>true),"`budgetTemlateId` = '?' ",array($budgetId));
		return array('status'=>'successful', 'errMsg' => '');
	}
/*
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
	function getBudgetItemsByBudgetId ($budgetId , $isGBK = false) {
		global $mysql;
		$res= array();
		$arr = $mysql->DBGetAsMap(" select * from `budget_item` where `budgetId` = '?' and `isDeleted` = 'false' ORDER BY LEFT( itemCode, 2 ) ASC , ( SUBSTRING( itemCode, 2 ) ) *1 DESC ",$budgetId);
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
			**//*
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
	}*/
?>