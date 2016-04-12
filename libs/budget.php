<?php
	include_once "conn.php";
	include_once "budgetDB.php";
	include_once "businessDB.php";
	include_once "budgettemplateDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	$isParseResut = true;
	switch($action){
		case "list": 	$res = getBudgets();  break;
		case "listIds": 	$res = getBudgetIds();  $isParseResut = false;break;
		//获取预算所有条目
		case "itemlist":$res = getBudgetItemsByBudgetId($_REQUEST["budgetId"]);break;
		//添加预算
		case "add":  	$res = addBudget($_REQUEST);  break;
		//从模板添加预算
		case "createBudgetFromTemplate" : $res = createBudgetFromTemplate($_REQUEST);break;
		//添加小项
		case "addItem":	$res = addItem($_REQUEST);  break;
		//将小项上移一位
		case "moveItemUpward": $res = moveItemUpward($_REQUEST); break;
		//将小项下移一位
		case "moveItemDownward": $res = moveItemDownward($_REQUEST); break;
		//添加大项
		case "addBigItem":	$res = addBigItem($_REQUEST);  break;
		//删除项，不区分大项，小项
		case "delItem":$res = delItem($_REQUEST['budgetItemId']);break;
		//修改项，不区分大项，小项
		case "editItem":$res = editItem($_REQUEST);  break;
		//修改预算
		case "edit":	$res = editBudget($_REQUEST);  break;
		//删除预算
		case "delete":	$res = delBudget($_REQUEST["budgetId"]);  break;
		//根据id获取预算
		case "view":	$res = getBudgetsByBudgetId($_REQUEST["budgetId"]);  break;
		//根据业务id获取预算
		case "getBudgetsByBusinessId": $res = getBudgetsByBusinessId($_REQUEST["businessId"]); break;
		//折扣
		case "discount":$res = makeDiscount($_REQUEST);  break;
		//成本分析
		case "analysis":$res = costAnalysis($_REQUEST['budgetId']);break;
		//从预算创建模板
		case "createBudgetTemplateFromBudget":$res = createTemplateFromBudget($_REQUEST['budgetId'],$_REQUEST['budgetTemplateName']);break;
		//获取预算模板列表
		case "getBudgetTemplate":$res = getBudgetTemplate();break;
		//根据预算模板id获取预算模板项目
		case "getBudgetTemplateItem":$res = getBudgetTemplateItem($_REQUEST['budgetTemplateId']);break;
		// 预算完成，将对应的project或者business的budgetFinished置为true
		case "finishBudget":$res = finishBudget($_REQUEST['budgetId']);break;
		//删除预算模板
		case "deleteBudgetTemplate":$res = deleteBudgetTemplate($_REQUEST['budgetTemplateId']);break;
		default:
			throw new Exception("unknown action:".$action);
	}
	if($isParseResut){
		echo (json_encode($res));
	}	
?>