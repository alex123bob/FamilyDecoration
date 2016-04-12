<?php
	//添加预算
	function createTemplateFromBudget($budgetId,$templateName){
		global $mysql;
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
		$templateFields = array('areaSize','comments');
		foreach($template as $key=> $val){
			if(is_numeric($key) || !in_array($key,$templateFields))
				unset($template[$key]);
		}
		$template['budgetTemplateName'] = isset($templateName) && !empty($templateName) ? $templateName : (isset($template['budgetName']) ? $template['budgetName'] : '未命名' ).'模板';
		$template['budgetTemplateId'] = $templateId;
		$template['custName'] = '客户姓名';
		$mysql->DBInsertAsArray("budget_template",$template);
			
		//创建模板对应条目
		$items = getBudgetItemsByBudgetId($budgetId,false,false);
		//这里是所有的，只要个别字段。
		//'budgetTemplateItemId','itemName','budgetTemplateId','itemCode','itemUnit','itemAmount','mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice','lossPercent','isDeleted','remark','basicItemId','basicSubItemId','manpowerCost','mainMaterialCost','discount','workCategory'
		$templateItemFields = array('itemName','itemCode','itemUnit','mainMaterialPrice','auxiliaryMaterialPrice','manpowerPrice','machineryPrice','lossPercent','remark','basicItemId','basicSubItemId','manpowerCost','mainMaterialCost','discount','workCategory','isCustomized');
		$NOPRQS = array('N','P','O','Q','R','S');
		foreach($items as $key=> $item){
			if(in_array($item['itemCode'],$NOPRQS)){
				//预算模板项目表中，不存NOPRQS，后面根据模板创建项目时，调用addBudget，里面会自动创建NOPQRS项目
				continue;
			}
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
	function deleteBudgetTemplate($templateId){
		global $mysql;
		$mysql->DBUpdate('budget_template',array('isDeleted'=>true,'lastUpdateTime'=>'now()'),"`budgetTemplateId` = '?' ",array($templateId));
		$mysql->DBUpdate('budget_template_item',array('isDeleted'=>true,'lastUpdateTime'=>'now()'),"`budgetTemplateId` = '?' ",array($templateId));
		return array('status'=>'successful', 'errMsg' => '');
	}
	
	//获取预算模板
	function getBudgetTemplate(){
		global $mysql;
		return $mysql->DBGetAsMap(" select * from `budget_template` where `isDeleted` = 'false' ");
	}
	
	//从模板创建预算
	function createBudgetFromTemplate($post){
		global $mysql;
		$budget = addBudget($post);
		$items = getBudgetTemplateItem($post['budgetTemplateId']);
		$budgetItemFields = array('itemCode','workCategory','','remark','mainMaterialPrice','auxiliaryMaterialPrice','manpowerCost', 'mainMaterialCost','itemName','budgetId','itemUnit','itemAmount','manpowerPrice','machineryPrice','lossPercent','basicItemId','basicSubItemId','isCustomized');
		foreach($items as $key=> $item){
			foreach($item as $key=> $val){
				if(is_numeric($key) || !in_array($key,$budgetItemFields))
					unset($item[$key]);
			}
			$item['budgetId'] = $budget['budgetId'];
			$item['budgetItemId'] = date("YmdHis").str_pad(rand(0, 9999), 4, rand(0, 9), STR_PAD_LEFT);
			$mysql->DBInsertAsArray("`budget_item`",$item);
		}
		return array('status'=>'successful', 'errMsg' => '', "budgetId" => $budget['budgetId']);
	}
	
	function getBudgetTemplateItem($templateId){
		global $mysql;
		return $mysql->DBGetAsMap("select * from budget_template_item where `isDeleted` = 'false' and budgetTemplateId = ? ",$templateId);
	}
?>