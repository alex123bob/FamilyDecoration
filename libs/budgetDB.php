<?php
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
		$discount = isset($post['discount'])? $post['discount'] : 1;
		global $mysql;
		$fields = array('itemName','budgetId','itemUnit','itemAmount','remark', 'manpowerCost', 'mainMaterialCost', 'basicItemId','basicSubItemId');
		$obj = array('itemCode'=>$itemCode,'budgetItemId' => "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT));
		foreach($fields as $field){
			if(isset($post[$field]))
				$obj[$field] = $post[$field];
		}
		//主材，辅材，人工，机械需要算折扣
		foreach(array('mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice') as $field){
			if(isset($post[$field]))
				$obj[$field] = $post[$field] * $discount;
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
			$mysql->DBUpdate("budget_item",array('isDeleted'=>true,'itemCode'=>'XXX'),"`budgetId` = '?' and `itemCode` like '%?%' ",array($budgetId,$itemCode));
			//重排序大项
			$list = $mysql->DBGetAsOneArray("SELECT  distinct LEFT( itemCode, 1 ) as code FROM `budget_item` where `isDeleted` = 'false' and `budgetId` = '?'  and `itemCode` not in ('N','O','P','Q','R','S') and LEFT( itemCode, 1 ) > '?'",$budgetId,$itemCode);
			foreach($list as $itemCode){
				$newItemCode = chr(ord($itemCode)-1);
				$res = $sql = "update  `budget_item` set `itemCode` = REPLACE(`itemCode`,'".$itemCode."','".$newItemCode."') where `isDeleted` = 'false' and `budgetId` = '".$budgetId."' and `itemCode` like '%".$itemCode."%' ";
				$mysql->DBExecute($sql);
			}
		}else{
			//删除小项
			$mysql->DBUpdate('budget_item',array('isDeleted'=>true,'itemCode'=>'XXX'),"`budgetItemId` = '?' ",array($budgetItemId));
			$code = substr($itemCode,0,1);
			$index = intval(substr($itemCode,2));
			//重排序小项
			$sql = "SELECT budgetItemId,SUBSTRING(itemCode,3) as idx FROM  `budget_item` WHERE `isDeleted` = 'false' and `budgetId` = '?' and `itemCode` like '%?%' and SUBSTRING(itemCode,3) > ? ";
			$list = $mysql->DBGetAsMap($sql,$budgetId,$code,$index);
			foreach($list as $item){
				$newidx = intval($item['idx']) - 1;
				$mysql->DBUpdate('budget_item',array('itemCode'=>"$code-$newidx"),"`budgetItemId` = '?' ",array($item['budgetItemId']));
			}
		}
		return array('status'=>'successful', 'errMsg' => '');
	}

	//添加预算
	function addBudget($post){
		global $mysql;
		$projectId = $post["projectId"];
		$projects = $mysql->DBGetAsMap("SELECT projectId FROM `project` where `isDeleted` = 'false' and `projectId` = '?' and CHAR_LENGTH(`budgetId`) > 2 ",$projectId);  //随便选的2，有内容
		if(count($projects) > 0) 
			throw new Exception("项目 : '$projectId' 已经存在预算!");
		$fields = array("custName","areaSize","totalFee","comments","comments");
		$obj = array("isDeleted"=>false,"budgetId" => "budget-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT));
		foreach($fields as $field){
			if(isset($post[$field])){
				$obj[$field] = $post[$field];
			}
		}
		$mysql->DBUpdate("project",array('budgetId'=>$obj["budgetId"]),"`projectId` = '?' and `isDeleted`='false' ",array($projectId));
		$mysql->DBInsertAsArray("`budget`",$obj);
		//N
		$item = array('itemCode'=>'N','itemName'=>'工程直接费','itemUnit'=>'元','budgetId'=>$obj["budgetId"]);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//O
		$item = array('itemCode'=>'O','itemName'=>'设计费3%','itemUnit'=>'元','itemAmount'=>0.03,'budgetId'=>$obj["budgetId"]);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//P
		$item = array('itemCode'=>'P','itemName'=>'效果图','itemUnit'=>'张','itemAmount'=>0,'budgetId'=>$obj["budgetId"]);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//Q
		$item = array('itemCode'=>'Q','itemName'=>'5%管理费','itemUnit'=>'元','itemAmount'=>0.05,'budgetId'=>$obj["budgetId"]);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//R
		$item = array('itemCode'=>'R','itemName'=>'税金','itemUnit'=>'元','itemAmount'=>0.03,'budgetId'=>$obj["budgetId"]);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		//S
		$item = array('itemCode'=>'S','itemName'=>'工程总造价','itemUnit'=>'元','budgetId'=>$obj["budgetId"]);
		$item['budgetItemId'] = "budget-item-".date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
		$mysql->DBInsertAsArray("`budget_item`",$item);
		return array('status'=>'successful', 'errMsg' => '', "budgetId" => $obj["budgetId"]);
	}

	//删除预算
	function delBudget ($budgetId){
		global $mysql;
		$mysql->DBUpdate('project',array('budgetId'=>''),"`budgetId` = '?' ",array($budgetId));
		$mysql->DBUpdate('budget',array('isDeleted'=>true),"`budgetId` = '?' ",array($budgetId));
		$mysql->DBUpdate('budget_item',array('isDeleted'=>true),"`budgetId` = '?' ",array($budgetId));
		return array('status'=>'successful', 'errMsg' => '');
	}

	//供本地备份脚本使用
	function getBudgetIds (){
		global $mysql;
		$arr = $mysql->DBGetAsMap("SELECT b.budgetId,p.projectName FROM `budget` b left join `project` p on b.budgetId=p.budgetId where b.`isDeleted` = 'false' ");
		foreach($arr as $key => $val) {
			echo $val['budgetId'].">".str2GBK($val['projectName'])."\n";
		}
	}
	function getBudgets (){
		global $mysql;
		return $mysql->DBGetAsMap("SELECT b.*,p.projectName FROM `budget` b left join `project` p on b.budgetId=p.budgetId where b.`isDeleted` = 'false' ");
	}
	
	function getBudgetsByBudgetId ($budgetId){
		global $mysql;
		return $mysql->DBGetAsMap("SELECT b.*,p.projectName FROM `budget` b left join `project` p on b.budgetId=p.budgetId where b.`isDeleted` = 'false' and b.`budgetId` = '?' ",$budgetId);
	}
	
	function compareBudgetItem($arg1,$arg2){
		return strcasecmp($arg1["itemCode"],$arg2["itemCode"]);
	}
	//修改预算
	function editBudget (array $pro){
		global $mysql;
		$obj = array();
		$fields = array("custName","areaSize", "totalFee", "comments");
		foreach($fields as $field) {
			if (isset($pro[$field])) {
				$obj[$field] = $pro[$field];
			}
		}
		$mysql->DBUpdate('budget',$obj,"`budgetId` = '?'",array($pro['budgetId']));
		if(isset($pro['projectId']))
			$mysql->DBUpdate('project',array('budgetId'=>$pro['budgetId']),"`projectId` = '?'",array($pro['projectId']));
		return array('status'=>'successful', 'errMsg' => '');
	}
	//获取预算结果QPRST
	function getBudgetResult($budgetId){
		$arr = getBudgetItemsByBudgetId($budgetId);
		$res = array();
		foreach($arr as $item){
			if(in_array($item['itemCode'],array('N','O','P','Q','R','S'))){
				$res[$item['itemCode']]['budgetItemId'] = $item['budgetItemId'];
				$res[$item['itemCode']]['itemName'] = $item['itemName'];
				$res[$item['itemCode']]['mainMaterialTotalPrice'] = $item['mainMaterialTotalPrice'];
				$res[$item['itemCode']]['itemAmount'] = $item['itemAmount'];
				$res[$item['itemCode']]['itemUnit'] = $item['itemUnit'];
				$res[$item['itemCode']]['itemCode'] = $item['itemCode'];
			}
		}
		return $res;
	}
	//获取预算所有条目
	function getBudgetItemsByBudgetId ($budgetId , $isGBK = false,$isNOPQRSAmount = true) {
		global $mysql;
		$res= array();
		$arr = $mysql->DBGetAsMap(" select * from `budget_item` where `budgetId` = '?' and `isDeleted` = 'false' ORDER BY LEFT( itemCode, 2 ) ASC , ( SUBSTRING( itemCode, 2 ) ) *1 DESC ",$budgetId);
		$count = 0;
		$smallCount = array(0,0,0,0);
		$directFee = 0;
		$isFirstSmallCount = true;
		$otherItems = array();
		$otherItems['N'] = array('budgetItemId'=>'NULLN','itemName'=>'','budgetId'=>'',
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>'','auxiliaryMaterialTotalPrice'=>'',
								'manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'', 'manpowerCost'=>'', 'mainMaterialCost'=>'','isEditable'=>false);
		$otherItems['O'] = array('budgetItemId'=>'NULLO','itemName'=>'','budgetId'=>'',
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>'','auxiliaryMaterialTotalPrice'=>'',
								'manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'', 'manpowerCost'=>'', 'mainMaterialCost'=>'','isEditable'=>false);
		$otherItems['P'] = array('budgetItemId'=>'NULLP','itemName'=>'','budgetId'=>'',
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>'','auxiliaryMaterialTotalPrice'=>'',
								'manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'', 'manpowerCost'=>'', 'mainMaterialCost'=>'','isEditable'=>false);
		$otherItems['Q'] = array('budgetItemId'=>'NULLQ','itemName'=>'','budgetId'=>'',
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>'','auxiliaryMaterialTotalPrice'=>'',
								'manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'', 'manpowerCost'=>'', 'mainMaterialCost'=>'','isEditable'=>false);
		$otherItems['R'] = array('budgetItemId'=>'NULLR','itemName'=>'','budgetId'=>'',
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>'','auxiliaryMaterialTotalPrice'=>'',
								'manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'', 'manpowerCost'=>'', 'mainMaterialCost'=>'','isEditable'=>false);
		$otherItems['S'] = array('budgetItemId'=>'NULLS','itemName'=>'','budgetId'=>'',
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>'','auxiliaryMaterialTotalPrice'=>'',
								'manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'', 'manpowerCost'=>'', 'mainMaterialCost'=>'','isEditable'=>false);
		foreach($arr as $val) {
			$itemCode = $val['itemCode'];
			$itemUnit = $val['itemUnit'];
			$itemAmount = $val['itemAmount'];
			$budgetId = $val['budgetId'];
			//这几项需要单独计算
			if(in_array($itemCode,array('N','O','P','Q','R','S'))){
				$otherItems[$itemCode] = $val;
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
								'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
								'machineryPrice'=>'','mainMaterialTotalPrice'=>$smallCount[0],'auxiliaryMaterialTotalPrice'=>$smallCount[1],
								'manpowerTotalPrice'=>$smallCount[2],'machineryTotalPrice'=>$smallCount[3],'lossPercent'=>'','remark'=>'',
								'manpowerPrice'=>'','machineryPrice'=>'','isEditable'=>false);
				$directFee+=$smallCount[0];
				$directFee+=$smallCount[1];
				$directFee+=$smallCount[2];
				$directFee+=$smallCount[3];
				$smallCount = array(0,0,0,0);
				}
			}
			//正常输出项
			$res[$count]['budgetItemId'] = $val['budgetItemId'];
			$res[$count]['itemName'] = $isGBK ? str2GBK($val['itemName']) :  ($val['itemName']);
			$res[$count]['budgetId'] = $val['budgetId'];
			$res[$count]['itemCode'] = $val['itemCode'];
			$res[$count]['itemUnit'] = $isGBK ? str2GBK($val['itemUnit']) :  ($val['itemUnit']);
			$res[$count]['itemAmount'] = $itemAmount;
			$res[$count]['mainMaterialPrice'] = $val['mainMaterialPrice'];
			$res[$count]['auxiliaryMaterialPrice'] = $val['auxiliaryMaterialPrice'];
			$res[$count]['manpowerPrice'] = $val['manpowerPrice'];
			$res[$count]['machineryPrice'] = $val['machineryPrice'];
			//损耗=（主材单价+辅料单价）*0.05
			$loss = ($val['mainMaterialPrice']+$val['auxiliaryMaterialPrice']) * 0.05;
			if($val['lossPercent'] != $loss){
				$val['lossPercent'] = $loss;
				editItem($val);
			}
			$res[$count]['lossPercent'] = $loss;
			//主材总价=（主菜单价+损耗）* 数量
			$mainMaterialTotalPrice = $itemAmount * ($val['mainMaterialPrice'] + $loss);
			$res[$count]['mainMaterialTotalPrice'] = $mainMaterialTotalPrice;
			$res[$count]['auxiliaryMaterialTotalPrice'] =  $itemAmount * $val['auxiliaryMaterialPrice'];
			$res[$count]['manpowerTotalPrice'] = $itemAmount * $val['manpowerPrice'];
			$res[$count]['machineryTotalPrice'] = $itemAmount * $val['machineryPrice'];
			$res[$count]['remark'] = $val['remark'] == 'NULL' ? '' : ($isGBK ? str2GBK($val['remark']) :  (addslashes(nl2br(str_replace("\n", "<br />", $val['remark'])))));
			$res[$count]['basicItemId'] = $val['basicItemId'];
			$res[$count]['basicSubItemId'] = $val['basicSubItemId'];
			$res[$count]['manpowerPrice'] = $val['manpowerPrice'];
			$res[$count]['machineryPrice'] = $val['machineryPrice'];
			$res[$count]['manpowerCost'] = $val['manpowerCost'];
			$res[$count]['mainMaterialCost'] = $val['mainMaterialCost'];
			$res[$count]['isEditable'] = true;
			/**
			2.辅材总价=辅材单价*数量
			3.人工总价=人工单价*数量
			4.机械总价=机械单价*数量
			6.小计=各类小项总价之和
			7.合计=所有小巷综合			
			**/
			$smallCount[0] +=  $mainMaterialTotalPrice;
			$smallCount[1] +=  $itemAmount * $val['auxiliaryMaterialPrice'];
			$smallCount[2] +=  $itemAmount * $val['manpowerPrice'];
			$smallCount[3] +=  $itemAmount * $val['machineryPrice'];
			//如果是大项的话，有些字段要清空
			if(strlen($itemCode) == 1){
				$res[$count]['itemUnit'] = '';
				$res[$count]['mainMaterialTotalPrice'] = '';
				$res[$count]['itemAmount'] = '';
				$res[$count]['mainMaterialPrice'] = '';
				$res[$count]['auxiliaryMaterialPrice'] = '';
				$res[$count]['manpowerPrice'] = '';
				$res[$count]['machineryPrice'] = '';
				$res[$count]['auxiliaryMaterialTotalPrice'] = '';
				$res[$count]['manpowerTotalPrice'] = '';
				$res[$count]['machineryTotalPrice'] = '';
				$res[$count]['lossPercent'] = '';
				$res[$count]['remark'] = '';
			}
			$count++;
		}
		//如果 isFirstSmallCount 还是初始化的状态true说明没有一行小计,false的时候，说明至少有一个大项输出了。
		if(!$isFirstSmallCount){
			//最后一行小计
			$res[$count++] = array('budgetItemId'=>'NULL'.$count,'itemName'=>$isGBK ? str2GBK('小计') : ('小计'),'budgetId'=>$budgetId,
							'itemCode'=>'','itemUnit'=>'','itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'',
							'machineryPrice'=>'','mainMaterialTotalPrice'=>$smallCount[0],'auxiliaryMaterialTotalPrice'=>$smallCount[1],
							'manpowerTotalPrice'=>$smallCount[2],'machineryTotalPrice'=>$smallCount[3],'lossPercent'=>'','remark'=>'','isEditable'=>false);
			$directFee+=$smallCount[0];
			$directFee+=$smallCount[1];
			$directFee+=$smallCount[2];
			$directFee+=$smallCount[3];
			$smallCount = array(0,0,0,0);
		}
		//增加一行空行
		$res[$count++] = array('budgetItemId'=>'NULL'.$count,'itemName'=>'','budgetId'=>$budgetId,'itemCode'=>'','itemUnit'=>'','itemAmount'=>'',
					'mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'','mainMaterialTotalPrice'=>'',
					'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		//计算其他项
		$totalFee = $directFee;
		//N 工程直接费
		$itemUnit = '元';
		$itemName = '工程直接费';
		$itemCode = 'N';
		$item = $otherItems[$itemCode];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>'','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'',
				'mainMaterialTotalPrice'=>$fee,'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// O 设计费
		$itemUnit = '元';
		$itemName = '设计费3%';
		$itemCode = 'O';
		$item = $otherItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$isNOPQRSAmount ? $itemAmount : '','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'',
				'mainMaterialTotalPrice'=>$fee,
				'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// P 效果图
		$itemUnit = '张';
		$itemName = '效果图';
		$itemCode = 'P';
		$item = $otherItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = 500 * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$isNOPQRSAmount ? $itemAmount : '','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'',
				'mainMaterialTotalPrice'=>$fee,
				'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		// Q 5%管理费
		$itemUnit = '元';
		$itemName = '5%管理费';
		$itemCode = 'Q';
		$item = $otherItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$isNOPQRSAmount ? $itemAmount : '','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'',
				'mainMaterialTotalPrice'=>$fee,
				'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// R 税金
		$itemUnit = '元';
		$itemName = '税金';
		$itemCode = 'R';
		$item = $otherItems[$itemCode];
		$itemAmount = $item['itemAmount'];
		$budgetItemId = $item['budgetItemId'];
		$fee = $directFee * $itemAmount; 
		$totalFee += $fee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$isNOPQRSAmount ? $itemAmount : '','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'',
				'mainMaterialTotalPrice'=>$fee,
				'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		// S 工程总造价
		$itemUnit = '元';
		$itemName = '工程总造价';
		$itemCode = 'S';
		$item = $otherItems[$itemCode];
		$budgetItemId = $item['budgetItemId'];
		$itemAmount = '';
		$fee = $totalFee;
		$res[$count++] = array('budgetItemId'=>$budgetItemId,'itemName'=>$isGBK ? str2GBK($itemName):($itemName),'budgetId'=>$budgetId,'itemCode'=>$itemCode,
				'itemUnit'=>$isGBK ? str2GBK($itemUnit):($itemUnit),'itemAmount'=>$isNOPQRSAmount ? $itemAmount : '','mainMaterialPrice'=>'','auxiliaryMaterialPrice'=>'','manpowerPrice'=>'','machineryPrice'=>'',
				'mainMaterialTotalPrice'=>$fee,
				'auxiliaryMaterialTotalPrice'=>'','manpowerTotalPrice'=>'','machineryTotalPrice'=>'','lossPercent'=>'','remark'=>'','isEditable'=>false);
		if($fee != $item['mainMaterialPrice']){
			$item['mainMaterialPrice'] = $fee;
			$arr = editItem($item);// update
		}
		return $res;
	}
?>