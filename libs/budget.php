<?php
	include_once "conn.php";
	include_once "budgetDB.php";
	$action = $_REQUEST["action"];
	$res = "";
	$isParseResut = true;
	switch($action){
		case "list": 	$res = getBudgets();  break;
		case "listIds": 	$res = getBudgetIds();  $isParseResut = false;break;
		//获取预算所有条目
		case "itemlist":$res = getBudgetItemsByBudgetId($_REQUEST["budgetId"]);break;
		//获取预算结果QPRST
		case "getBudgetResult":$res = getBudgetResult($_REQUEST["budgetId"]);break;
		//添加预算
		case "add":  	$res = addBudget($_REQUEST);  break;
		//添加小项
		case "addItem":	$res = addItem($_REQUEST);  break;
		//添加大项
		case "addBigItem":	$res = addBigItem($_REQUEST);  break;
		//删除项，不区分大项，小项
		case "delItem":$res = delItem($_REQUEST['budgetItemId']);break;
		//修改项，不区分大项，小项
		case "editItem":$res = editItem($_REQUEST);  break;
		//修改预算
		case "edit":	$res = editBudget($_REQUEST);  break;
		//删除预算
		case "delete":	$res = delBudget($_REQUEST["budgetId"]);  break;;
		case "view":	$res = getBudgetsByBudgetId($_REQUEST["budgetId"]);  break;
		default: 		throw new Exception("unknown action:".$action);
	}
	if($isParseResut){
		echo (json_encode($res));
	}	
?>